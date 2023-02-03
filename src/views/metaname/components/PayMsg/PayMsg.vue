<template>
  <div class="metaname-card-warp">
    <div class="metaname-card" id="metaname-card" ref="MetaNameRef">
      <div
        class="bg"
        :style="{
          background: `linear-gradient(143deg, ${metaNameBgColors[metaNameBgColorIndex][0]} 1%, ${metaNameBgColors[metaNameBgColorIndex][1]} 99%)`,
        }"
      ></div>
      <div class="content  flex flex-v">
        <img class="metaname" :src="metaNameLogoString" />
        <div
          class="name flex1  flex flex-align-center flex-pack-center"
          :class="[
            'length' +
              (bytesLength(name) >= 5 && bytesLength(name) <= 11
                ? 5
                : bytesLength(name) >= 12
                ? '-normal'
                : bytesLength(name)),
          ]"
        >
          <span>
            {{ name }}
          </span>
        </div>

        <div class="tag">
          <img :src="metaTagString" />
        </div>
      </div>
    </div>
  </div>

  <div class="order-msg">
    <div class="pay-amount flex flex-align-center order-msg-item">
      <div class="label flex1">{{ $t('MetaName.Pay Amount') }}</div>
      <div class="amount">${{ price }}</div>
    </div>

    <div class="pay-type order-msg-item">
      <div class="title">{{ $t('MetaName.Choose Pay Type') }}</div>
      <div class="pay-type-list">
        <template v-for="(item, index) in payPlatformList" :key="index">
          <div
            class="pay-type-item flex flex-align-center"
            v-if="!item.disabled()"
            @click="changePayType(item.platform)"
          >
            <div class="logo flex flex-align-center flex-pack-center">
              <img :src="item.icon" />
            </div>
            <div class="name flex1">{{ item.name() }}</div>
            <span
              class="check-warp flex flex-align-center flex-pack-center"
              v-if="currentPayPlatform === item.platform"
            >
              <Icon name="check" />
            </span>
          </div>
        </template>
      </div>
    </div>

    <div class="result-amount">
      <div class="amount">
        {{ currencyAmount }}
        {{ currentPayPlatform === PayPlatform.UnionPay ? 'USD' : payPlatformList.find(item => item.platform === currentPayPlatform)!.key.toUpperCase()}}
      </div>
      <div class="usd">{{ price }} USD</div>
    </div>

    <div class="btn primary" @click="pay">
      {{ $t('MetaName.Pay') }}
    </div>
    <div class="back">
      <a @click="emit('back')">{{ $t('back') }}</a>
    </div>
  </div>

  <StartPay
    v-model="isStartPay"
    :pay-platform="currentPayPlatform"
    :product_type="productType"
    :url="payOrderInfo.url"
    :amount="payOrderInfo.amount"
    :order-id="payOrderInfo.orderId"
    @fail="emit('update:loading', false)"
    @success="onPaySuccess"
  />
</template>

<script setup lang="ts">
import { SendMetaNameTransationResult } from '@/@types/sdk'
import { payPlatformList } from '@/config'
import { MetaNameOperateType, NodeName, PayPlatform, ProductType, ToCurrency } from '@/enum'
import { useUserStore } from '@/stores/user'
import { useRootStore } from '@/stores/root'
import {
  bytesLength,
  CreatePayOrder,
  dataURLtoFile,
  FileToAttachmentItem,
  getCurrencyAmount,
  metanameOperation,
  randomNumber,
  setPayQuitUrl,
  urlToBase64,
} from '@/utils/util'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import Decimal from 'decimal.js-light'
import { BigNumber, ethers } from 'ethers'
import { result } from 'lodash'
import { nextTick, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StartPay from '@/components/StartPay/StartPay.vue'
//@ts-ignore
import html2canvas from 'html2canvas'
import MetaTag from '@/assets/metaname/img_meta.png'
import MetaNameLogo from '@/assets/metaname/logo_metaname.png'

import { getBlockHeight, MetaNameUpdateInfo, GetMetaNameInfo } from '@/api/index'
import { useI18n } from 'vue-i18n'
interface Props {
  price: number
  year: number
  name: string
  type: MetaNameReqCode
  metafile?: string
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const userStore = useUserStore()

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['back', 'success', 'update:loading'])

const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress
    ? mappingChainId((window as any).ethereum.chainId)
    : PayPlatform.UnionPay
)

onMounted(() => {})

const i18n = useI18n()
const currencyAmount = ref(0)
const productType = ProductType.MetaName
const isStartPay = ref(false)
const payOrderInfo = reactive({
  url: '',
  orderId: '',
  amount: '',
})
const metaNameBgColorIndex = ref(0)
const metaNameBgColors = [
  ['#5721A1', '#2DEBD8'],
  ['#F68084', '#A6C0FE'],
  ['#FA709A', '#FEE140'],
  ['#009EFD', '#2AF598'],
  ['#FA71CD', '#C471F5'],
  ['#005BEA', '#00C6FB '],
  ['#7028E4', '#E5B2CA'],
  ['#FF758C', '#FF7EB3'],
  ['#8BAAAA', '#AE8B9C'],
  ['#E6B980', '#EACDA3'],
]
const MetaNameRef = ref()
const metaTagString = ref('')
const metaNameLogoString = ref('')
let metafile = ''

