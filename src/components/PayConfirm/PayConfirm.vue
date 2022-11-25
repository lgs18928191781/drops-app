<template>
  <ElDialog
    v-model="visible"
    @close="closeDialog"
    center
    :close-on-click-modal="!qrcodeUrl || !payWechatSuccess"
  >
    <template #title>
      <div class="dialogTitleWrap" v-if="!payWechatSuccess">
        <span>{{ $t('PayConfirm') }}</span>
      </div>
    </template>
    <ElSkeleton :loading="isSkeleton" animated>
      <template #template>
        <PayConfirmSkeletonVue />
      </template>
      <template #default>
        <ElDialog
          custom-class="quickPayDialog"
          v-model="quickPayOpen"
          center
          :close-on-click-modal="false"
          append-to-body
        >
          <iframe
            id="payIframe"
            width="100%"
            height="90%"
            :srcdoc="quickPayDoc"
            frameborder="0"
          ></iframe>
        </ElDialog>
        <div class="wechat-pay-success" v-if="payWechatSuccess">
          <div class="paySuccessWrap">
            <div class="top">
              <img
                :src="
                  payPlatformList[payPlatformIndex].platform === PayPlatform.WechatPay
                    ? wechatTitleIcon
                    : payPlatformList[payPlatformIndex].platform === PayPlatform.AliPay
                    ? alipayTitleIcon
                    : sandPayTitleIcon
                "
                alt=""
              />
              <span
                :class="[
                  payPlatformList[payPlatformIndex].platform === PayPlatform.WechatPay
                    ? 'wechat'
                    : payPlatformList[payPlatformIndex].platform === PayPlatform.AliPay
                    ? 'alipay'
                    : 'sandpay',
                ]"
                >{{ $t('paySuccess') }}</span
              >
            </div>
            <div class="center">
              <span>ShowPayLimited</span>
              <span>¥{{ totalPrice }}</span>
            </div>
            <div class="foot">
              <span
                :class="[
                  payPlatformList[payPlatformIndex].platform === PayPlatform.WechatPay
                    ? 'wechat'
                    : payPlatformList[payPlatformIndex].platform === PayPlatform.AliPay
                    ? 'alipay'
                    : 'sandpay',
                ]"
                @click="toSuceessPage"
                >{{ $t('complie') }}</span
              >
              <span v-if="props.isLegal"
                >{{ $t('skipDetail') }}{{ overTime }}{{ $t('overTimeClose') }}</span
              >
            </div>
          </div>
        </div>
        <div class="appPaySuccessCallBackWrap" v-else-if="appPaySuccessCallBack">
          <div class="item">
            <span>{{ $t('waitTransitionConfirm') }}</span>
            <spinner></spinner>
          </div>
          <div class="item">
            <span>{{ $t('waitTolong') }}</span>
            <span class="toIndex" @click="toIndex">{{ $t('goOnCheckOther') }}</span>
            <span>{{ $t('laterToMyNft') }}</span>
          </div>
        </div>
        <div class="wechat-pay-confirm" v-else-if="qrcodeUrl">
          <div class="nftName">
            <span>{{ $t('legalBuy') }}</span>
            <span>{{ nft.val?.nftName }}</span>
            <span v-if="blindBoxPage">*{{ buyAmount }}</span>
          </div>
          <div class="buyInfoWrap">
            <div class="orderAmount">
              <div class="top">
                <div class="left">
                  <span>{{ $t('legalOrderAmount') }}</span>
                  <span>{{ $t('LegalpaySuceessTip') }}</span>
                </div>
                <div class="right">¥{{ totalPrice }}</div>
              </div>
            </div>
            <div class="qrcodeWrap">
              <canvas id="qrcodeContainer"></canvas>
              <div class="restTime">
                <span v-if="payPlatformIndex !== -1">{{
                  orderInvaildFlag
                    ? ''
                    : $t('plaseUse') +
                      $t('payType' + payPlatformList[payPlatformIndex].platform) +
                      $t('screenPay')
                }}</span>
                <span v-if="props.isLegal || cnyMode"
                  >&nbsp;{{ restPayTime }}&nbsp;{{
                    orderInvaildFlag ? $t('codeInviliad') : ''
                  }}</span
                >
              </div>
              <div v-if="cnyMode && !props.isLegal" class="invaliableTime">
                {{
                  orderInvaildFlag
                    ? ''
                    : props.blindBoxPage
                    ? $t('blindBoxInvilable')
                    : $t('codeInviliable')
                }}
              </div>
            </div>
            <div class="foot">
              <div v-if="props.isLegal && !orderInvaildFlag" class="legalWaitingConfirmWrap">
                <div class="item">
                  <span>{{ $t('friendTips') }}</span>
                </div>
                <div class="item">
                  <span>{{ $t('waitTolong') }}</span>
                  <span class="toIndex" @click="toIndex">{{ $t('goOnCheckOther') }}</span>
                  <span>{{ $t('laterToMyNft') }}</span>
                </div>
              </div>
              <div
                class="waitingConfirmWrap"
                v-else-if="!props.isLegal && cnyMode && !orderInvaildFlag"
              >
                <div>
                  <div class="item">
                    <span>{{ $t('waitTransitionConfirm') }}</span>
                    <spinner></spinner>
                  </div>
                  <div class="item">
                    <span>{{ $t('waitTolong') }}</span>
                    <span class="toIndex" @click="toIndex">{{ $t('goOnCheckOther') }}</span>
                    <span>{{ $t('laterToMyNft') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pay-confirm" v-else>
          <div class="nft flex">
            <div class="top">
              <div class="cover">
                <Cover
                  :isBlindBox="props.blindBoxPage"
                  :blindBoxRest="nft.val?.remain"
                  :cover="[
                    $filters.metafile(nft.val?.nftIcon),
                    nft.val?.nftBackIcon ? $filters.metafile(nft.val?.nftBackIcon) : undefined,
                  ]"
                ></Cover>
              </div>
              <div class="flex1">
                <div class="name">{{ nft.val?.nftName }}</div>
                <div class="user-list">
                  <div class="user-item flex flex-align-center">
                    <UserAvatar :meta-id="nft.val?.nftIssueMetaId"></UserAvatar>
                    <span class="username">{{ nft.val?.nftIssuer }}</span>
                    <span class="label">({{ $t('creater') }})</span>
                  </div>
                  <div class="user-item flex flex-align-center">
                    <UserAvatar :meta-id="nft.val?.nftOwnerMetaId"></UserAvatar>
                    <span class="username">{{ nft.val?.nftOwnerName }}</span>
                    <span class="label">({{ $t('owner') }})</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="composeFlagWrap" v-if="nft.val?.nftHasCompound">
              <div class="left">
                <span>{{ $t('composeStatus') }}</span>
                <!-- <span>{{$t('composeTips')}}</span> -->
              </div>
              <div class="right">
                <span>{{ $t('isCompose') }}</span>
              </div>
            </div>
          </div>

          <div class="price-list">
            <div class="price-item flex flex-align-center" v-if="blindBoxPage">
              <div class="name flex1">{{ $t('buyAmount') }}</div>
              <div class="buyCalc">
                <i class="el-icon-minus" @click="minus"></i>
                <el-input :modelValue="buyAmount" />
                <i class="el-icon-plus" @click="plus"></i>
              </div>
            </div>
            <div class="price-item flex flex-align-center">
              <div class="name flex1">{{ $t('price') }}</div>
              <div class="amount">
                <span v-if="cnyMode">￥</span
                >{{ props.isLegal ? legalOriginalPrice.toFixed(2) : nftSalePrice }}&nbsp;{{
                  nftSaleUnit
                }}
              </div>
            </div>
            <div class="price-item flex flex-align-center" v-if="platformFee">
              <div class="name flex1">
                {{ $t('buyFeeTips3') }}({{
                  blindBoxPage
                    ? 6
                    : props.isLegal
                    ? new Decimal(fee.val!.platformPercentage).mul(100).toNumber()
                    : cnyMode
                    ? new Decimal(cnyPlatformFee).toNumber()
                    : new Decimal(fee.val!.platformPercentage).mul(100).toNumber()









                }}%)
              </div>
              <div class="amount">
                <span v-if="cnyMode">￥</span>{{ platformFee }}&nbsp;{{ nftSaleUnit }}
              </div>
            </div>
            <div class="price-item flex flex-align-center" v-if="royaltyFee">
              <div class="name flex1">
                {{ $t('buyFeeTips2') }}({{
                  new Decimal(fee.val!.royaltyPercentage).mul(100).toNumber()









                }}%)
              </div>
              <div class="amount">
                {{ cnyMode ? '¥' : '' }}&nbsp;{{ royaltyFee }}&nbsp;{{ nftSaleUnit }}
              </div>
            </div>
          </div>

          <div class="total-price flex flex-align-center">
            <div class="name flex1">{{ $t('needPayAmount') }}</div>
            <div class="amount flex flex-align-center">
              <img v-if="!props.isLegal && !cnyMode" :src="BsvIcon" /><span v-if="cnyMode">￥</span
              >{{ totalPrice }}&nbsp;{{ nftSaleUnit }}
            </div>
          </div>

          <div class="operate flex">
            <div v-if="props.isLegal || cnyMode" class="wechatBtnWrap">
              <div class="pay-platform-list">
                <el-button
                  class="pay-platform-item"
                  v-for="item in payPlatformList"
                  :key="item.platform"
                  :disabled="item.disabled"
                  :style="{ background: item.background }"
                  @click="confirmPay(item.platform)"
                >
                  <div>
                    <img class="icon" :src="item.icon" />
                    <div class="title">
                      <span class="name">{{ item.name }}</span>
                      <span v-if="+envLimited && item.suffix" class="tips">
                        {{ $t('envLimited') }}
                      </span>
                    </div>
                  </div>
                </el-button>
              </div>
            </div>
            <div v-else class="bsvPayWrap flex">
              <ElButton
                class="flex1"
                size="large"
                type="primary"
                @click="confirmPay"
                v-if="balance > totalPrice"
                >{{ $t('ConfirmPay') }}</ElButton
              >
              <ElButton class="flex1" type="info" size="large" @click="toWallet" v-else
                >{{ $t('InsufficientBalance') }}<a>{{ $t('yourWallet') }}</a></ElButton
              >
            </div>
          </div>
          <div class="selectPayMode" @click="isOpenPayMode = true">
            <img :src="PayIcon" alt="" />
            <span>{{ $t('selectPayMode') }}</span>
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
      </template>
    </ElSkeleton>
    <PayModeDialog
      :visible="isOpenPayMode"
      :isLegal="props.isLegal"
      @payModeclose="isOpenPayMode = false"
    >
    </PayModeDialog>
  </ElDialog>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick, onUnmounted } from 'vue'
