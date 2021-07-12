import HttpRequest from '@/utils/request'
// @ts-ignore
import qs from 'qs'

const env = import.meta.env

declare interface apiResponse{
  code: number
  msg: string
}
const apiHttp = new HttpRequest(env.VITE_WalletApi).request
const nftHttp = new HttpRequest('').request
export const GetToken = (params: object) => {
    return apiHttp.post('/showmoney/oauth2/oauth/token', params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        transformRequest: [
          function(data: object) {
            return qs.stringify(data);
          }
        ]
    })
}

export const QueryFindMetaData = (params: string) => {
  return apiHttp.get(`/api/showMANDB/api/v1/query/queryFindMetaData/${params}`);
}

export const QueryFindMetaDataForPost = (params: string) => {
  return apiHttp.post(`/api/showMANDB/api/v1/query/queryFindMetaDataForPost`, {
    data: {
      query: params
    }
  });
} 

interface GetProductListResponstData extends apiResponse {
  data: NftItem []
}
export const GetProductList = (params: { pageSize: number, page: number }):Promise<GetProductListResponstData> => {
  return apiHttp.post(`/nftonshow/api/v2/product/productList`, params);
} 

interface GetProductDetailResponstData extends apiResponse {
  data: NftItemDetail
}
export const GetProductDetail = (params: { tokenId: string }):Promise<GetProductDetailResponstData> => {
  return apiHttp.post(`/nftonshow/api/v2/product/productDetails`, params);
}

interface TransactionRecordResponstData extends apiResponse {
  data: {
    username: string,
    ownerTime: number,
    amount: string
  }
}
export const TransactionRecord = (params: { tokenId: string }):Promise<TransactionRecordResponstData> => {
  return apiHttp.post(`/nftonshow/api/v2/productTransaction/transactionRecord`, params);
} 


interface CreateNftResponstData extends apiResponse {
  data: string
}
export const CreateNft = (params: { 
  type: string,
  fileUrl: string,
  coverUrl: string,
  intro: string,
  series: string,
  seriesNumber: number,
  tx?: string,
  classify?: string,
}):Promise<CreateNftResponstData> => {
  return apiHttp.post(`/nftonshow/api/v2/found/foundNft`, params);
} 

interface MyNftsResponstData extends apiResponse {
  data: NftItem []
}
export const MyNfts = (params: Pagination):Promise<MyNftsResponstData> => {
  return apiHttp.post(`/nftonshow/api/v2/product/myProduct`, params);
} 

interface SaleNftResponstData extends apiResponse {
  data: {
    tokenId: string
  }
}
export const SaleNft = (params: {
  sellValidTime: number,
  amount: number,
  tokenId: string
}):Promise<SaleNftResponstData> => {
  return apiHttp.post(`/nftonshow/api/v2/productTransaction/sell`, params);
} 