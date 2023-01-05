<template>
  <template v-if="modelValue">
    <!-- 订单支付 -->
    <ElDrawer
      :title="$t('PayModal.Order Pay')"
      v-model="isShowPayIframe"
      direction="btt"
      @close="onPayIframeClose"
      custom-class="el-drawer__body_no_padding"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div
        v-loading="isPayIframeLoading"
        :element-loading-svg="LoadingTEXT"
        :element-loading-text="$t('Loading')"
      >
        <div class="iosPayWarp" v-html="iosPayHtml"></div>
        <iframe id="pay-iframe" ref="PayIframeRef"></iframe>
      </div>
    </ElDrawer>

    <!-- 支付状态 -->
    <ElDrawer
      :title="payStatusModelTitle[payResult.status]"
      v-model="isShowPayStatusModal"
      direction="btt"
      @close="payStatusButtonFunction[payResult.status]"
      :show-close="payResult.status === PayStatus.Ing ? false : true"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <ElResult
        :icon="payStatusType[payResult.status]"
        :title="payStatusTitle[payResult.status]"
        :sub-title="payResultMessage"
        v-loading="payResult.status === PayStatus.Ing"
        :element-loading-svg="LoadingTEXT"
        :element-loading-text="$t('Loading')"
        element-loading-background="#fff"
      >
        <template #extra>
          <ElButton
            class="main-border"
            :class="payResult.status === PayStatus.Success ? 'primary' : ''"
            @click="payStatusButtonFunction[payResult.status]"
            >{{ payStatusButtonText[payResult.status] }}</ElButton
          >
        </template>
      </ElResult>
    </ElDrawer>

    <!-- 扫码支付 -->
    <ElDrawer
      title="扫码支付"
      v-model="isShowQrcode"
      direction="btt"
      @close="wechatPayQRCodeOnclose"
    >
      <div class="qrcode-pay">
        <div class="ttitle">{{ $t('PayModal.Buy') + '&nbsp;' + nft.val?.nftName }}</div>
        <div class="orderAmount">
          <div class="top flex flex-align-center">
            <div class="left flex1">
              <div class="label">{{ $t('PayModal.Order Amount') }}</div>
              <div class="tips">{{ $t('PayModal.PayTips1') }}</div>
            </div>
            <div class="right">
              <NFTAmountVue
                :amount="nft.val!.nftPrice"
                :genesis="nft.val!.nftGenesis"
                :codehash="nft.val!.nftCodehash"
                :is-first-sell="nft.val!.nftIsFirstSell"
                :is-legal="nft.val!.nftIsLegal"
              />
            </div>
          </div>
        </div>
        <div class="paycode">
          <img :src="qrcodeData" />
          <div class="paycode-tips flex flex-align-center flex-pack-center">
            <template v-if="isQrcodeInTime">
              {{ $t('PayModal.PayTips2') }}

              <div class="countdown">
                <!-- <VueCountdown
                :time="60 * 1000"
                :transform="transformSlotProps"
                v-slot="{ minutes, seconds }"
                @end="isQrcodeInTime = false"
                class="count-down-warp"
              >
                <div class="count-down">({{ minutes }}:{{ seconds }})</div>
              </VueCountdown> -->
              </div>
            </template>
            <template v-else>{{ $t('PayModal.PayTips3') }}</template>
          </div>
        </div>

        <div class="loading-status flex flex-align-center flex-pack-center">
          <ElIcon class="is-loading">
            <Loading />
          </ElIcon>
          {{ $t('PayModal.PayTips4') }}
        </div>
        <div class="other-tips">
          {{ $t('PayModal.PayTips5') }}<a @click="$router.back()">{{ $t('PayModal.PayTips6') }}</a
          >{{ $t('PayModal.PayTips7') }}
        </div>
        <div class="other-tips">
          {{ $t('PayModal.PayTips8') }}
        </div>
      </div>
    </ElDrawer>

    <!-- 余额支付确认框 -->
    <ElDialog
      v-model="balancePay.visible"
      center
      :title="$t('PayModal.Balance Pay')"
      :close-on-click-modal="false"
      @close="onBalancePayClose"
    >
      <div class="balance-pay-confirm">
        <div class="pay-amount">
          <div>{{ $t('PayModal.Pay Amount') }}</div>
          <div class="amount">
            ￥{{ new Decimal(balancePay.params.oriTotalAmount).div(100).toFixed(2) }}
          </div>
        </div>
        <ElInput
          tyype="number"
          v-model="balancePay.params.smsCode"
          :placeholder="$t('PayModal.Enter Code ')"
        />
        <div class="operate flex">
          <ElButton
            type="primary"
            size="large"
            class="flex1"
            :disabled="balancePay.params.smsCode === ''"
            @click="balancePayConfirm"
            >{{ $t('PayModal.Confirm Pay') }}</ElButton
          >
        </div>
      </div>
    </ElDialog>
  </template>
