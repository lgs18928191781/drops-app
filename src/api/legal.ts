import { PayPlatform } from '@/enum'
import { isAuthorized, user, UserType } from '@/stores/user'
import HttpRequest from 'request-sdk'

// const Legal = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/legal-currency`, {
// @ts-ignore
const Legal = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/newlegal`, {
  header: {
    accessKey: () => (isAuthorized.value ? user.value!.token! : undefined),
    userName: () => {
      if (isAuthorized) {
        return user.value!.userType === 'email' ? user.value!.email! : user.value!.phone!
      }
    },
    timestamp: () => new Date().getTime(),
  },
}).request

// 购买法币NFT
export const GetLegalBuyNftInfo = (params: {
  uuid: string
  metaid: string
  type: number
  openid?: string
  goodName: string
  payType: PayPlatform
  quitUrl: string
  from: string
  couponId?: string
}): Promise<GetLegalBuyNft> => {
  return Legal.post('/api/v1/nos/legal/buy', params)
}

// 获取我的法币余额(欧阳)
export const GetMyLegalAmount = (params: {
  currency: string
  metaid: string
}): Promise<GetMyLegalAmountRes> => {
  return Legal.post('/api/v1/nos/legal/balance', params)
}

export const LegalOffsale = (params: {
  uuid: string
  sig: string
}): Promise<LegalGetUserOnSaleRes> => {
  return Legal.post('/api/v1/nos/legal/off', params)
}