import { router } from '@/router'
import Cover from '../NFT/Cover.vue'
import spinner from '@/components/spinner/spinner.vue'
import PayConfirmSkeletonVue from './PayConfirmSkeleton.vue'
import PayModeDialog from './payModeDialog.vue'
import { orderError, PayPlatform, PaySource } from '@/enum'
import wechatTitleIcon from '@/assets/images/wechatTitle.svg?url'
import alipayTitleIcon from '@/assets/images/alipay-circle.svg?url'
import sandPayTitleIcon from '@/assets/images/sandPay_title.svg?url'
import { UnitName, Platform } from '@/config'
import { useRootStore, isIosApp } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { Decimal } from 'decimal.js'
import PayIcon from '@/assets/images/pay_icon_wallet.svg?url'
import BsvIcon from '@/assets/images/logo_bsv.svg?url'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import { checkSdkStatus } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import WechatPayIcon from '@/assets/svg/icon_wechat_pay.svg?url'
import AliPayIcon from '@/assets/svg/icon_zfb_pay.svg?url'
import SandPayIcon from '@/assets/svg/sandPay_icon.svg?url'
import {
  converterBSV,
  converterCNY,
  legalNftConverterCNY,
  legalNftConverterBSV,
  bsv,
} from '@/utils/filters'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
interface PayPlatformItem {
  icon: string
  name: string
  platform: PayPlatform
  background: string
  disabled: boolean
  suffix: boolean
}

