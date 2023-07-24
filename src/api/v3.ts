import { PayPlatform, PayType } from '@/enum'
import HttpRequest from '@/utils/request'
import { alertCatchError, realRandomString } from '@/utils/util'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { crypto } from 'mvc-lib'
import { aesEncrypt } from '@/utils/crypto'

// @ts-ignore
const V3 = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/v3`, {
  header: () => {
    const userStore = useUserStore()
    if (userStore.isAuthorized) {
      return {
        token: userStore.user!.token,
        meta_id: userStore.user!.metaId,
        userName: userStore.userName,
      }
    } else {
      return {}
    }
  },
  errorHandel(error: any) {
    if (error?.response?.status === 401) {
      if (error?.response && error?.response?.data && error?.response?.data?.data) {
        ElMessage.error(error.response.data.data)
      } else {
        alertCatchError(error)
      }
      return Promise.reject(error.response.data.data)
    } else if (error?.response && error?.response?.data && error?.response?.data?.data !== '') {
      return Promise.reject({
        code: error.response?.data?.code,
        message: error.response.data.data,
      })
    } else {
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  },
}).request

export const GetTicket = (params: {
  activity_id: number
  meta_id: string
}): Promise<GetTicketRes> => {
  return V3.post('/api/purchase/myTicket', params)
}

export const OpenBilindbox = (params: {
  activity_id: number
  meta_id: string
  address: string
}): Promise<OpenBilindboxRes> => {
  return V3.post('/api/purchase/open', params)
}

export const GetUserBilindboxOrders = (params: {
  uuid: string
}): Promise<GetUserBilindboxOrdersRes> => {
  return V3.post('/api/purchase/getOrders', params)
}

export const GetBlindBoxOrderStatus = (params: {
  uuid: string
}): Promise<GetBlindBoxOrderStatusRes> => {
  return V3.post('/api/purchase/getSnappedOrderIdStatus', params)
}

export const CreateBlindboxOrderId = (params: {
  activity_id: number
  count: number
  description: string
  from: string
  goods_name: string
  metaid: string
  pay_type: PayPlatform
  quit_url: string
  types: PayType
}): Promise<CreateBlindboxOrderIdRes> => {
  return V3.post('/api/purchase/createOrderId', params)
}

export const GetUserUnpayBlindboxOrder = (params: {
  activity_id: number
  meta_id: string
  page: number
  pageSize: number
}): Promise<BlindboxUUIDDataRes> => {
  return V3.post('/api/purchase/getOrders', params)
}

export const CheckBlindboxOrderStatus = (params: {
  uuid: string
}): Promise<CheckBlindboxOrderStatusRes> => {
  return V3.post('/api/purchase/getOrderIdInfo', params)
}

export const GetActivityInfo = (params: { activity_id: number }): Promise<GetActivityInfoRes> => {
  return V3.post('/api/purchase/activities', params)
}

export const GetUnSendNFTs = (params: {
  meta_id: string
  page: number
  pageSize: number
}): Promise<GetUnSendNFTsRes> => {
  return V3.post('/api/purchase/myNFT', params)
}

export const GetMyMEBalance = (params: { address: string }): Promise<GetMyMEBalanceRes> => {
  return V3.post('/api/me/user/myMe', params)
}

export const GetMeRate = (params: { meta_id: string; coin: string }): Promise<GetMeRateRes> => {
  return V3.get('/api/me/user/getRare', { params })
}

export const GetMeRecords = (params: {
  meta_id: string
  page: number
  page_size: number
}): Promise<GetMeRecordsRes> => {
  const { meta_id, ..._prams } = params
  return V3.get(`/api/me/record/user/${meta_id}`, { params: _prams })
}

export const CreateMeOrder = (params: {
  Token: string
  address: string
  count: number
  description: string
  from: string
  goods_name: string
  metaid: string
  open_id?: string
  pay_type: number
  quit_url: string
  types: number
  from_coin_address?: string
}): Promise<CreateMeOrderRes> => {
  return V3.post('/api/me/user/createOrderId', params)
}

export const GetProtocolMeInfo = (params: {
  protocol: string
  address: string
}): Promise<GetProtocolMeInfoRes> => {
  return V3.get(`/api/me/protocol/${params.protocol}/info`, {
    params: { address: params.address },
  })
}

export const GetMeUtxos = (params: {
  address: string
  amount: number
  meta_id: string
  protocol: string
  receive_address: string
}): Promise<GetMeUtxosRes> => {
  const { address, amount, meta_id, protocol, receive_address } = params

  // params 添加 sign， nonce, timestamp，然后用key用aes算法加密
  const timestamp = new Date().getTime()
  // nonce为6位随机字符串
  const nonce = realRandomString(6)

  // 生成sign：将参数按照key的字母顺序排序，然后拼接成字符串，最后用sha256加密两次
  const concatenated =
    nonce +
    address +
    meta_id +
    receive_address +
    amount.toString() +
    timestamp.toString() +
    protocol
  const sign = crypto.Hash.sha256sha256(Buffer.from(concatenated)).toString('hex')

  // aesEncrypt成encodeData
  const encryptingParams = JSON.stringify({
    sign,
    nonce,
    timestamp,
    ...params,
  })
  const secretKey = 'fF3nMXzGPQMw10Kc'
  const encodeData = aesEncrypt(encryptingParams, secretKey)

  return V3.post('/api/me/user/getOperateFee', { encode_data: encodeData })
}

export const GetMetaEggs = (params: {
  address: string
  meta_id: string
}): Promise<GetMetaEggsRes> => {
  return V3.get(`/api/egg/info/${params.address}/list`, { params: { meta_id: params.meta_id } })
}
export const GetMetaEgg = (params: {
  codehash: string
  egg_uuid: string
  genesis: string
  level: number
  token_index: string
}): Promise<GetMetaEggRes> => {
  return V3.post('/api/egg/info/one', params)
}

export const GetMetaInitEgg = (params: {
  address: string
  meta_id: string
}): Promise<GetMeUtxosRes> => {
  return V3.get(`/api/egg/origin/${params.address}`, { params: { meta_id: params.meta_id } })
}

export const ActiveMetaEgg = (params: {
  address: string
  meta_id: string
  egg_uuid: string
}): Promise<GetMeUtxosRes> => {
  return V3.post('/api/egg/active', params)
}

export const FeedMetaEgg = (params: {
  address: string
  codehash: string
  egg_uuid: string
  genesis: string
  level: number
  meta_id: string
  token_index: string
  feed_type: 1 | 2
  me_amount?: number
  nft_list?: string[]
}): Promise<GetMeUtxosRes> => {
  return V3.post('/api/egg/feed', params)
}

export const UpgradeMetaEgg = (params: {
  address: string
  codehash: string
  egg_uuid: string
  genesis: string
  level: number
  meta_id: string
  token_index: string
}): Promise<UpgradeMetaEggRes> => {
  return V3.post('/api/egg/upgrade', params)
}

export const MetaEggAdoptMsg = (params: {
  address: string
  meta_id: string
}): Promise<MetaEggAdoptMsgRes> => {
  return V3.get(`/api/egg/origin/information/${params.address}`, {
    params: { meta_id: params.meta_id },
  })
}

export const MetaEggAdopt = (params: {
  address: string
  meta_id: string
}): Promise<MetaEggAdoptMsgRes> => {
  return V3.get(`/api/egg/origin/adopt/${params.address}`, {
    params: { meta_id: params.meta_id },
  })
}

export const MetaEggUpgradeCount = (params: {
  address: string
  meta_id: string
}): Promise<MetaEggAdoptMsgRes> => {
  return V3.get(`/api/egg/info/upgrade/${params.address}`, {
    params: { meta_id: params.meta_id },
  })
}
