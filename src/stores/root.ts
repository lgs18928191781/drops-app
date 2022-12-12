import { SignUserType } from '@/enum'
import { defineStore } from 'pinia'
import { GetCertMetaIdList } from '@/api/aggregation'
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
  currentPrice: 'CNY' | 'USD'
  theme: 'light' | 'dark'
}

const UA = window.navigator.userAgent.toLowerCase()
// 根据尺寸判断是否是移动端
export const isMobile = window.innerWidth <= 1024
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
      currentPrice: window.localStorage.getItem('currentPrice') || 'CNY',
      theme,
    },
  getters: {
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
      GetCertMetaIdList().then(res => {
        if (res.code == 0) {
          this.isCertedMetaIds = res.data
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