interface Props {
  visible: boolean
  genesis: string
  codehash: string
  tokenIndex: string
  isLegal: boolean
  uuid: string
  price: string
  blindBoxPage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  isLegal: false,
  uuid: '',
  price: '0',
})
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const route = useRoute()
const emit = defineEmits(['close', 'success', 'fail'])
const qrcodeUrl = ref('')
const payWechatSuccess = ref(false)
const isSkeleton = ref(true)
const quickPayOpen = ref(false)
const quickPayDoc = ref('')
const payPlatformIndex = ref(-1)
const orderInvaildFlag = ref(false)
const overTime = ref(5)
const appPaySuccessCallBack = ref(false)
const buyAmount: any = ref(1)
const restPayTime = ref('01:00')
const balance = ref(0)
const envLimited = ref(`${import.meta.env.VITE_envCondition}`)
const isOpenPayMode = ref(false)
const wechatpayOverTime = ref(null)
const payPlatformList: PayPlatformItem[] = [
  {
    icon: WechatPayIcon,
    name: i18n.t('wechatpay'),
    platform: PayPlatform.WechatPay,
    background: '#909399',
    disabled: true,
    suffix: false,
  },
  {
    icon: AliPayIcon,
    name: i18n.t('aliPay'),
    platform: PayPlatform.AliPay,
    background: '#108EE9',
    disabled: false,
    suffix: false,
  },
  {
    icon: SandPayIcon,
    name: i18n.t('quickPay'),
    platform: PayPlatform.UnionPay,
    background: '#FCA63D',
    disabled: false,
    suffix: true,
  },
]

const nft: { val: Partial<NFTApiGetNFTDetailResDataItem> | null } = reactive({
  val: null,
})

const fee: {
  val: {
    platformFee: number
    royaltyFee: number
    total: number
    platformPercentage: number
    royaltyPercentage: number
  } | null
} = { val: null }

const cnyPlatformFee = computed(() => {
  return rootStore.exchangeRate.feeRate
})

const isApp = computed(() => {
  return window?.appMetaIdJs || window?.appMetaIdJsV2
})

const cnyMode = computed(() => {
  return rootStore.currentPrice === UnitName.RMB
})

const legalOriginalPrice = computed(() => {
  return (
    +nftSalePrice.value /
    (1 + new Decimal(fee.val!.platformPercentage).plus(fee.val!.royaltyPercentage).toNumber())
  )
})

const nftSalePrice = computed(() => {
  if (props.isLegal) {
    if (cnyMode.value) {
      return legalNftConverterCNY(nft.val?.nftPrice * buyAmount.value)
    } else {
      return legalNftConverterBSV(nft.val?.nftPrice * buyAmount.value)
    }
  } else if (props.blindBoxPage) {
    if (cnyMode.value) {
      return new Decimal(nft.val.rmbPrice * 0.01 * buyAmount.value).toFixed(2)
    } else {
      return new Decimal(nft.val.bsvPrice * buyAmount.value).div(Math.pow(10, 8)).toNumber()
    }
  } else {
    if (cnyMode.value) {
      return converterCNY(nft.val?.nftPrice * buyAmount.value)
    } else {
      return converterBSV(nft.val?.nftPrice * buyAmount.value)
    }
  }
})

const nftSaleUnit = computed(() => {
  if (props.isLegal) {
    return ''
  } else {
    if (cnyMode.value) {
      return ''
    } else {
      return 'BSV'
    }
  }
})

