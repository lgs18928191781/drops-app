import { defineStore, storeToRefs } from 'pinia'
import { encode, decode } from 'js-base64'
import { SDK } from '@/utils/sdk'
import { toRaw } from 'vue'
import { GetUserKycInfo } from '@/api/wxcore'
import { GetProdTestMetaIds } from '@/api/strapi'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { SdkPayType } from '@/enum'
import {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  useRoute,
  useRouter,
} from 'vue-router'
import { router } from '@/router'
import { useTalkStore } from './talk'
import { useRootStore } from './root'
import detectEthereumProvider from '@metamask/detect-provider'
import { useGenesisStore } from './genesis'
import { setUser } from '@sentry/vue'
import { MetaletSDK } from '@/utils/metalet-sdk'
import { getCurrentInstance } from 'vue'
import { useFollowStore } from './follow'

export interface KycInfoTypes {
  name: string
  idCard: string
  bank_card: string
  phone: string
}
interface UserState {
  user: null | UserInfo
  metaletLogin: boolean
  password: string | null
  isNeedConfirm?: {
    me: boolean
    bsv: boolean
  }
  wallet: SDK | MetaletSDK | null
  //metaletWallet?: MetaletSDK | null
  kycInfo: null | KycInfoTypes
  isGetedKycInfo: boolean
  isSetedisTestUser: boolean
  isTestUser: boolean
  sdkPayConfirm: {
    [key in SdkPayType]: {
      value: number
      visible: boolean
    }
  }
  sdkPayment: SdkPayType
  isNeedRefresh: boolean
}

const userkey = encode('user')

let user: any = null
if (window.localStorage.getItem(userkey)) {
  user = decode(window.localStorage.getItem(userkey)!)
  user = JSON.parse(user)
  // setUser({
  //   id: user.metaId,
  //   email: user.phone || user.email,
  //   username: user.name,
  // })
}
const passwordkey = encode('password')
let password = ''
if (window.localStorage.getItem(passwordkey)) {
  password = decode(window.localStorage.getItem(passwordkey)!)
}

const sdkPayConfirmPaymentKey = 'SDK-PAYMENT'
const sdkPayConfirmHideKey = {
  [SdkPayType.ME]: 'HIDE-ME-CONFIRM',
  [SdkPayType.SPACE]: 'HIDE-SPACE-CONFIRM',
}
const sdkPayConfirmMaxKey = {
  [SdkPayType.ME]: 'MAX-ME',
  [SdkPayType.SPACE]: 'MAX-SPACE',
}
const sdkPayConfirm = {
  [SdkPayType.ME]: {
    value: localStorage.getItem(sdkPayConfirmMaxKey[SdkPayType.ME])
      ? parseInt(localStorage.getItem(sdkPayConfirmMaxKey[SdkPayType.ME])!)
      : 5,
    visible: localStorage.getItem(sdkPayConfirmHideKey[SdkPayType.ME]) ? false : true,
  },
  [SdkPayType.SPACE]: {
    value: localStorage.getItem(sdkPayConfirmMaxKey[SdkPayType.SPACE])
      ? parseInt(localStorage.getItem(sdkPayConfirmMaxKey[SdkPayType.SPACE])!)
      : 3000,
    visible: localStorage.getItem(sdkPayConfirmHideKey[SdkPayType.SPACE]) ? false : true,
  },
}

if (user) {
  setTimeout(() => {
    
    const genesisStore = useGenesisStore()
    //const followStore = useFollowStore()
    genesisStore.initGenesis()
    //followStore.initFollowList()
    genesisStore.sync()

    
  }, 500)
}

