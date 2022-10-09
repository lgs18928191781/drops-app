import { createStore } from '@harlem/core'
import { HdWallet, hdWalletFromAccount } from '@/utils/wallet/hd-wallet'
import { toRaw } from 'vue'
import { PayPlatform } from '@/enum'
import { decode } from 'js-base64'
import { SDK } from '@/utils/sdk'

export interface RootState {
  sendCodeTimer: number
  redirectUri: string
  wallet: SDK | null
  defaultPayPlatform: number
  isSetedSystemConfig: boolean // 是否已设置网站配置
  exchangeRate: ExchangeRate
  isShowDownloadApp: boolean // 是否 显示下载App 提示
  marketDefalutClassify: string // 用户市场页面跳转到具体的分类
}

const UA = window.navigator.userAgent.toLowerCase()
export const isAndroid = !!(UA && UA.indexOf('android') > 0)
export const isIOS = !!(UA && /iphone|ipad|ipod|ios/.test(UA))
export const isWechat = !!(UA && /micromessenger/.test(UA))
export const isApp = !!window.appMetaIdJsV2
export const isIosApp = isIOS && isApp
export const isAndroidApp = isApp && isAndroid

const STATE: RootState = {
  sendCodeTimer: 0,
  redirectUri: '/',
  wallet: null,
  defaultPayPlatform: localStorage.getItem('defaultPayPlatform')
    ? parseInt(localStorage.getItem('defaultPayPlatform')!)
    : isAndroid && isApp
    ? PayPlatform.UnionPay
    : PayPlatform.QuickPay,
  isSetedSystemConfig: false,
  exchangeRate: {
    cnyRate: 0,
    usdtRate: 0,
    feeRate: 0,
    message: '',
  },
  isShowDownloadApp: true,
  marketDefalutClassify: '全部',
}

const { getter, mutation, onMutationSuccess } = createStore('root', STATE, {
  providers: {
    payload: payload => payload,
  },
})

export const watchMutationSuccess = onMutationSuccess
export const sendCodeTimer = getter('sendCodeTimer', state => state.sendCodeTimer)
export const redirectUri = getter('redirectUri', state => state.redirectUri)
export const showWallet = getter('wallet', state =>
  state.wallet ? toRaw(state.wallet) : state.wallet
)
export const isSetedSystemConfig = getter('isSetedSystemConfig', state => state.isSetedSystemConfig)
export const exchangeRate = getter('exchangeRate', state => state.exchangeRate)
export const isShowDownloadApp = getter('isShowDownloadApp', state => state.isShowDownloadApp)
export const defaultPayPlatform = getter('defaultPayPlatform', state => state.defaultPayPlatform)
export const marketDefalutClassify = getter(
  'marketDefalutClassify',
  state => state.marketDefalutClassify
)

export const setSendCodeTimer = mutation<number>('set-send-code-timer', (state, time: number) => {
  state.sendCodeTimer = time
})
export const setRedirectUri = mutation<string>('set-redirect-uri', (state, uri: string) => {
  state.redirectUri = uri
})
// export const setWallet = mutation<HdWallet | null>('set-wallet', (state, wallet: HdWallet | null) => {
//   state.wallet = wallet ? markRaw(wallet) : null
// })
export const setWallet = mutation('set-wallet', (state, isReset = false) => {
  state.wallet = isReset ? null : new SDK()
})
export const changeDefaultPayPlatform = mutation<PayPlatform>(
  'changeDefaultPayPlatform',
  (state, PayPlatform: PayPlatform) => {
    state.defaultPayPlatform = PayPlatform
    localStorage.setItem('defaultPayPlatform', PayPlatform.toString())
  }
)
export const changeIsSetedSystemConfig = mutation<boolean>(
  'changeIsSetedSystemConfig',
  (state, value: boolean) => {
    state.isSetedSystemConfig = value
  }
)
export const changeExchangeRate = mutation<ExchangeRate>(
  'change-exchange-rate',
  (state, value: ExchangeRate) => {
    state.exchangeRate = value
  }
)
export const changeIsShowDownloadApp = mutation<boolean>(
  'changeIsShowDownloadApp',
  (state, value: boolean) => {
    state.isShowDownloadApp = value
  }
)
export const changeMarketDefalutClassify = mutation<string>(
  'changeMarketDefalutClassify',
  (state, value: string) => {
    if (value) state.marketDefalutClassify = value
  }
)

onMutationSuccess('set-send-code-timer', event => {
  // console.log(event)
  const num = event.payload
  if (num > 0) {
    setTimeout(() => {
      setSendCodeTimer(num - 1)
    }, 1000)
  }
})

// 设置网站配置
export function setSystemConfig() {
  return new Promise<void>(async resolve => {
    changeIsSetedSystemConfig(true)
    getExchangeRate()

    setInterval(() => {
      getExchangeRate()
    }, 30 * 1000)
    resolve()
  })
}

// 获取获取费率
export function getExchangeRate() {
  return new Promise<void>(async resolve => {
    fetch('https://www.showpay.top/wxcore/legalbsv/getExchangeRate')
      .then(function(response) {
        return response.json()
      })
      .then(function(res) {
        if (res?.code === 0) {
          changeExchangeRate(res.data)
        }
      })
      .catch()
    resolve()
  })
}