</template>

<script setup lang="ts">
import { GetOrderAmout, PayOrderConfirm } from '@/api/pay'
import { PayPlatform, PayStatus } from '@/enum'
import { isApp, isIOS, isIosApp, isWechat, useRootStore } from '@/stores/root'
import Decimal from 'decimal.js-light'
import {
  ComponentOptionsBase,
  ComponentPublicInstance,
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  reactive,
  Ref,
  ref,
  watch,
} from 'vue'
import QRCode from 'qrcode'
import { LoadingTEXT } from '@/utils/LoadingSVGText'

import {
  alertCatchError,
  checkAppHasMethod,
  CheckMetaMaskAccount,
  checkOrderStatus as CheckOrderStatus,
  openLoading,
} from '@/utils/util'
import { ElMessage, LoadingParentElement } from 'element-plus'
import { GetOrder, GetOrderStatus, PayETHByME, UpdatePay } from '@/api/wxcore'
import { useUserStore } from '@/stores/user'
import { ethers } from 'ethers'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
  url: string
  payPlatform: PayPlatform
  orderId: string
  product_type: number
  amount: string
}
const props = withDefaults(defineProps<Props>(), {})
const rootStore = useRootStore()

const emit = defineEmits(['success', 'fail', 'update:modelValue'])
const nft: { val: null | NFTApiGetNFTDetailResDataItem } = inject('nft')!
const i18n = useI18n()

const payStatusType = {
  [PayStatus.Ing]: 'loading',
  [PayStatus.Fail]: 'error',
  [PayStatus.Success]: 'success',
}
const useStore = useUserStore()

const payStatusTitle = {
  [PayStatus.Ing]: '',
  [PayStatus.Fail]: i18n.t('PayModal.Pay Fail'),
  [PayStatus.Success]: i18n.t('PayModal.Pay Success'),
}

const payStatusModelTitle = {
  [PayStatus.Ing]: i18n.t('PayModel.Paying'),
  [PayStatus.Fail]: i18n.t('PayModal.Pay Fail'),
  [PayStatus.Success]: i18n.t('PayModal.Pay Success'),
}

const payStatusButtonText = {
  [PayStatus.Ing]: '',
  [PayStatus.Fail]: i18n.t('Confirm'),
  [PayStatus.Success]: i18n.t('PayModal.Finish'),
}

const payStatusButtonFunction = {
  [PayStatus.Ing]: () => {
    //
  },
  [PayStatus.Fail]: () => {
    isShowPayStatusModal.value = false
    emit('fail')
    emit('update:modelValue', false)
    payResult.status = PayStatus.Ing
  },
  [PayStatus.Success]: () => {
    isShowPayStatusModal.value = false
    emit('success')
    emit('update:modelValue', false)
    payResult.status = PayStatus.Ing
  },
}
const payResult = reactive({
  modelTitle: payStatusModelTitle[PayStatus.Ing],
  status: PayStatus.Ing,
  intro: '',
})

const balancePay = reactive({
  visible: false,
  params: {
    oriCustomerOrderNo: '',
    oriTotalAmount: '',
    smsCode: '',
  },
})

let checkOrderStateInterval: any // 轮询检查订单状态
let checkOrderTimeOut: any // 检查订单超时
let loading: { close: () => void }
const isShowPayStatusModal = ref(false)
const isShowQrcode = ref(false)
const isShowPayIframe = ref(false)
const isPayIframeLoading = ref(true)
const qrcodeData = ref('')
const iosPayHtml = ref('')
const PayIframeRef = ref()
const isQrcodeInTime = ref(true) // 付款码是否在有效时间

const payResultMessage = computed(() => {
  let msg = ''
  if (payResult.status === PayStatus.Success) {
    const symbol =
      props.payPlatform === PayPlatform.ETH
        ? import.meta.env.VITE_ETH_CHAIN
        : rootStore.currentPriceSymbol
    const amount =
      props.payPlatform === PayPlatform.ETH
        ? new Decimal(props.amount).div(Math.pow(10, 18)).toFixed(10)
        : new Decimal(props.amount).div(100).toFixed(2)
    msg = `ShowPayLimited: ${symbol} ${amount}`
  } else if (payResult.status === PayStatus.Fail) {
    msg = payResult.intro
  }
  return msg
})

