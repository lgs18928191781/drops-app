import { ComputedRef } from 'vue'
import { createStore } from '@harlem/core'
import Storage from '@/utils/storage'
import { encode, decode } from 'js-base64'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { GetUserKycInfo } from '@/api/wxcore'
import { GetProdTestMetaIds } from '@/api/strapi'
import { alertCatchError, getWalletBalance, openLoading } from '@/utils/util'
import { isApp, isIosApp, setWallet, showWallet } from './root'

export type UserType = 'phone' | 'email'
export interface UserInfoTypes {
  [x: string]: any
  userType: UserType
  name: string
  areaCode?: string
  phone?: string
  email?: string
  password?: string
  pk2?: string
  metaId?: string
  token?: string
  tag?: 'new' | 'old'
  enCryptedMnemonic?: string
  mnemonic?: string
  rootAddress?: string
  pubKey?: string
  protocolTxId?: string
  infoTxId?: string
  avatarTxId?: string
  xpub?: string
  address?: string
  avatarType?: string
  flag?: boolean
}
export interface KycInfoTypes {
  name: string
  idCard: string
  bank_card: string
  phone: string
}
interface UserState {
  user: UserInfoTypes | null
  password: string | null
  kycInfo: KycInfoTypes
  isGetedKycInfo: boolean
  isTestUser: boolean
  isSetedisTestUser: boolean
  balance: {
    total: number
    ruoxi: number
    cloud: number
  }
  isGetBalanced: boolean
  needConfirmMeNum: number
  isHideMeConfirm: boolean
}

export const emptyUserInfo: UserInfoTypes = {
  userType: 'phone',
  areaCode: '86',
  phone: '',
  email: '',
  name: '',
}
export const emptyKycInfo: KycInfoTypes = {
  name: '',
  idCard: '',
  phone: '',
  bank_card: '',
}

export const userStorage = new Storage<UserInfoTypes>('user')

const STATE: UserState = {
  user: window.appMetaIdJsV2 ? emptyUserInfo : userStorage.get() || emptyUserInfo,
  kycInfo: emptyKycInfo,
  password: window.localStorage.getItem('password')
    ? decode(window.localStorage.getItem('password')!)
    : '',
  isGetedKycInfo: false,
  isTestUser: false,
  isSetedisTestUser: false,
  balance: {
    total: 0,
    ruoxi: 0,
    cloud: 0,
  },
  isGetBalanced: false,
  needConfirmMeNum: localStorage.getItem('needConfirmMeNum')
    ? parseInt(localStorage.getItem('needConfirmMeNum')!)
    : 1,
  isHideMeConfirm: !!localStorage.getItem('isHideMeConfirm'),
}

export const userStore = createStore('user', STATE)

const { getter, mutation } = userStore
export function useStore() {
  return userStore
}

export const user = getter('user', state => state.user)
export const isTestUser = getter('user', state => state.isTestUser)
export const isGetedKycInfo = getter('user', state => state.isGetedKycInfo)
export const isSetedisTestUser = getter('user', state => state.isSetedisTestUser)
export const password = getter('password', state => state.password)
export const kycInfo = getter('password', state => state.kycInfo)
export const isGetBalanced = getter('isGetBalanced', state => state.isGetBalanced)
export const balance = getter('balance', state => state.balance)
export const isKycValid = getter('isKycValid', state => {
  return !!(
    state.kycInfo.name &&
    state.kycInfo.idCard &&
    state.kycInfo.phone &&
    state.kycInfo.bank_card
  )
})
export const needConfirmMeNum = getter('needConfirmMeNum', state => state.needConfirmMeNum)
export const isHideMeConfirm = getter('isHideMeConfirm', state => state.isHideMeConfirm)

export const isAuthorized = getter('isAuthorized', () => checkAuthorization(user))
export const checkAuthorization = (
  user: ComputedRef<UserInfoTypes | null>
): user is ComputedRef<UserInfoTypes> => {
  // const password = window.localStorage.getItem('password')
  //   ? decode(window.localStorage.getItem('password')!)
  //   : ''

  return !!(user.value && user.value.token)
}

export const updateUser = mutation<UserInfoTypes | null>('updateUser', (state, userData) => {
  if (userData === undefined || userData === null) {
    userStorage.remove()
    state.user = null
  } else {
    // 移除密码
    const { password, ...data } = userData
    if (data.rootAddress) {
      data.address = data.rootAddress
    }
    userStorage.set(data)
    state.user = data
  }
})

