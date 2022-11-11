import { BindUserInfo } from '@/@types/common'
import { useUserStore } from '@/stores/user'
import HttpRequest from 'request-sdk'
import { ApiResultTypes, BaseUserInfoParams } from '.'

// @ts-ignore
const Core = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/showpaycore`, {
  header: () => {
    const userStore = useUserStore()
    if (userStore.isAuthorized) {
      return {
        accessKey: userStore.user!.token,
        userName:
          userStore.user!.userType === 'email' ? userStore.user!.email! : userStore.user!.phone!,
        timestamp: () => new Date().getTime(),
      }
    } else {
      return {}
    }
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.msg,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const UpdateUserInfo = (): Promise<apiResponse> => {
  const userStore = useUserStore()
  const params = {
    userType: userStore.user!.userType,
    phone: userStore.user!.phone ? userStore.user!.phone : undefined,
    email: userStore.user!.email ? userStore.user!.email : undefined,
  }
  return Core.post('/api/v1/user/setuserinfo', params)
}

// 获取注册验证码
export const RegisterGetCode = async (params: BaseUserInfoParams): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/register/verification', params)
}

// 用户注册
export const RegisterCheck = async (params: {
  type: number
  userType: string
  phone?: string
  email?: string
  code: string
  name: string
  promotion?: string
}): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/register/check', params)
}

// 获取图形验证码
export const GetImageCode = async (params: { characteristic: string }): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/codeImage', params)
}

// 用户登录
export const LoginCheck = async (params: ObjTypes<any>): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/new/login/check', params)
}

// 获取登录验证码
export const LoginGetCode = async (params: ObjTypes<any>): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/login/verification', params)
}

export const SetUserInfo = (params: {
  userType: 'phone' | 'email'
  metaid: string
  phone?: string
  email?: string
  accessKey: string
  userName?: string
}): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/setuserinfo', params, {
    headers: {
      'Content-Type': 'application/json',
      accessKey: params.accessKey,
      timestamp: Date.now(),
      // @ts-ignore
      userName: params.userType === 'phone' ? params.phone : params.email,
    },
  })
}

export interface BaseUserInfoParams {
  userType: string
  phone?: string
  email?: string
}

interface SetUserPasswordParams extends BaseUserInfoParams {
  address: string
  password: string
  affirmPassword: string
  enCryptedMnemonic: string
  remark: string
  type?: number
}

export const SetUserPassword = (
  params: SetUserPasswordParams,
  token: string,
  userName: string
): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/setPassword', params, {
    headers: {
      'Content-Type': 'application/json',
      accessKey: token,
      timestamp: Date.now(),
      userName: userName,
    },
  })
}

interface SetUserWalletInfoParams extends BaseUserInfoParams {
  address: string
  pubkey: string
  xpub: string
  remark: string
  type?: number
  headers?: ObjTypes<string | number>
}
// 提交用户钱包信息
export const SetUserWalletInfo = (params: SetUserWalletInfoParams): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/wallet/setuserwalletinfo', params)
}

//绑定metaid或地址登录
export const loginByMetaidOrAddress = (params: { address?: string; metaId?: string }) => {
  return Core.post(`/api/v1/thirdparty/checkMetaidOrAddress`, params)
}

//上报hashData

export const setHashData = (params: {
  accessKey: string
  userName: string
  timestamp: number
  hashData: string
  metaId: string
  address: string
}) => {
  return Core.post(
    `/api/v1/thirdparty/setUserWalletHashData`,
    {
      hashData: params.hashData,
      metaId: params.metaId,
      ethAddress: params.address,
    },
    {
      headers: {
        accessKey: params.accessKey,
        userName: params.userName,
        timestamp: params.timestamp,
      },
    }
  )
}

//获取随机word

export const GetRandomWord = (): Promise<{ code: number; data: { word: string } }> => {
  return Core.get(`/api/v1/mnemonic/getWord`)
}

//助记词登录

export const MnemoicLogin = (params: {
  xpub: string
  sign: string //publickey+word签名
  word: string
  type: number // 1.web 2.app
}): Promise<{
  code: number
  data: BindUserInfo
}> => {
  return Core.post(`/api/v1/mnemonic/verification`, params)
}

//新用户登录

export const LoginByNewUser = (params: {
  address: string
  xPub: string
  pubKey: string
  // metaId: '',
  hashData: string
  mnemonic: string
  userName: string
}) => {
  return Core.post(`/api/v1/thirdparty/setUserWalletInfo`, params)
}

//已绑定签名
export const LoginByHashData = (params: {
  hashData: string
}): Promise<{ code: number; data: string }> => {
  return Core.post(`/api/v1/thirdparty/checkHashData`, params)
}

export const GetMetaIdByLoginName = (params: {
  userType: 'phone' | 'emial'
  phone?: string
  email?: string
}): Promise<{ code: number; result: { metaId: string } }> => {
  return Core.post(`/api/v1/thirdparty/getUserMetaId`, params)
}
