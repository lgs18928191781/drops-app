import { PayPlatform } from '@/enum'
import HttpRequest from 'request-sdk'
import { alertCatchError } from '@/utils/util'
import { ElMessage } from 'element-plus'
import { getToken, getUserName } from '@/stores/user'
// @ts-ignore
const Wxcore = new HttpRequest(`${import.meta.env.VITE_WXCOREAPI}/wxcore`, {
  header: {
    accessKey: () => getToken(),
    userName: () => getUserName(),
    timestamp: () => new Date().getTime(),
  },
  errorHandel(error: any) {
    if (error.status === 401) {
      if (error.response && error.response.data && error.response.data.data) {
        ElMessage.error(error.response.data.data)
      } else {
        alertCatchError(error)
      }
      return Promise.reject(error.response.data.data)
    } else if (error.response && error.response.data && error.response.data.data !== '') {
      return Promise.reject(error.response.data.data)
    } else {
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  },
}).request

export const BindBankCard = (params: {
  address: string
  bank_card: string
  id_card: string
  meta_id: string
  name: string
  phone: string
  code: string
}): Promise<BindBankCardRes> => {
  return Wxcore.post('/verify/bankcard/bind', params)
}

export const GetUserKycInfo = (metaId: string): Promise<GetUserKycInfoRes> => {
  return Wxcore.get(`/verify/bankcard/user/${metaId}`)
}

export const GetUserBuyRecords = (params: {
  metaId: string
  pageSize: number
  timestamp: number | string
}): Promise<GetUserBuyRecordsres> => {
  const { metaId, ..._params } = params
  return Wxcore.get(`/transfer/user/${metaId}/buy`, { params: _params })
}

export const GetUserSaleRecords = (params: {
  metaId: string
  pageSize: number
  timestamp: number | string
  address: string
}): Promise<GetUserBuyRecordsres> => {
  const { metaId, ..._params } = params
  return Wxcore.get(`/transfer/user/${metaId}/sell`, { params: _params })
}

export const SendCode = (params: { phone: string }): Promise<GetUserBuyRecordsres> => {
  return Wxcore.post('/verify/bankcard/bind/send/code', params)
}

export const dividendReceive = (activityTag: string, address: string): Promise<any> => {
  const url = '/dividend/receive'
  return Wxcore.post(url, {
    activityTag,
    address,
  })
}

export const GetUserKycInfoByAll = (metaId: string): Promise<GetUserKycInfoByAllRes> => {
  return Wxcore.get(`/verify/bankcard/user/${metaId}/operate`)
}

// 创建NFT法币购买订单
export const createNftOrderForLegal = (params: {
  address: string
  amount: string
  codehash: string
  contract: string
  currency: string
  description: string
  genesis: string
  goods_name: string
  index: string
  metaid: string
  open_id?: string
  types: number
  pay_type: PayPlatform
  quit_url: string
  coupon_id?: string
  from: string
}) => {
  return Wxcore.post('/legalbsv/getOrderId', params)
}

// 转账到云钱包
export const toTransferCloudWallet = (params: { meta_id: string; amount: number }) => {
  return Wxcore.post('/cloud/change/balance', params)
}

// 转账到云钱包
export const IsWtiteUser = (meta_id: string) => {
  return new Promise<boolean>(async resolve => {
    const res = await Wxcore.get(`/white/user/${meta_id}`).catch(() => resolve(false))
    if (res?.code === 0) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

export const GetCouponInfo = (tag: string): Promise<GetCouponInfoRes> => {
  return Wxcore.get(`/coupon/${tag}/info`)
}

export const GetOrderStatus = (params: {
  orderId: string
  payType: number
}): Promise<GetOrderStatusRes> => {
  return Wxcore.get(`/common/order/${params.orderId}/${params.payType}`)
}