export const updateKyc = mutation<KycInfoTypes | null>('updateKyc', (state, kycInfo) => {
  state.isGetedKycInfo = true
  state.kycInfo = kycInfo
})

export const updatePassword = mutation<string | null>('updatePassword', (state, password) => {
  if (password === undefined || password === null) {
    window.localStorage.removeItem('password')
    state.password = null
  } else {
    window.localStorage.setItem('password', encode(password))
    state.password = password
  }
})

export const changeIsTestUser = mutation('changeIsTestUser', (state, is: boolean) => {
  state.isSetedisTestUser = true
  state.isTestUser = is
})

export const changeIsSetedisTestUser = mutation('changeIsSetedisTestUser', state => {
  state.isSetedisTestUser = true
})

export const updateUserBalance = mutation<{ total: number; ruoxi: number; cloud: number }>(
  'updateUserBalance',
  (state, data) => {
    state.balance = data
    state.isGetBalanced = true
  }
)
export const userLogout = mutation('logout', (state, path = '/') => {
  openLoading()
  state.user = emptyUserInfo
  state.kycInfo = emptyKycInfo
  state.isGetedKycInfo = false
  userStorage.remove()
  localStorage.removeItem('user')
  localStorage.removeItem('password')
  localStorage.clear()
  setWallet(true)
  // @ts-ignore
  location.href = path
})
export const changeHideMeConfirm = mutation('changeHideMeConfirm', state => {
  state.isHideMeConfirm = !state.isHideMeConfirm
  if (state.isHideMeConfirm) {
    localStorage.setItem('isHideMeConfirm', 'true')
  } else {
    localStorage.removeItem('isHideMeConfirm')
  }
})

export const changeNeedConfirmMe = mutation<number>('changeHideMeConfirm', (state, value) => {
  localStorage.setItem('needConfirmMeNum', value.toString())
  state.needConfirmMeNum = value
})

export function setKycInfo() {
  return new Promise<void>(async resolve => {
    try {
      const res = await GetUserKycInfo(user.value!.metaId!)
      if (res.code === 0) {
        updateKyc({
          name: res.data.name,
          idCard: res.data.id_card,
          phone: res.data.phone,
          bank_card: res.data.bank_card,
        })
        await setIsTestUser()
        resolve()
      }
    } catch (error) {
      updateKyc(emptyKycInfo)
      resolve()
    }
  })
}

export function checkUserToken(fullPath: string) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASEAPI}/showpaycore/api/v1/user/checkUserToken?user_ctoken=${
        user.value?.token
      }`
    )
    if (res.data && res.data.code === 0) {
      resolve()
    } else {
      userLogout()
      ElMessageBox.alert('登录信息过期，请重新登陆', '温馨提示', {
        confirmButtonText: '去登录',
      }).then(() => {
        showWallet.value?.toLogin(fullPath)
      })
    }
  })
}

export function setuserinfo() {
  return new Promise<apiResponse>(async (resolve, reject) => {
    const params: any = {
      userType: user.value?.userType,
      phone: user.value?.phone ? user.value?.phone : undefined,
      email: user.value?.email ? user.value?.email : undefined,
    }
    const res = await axios.post(
      `${import.meta.env.VITE_BASEAPI}/showpaycore/api/v1/user/setuserinfo`,
      params,
      {
        headers: {
          userName: user.value?.phone ? user.value?.phone : user.value?.email,
          accessKey: user.value?.token,
          timestamp: new Date().getTime(),
        },
      }
    )
    debugger
    if (res.code === 0) {
      resolve(res)
    }
  })
}

export function setIsTestUser() {
  return new Promise<void>(async resolve => {
    changeIsSetedisTestUser()
    const res = await GetProdTestMetaIds({ metaId: user.value!.metaId!, _limit: 1 }).catch(() =>
      resolve()
    )
    if (res) {
      if (res.length > 0) {
        changeIsTestUser(true)
      }
    }
    resolve()
  })
}

export function getUserCnyBalcnce() {
  return new Promise<void>(async resolve => {
    const res = await getWalletBalance().catch(error => {
      alertCatchError(error)
      resolve()
    })
    if (res) {
      updateUserBalance(res)
    }
    resolve()
  })
}
