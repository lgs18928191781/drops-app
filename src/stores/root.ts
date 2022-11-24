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
  exchangeRate: ExchangeRate
  isGetedExchangeRate: boolean
  isShowLogin: boolean
  isCertedMetaIds: string[]
  currentPrice: string
}

const UA = window.navigator.userAgent.toLowerCase()
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

export const useRootStore = defineStore('root', {
  state: () =>
    <RootState>{
      isCertedMetaIds: [],
      signBaseInfo: emptySignBaseInfo,
      sendCodeTimer: 60,
      redirectUri: '/',
      exchangeRate: {
        cnyRate: 0,
        usdtRate: 0,
        feeRate: 0,
        message: '',
      },
      isGetedExchangeRate: false,
      isShowLogin: false,
      currentPrice: window.localStorage.getItem('currentPrice') || 'BSV',
    },
  getters: {},
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
    fetch('https://www.showpay.top/wxcore/legalbsv/getExchangeRate')
      .then(response => {
        return response.json()
      })
      .then(res => {
        if (res?.code === 0) {
          resolve(res.data)
        }
      })
      .catch(() => resolve(null))
  })
}
