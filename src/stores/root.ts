import { SignUserType, ToCurrency } from '@/enum'
import { defineStore } from 'pinia'
import { GetCertMetaIdList } from '@/api/aggregation'
import i18n from '@/utils/i18n'
import { GetCertifiedMetaId } from '@/api/strapi'

export interface SignBaseInfo {
  userType: SignUserType
  areaCode: string
  phone: string
  email: string
}
interface RootState {
  signBaseInfo: SignBaseInfo
  sendCodeTimer: number
  redirectUri: string
  exchangeRate: ExchangeRate[]
  isGetedExchangeRate: boolean
  isShowLogin: boolean
  isShowMetaMak: boolean
  isCertedMetaIds: string[]
  currentPrice: ToCurrency
  theme: 'light' | 'dark'
  showLoginBindEvmAccount: {
    isUpdatePlan: boolean
    loginedButBind: boolean
    bindEvmChain: string
  }
  chainWhiteList: Array<string>
  updatePlanRes: {
    registerTime: number
    signHash: string
  } | null
  updatePlanWhiteList: string[]
}

const UA = window.navigator.userAgent.toLowerCase()
// 根据尺寸判断是否是移动端
export const isMobile = window.innerWidth <= 1024
export const isShortDevice = window.innerHeight <= 700
export const isAndroid = !!(UA && UA.indexOf('android') > 0)
export const isIOS = !!(UA && /iphone|ipad|ipod|ios/.test(UA))
export const isWechat = !!(UA && /micromessenger/.test(UA))
export const isApp = !!window.appMetaIdJsV2
export const isIosApp = isIOS && isApp
export const isAndroidApp = isApp && isAndroid
export const emptySignBaseInfo = {
  userType: SignUserType.Phone,
  areaCode: '86',
  phone: '',
  email: '',
}

const theme = localStorage.theme
  ? localStorage.theme
  : window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'

const initCurrentPrice = window.localStorage.getItem('currentPrice')
  ? window.localStorage.getItem('currentPrice')
  : i18n.global.locale.value === 'en'
  ? 'USD'
  : 'CNY'

const polygonChian = ['0x89', '0x13881']
const ethChian = ['0x1', '0x5']

export const useRootStore = defineStore('root', {
  state: () =>
    <RootState>{
      isCertedMetaIds: [],
      signBaseInfo: emptySignBaseInfo,
      sendCodeTimer: 60,
      redirectUri: '/',
      exchangeRate: [],
      isGetedExchangeRate: false,
      isShowLogin: false,
      isShowMetaMak: false,
      showLoginBindEvmAccount: {
        isUpdatePlan: false,
        loginedButBind: false,
        bindEvmChain: '',
      },
      currentPrice: initCurrentPrice,
      theme,
      chainWhiteList: import.meta.env.MODE == 'gray' ? ['0x5', '0x13881'] : ['0x1', '0x89'],
      updatePlanRes: null,
      updatePlanWhiteList: ['0x0c45B536C69AB0B8806a65C94BA8C8e6e71Ba7c'],
    },
  getters: {
    GetCurrentChain: state => {
      window.ethereum && polygonChian.includes(window.ethereum?.chainId)
        ? (state.currentChain = 'polygon')
        : window.ethereum && ethChian.includes(window.ethereum?.chainId)
        ? (state.currentChain = 'eth')
        : ''
    },
    currentPriceSymbol: state => {
      const Symbols = {
        USD: '$',
        CNY: '￥',
      }
      return Symbols[state.currentPrice]
    },
    currentExchangeRate: state =>
      state.exchangeRate.find(item => item.symbol === state.currentPrice),
  },
  actions: {
    updateShowLoginBindEvmAccount(payload: {
      isUpdatePlan: boolean
      loginedButBind: boolean
      bindEvmChain: string
    }) {
      this.showLoginBindEvmAccount = payload
    },
    updateAccountPlan(payload: { registerTime: number; signHash: string } | null) {
      this.updatePlanRes = payload
    },
    getExchangeRate() {
      this.isGetedExchangeRate = true
      fetchExchangeRate().then((res: any) => {
        if (res) {
          this.exchangeRate = res
        }
      })
      // setInterval(() => {
      //   fetchExchangeRate().then((res: any) => {
      //     if (res) {
      //       this.exchangeRate = res
      //     }
      //   })
      // }, 30 * 1000)
    },
    changePrices(payload: string) {
      if (payload == this.currentPrice) {
        return
      } else {
        this.currentPrice = payload
        window.localStorage.setItem('currentPrice', payload)
      }
    },

    startSendCodeCountdown() {
      setInterval(() => {
        if (this.sendCodeTimer > 0) {
          this.sendCodeTimer--
        }
      }, 1000)
    },
    setSystemConfig() {
      GetCertifiedMetaId().then(res => {
        if (res) {
          this.isCertedMetaIds = res.data.list
        }
      })
    },
  },
})

function fetchExchangeRate() {
  return new Promise(resolve => {
    fetch(`${import.meta.env.VITE_BASEAPI}/metaid-base/v1/exchange/rates`)
      .then(response => {
        return response.json()
      })
      .then(res => {
        if (res?.result) {
          resolve(res.result.rates)
        }
      })
      .catch(() => resolve(null))
  })
}
