import HttpRequest from '@/utils/request'
// @ts-ignore
import qs from 'qs'

const env = import.meta.env

export enum NftApiCode {
  success = 0,
}
const apiHttp = new HttpRequest(env.VITE_WalletApi).request

export const GetToken = (params: object) => {
  return apiHttp.post('/showmoney/oauth2/oauth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    transformRequest: [
      function (data: object) {
        return qs.stringify(data)
      },
    ],
  })
}

export const QueryFindMetaData = (params: string) => {
  return apiHttp.get(`/v2showMANDB/api/v1/query/queryFindMetaData/${params}`)
}

export const QueryFindMetaDataForPost = (params: any) => {
  return apiHttp.post(`/v2showMANDB/api/v1/query/queryFindMetaDataForPost`, {
    data: {
      query: btoa(JSON.stringify(params)),
    },
  })
}

export const GetTxData = (txId: string) => {
  return QueryFindMetaDataForPost({
    find: {
      txId,
    },
    skip: 0,
  })
}