function drawePayCode() {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (props.url) {
        if (props.payPlatform === PayPlatform.ETH) {
          await CheckMetaMaskAccount(useStore.user!.evmAddress!)
          const tx = await window.ethereum!.request!({
            method: 'eth_sendTransaction',
            params: [
              {
                value: ethers.utils.hexValue(new Decimal(props.amount + '000000000').toNumber()),
                to: props.url,
                from: useStore.user?.evmAddress,
              },
            ],
          })
          const res = await UpdatePay({
            order_id: props.orderId,
            tx_hash: tx,
            from_coin_address: useStore.user!.evmAddress!,
            product_type: props.product_type,
          })
          if (res.code === 0) {
            payResult.status = PayStatus.Success
            isShowPayStatusModal.value = true
          }
        }
        // 余额支付
        else if (props.payPlatform === PayPlatform.BalancePay) {
          const getOrdetAmount = await GetOrderAmout({
            address: useStore.user!.address!,
            oriCustomerOrderNo: props.url,
          }).catch(() => reject(Error(i18n.t('PayModal.Get Order Amount Fail'))))
          if (getOrdetAmount?.success) {
            balancePay.params.oriCustomerOrderNo = props.url
            balancePay.params.oriTotalAmount = getOrdetAmount.data.total_amount
            payResult.intro = `ShowPayLimited: ¥ ${new Decimal(getOrdetAmount.data.total_amount)
              .div(100)
              .toFixed(2)}`
            balancePay.visible = true
          }
        } else if (isWechat) {
          // 微信浏览器环境 生成二维码，然后让后用户保存图片，扫码支付
          if (
            props.payPlatform === PayPlatform.UnionPay ||
            props.payPlatform === PayPlatform.QuickPay
          ) {
            openPayIframe(props.url)
            isShowPayStatusModal.value = true
          } else {
            const canvas: any = document.querySelector('#qrcodeContainer')
            QRCode.toCanvas(canvas, props.url, (err: any) => {
              if (!err) {
                qrcodeData.value = canvas.toDataURL('image/png')
                isShowQrcode.value = true
              }
            })
            // 轮询检查订单状态
            await intervalChceckOrderStatus()
            resolve()
          }
        } else {
          // 非微信浏览器环境
          if (isApp) {
            if (isIosApp) {
              window.addEventListener('message', res => {
                console.log(res.data)
                if (res.data.status) {
                  isShowPayIframe.value = false
                  onPayIframeClose()
                  window.removeEventListener('message', () => {
                    //
                  })
                }
              })
              openPayIframe(props.url)
              resolve()
            } else {
              await checkAppHasMethod('payForApp')
              // @ts-ignore
              window.onAppPayCallBack = onAppPayCallBack
              const params = {
                payType:
                  props.payPlatform === PayPlatform.WechatPay
                    ? 0
                    : props.payPlatform === PayPlatform.AliPay
                    ? 1
                    : props.payPlatform === PayPlatform.UnionPay
                    ? 2
                    : -1,
                orderInfo: props.url,
              }
              window.appMetaIdJsV2.payForApp(
                useStore.user!.token,
                JSON.stringify(params),
                'onAppPayCallBack'
              )
              resolve()
            }
          } else {
            if (
              props.payPlatform === PayPlatform.UnionPay ||
              props.payPlatform === PayPlatform.QuickPay
            ) {
              window.addEventListener('message', res => {
                console.log(res.data)
                if (res.data.status) {
                  isShowPayIframe.value = false
                  onPayIframeClose()
                  window.removeEventListener('message', () => {
                    //
                  })
                }
              })
            }
            openPayIframe(props.url)
            resolve()
          }
        }
        resolve()
      } else {
        throw new Error(i18n.t('PayModal.Platform exception'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

async function onPayIframeClose() {
  window.removeEventListener('message', () => {
    //
  })
  isShowPayStatusModal.value = true
  checkOrderStatus()
}

function checkOrderStatus() {
  setTimeout(
    async () => {
      debugger
      const res = await GetOrder({
        order_id: props.orderId,
        pay_type: props.payPlatform,
        product_type: props.product_type,
      }).catch(error => {
        payResult.status = PayStatus.Fail
        alertCatchError(error)
      })
      if (res) {
        payResult.status =
          res.data.status === 2 || res.data.status === 3 ? PayStatus.Success : PayStatus.Fail
      }
    },
    props.payPlatform === PayPlatform.UnionPay ? 10000 : 3000
  )
}

function openPayIframe(url: string) {
  isPayIframeLoading.value = true
  isShowPayIframe.value = true
  nextTick(() => {
    if (url.indexOf('<html>') !== -1 || url.indexOf('<form') !== -1) {
      if (props.payPlatform === PayPlatform.AliPay && isIOS && !isApp) {
        iosPayHtml.value = url
        nextTick(() => {
          document.forms[0].submit()
        })
      } else {
        PayIframeRef.value.srcdoc = url
      }
    } else {
      debugger
      if (isIOS && !isApp) {
        // ios 网页
        window.addEventListener('message', function(event) {
          const result = event.data
          if (result.openUrl) {
            window.location.href = result.openUrl
          }
        })

        const script = document.createElement('SCRIPT')
        script.append(`
        window.parent.postMessage({ openUrl: '${url}' }, "*");
      `)
        PayIframeRef.value!.appendChild(script)
      } else {
        PayIframeRef.value.src = url
      }
    }
    isPayIframeLoading.value = false
  })
}

function intervalChceckOrderStatus() {
  return new Promise<void>(async (resolve, reject) => {
    // 轮询检查订单状态
    checkOrderStateInterval = setInterval(async () => {
      const res = await GetOrder({
        order_id: props.orderId,
        pay_type: props.payPlatform,
        product_type: props.product_type,
      })
      if (
        res.code === 0 &&
        (res.data.status === 2 || res.data.status === 3 || res.data.status === 4)
      ) {
        // 购买成功
        isShowQrcode.value = false
        clearInterval(checkOrderStateInterval)
        clearTimeout(checkOrderTimeOut)
        payResult.status = PayStatus.Success
        isShowPayStatusModal.value = true
        resolve()
      }
    }, 1000)
    checkOrderTimeOut = setTimeout(() => {
      isShowQrcode.value = false
      clearInterval(checkOrderTimeOut)
      payResult.status = PayStatus.Fail
      isShowPayStatusModal.value = true
      resolve()
    }, 1000 * 60)
  })
}

function setPayFail(reason: string) {
  debugger
  payResult.intro = reason
  payResult.status = PayStatus.Fail
  isShowPayStatusModal.value = true
}

function onAppPayCallBack(res: any) {
  try {
    isShowPayStatusModal.value = true
    res = JSON.parse(res)
    if (res.errCode === 0) {
      payResult.status = PayStatus.Success
      // 支付成功
    } else if (res.errCode === -1) {
      payResult.status = PayStatus.Fail
      // 支付失败
    } else if (res.errCode === -2) {
      // 用户取消
      isShowPayStatusModal.value = false
      emit('update:modelValue', false)
      // 支付失败
    } else if (res.errCode === 10000) {
      payResult.status = PayStatus.Fail
    }
  } catch (error) {
    ElMessage.error(
      i18n.t('PayModal.Parsing App callback parameter error') + (error as any).message
    )
  }
}

async function balancePayConfirm() {
  const loading = openLoading()
  const res = await PayOrderConfirm({
    ...balancePay.params,
    address: useStore.user!.address!,
  }).catch(error => {
    payResult.intro = error.message
    payResult.status = PayStatus.Fail
    balancePay.visible = false
    isShowPayStatusModal.value = true
    loading.close()
  })
  if (res?.success) {
    payResult.status = PayStatus.Success
    balancePay.visible = false
    isShowPayStatusModal.value = true
    loading.close()
  }
}

function transformSlotProps(props: any) {
  const formattedProps = {}
  Object.entries(props).forEach(([key, value]) => {
    // @ts-ignore
    formattedProps[key] = value < 10 ? `0${value}` : String(value)
  })
  return formattedProps
}

function wechatPayQRCodeOnclose() {
  // 清除倒计时
  clearInterval(checkOrderStateInterval)
  clearTimeout(checkOrderTimeOut)
}

function onBalancePayClose() {
  if (!isShowPayStatusModal.value) {
    payResult.status = PayStatus.Fail
    isShowPayStatusModal.value = true
  }
}

onBeforeUnmount(() => {
  // 清除倒计时
  clearInterval(checkOrderStateInterval)
  clearTimeout(checkOrderTimeOut)
})

defineExpose({
  setPayFail,
})

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      loading = openLoading()
      drawePayCode()
        .catch(error => {
          debugger
          setPayFail(error.message)
        })
        .finally(() => {
          loading.close()
        })
    } else {
      // 清除倒计时
      clearInterval(checkOrderStateInterval)
      clearTimeout(checkOrderTimeOut)
    }
  }
)
</script>

<style lang="scss" scoped src="./StartPay.scss"></style>
