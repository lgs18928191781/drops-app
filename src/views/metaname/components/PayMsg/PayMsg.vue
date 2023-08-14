<template>
  <div class="order-msg">
    <div class="pay-amount flex flex-align-center order-msg-item">
      <div class="label flex1">{{ $t('MetaName.Pay Amount') }}</div>
      <div class="amount">${{ price }}</div>
    </div>

    <div class="pay-type order-msg-item">
      <div class="title">{{ $t('MetaName.Choose Pay Type') }}</div>
      <div class="pay-type-list">
        <template v-for="(item, index) in payList" :key="item.key">
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
      <div class="tips" v-if="currentPayPlatform === PayPlatform.SPACE">
        {{ $t('MetaName.registerBySpaceTips') }}
      </div>
      <div class="amount">
        {{
          currentPayPlatform == PayPlatform.UnionPay
            ? getPlatformSymbol(currentPayPlatform, '')
            : ''
        }}
        {{ currencyAmount }}
        {{
          currentPayPlatform == PayPlatform.UnionPay
            ? ''
            : getPlatformSymbol(currentPayPlatform, 'USD')
        }}
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
    :pay_decimal_num="payOrderInfo.pay_decimal_num"
    @fail="emit('update:loading', false)"
    @success="onPaySuccess"
  />
</template>

<script setup lang="ts">
import { PayPlatformItem, payPlatformList, payPlatformToCurrency } from '@/config'
import { MetaNameOperateType, PayPlatform, ProductType, ToCurrency, Lang } from '@/enum'
import { useUserStore } from '@/stores/user'
import {
  bytesLength,
  CreatePayOrder,
  getCurrencyAmount,
  mappingChainId,
  setPayQuitUrl,
  getPlatformSymbol,
} from '@/utils/util'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StartPay from '@/components/StartPay/StartPay.vue'
import { MetaNameBeforeReqRes, UploadMetaNameCover } from '@/api/wxcore'
import { GetMetaNameCover } from '@/api/canvas-base'
import { getMetaNameOperateParams } from '@/utils/metaname'
import { useI18n } from 'vue-i18n'
import Amount from '@/components/Amount/Amount.vue'
import { PriceTag } from '@element-plus/icons-vue'

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
const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const emit = defineEmits(['back', 'success', 'update:loading'])

const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress && (window as any).ethereum
    ? mappingChainId((window as any).ethereum?.chainId)
    : i18n.locale.value === Lang.ZH
    ? PayPlatform.UnionPay
    : PayPlatform.SPACE
)

const currencyAmount = computed(() => {
  let amount = 0
  if (props.price) {
    amount = getCurrencyAmount(
      props.price * 100,
      ToCurrency.USD,
      payPlatformToCurrency[currentPayPlatform.value]
    )
  }

  return amount
})

const productType = ProductType.MetaName
const isStartPay = ref(false)
const payOrderInfo = reactive({
  url: '',
  orderId: '',
  amount: '',
  pay_decimal_num: 0,
})
let metafile = ''

const payList = computed(() => {
  return payPlatformList.filter(_item => {
    if (i18n.locale.value === Lang.EN) {
      if (_item.platform !== PayPlatform.UnionPay) {
        return _item
      }
    } else {
      return _item
    }
  })
})

function changePayType(item: PayPlatformItem) {
  if (item.disabled() || currentPayPlatform.value === item.platform) return
  currentPayPlatform.value = item.platform
}

function setCurrencyAmount() {
  if (currentPayPlatform.value === PayPlatform.UnionPay) {
    currencyAmount.value = props.price
  } else {
    const targes = {
      [PayPlatform.ETH]: ToCurrency.ETH,
      [PayPlatform.BSV]: ToCurrency.BSV,
      [PayPlatform.POLYGON]: ToCurrency.POLYGON,
      [PayPlatform.SPACE]: ToCurrency.MVC,
    }
    currencyAmount.value = getCurrencyAmount(
      props.price,
      ToCurrency.USD,
      // @ts-ignore
      targes[currentPayPlatform.value]
    )
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
          payOrderInfo.pay_decimal_num = result.pay_decimal_num
          payOrderInfo.url = result.url
          isStartPay.value = true
        }
      } else {
        emit('update:loading', false)
      }
    }
  } catch (error) {
    debugger
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

// setCurrencyAmount()
</script>

<style lang="scss" scoped src="./PayMsg.scss"></style>
