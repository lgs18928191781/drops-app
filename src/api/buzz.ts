import { BuzzItem } from '@/@types/common'
import { InviteActivityTag } from '@/enum'
import HttpRequest from 'request-sdk'

const env = import.meta.env

// @ts-ignore
const BuzzRequest = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/aggregation`, {
  header: {
    'Content-Type': 'application/json',
    // accessKey: () => (isAuthorized.value ? user.value!.token! : undefined),
    // userName: () => {
    //   if (isAuthorized) {
    //     return user.value!.userType === 'email' ? user.value!.email! : user.value!.phone!
    //   }
    // },
    // timestamp: () => new Date().getTime(),
  },
}).request

export const getBuzzFollowList = (data: any): Promise<any> => {
  const url = '/v2/app/buzz/getBuzzFollowList'
  return BuzzRequest({
    url,
    data,
    method: 'POST',
  })
}

export const getBuzzHotList = (data: any): Promise<any> => {
  const url = '/v2/app/buzz/getBuzzHotList'
  return BuzzRequest({
    url,
    data,
    method: 'POST',
  })
}

export const getBuzzHomeList = (data: any): Promise<BuzzItem[]> => {
  const url = '/v2/app/buzz/getBuzzHomeList'
  return BuzzRequest({
    url,
    data,
    method: 'POST',
  })
}

export const getOneBuzz = (data: any): Promise<any> => {
  const url = '/v2/app/buzz/getOneBuzz'
  return BuzzRequest({
    url,
    data,
    method: 'POST',
  })
}
export const getBuzzInteractiveList = (data: any): Promise<any> => {
  const url = '/v2/app/buzz/getBuzzInteractiveList'
  return BuzzRequest({
    url,
    data,
    method: 'POST',
  })
}

export const getMetaAccessContentUserAddressByTxId = (txId: string) => {
  const url = `/v2/app/metaAccess/getMetaAccessContentUserAddressByTxId/${txId}`
  return BuzzRequest({
    url,
    method: 'GET',
  })
}
