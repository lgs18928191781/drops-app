<template>
  <template v-if="modelValue">
    <!-- 订单支付 -->
    <ElDrawer
      title="订单支付"
      v-model="isShowPayIframe"
      direction="btt"
      @close="onPayIframeClose"
      custom-class="el-drawer__body_no_padding"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div v-loading="isPayIframeLoading">
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
        :sub-title="payResult.intro"
        v-loading="payResult.status === PayStatus.Ing"
        element-loading-background="#fff"
      >
        <template #extra>
          <ElButton type="primary" @click="payStatusButtonFunction[payResult.status]">{{
            payStatusButtonText[payResult.status]
          }}</ElButton>
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
        <div class="ttitle">购买 {{ nft.val?.nftName }}</div>
        <div class="orderAmount">
          <div class="top flex flex-align-center">
            <div class="left flex1">
              <div class="label">订单金额</div>
              <div class="tips">支付成功后，可在“我的NFT”中查看</div>
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
              请使用支付宝扫码支付
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
            <template v-else>付款二维码已失效</template>
          </div>
        </div>

        <div class="loading-status flex flex-align-center flex-pack-center">
          <ElIcon class="is-loading">
            <Loading />
          </ElIcon>
          支付确认中，请勿关闭窗口
        </div>
        <div class="other-tips">
          等待太久？<a @click="$router.back()">我已支付成功，继续浏览其他NFT</a
          >（可约1分钟后前往我的NFT查看）
        </div>
        <div class="other-tips">
          二维码有效期为1分钟，请尽快扫码支付(如二维码超过有效期后需等待3分钟方可重新发起订单)
        </div>
      </div>
    </ElDrawer>

    <!-- 余额支付确认框 -->
    <ElDialog
      v-model="balancePay.visible"
      center
      title="余额支付"
      :close-on-click-modal="false"
      @close="onBalancePayClose"
    >
      <div class="balance-pay-confirm">
        <div class="pay-amount">
          <div>支付金额</div>
          <div class="amount">
            ￥{{ new Decimal(balancePay.params.oriTotalAmount).div(100).toFixed(2) }}
          </div>
        </div>
        <ElInput
          tyype="number"
          v-model="balancePay.params.smsCode"
          placeholder="请填写短信验证码"
        />
        <div class="operate flex">
          <ElButton
            type="primary"
            size="large"
            class="flex1"
            :disabled="balancePay.params.smsCode === ''"
            @click="balancePayConfirm"
            >确认支付</ElButton
          >
        </div>
      </div>
    </ElDialog>
  </template>
</template>

<script setup lang="ts">
import { GetOrderAmout, PayOrderConfirm } from '@/api/pay'
import { PayPlatform, PayStatus } from '@/enum'
import { isApp, isIOS, isIosApp, isWechat } from '@/stores/root'
import Decimal from 'decimal.js-light'
import {
  ComponentOptionsBase,
  ComponentPublicInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  reactive,
  Ref,
  ref,
  watch,
} from 'vue'
import QRCode from 'qrcode'

import {
  alertCatchError,
  checkAppHasMethod,
  checkOrderStatus as CheckOrderStatus,
  openLoading,
} from '@/utils/util'
import { ElMessage, LoadingParentElement } from 'element-plus'
import { GetOrderStatus, PayETHByME } from '@/api/wxcore'
import { useUserStore } from '@/stores/user'
import { ethers } from 'ethers'

interface Props {
  modelValue: boolean
  url: string
  payPlatform: PayPlatform
  orderId: string
  product_type: number
  amount: string
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['success', 'fail', 'update:modelValue'])
const nft: { val: null | NFTApiGetNFTDetailResDataItem } = inject('nft')!
const payStatusType = {
  [PayStatus.Ing]: 'loading',
  [PayStatus.Fail]: 'error',
  [PayStatus.Success]: 'success',
}
const useStore = useUserStore()

const payStatusTitle = {
  [PayStatus.Ing]: '',
  [PayStatus.Fail]: '支付失败',
  [PayStatus.Success]: '支付成功',
}

const payStatusModelTitle = {
  [PayStatus.Ing]: '正在支付中..',
  [PayStatus.Fail]: '支付失败',
  [PayStatus.Success]: '支付成功',
}

const payStatusButtonText = {
  [PayStatus.Ing]: '',
  [PayStatus.Fail]: '确认',
  [PayStatus.Success]: '完成',
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

function drawePayCode() {
  return new Promise<void>(async (resolve, reject) => {
    if (props.url) {
      if (props.payPlatform === PayPlatform.ETH) {
        const getOrderAmount = await CheckOrderStatus({
          orderId: props.orderId,
          payPlatform: props.payPlatform,
          isBilinbox: props.isBilinbox,
        })
        const tx = await window.ethereum!.request!({
          method: 'eth_sendTransaction',
          params: [
            {
              value: ethers.utils.hexValue(
                new Decimal(getOrderAmount.amount).mul(Math.pow(10, 18)).toString()
              ),
              to: props.url,
              from: useStore.user?.ethAddress,
            },
          ],
        })
        const res = await PayETHByME({
          order_id: props.orderId,
          tx_hash: tx,
          from_coin_address: useStore.user!.ethAddress!,
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
        }).catch(() => reject(Error('获取订单金额失败')))
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
      reject(Error('平台异常,请稍后重试(6001)'))
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
  setTimeout(async () => {
    const res = await CheckOrderStatus({
      orderId: props.orderId,
      payPlatform: props.payPlatform,
      isBilinbox: props.isBilinbox,
    }).catch(error => {
      payResult.status = PayStatus.Fail
      alertCatchError(error)
    })
    if (res) {
      if (res.amount) {
        payResult.intro = `ShowPayLimited: ¥ ${new Decimal(res.amount).div(100).toFixed(2)}`
      }
      payResult.status = res.status
    }
  }, 3000)
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
      const res = await GetOrderStatus({
        orderId: props.orderId,
        payType: props.payPlatform,
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
    ElMessage.error('解析App回调参数错误, ' + (error as any).message)
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
