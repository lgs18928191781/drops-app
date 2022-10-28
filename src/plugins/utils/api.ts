import HttpRequest from 'request-sdk'

const mvcBaseUrL = 'https://testmvc.showmoney.app/showpaycore'
const mvcApi = new HttpRequest(mvcBaseUrL!).request

export interface MetaMaskLoginUserInfo {
  address: string
  appToken: string
  did: null
  email: string
  enCryptedMnemonic: string | null
  lastLoginTime: number
  metaId: string
  name: string
  phone: string
  pk2: string
  register: string
  tag: 'new' | 'old'
  token: string
}

//已绑定签名
export const loginByHashData = (params: {
  hashData: string
}): Promise<{ code: number; data: string }> => {
  return mvcApi.post(`/api/v1/thirdparty/checkHashData`, params)
}

//绑定metaid或地址登录
export const loginByMetaidOrAddress = (params: { address?: string; metaId?: string }) => {
  return mvcApi.post(`/api/v1/thirdparty/checkMetaidOrAddress`, params)
}

//新用户登录

export const loginByNewUser = (params: {
  address: string
  xPub: string
  pubKey: string
  // metaId: '',
  hashData: string
  mnemonic: string
  userName: string
}) => {
  return mvcApi.post(`/api/v1/thirdparty/setUserWalletInfo`, params)
}

//上报hashData

export const setHashData = (params: {
  accessKey: string
  userName: string
  timestamp: number
  hashData: string
  metaId: string
}) => {
  return mvcApi.post(
    `/api/v1/thirdparty/setUserWalletHashData`,
    {
      hashData: params.hashData,
      metaId: params.metaId,
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

export const getRandomWord = (): Promise<{ code: number; data: { word: string } }> => {
  return mvcApi.get(`/api/v1/mnemonic/getWord`)
}

//助记词登录

export const mnemoicLogin = (params: {
  xpub: string
  sign: string //publickey+word签名
  word: string
  type: number // 1.web 2.app
}): Promise<{
  code: number
  data: MetaMaskLoginUserInfo
}> => {
  return mvcApi.post(`/api/v1/mnemonic/verification`, params)
}
