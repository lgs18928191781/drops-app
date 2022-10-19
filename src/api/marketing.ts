import { PayPlatform } from '@/enum'
import { useUserStore } from '@/stores/user'
import HttpRequest from 'request-sdk'

const userStore = useUserStore()
// const Pay = new HttpRequest(`${import.meta.env.VITE_WXCOREAPI}/showpaycore`, {
// @ts-ignore
const Marketing = new HttpRequest(import.meta.env.VITE_Showmoney_Marketing_Api, {
  header: {
    accessKey: () => (userStore.isAuthorized ? userStore.user?.token! : undefined),
    userName: () => {
      if (userStore.isAuthorized) {
        return userStore.user?.userType === 'email'
          ? userStore.user?.email!
          : userStore.user?.phone!
      }
    },
    timestamp: () => new Date().getTime(),
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (!response.data.success && response.data.message) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          message: response.data.message,
          data: response.data.data,
        })
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const GetCoupons = (params: {
  metaId: string
  page: number
  page_no: number
  order_scope: 'blindbox' | 'nft' | 'all' // 订单的类型，blindbox盲盒，nft NFT，ALL通用券，首要判断条件，如果不带，默认返回全部券
  activityId?: string
  genesis?: string
  codehash?: string // 购买NFT时，必需带上
  tokenIndex?: number // 购买NFT时，必需带上
  amount: number // 订单金额，必需带上，用于判断满减之类的券
  available?: 'no' | 'yes' // no 已经使用，yes 未使用 ，不传默认返回全部
  pay_type: PayPlatform
}): Promise<GetCouponsRes> => {
  const { metaId, ..._params } = params
  return Marketing.post(`/v1/api/coupon/${metaId}/listCoupon`, _params)
}
