import { PayPlatform } from '@/enum'
import HttpRequest from '@/utils/request'
import { alertCatchError } from '@/utils/util'
import { ElMessage } from 'element-plus'
import { getToken, getUserName, useUserStore } from '@/stores/user'
import { Reqswapargs } from '@/utils/wallet/hd-wallet'
// @ts-ignore
const Wxcore = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/wxcore`, {
  header: () => {
    const userStore = useUserStore()
    if (userStore.isAuthorized) {
      return {
        accessKey: userStore.user!.token,
        userName: userStore.userName!,
        timestamp: new Date().getTime(),
        metaId: userStore.user!.metaId,
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
            message: response.data.data || response.data.msg,
          })
        }
      } else {
        resolve(response.data)
      }
    })
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
      return Promise.reject({
        message: error.response.data.data,
        code: error.response.data.code,
      })
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

export const UpdatePay = (params: {
  order_id: string
  tx_hash: number
  product_type: number
  from_coin_address: string
  chain_id?: string //用于以太坊交易上报校验，普通交易更新可不传
}): Promise<GetOrderStatusRes> => {
  return Wxcore.post(`/product/order/coin/pay`, params)
}

export const CreatOrder = (params: {
  address: string
  count?: number
  from: string
  goods_name: string
  metaid: string
  pay_type: number
  product_type: 100 | 200 | 300 // 商品订单类型：100-ME, 200-Legal_NFT ,300-MetaName
  quit_url: string
  types: number
  uuid?: string
  open_id?: string
  from_coin_address?: string
  coupon_id?: string
  description?: string
  operate_type?: 1 | 2 | 3
  meta_name_len?: number
  data?: string
  mvc_to_address?: string
  nft_to_address?: string
  tx_fee?: number
  fee_per_year?: number
  meta_name_uts_ascii?: string
}): Promise<GetOrderStatusRes> => {
  return Wxcore.post(`/product/order`, params)
}

export const GetOrder = (params: {
  order_id: string
  pay_type: number | string
  product_type: number | string
}): Promise<{
  code: number
  data: Order
}> => {
  const { order_id, ..._params } = params
  return Wxcore.get(`/product/order/${order_id}/info`, { params: _params })
}

export const MetaNameAllPrice = (
  metaId?: string
): Promise<{
  Prices: {
    meta_name_len: number
    usd: number
    cny: number
  }[]
}> => {
  return Wxcore.get(`/metaname/price`, { params: { meta_id: metaId } })
}

export const UploadMetaNameCover = (
  params: any
): Promise<{
  image_tx_id: string
  name: string
}> => {
  return Wxcore.post(`/metaname/image/upload`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const GetMetaNameInfo = (name: string): Promise<MetaNameIndexerInfo> => {
  return Wxcore.get(`/metaname/indexer/info`, { params: { name } })
}

export const MetaNameBeforeReqRes = (parmas: {
  address: string
  name: string
  op: number
  years?: number
}): Promise<{ code: number; data: Reqswapargs; msg: string }> => {
  return Wxcore.post(`/metaname/reqargs`, {
    ...parmas,
    source: 'Show',
  })
}

export const MetaNameUpdateInfo = (
  parmas: string | ArrayBuffer
): Promise<{
  code: number
  data: {
    expiredBlockTime: number
    nftCodeHash: string
    nftGenesisId: string
    nftTokenIndex: string
    txid: string
  }
  msg: string
}> => {
  return Wxcore.post(`/metaname/updateinfo`, { data: parmas })
}
