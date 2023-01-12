<template>
  <div class="metaname-card-warp">
    <div
      class="metaname-card flex flex-v"
      id="metaname-card"
      ref="MetaNameRef"
      :style="{
        background: `linear-gradient(143deg, ${metaNameBgColors[metaNameBgColorIndex][0]} 1%, ${metaNameBgColors[metaNameBgColorIndex][1]} 99%)`,
      }"
    >
      <img class="metaname" src="@/assets/images/metaname.png" />
      <div
        class="name flex1"
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
        .meta
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
        <div
          class="pay-type-item flex flex-align-center"
          v-for="(item, index) in payPlatformList"
          :key="index"
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
      </div>
    </div>

    <div class="result-amount">
      <div class="amount">
        {{ currencyAmount }}
        {{ currentPayPlatform === PayPlatform.UnionPay ? 'USD' : payPlatformList.find(item => item.platform === currentPayPlatform)!.key.toUpperCase()}}
      </div>
      <div class="usd">{{ price }} USD</div>
    </div>

    <div class="btn primary" @click="pay" v-loading="loading">
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
    @fail="loading = false"
    @success="onPaySuccess"
  />
</template>

<script setup lang="ts">
import { SendMetaNameTransationResult } from '@/@types/sdk'
import { payPlatformList } from '@/config'
import { MetaNameOperateType, PayPlatform, ProductType, ToCurrency } from '@/enum'
import { useUserStore } from '@/stores/user'
import {
  bytesLength,
  CreatePayOrder,
  dataURLtoFile,
  getCurrencyAmount,
  randomNumber,
  setPayQuitUrl,
} from '@/utils/util'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import Decimal from 'decimal.js-light'
import { BigNumber } from 'ethers'
import { result } from 'lodash'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StartPay from '@/components/StartPay/StartPay.vue'
//@ts-ignore
import html2canvas from 'html2canvas'

import { getBlockHeight, MetaNameUpdateInfo, GetMetaNameInfo } from '@/api/index'
import { useI18n } from 'vue-i18n'
interface Props {
  price: number
  year: number
  name: string
  type: MetaNameReqCode
}

const props = withDefaults(defineProps<Props>(), {})

const testname =
  '我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const emit = defineEmits(['back', 'success'])
const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)
const i18n = useI18n()
const currencyAmount = ref(0)
const loading = ref(false)
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

function changePayType(platform: PayPlatform) {
  if (currentPayPlatform.value === platform) return
  currentPayPlatform.value = platform
  if (currentPayPlatform.value === PayPlatform.UnionPay) {
    currencyAmount.value = props.price
  } else {
    currencyAmount.value = getCurrencyAmount(props.price, ToCurrency.USD, ToCurrency.ETH)
  }
}

async function metanameOperation(params: {
  //注册时mvc跟metaid,更新信息时不需要传入years,注册时必须要传入icon
  registerName: string
  op: MetaNameReqCode
  //注册和更新操作info必填,续费info字段不需要
  info?: Partial<MetaNameInfo>
  years?: number
}) {
  return new Promise<SendMetaNameTransationResult>(async (resolve, reject) => {
    try {
      const res = await userStore.showWallet.MetaNameBeforeReq({
        name: `${params.registerName}`,
        op: params.op,
      })
      if (res.code == 0) {
        const { data } = res
        const metaNameParams = {
          op_code: data.op,
          info: params.info,
          years: params.years!,
          reqswapargs: data,
        }
        const result = await userStore.showWallet.sendMetaNameTransation(metaNameParams)
        if (result) {
          resolve(result)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

async function pay() {
  loading.value = true
  try {
    if (props.type === MetaNameReqCode.register) {
      metaNameBgColorIndex.value = randomNumber(0, 9)
      const res = await html2canvas(MetaNameRef.value, {
        scale: 5,
        backgroundColor: null,
      })
      if (res) {
        const base64 = res.toDataURL('image/png')
        const file = dataURLtoFile(base64, `${props.name}.png`)
      }
      return
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
        icon: 'metafile://adb7015c50d9d32e803b85cc9d67c0f5b7a663a848e8c3d2ef18dffb7a745941.png',
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
        debugger
      } else {
        loading.value = false
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
        console.log('updateInfoTx', updateInfoTx.data)
        loading.value = false
        debugger
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
    })
    if (result) {
      payOrderInfo.amount = result.pay_amount!.toString()
      payOrderInfo.orderId = result.outside_order_id
      payOrderInfo.url = result.url
      isStartPay.value = true
    }
  } catch (error) {
    ElMessage.error((error as any).message)
  }
}

function onPaySuccess() {
  loading.value = false
  router.push({
    name: 'metaNameSearchRegister',
    params: {
      metaName: props.name,
    },
  })
  emit('success')
}

if (currentPayPlatform.value === PayPlatform.UnionPay) {
  currencyAmount.value = props.price
} else {
  currencyAmount.value = getCurrencyAmount(props.price, ToCurrency.USD, ToCurrency.ETH)
}
</script>

<style lang="scss" scoped src="./PayMsg.scss"></style>