const platformFee = computed(() => {
  if (props.isLegal) {
    let platFee = new Decimal(fee.val!.platformPercentage).mul(legalOriginalPrice.value).toNumber()
    return platFee < 0.01 ? 0.01 : platFee.toFixed(2)
  } else if (props.blindBoxPage) {
    if (cnyMode.value) {
      return new Decimal(+nftSalePrice.value * 0.06 * buyAmount.value).toFixed(2) != '0.00'
        ? new Decimal(+nftSalePrice.value * 0.06 * buyAmount.value).toFixed(2)
        : '0.01'
    } else {
      return new Decimal(+nftSalePrice.value * 0.06 * buyAmount.value)
        .div(Math.pow(10, 8))
        .toNumber() >
        1000 / 10 ** 8
        ? new Decimal(+nftSalePrice.value * 0.06 * buyAmount.value).div(Math.pow(10, 8)).toNumber()
        : 1000 / 10 ** 8
    }
  } else {
    if (cnyMode.value && !props.blindBoxPage) {
      return new Decimal(
        ((+nftSalePrice.value * rootStore.exchangeRate.feeRate) / 100).toFixed(2)
      ).toNumber() <= 0
        ? 0.01
        : ((+nftSalePrice.value * rootStore.exchangeRate.feeRate) / 100).toFixed(2)
    } else {
      return bsv(fee.val!.platformFee * buyAmount.value)
    }
  }
})
const royaltyFee = computed(() => {
  if (props.isLegal) {
    let royalFee = new Decimal(fee.val!.royaltyPercentage).mul(legalOriginalPrice.value).toNumber()
    return royalFee < 0.01 ? 0.01 : royalFee.toFixed(2)
  } else if (props.blindBoxPage) {
    return 0
  } else {
    if (cnyMode.value) {
      return 0
    } else {
      return bsv(fee.val!.royaltyFee * buyAmount.value)
    }
  }
})

const totalPrice = computed(() => {
  if (props.isLegal) {
    return Number(nftSalePrice.value).toFixed(2)
  } else if (props.blindBoxPage) {
    if (cnyMode.value) {
      return Number(nftSalePrice.value).toFixed(2)
    } else {
      return Number(nftSalePrice.value)
    }
  } else {
    if (cnyMode.value) {
      return (+platformFee.value + +nftSalePrice.value).toFixed(2)
    } else {
      return new Decimal(bsv(nft.val?.nftPrice * buyAmount.value)).plus(
        bsv(fee.val!.total * buyAmount.value)
      )
    }
  }
})

function closeDialog() {
  emit('close')
  qrcodeUrl.value = ''
  restPayTime.value = '01:00'
  orderInvaildFlag.value = false
  payWechatSuccess.value = false
  appPaySuccessCallBack.value = false
  clearInterval(skipToDetail.value)
  clearInterval(wechatpayOverTime.value)
  clearInterval(restPayTimeInterval.value)
}

function toIndex() {
  closeDialog()
  router.push({ name: 'home' })
}

function toSuceessPage() {
  emit('success', { ...props })
  clearInterval(skipToDetail.value)
}

function minus() {
  buyAmount.value--
  if (buyAmount.value < 1) buyAmount.value = 1
}

function plus() {
  if (buyAmount.value >= 10) {
    return ElMessage.error(`${i18n.t('limitedTen')}`)
  }
  buyAmount.value++
  if (buyAmount.value > 10) {
    buyAmount.value = 10
  }
}

function toWallet() {
  window.open(import.meta.env.VITE_AuthUrl)
}

function wechatpay(res: any) {
  if (typeof res === 'string') {
    // debugger
    const { errCode, errStr, transaction, openId } = JSON.parse(res)
    if (errCode === 0) {
      ElMessage.success(`${i18n.t('alipaySuceess')}`)
      if (props.isLegal) {
        appPaySuccessCallBack.value = true
        wechatpayOverTime.value = setInterval(async () => {
          const result = await GetLegalNftDetail({
            uuid: props.uuid,
          })
          if (result.code === 0) {
            wechatpayState.value = result.data.nftSellState
            if (wechatpayState.value !== 0) {
              appPaySuccessCallBack.value = false
              emit('success', { ...props })
              clearInterval(wechatpayOverTime.value)
            }
          }
        }, 3000)
      } else {
        appPaySuccessCallBack.value = true
        wechatpayOverTime.value = setInterval(async () => {
          const result = await NFTApiGetNFTDetail({
            genesis: nft.val!.nftGenesis,
            codehash: nft.val!.nftCodehash,
            tokenIndex: nft.val!.nftTokenIndex,
          })
          if (result.code === 0) {
            if (
              result.data.results.items[0].nftSellState === 0 &&
              !result.data.results.items[0].nftIsReady
            ) {
              appPaySuccessCallBack.value = false
              emit('success', res)
              clearInterval(wechatpayOverTime.value)
            }
          }
        }, 3000)
      }
    } else if (errCode === -1) {
      if (errStr) ElMessage.error(`${i18n.t(errStr)}`)
    } else if (errCode === -2) {
      ElMessage.error(`${i18n.t('payCancel')}`)
    } else if (errCode === 10000) {
      ElMessage.error(`${i18n.t('uninstallWeChat')}`)
    }
  }
}