function mappingChainId(chainId: string) {
  switch (chainId) {
    case '0x1':
      return PayPlatform.ETH
    case '0x5':
      return PayPlatform.ETH
    case '0x89':
      return PayPlatform.POLYGON
    case '0x13881':
      return PayPlatform.POLYGON
    default:
      break
  }
}

function changePayType(platform: PayPlatform) {
  if (currentPayPlatform.value === platform) return
  currentPayPlatform.value = platform
  if (currentPayPlatform.value === PayPlatform.UnionPay) {
    currencyAmount.value = props.price
  } else {
    currencyAmount.value = getCurrencyAmount(props.price, ToCurrency.USD, ToCurrency.ETH)
  }
}

async function pay() {
  emit('update:loading', true)
  try {
    if (props.type === MetaNameReqCode.register) {
      metaNameBgColorIndex.value = randomNumber(0, 9)
      await nextTick()
      const res = await html2canvas(MetaNameRef.value, {
        backgroundColor: null,
        removeContainer: true,
        width: 240,
        height: 300,
      })
      if (res) {
        const base64 = res.toDataURL('image/png')
        const file = dataURLtoFile(base64, `${props.name}.png`)
        const attachment = await FileToAttachmentItem(file)
        const result = await userStore.showWallet.createBrfcChildNode({
          nodeName: NodeName.MetaFile,
          attachments: [attachment],
        })
        metafile = result!.metaFiles![0].txId
      }
    }
    const metaNameOpParams: {
      registerName: string
      op: MetaNameReqCode
      info?: Partial<MetaNameInfo>
      years?: number
    } = {
      registerName: props.name,
      op: props.type,
      info: {
        mvc: userStore.user!.address,
        icon: `metafile://${metafile}.png`,
      },
      years: props.year,
    }
    if (props.type == MetaNameReqCode.updataInfo) {
      const metaNameInfo = await GetMetaNameInfo(props.name)
      if (metaNameInfo.code == 0) {
        metaNameOpParams.info = {
          ...metaNameOpParams.info,
          ...metaNameInfo.data.infos,
        }
        delete metaNameOpParams.years
      } else {
        emit('update:loading', false)
        return ElMessage.error(`${i18n.t('getMetaNameInfoError')}`)
      }
    }
    if (props.type == MetaNameReqCode.renew) {
      delete metaNameOpParams.info
    }
    const res = await metanameOperation(metaNameOpParams)

    const operateType = {
      [MetaNameReqCode.register]: MetaNameOperateType.Register,
      [MetaNameReqCode.renew]: MetaNameOperateType.Renew,
      [MetaNameReqCode.updataInfo]: MetaNameOperateType.UpdateInfo,
    }
    if (props.type == MetaNameReqCode.updataInfo) {
      const updateInfoTx = await MetaNameUpdateInfo(res!.registerMetaNameResp!)
      if (updateInfoTx.code == 0) {
        //更新成功,这里不能用
        emit('update:loading', false)
        return
      }
    }

    const result = await CreatePayOrder({
      platform: currentPayPlatform.value,
      fullPath: setPayQuitUrl({
        payPlatform: currentPayPlatform.value,
        fullPath: route.fullPath,
        isBlindbox: false,
      }),
      goods_name: props.name,
      count: 1,
      product_type: productType,
      operate_type: operateType[props.type],
      mvc_to_address: res?.MvcToAddress,
      nft_to_address: res?.NftToAddress,
      tx_fee: res.TxFee,
      fee_per_year: res?.FeePerYear,
      meta_name_len: bytesLength(props.name),
      data: res?.registerMetaNameResp?.toString(),
      meta_name_uts_ascii: props.name,
    })
    if (result) {
      payOrderInfo.amount = result.pay_amount!.toString()
      payOrderInfo.orderId = result.outside_order_id
      payOrderInfo.url = result.url
      isStartPay.value = true
    }
  } catch (error) {
    emit('update:loading', false)
    ElMessage.error((error as any).message)
  }
}

function onPaySuccess(params: { orderId: string; platform: PayPlatform; productType: number }) {
  emit('update:loading', false)
  router.push({
    name: props.type === MetaNameReqCode.register ? 'metaNameSearchRegister' : 'metaNameMineStatus',
    params: {
      metaName: props.name,
      orderId: params.orderId,
      platform: params.platform,
      productType: params.productType,
      metaFile: metafile ? metafile : props.metafile,
    },
  })
  emit('success')
}

if (currentPayPlatform.value === PayPlatform.UnionPay) {
  currencyAmount.value = props.price
} else {
  currencyAmount.value = getCurrencyAmount(props.price, ToCurrency.USD, ToCurrency.ETH)
}
urlToBase64(MetaTag).then(val => {
  metaTagString.value = val
})
urlToBase64(MetaNameLogo).then(val => {
  metaNameLogoString.value = val
})
</script>

<style lang="scss" scoped src="./PayMsg.scss"></style>