export const useUserStore = defineStore('user', {
  state: () =>
    <UserState>{
      user: user,
      password,
      wallet: null,
      //metaletWallet: null,
      kycInfo: null,
      isGetedKycInfo: false,
      isSetedisTestUser: false,
      isTestUser: false,
      sdkPayConfirm: sdkPayConfirm,
      metaletLogin: Boolean(Number(localStorage.getItem('useMetaletLogin'))) || Boolean(0),
      sdkPayment: localStorage.getItem(sdkPayConfirmPaymentKey) || SdkPayType.ME,
      isNeedRefresh: false,
    },
  getters: {
    getMetaletloginState: state => {
      console.log('222222', Boolean(0))
      return state.metaletLogin
    },
    getSdkPayment: state => {
      if (state.metaletLogin) {
        return SdkPayType.SPACE
      } else {
        return state.sdkPayment
      }
    },
    isAuthorized: state => <boolean>!!(state.user && state.user.token) || state.metaletLogin,
    userName: state => {
      if (state.user && state.user.token) {
        // @ts-ignore
        return state.user!.userType === 'email' || state.user!.registerType === 'email'
          ? state.user!.email!
          : state.user!.phone!
      } else {
        return undefined
      }
    },
    token: state => {
      if (state.user && state.user.token) {
        return state.user.token
      } else {
        return undefined
      }
    },
    showWallet: state => {
      if (state.metaletLogin) {
        return <MetaletSDK>(state.wallet ? toRaw(state.wallet) : state.wallet)
      }
      return <SDK>(state.wallet ? toRaw(state.wallet) : state.wallet)
    },
  },
  actions: {
    logout(route: RouteLocationNormalizedLoaded) {
      return new Promise<void>(async resolve => {
        const talkStore = useTalkStore()
        const rootStore = useRootStore()
        const genesStore = useGenesisStore()
        //const followStore = useFollowStore()

        //
        // 只保存pwaInstall状态
        const pwaInstall = localStorage.getItem('pwaInstall')
        localStorage.clear()
        if (pwaInstall) localStorage.setItem('pwaInstall', pwaInstall)

        if (rootStore.updatePlanRes) rootStore.updateAccountPlan(null)
        if (rootStore.isShowLogin) rootStore.$patch({ isShowLogin: false })
        if (this.metaletLogin) {
          this.updateMetaletLoginState(false)
          localStorage.removeItem('useMetaletLogin')
          localStorage.removeItem('last-feeb')
          const state = await window.metaidwallet.isConnected()
          if (state) {
            // await window.metaidwallet.disconnect()
            this.isNeedRefresh = true
          }
        }
        if (window.provider) window.provider = undefined
        // localStorage.removeItem(encode('user'))
        // localStorage.removeItem(encode('password'))
        // localStorage.removeItem('walletconnect')
        try {
          rootStore.updateShowLoginBindEvmAccount({
            isUpdatePlan: false,
            loginedButBind: false,
            bindEvmChain: '',
          })
          this.user = null
          this.password = null
        } catch {}

        //talkStore.reset()
        genesStore.initGenesis()
        //followStore.initFollowList()
        //

        if (route.meta.isAuth) router.push('/')
        // talk的路由跳buzz推荐页
        if (route.path.includes('talk')) router.push('/buzz/recommend')
        resolve()
      })
    },
    changeWalletAccount() {},

    updateUserInfo(userInfo: Partial<SetUserInfo>) {
      return new Promise<void>(async resolve => {
        console.log('userInfo', userInfo)

        //
        const { password, ...data } = userInfo

        // 兼容处理
        // @ts-ignore
        if (!data.address && data.rootAddress) {
          // @ts-ignore
          data.address = data.rootAddress
        }
        // @ts-ignore
        if (!data.userType && data.registerType) {
          // @ts-ignore
          data.userType = data.registerType
        }
        // localStorage.setItem('user', JSON.stringify(data))
        // window.localStorage.setItem('password', password)

        localStorage.setItem(encode('user'), encode(JSON.stringify(data)))

        if (password) {
          window.localStorage.setItem(encode('password'), encode(password))
        }

        try {
          this.user = data
          console.log('this.uesr', this.user)
         
          this.isNeedRefresh = true
          //
        } catch {}

        const genesisStore = useGenesisStore()
       // const followStore = useFollowStore()
        genesisStore.initGenesis()
       // followStore.initFollowList()
        // genesisStore.sync()
        resolve()
      })
    },

    updateMetaletLoginState(isUseMetalet: boolean) {
      this.metaletLogin = isUseMetalet
      localStorage.setItem('useMetaletLogin', Number(isUseMetalet).toString())
    },

    setKycInfo() {
      return new Promise<void>(async resolve => {
        try {
          this.isGetedKycInfo = true
          const res = await GetUserKycInfo(this.user!.metaId!)
          if (res.code === 0) {
            this.kycInfo = {
              name: res.data.name,
              idCard: res.data.id_card,
              phone: res.data.phone,
              bank_card: res.data.bank_card,
            }
            resolve()
          }
        } catch (error) {
          resolve()
        }
      })
    },
    setIsTestUser() {
      return new Promise<void>(async resolve => {
        this.isSetedisTestUser = true
        const res = await GetProdTestMetaIds({
          metaId: this.user!.metaId!,
          _limit: 1,
        }).catch(() => {
          this.isSetedisTestUser = false
          resolve()
        })
        if (res) {
          if (res.length > 0) {
            this.isTestUser = true
          }
        }
        resolve()
      })
    },
    checkUserToken(route: RouteLocationNormalized) {
      return new Promise<void>(async (resolve, reject) => {
        if (this.metaletLogin) {
          resolve()
          return
        }
        const res = await axios
          .get(
            `${import.meta.env.VITE_BASEAPI}/showpaycore/api/v1/user/checkUserToken?user_ctoken=${
              this.user!.token
            }`
          )
          .catch(() => resolve())
        if (res.data && res.data.code === 0) {
          resolve()
        } else {
          this.logout(route)
          const rootStore = useRootStore()
          ElMessageBox.alert('登录信息过期，请重新登录', '温馨提示', {
            confirmButtonText: '去登录',
          }).then(() => {
            rootStore.$patch({ isShowLogin: true })
          })
          reject(new Error('登录信息过期'))
        }
      })
    },
    changeSdkPayConfirm(type: 'visible' | 'value', value: number | boolean, payType: SdkPayType) {
      if (type === 'visible') {
        if (value) {
          localStorage.removeItem(sdkPayConfirmHideKey[payType])
        } else {
          localStorage.setItem(sdkPayConfirmHideKey[payType], true.toString())
        }
        this.sdkPayConfirm[payType].visible = value as boolean
      } else {
        localStorage.setItem(sdkPayConfirmMaxKey[payType], value.toString())
        this.sdkPayConfirm[payType].value = value as number
      }
    },
    changeSdkPayment(payType: SdkPayType) {
      if (payType === this.sdkPayment) return
      localStorage.setItem(sdkPayConfirmPaymentKey, payType)
      this.sdkPayment = payType
    },
  },
})

export function getUserName() {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user')!)
    return user!.userType === 'email' ? user!.email! : user!.phone!
  } else {
    return undefined
  }
}

export function getToken() {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user')!)
    return user.token
  } else {
    return undefined
  }
}