async function confirmPay(payPlatform?: PayPlatform) {
  if (payPlatform) {
    payPlatformIndex.value = payPlatformList.findIndex(item => item.platform === payPlatform)
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  try {
    await checkSdkStatus(route.fullPath)
    console.log('nft.val', nft)
    if (userStore.user!.metaId === nft.val?.nftOwnerMetaId) {
      loading.close()
      ElMessage.error(i18n.t('notCanBuySelf'))
      return
    } else {
      if (
        (!nft.val?.nftSellTxId || (nft.val?.nftSellTxId && nft.val?.nftSellTxId === '')) &&
        !props.isLegal &&
        !props.blindBoxPage
      ) {
        loading.close()
        ElMessage.error(i18n.t('buySellTxIdFail'))
        return
      } else {
        if (props.isLegal) {
          if (payPlatform === PayPlatform.WechatPay) {
            loading.close()
            return ElMessage.error(`${i18n.t('closeWeChatPay')}`)
          }
          if (isApp.value) {
            // if (!window.appMetaIdJsV2.hasOwnProperty('weChatPayForApp')) {
            //   loading.close()
            //   return ElMessage.error(`${i18n.t('updateAppVersion')}`)
            // }

            // const cbName: any = 'wechatpayForApp'
            try {
              const wechatpayResultForApp = await GetLegalBuyNftInfo({
                uuid: props.uuid,
                metaid: userStore.user!.metaId,
                type: Platform.app,
                payType: payPlatform,
                from: isIosApp ? PaySource.IOS : PaySource.ANDROID,
                quitUrl: `${import.meta.env.VITE_Hosts}/close`,
              })
              if (payPlatform === PayPlatform.AliPay) {
                if (!window.appMetaIdJsV2.hasOwnProperty('aliPayForApp')) {
                  loading.close()
                  return ElMessage.error(`${i18n.t('updateAppVersionForAlipay')}`)
                }
                const cbName: any = 'alipay'
                ;(window[cbName] as any) = wechatpay
                if (wechatpayResultForApp.code == 0) {
                  loading.close()
                  window.appMetaIdJsV2.aliPayForApp(
                    store.state.token.access_token,
                    wechatpayResultForApp.data.url,
                    cbName
                  )
                  // window.appMetaIdJsV2.weChatPayForApp(
                  //   store.state.token.access_token,
                  //   JSON.stringify(wechatpayResultForApp.data),
                  //   cbName
                  // )
                } else {
                  loading.close()
                  ElMessage.error(`${i18n.t('getAlipayorderFail')}`)
                }
              } else if (payPlatform === PayPlatform.UnionPay) {
                checkVersion()
                if (!window.appMetaIdJsV2.hasOwnProperty('unionPayForApp')) {
                  loading.close()
                  return ElMessage.error(`${i18n.t('updateAppVersionForBank')}`)
                }
                const cbName: any = 'sandPay'
                ;(window[cbName] as any) = wechatpay
                if (wechatpayResultForApp.code == 0) {
                  loading.close()
                  window.appMetaIdJsV2.unionPayForApp(
                    store.state.token.access_token,
                    wechatpayResultForApp.data.url,
                    cbName
                  )
                } else {
                  loading.close()
                  ElMessage.error(`${i18n.t('getSandPayorderFail')}`)
                }
              }
            } catch (error) {
              loading.close()
              ElMessage.error(
                payPlatform === PayPlatform.UnionPay
                  ? `${i18n.t('getSandPayorderFail')}`
                  : `${i18n.t('getAlipayorderFail')}`
              )
            }
          } else {
            const payResult = await GetLegalBuyNftInfo({
              uuid: props.uuid,
              metaid: userStore.user!.metaId,
              type: payPlatform === PayPlatform.UnionPay ? Platform.h5 : Platform.native,
              payType: payPlatform,
              from: PaySource.WEB,
              quitUrl: `${import.meta.env.VITE_Hosts}/close`,
              // quitUrl: `${import.meta.env.VITE_Hosts}${router.currentRoute.value.path}`,
            })
            if (payResult.code === 0) {
              if (payPlatform === PayPlatform.AliPay) {
                loading.close()
                qrcodeUrl.value = payResult.data.url
                newQrcode()
                setTimeout(() => {
                  endTime.value = dayjs()
                    .add(1, 'm')
                    .toString()
                }, 1000)
                restPayTimeInterval.value = setInterval(() => {
                  payTimeOver()
                }, 1000)
                wechatpayOverTime.value = setInterval(async () => {
                  const result = await GetLegalNftDetail({
                    uuid: props.uuid,
                  })
                  if (result.code === 0) {
                    wechatpayState.value = result.data.nftSellState
                    if (wechatpayState.value !== 0) {
                      payWechatSuccess.value = true
                      clearInterval(wechatpayOverTime.value)
                      clearInterval(restPayTimeInterval.value)
                      skipToDetail.value = setInterval(() => {
                        overTime.value--
                        if (overTime.value <= 0) {
                          emit('success', { ...props })
                          clearInterval(skipToDetail.value)
                          loading.close()
                        }
                      }, 1000)
                    }
                  }
                }, 3000)
              } else if (payPlatform === PayPlatform.UnionPay) {
                if (payResult.data.url) {
                  loading.close()
                  quickPayOpen.value = true
                  quickPayDoc.value = payResult.data.url

                  window.addEventListener('message', e => {
                    console.log(e.origin, e.data)
                    if (e.data === 'success') {
                      quickPayOpen.value = false
                      appPaySuccessCallBack.value = true
                      wechatpayOverTime.value = setInterval(async () => {
                        const result = await GetLegalNftDetail({
                          uuid: props.uuid,
                        })
                        if (result.code === 0) {
                          wechatpayState.value = result.data.nftSellState
                          if (wechatpayState.value !== 0) {
                            appPaySuccessCallBack.value = false
                            clearInterval(wechatpayOverTime.value)
                            emit('success', { ...props })
                          }
                        }
                      }, 3000)
                    }
                  })
                } else {
                  loading.close()
                  ElMessage.error(`${i18n.t('getUrlFail')}`)
                }
              }
            } else if (payResult.code == 1005) {
              loading.close()
              ElMessage.error(i18n.t('waitFiveMin'))
            } else {
              loading.close()
              ElMessage.error(i18n.t('createdAliPayFail'))
            }
          }
        } else if (props.blindBoxPage) {
          const blindBoxBuyRes: BuyBlindBoxData = await BuyBlindBox({
            quantity: buyAmount.value,
            metaid: userStore.user.metaId,
            address: userStore.user.address,
            currency: store.getters.getterCurrentPrice,
            type: store.state.isApp ? 2 : 1,
          })
          if (blindBoxBuyRes.code === 0) {
            if (cnyMode.value) {
              if (payPlatform === PayPlatform.WechatPay) {
                loading.close()
                return ElMessage.error(`${i18n.t('closeWeChatPay')}`)
              }
              if (isApp.value) {
                if (!window.appMetaIdJsV2.hasOwnProperty('weChatPayForApp')) {
                  loading.close()
                  return ElMessage.error(`${i18n.t('updateAppVersion')}`)
                }
                if (!window.appMetaIdJsV2.hasOwnProperty('aliPayForApp')) {
                  loading.close()
                  return ElMessage.error(`${i18n.t('updateAppVersionForAlipay')}`)
                }
                if (!window.appMetaIdJsV2.hasOwnProperty('unionPayForApp')) {
                  loading.close()
                  return ElMessage.error(`${i18n.t('updateAppVersionForBank')}`)
                }

                if (blindBoxBuyRes.code == 0) {
                  const cbName: any = 'wechatpay'
                  ;(window[cbName] as any) = wechatpay(blindBoxBuyRes)
                  loading.close()
                  window.appMetaIdJsV2.weChatPayForApp(
                    store.state.token.access_token,
                    JSON.stringify(blindBoxBuyRes.data),
                    cbName
                  )
                }
              } else {
                if (blindBoxBuyRes.code == 0) {
                  loading.close()
                  qrcodeUrl.value = blindBoxBuyRes.data.url
                  newQrcode()
                  setTimeout(() => {
                    endTime.value = dayjs()
                      .add(1, 'm')
                      .toString()
                  }, 1000)
                  restPayTimeInterval.value = setInterval(() => {
                    payTimeOver()
                  }, 1000)
                  wechatpayOverTime.value = setInterval(async () => {
                    const orderStatusRes = await BuyBlindBoxStatus({
                      wxCoreOrderId: blindBoxBuyRes.data.wxCoreOrderId,
                    })
                    console.log('xzxzxzxzx222szx', orderStatusRes)
                    if (orderStatusRes.code == 0 && orderStatusRes.data === 'success') {
                      payWechatSuccess.value = true
                      clearInterval(restPayTimeInterval.value)
                      clearInterval(wechatpayOverTime.value)
                    }
                  }, 3000)
                  // clearInterval(restPayTimeInterval.value)
                } else {
                  switch (blindBoxBuyRes.code) {
                    case orderError.lostParams:
                      ElMessage.error(`${i18n.t('lostParams')}`)
                      break
                    case orderError.notAllowBuy:
                      ElMessage.error(`${i18n.t('notAllowBuy')}`)
                      break
                    case orderError.restEnougth:
                      ElMessage.error(`${i18n.t('restEnougth')}`)
                      break
                    case orderError.limitedOnceSale:
                      ElMessage.error(`${i18n.t('limitedOnceSale')}`)
                      break
                    case orderError.limitedMetaIdBuy:
                      ElMessage.error(`${i18n.t('limitedMetaIdBuy')}`)
                      break
                    case orderError.serviceBusy:
                      ElMessage.error(`${i18n.t('serviceBusy')}`)
                      break
                    case orderError.notFoundWxCoreId:
                      ElMessage.error(`${i18n.t('notFoundWxCoreId')}`)
                      break
                    case orderError.wxCoreOrderFail:
                      ElMessage.error(`${i18n.t('wxCoreOrderFail')}`)
                      break
                    default:
                      break
                  }
                  clearInterval(restPayTimeInterval.value)
                  clearInterval(wechatpayOverTime.value)
                  loading.close()
                }
              }
            } else {
              if (blindBoxBuyRes.code === 0) {
                const res = await store.state.sdk.makeTx([
                  {
                    amount: blindBoxBuyRes.data.amount,
                    address: blindBoxBuyRes.data.address,
                  },
                ])
                if (res?.code === 200) {
                  // 翻转
                  const sendRes = await SendRawTx({
                    address: userStore.user!.address,
                    metaId: userStore.user!.metaId,
                    orderId: blindBoxBuyRes.data.wxCoreOrderId,
                    tx_raw: res.data.rawTx,
                  })
                  if (sendRes.code === 0) {
                    const checkOrderStatus = setInterval(async () => {
                      const orderStatusRes = await BuyBlindBoxStatus({
                        wxCoreOrderId: blindBoxBuyRes.data.wxCoreOrderId,
                      })
                      if (orderStatusRes.code === 0 && orderStatusRes.data === 'success') {
                        clearInterval(checkOrderStatus)
                        loading.close()
                        ElMessage.success(`${i18n.t('buy')} ${i18n.t('success')}`)
                        router.push({
                          path: `/self/${userStore.user.metaId}/myBlindbox`,
                        })
                      }
                    }, 3000)
                  }
                  // const callbackRes: callbackres = await wxcoreForBuyBlindBox({
                  //   status: res.code,
                  //   order_id: blindBoxBuyRes.data.wxCoreOrderId,
                  //   transaction_id: res.data.rawTx,
                  // })
                  // if (callbackRes.code === 0) {
                  //   ElMessage.success(`${i18n.t(callbackRes.data)}`)
                  //   loading.close()
                  // } else {
                  //   ElMessage.error(`${i18n.t('buyBlindBoxFail')}`)
                  //   loading.close()
                  // }
                }
              }
              // return ElMessage.error(`${i18n.t('appNotSupport')}`)
              // if (isApp.value) {
              //   if (!window.appMetaIdJsV2.hasOwnProperty('makeTx')) {
              //     loading.close()
              //     return ElMessage.error(`${i18n.t('updateAppVersion')}`)
              //   }
              //   if (blindBoxBuyRes.code == 0) {
              //     const cbName: any = 'makeTxForApp'
              //     ;(window[cbName] as any) = makeTx(blindBoxBuyRes.data.wxCoreOrderId)
              //     const makeTxParams = {
              //       userName: userStore.user.name,
              //       clientId: import.meta.env.VITE_AppId,
              //       payToList: [
              //         {
              //           amount: blindBoxBuyRes.data.amout,
              //           address: blindBoxBuyRes.data.address,
              //         },
              //       ],
              //       opRetrunList: ['BuyBlindBoxForBsv'],
              //     }
              //     loading.close()
              //     window.appMetaIdJsV2.makeTx(
              //       store.state.token.access_token,
              //       JSON.stringify(makeTxParams),
              //       cbName
              //     )
              //   }
              // }
            }
          } else {
            ElMessage.error(blindBoxBuyRes.error)
            loading.close()
          }
        } else {
          // 关闭微信支付
          if (payPlatform === PayPlatform.WechatPay) {
            loading.close()
            return ElMessage.error(`${i18n.t('closeWeChatPay')}`)
          }
          const params = {
            codehash: nft.val.nftCodehash,
            genesis: nft.val.nftGenesis,
            tokenIndex: nft.val.nftTokenIndex,
            genesisTxid: nft.val.nftGenesisTxId,
            sensibleId: nft.val.nftSensibleId,
            sellTxId: nft.val.nftSellTxId,
            sellContractTxId: nft.val.nftSellContractTxId,
            amount: nft.val.nftPrice,
            issueMetaId: nft.val.nftIssueMetaId,
            issueAddress: nft.val.nftIssueAddress,
            isFirstSell: nft.val.nftIsFirstSell,
            ownerMetaId: nft.val.nftOwnerMetaId,
          }
          if (cnyMode.value) {
            const address = userStore.user.address
              ? userStore.user.address
              : await checkUserAddress(userStore.user.metaId)
            if (!address) {
              return ElMessage.error(`${i18n.t('getUserAddressFali')}`)
            }
            try {
              const legalOrderResult = await createNftOrderForLegal({
                address: userStore.user.address,
                amount: new Decimal(shouldPayPrice.value).toString(),
                // amount: envMode.value ? '1' : new Decimal(shouldPayPrice.value).toString(),
                codehash: params.codehash,
                contract: params.sellContractTxId,
                currency: UnitName.RMB,
                description: nft.val.nftSellDesc,
                genesis: params.genesis,
                goods_name: nft.val.nftName,
                index: params.tokenIndex,
                metaid: userStore.user.metaId,
                types: isApp.value
                  ? Platform.app
                  : payPlatform == PayPlatform.UnionPay
                  ? Platform.h5
                  : Platform.native,
                pay_type: payPlatform,
                quit_url:
                  payPlatform == PayPlatform.UnionPay
                    ? `${import.meta.env.VITE_Hosts}/close`
                    : location.href,
              })
              if (isApp.value) {
                if (payPlatform === PayPlatform.WechatPay) {
                  if (!window.appMetaIdJsV2.hasOwnProperty('weChatPayForApp')) {
                    loading.close()
                    return ElMessage.error(`${i18n.t('updateAppVersion')}`)
                  }
                  const cbName: any = 'wechatpay'
                  ;(window[cbName] as any) = wechatpay
                  if (legalOrderResult.code === 0) {
                    loading.close()
                    window.appMetaIdJsV2.weChatPayForApp(
                      store.state.token.access_token,
                      JSON.stringify(legalOrderResult.data),
                      cbName
                    )
                  }
                } else if (payPlatform === PayPlatform.AliPay) {
                  if (!window.appMetaIdJsV2.hasOwnProperty('aliPayForApp')) {
                    loading.close()
                    return ElMessage.error(`${i18n.t('updateAppVersionForAlipay')}`)
                  }
                  const cbName: any = 'alipay'
                  ;(window[cbName] as any) = wechatpay
                  if (legalOrderResult.code === 0) {
                    loading.close()
                    window.appMetaIdJsV2.aliPayForApp(
                      store.state.token.access_token,
                      legalOrderResult.data.url,
                      cbName
                    )
                  } else {
                    loading.close()
                    ElMessage.error(`${i18n.t('getAlipayorderFail')}`)
                  }
                } else if (payPlatform === PayPlatform.UnionPay) {
                  checkVersion()
                  if (!window.appMetaIdJsV2.hasOwnProperty('unionPayForApp')) {
                    loading.close()
                    return ElMessage.error(`${i18n.t('updateAppVersionForBank')}`)
                  }
                  const cbName: any = 'sandPay'
                  ;(window[cbName] as any) = wechatpay
                  if (legalOrderResult.code == 0) {
                    loading.close()
                    window.appMetaIdJsV2.unionPayForApp(
                      store.state.token.access_token,
                      legalOrderResult.data.url,
                      cbName
                    )
                  } else {
                    loading.close()
                    ElMessage.error(`${i18n.t('getSandPayorderFail')}`)
                  }
                }
              } else {
                if (legalOrderResult.code == 0) {
                  loading.close()
                  if (payPlatform === PayPlatform.AliPay) {
                    qrcodeUrl.value = legalOrderResult.data.url
                    newQrcode()
                    setTimeout(() => {
                      endTime.value = dayjs()
                        .add(1, 'm')
                        .toString()
                    }, 1000)
                    restPayTimeInterval.value = setInterval(() => {
                      payTimeOver()
                    }, 1000)
                    wechatpayOverTime.value = setInterval(async () => {
                      const result = await NFTApiGetNFTDetail({
                        genesis: params.genesis,
                        codehash: params.codehash,
                        tokenIndex: params.tokenIndex,
                      })
                      if (result.code === 0) {
                        if (
                          result.data.results.items[0].nftSellState == 0 &&
                          !result.data.results.items[0].nftIsReady
                        ) {
                          payWechatSuccess.value = true
                          clearInterval(wechatpayOverTime.value)
                          clearInterval(restPayTimeInterval.value)
                        }
                        console.log('xxxxxzzzzxxxzzz', result.data.results.items)
                      } else {
                        clearInterval(wechatpayOverTime.value)
                        clearInterval(restPayTimeInterval.value)
                        loading.close()
                      }
                    }, 3000)
                  } else if (payPlatform === PayPlatform.UnionPay) {
                    if (legalOrderResult.data.url) {
                      loading.close()
                      quickPayOpen.value = true
                      quickPayDoc.value = legalOrderResult.data.url
                      window.addEventListener('message', e => {
                        console.log(e.origin, e.data)
                        if (e.data === 'success') {
                          quickPayOpen.value = false
                          appPaySuccessCallBack.value = true
                          wechatpayOverTime.value = setInterval(async () => {
                            const result = await NFTApiGetNFTDetail({
                              genesis: params.genesis,
                              codehash: params.codehash,
                              tokenIndex: params.tokenIndex,
                            })
                            if (result.code === 0) {
                              if (
                                result.data.results.items[0].nftSellState == 0 &&
                                !result.data.results.items[0].nftIsReady
                              ) {
                                payWechatSuccess.value = true
                                clearInterval(wechatpayOverTime.value)
                              }
                              console.log('xxxxxzzzzxxxzzz', result.data.results.items)
                            } else {
                              clearInterval(wechatpayOverTime.value)
                              loading.close()
                            }
                          }, 3000)
                        }
                      })
                    } else {
                      loading.close()
                      ElMessage.error(`${i18n.t('overLimitedPayAmount')}`)
                    }
                  }
                }
              }
            } catch (error) {
              if (loading) loading.close()

              emit('fail', error)
              return ElMessage.error(
                typeof error === 'string'
                  ? error.indexOf('6001') != -1
                    ? `${i18n.t('overLimitedPayAmount')}`
                    : `${i18n.t('orderIsPurchased')}`
                  : error
              )

              // console.log('发起订单失败')
            }
          } else {
            const userBalanceRes = await store.state.sdk?.getBalance()
            if (userBalanceRes && userBalanceRes.code === 200) {
              const allSatoshis = new Decimal(nft.val.nftPrice)
                .plus(fee.val.platformFee)
                .plus(fee.val.royaltyFee)
                .toNumber()
              if (userBalanceRes.data.satoshis > allSatoshis) {
                const res = await store.state.sdk?.nftBuy(params)
                if (res.code === 200) {
                  emit('success', res)
                  ElMessage.success(i18n.t('buySuccess'))
                  loading.close()
                }
              } else {
                loading.close()
                // 余额不足
                ElMessageBox.alert(
                  `
            <p>${i18n.t('useAmountTips')}: ${allSatoshis} Satoshis</p>
            <p>${i18n.t('insufficientBalance')}</p>
            `,
                  {
                    confirmButtonText: i18n.t('confirm'),
                    dangerouslyUseHTMLString: true,
                  }
                )
              }
            }
          }
        }
      }
    }
  } catch (error) {
    if (loading) loading.close()
    if (error) ElMessage.error(typeof error === 'string' ? error : JSON.stringify(error))
    emit('fail', error)
  }
}
</script>
<style lang="scss" scoped src="./PayConfirm.scss"></style>
