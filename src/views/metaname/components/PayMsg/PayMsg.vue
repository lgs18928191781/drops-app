<template>
  <div class="order-msg">
    <div class="pay-amount flex flex-align-center order-msg-item">
      <div class="label flex1">{{ $t('MetaName.Pay Amount') }}</div>
      <div class="amount">${{ price }}</div>
    </div>

    <div class="pay-type order-msg-item">
      <div class="title">{{ $t('MetaName.Choose Pay Type') }}</div>
      <div class="pay-type-list">
        <template v-for="(item, index) in payPlatformList" :key="item.key">
          <div
            class="pay-type-item flex flex-align-center"
            :class="{ disabled: item.disabled() }"
            @click="changePayType(item)"
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
import { PayPlatformItem, payPlatformList } from '@/config'
import { MetaNameOperateType, PayPlatform, ProductType, ToCurrency } from '@/enum'
import { useUserStore } from '@/stores/user'
import {
  bytesLength,
  CreatePayOrder,
  getCurrencyAmount,
  mappingChainId,
  setPayQuitUrl,
} from '@/utils/util'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StartPay from '@/components/StartPay/StartPay.vue'
import { MetaNameBeforeReqRes, UploadMetaNameCover } from '@/api/wxcore'
import { GetMetaNameCover } from '@/api/canvas-base'
import { getMetaNameOperateParams } from '@/utils/metaname'
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
  userStore.isAuthorized && userStore.user?.evmAddress && (window as any).ethereum
    ? mappingChainId((window as any).ethereum?.chainId)
    : PayPlatform.UnionPay
)

onMounted(() => {})

const currencyAmount = ref(0)
const productType = ProductType.MetaName
const isStartPay = ref(false)
const payOrderInfo = reactive({
  url: '',
  orderId: '',
  amount: '',
})
let metafile = ''

function changePayType(item: PayPlatformItem) {
  if (item.disabled() || currentPayPlatform.value === item.platform) return
  currentPayPlatform.value = item.platform
  setCurrencyAmount()
}

function setCurrencyAmount() {
  if (currentPayPlatform.value === PayPlatform.UnionPay) {
    currencyAmount.value = props.price
  } else if (currentPayPlatform.value === PayPlatform.ETH) {
    currencyAmount.value = getCurrencyAmount(props.price, ToCurrency.USD, ToCurrency.ETH)
  } else if (currentPayPlatform.value === PayPlatform.BSV) {
    currencyAmount.value = getCurrencyAmount(props.price, ToCurrency.USD, ToCurrency.BSV)
  } else if (currentPayPlatform.value === PayPlatform.POLYGON) {
    currencyAmount.value = getCurrencyAmount(props.price, ToCurrency.USD, ToCurrency.POLYGON)
  }
}

async function pay() {
  emit('update:loading', true)
  try {
    let metaNameOpParams: {
      registerName: string
      op: MetaNameReqCode
      info?: Partial<MetaNameInfo>
      years?: number
    } = {
      registerName: props.name,
      op: props.type,
      years: props.year,
    }
    if (props.type === MetaNameReqCode.register) {
      // 注册生成图片
      const cover = await GetMetaNameCover(props.name)
      const formData = new FormData()
      // @ts-ignore
      formData.append('file', cover)
      const response = await UploadMetaNameCover(formData)
      if (response) {
        metafile = response.image_tx_id
      }
      metaNameOpParams.info = {
        mvc: userStore.user!.address,
        icon: `metafile://${metafile}.png`,
        desc: `MetaName, Web3 Naming Brings You Real Value

MetaName is a Decentralized, Open-sourced and Cross-chain Name System Based on MetaID Protocol`,
        data: {
          classifyList: ['Name'],
        },
      }
    }
    const response = await MetaNameBeforeReqRes({
      name: metaNameOpParams.registerName,
      op: metaNameOpParams.op,
      years: metaNameOpParams.years,
      address: userStore.showWallet.wallet!.rootAddress,
    })
    if (response.code == 0) {
      const metaNameParams = {
        op_code: response.data.op,
        info: metaNameOpParams.info,
        years: metaNameOpParams.years!,
        reqswapargs: response.data,
      }
      const res = await getMetaNameOperateParams(metaNameParams)
      if (res) {
        const operateType = {
          [MetaNameReqCode.register]: MetaNameOperateType.Register,
          [MetaNameReqCode.renew]: MetaNameOperateType.Renew,
          [MetaNameReqCode.updataInfo]: MetaNameOperateType.UpdateInfo,
        }
        const result = await CreatePayOrder({
          platform: currentPayPlatform.value!,
          fullPath: setPayQuitUrl({
            payPlatform: currentPayPlatform.value!,
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
      } else {
        emit('update:loading', false)
      }
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

setCurrencyAmount()
</script>

<style lang="scss" scoped src="./PayMsg.scss"></style>
