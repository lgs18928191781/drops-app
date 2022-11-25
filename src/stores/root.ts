import { SignUserType } from '@/enum'
import { defineStore } from 'pinia'
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

export const useRootStore = defineStore('root', {
  state: () =>
    <RootState>{
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
    startSendCodeCountdown() {
      setInterval(() => {
        if (this.sendCodeTimer > 0) {
          this.sendCodeTimer--
        }
      }, 1000)
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
