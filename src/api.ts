import HttpRequest from '@/utils/request'
// @ts-ignore
import qs from 'qs'
import { apiResponse, CreateNftParams, CreateNftResponstData, GetClassiesData, GetProductDetailResponstData, GetProductListResponstData, GetSeriestData, GetTxStatusData, MyNftsResponstData, SaleNftResponstData, TransactionRecordResponstData } from './typings/api'

const env = import.meta.env

export enum NftApiCode {
  success = 0
}
const apiHttp = new HttpRequest(env.VITE_WalletApi).request
const nftHttp = new HttpRequest(env.VITE_NftApi).request
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
  return apiHttp.get(`/showMANDB/api/v1/query/queryFindMetaData/${params}`);
}

export const QueryFindMetaDataForPost = (params: any) => {
  return apiHttp.post(`/showMANDB/api/v1/query/queryFindMetaDataForPost`, {
    data: {
      query: btoa(JSON.stringify(params))
    }
  });
}

export const GetTxData = (txId: string) => {
  return QueryFindMetaDataForPost({
    find: {
      txId
    },
    skip: 0,
  })
} 


export const GetProductList = (params: { pageSize: number, page: number, classifyName?: string}):Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/productList`, params);
} 

export const GetProductClassifyList = (params: { pageSize: number, page: number, classifyName?: string}):Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/classify`, params);
} 


export const GetNftDetail = (params: { tokenId: string }):Promise<GetProductDetailResponstData> => {
  return nftHttp.post(`/api/v2/product/productDetails`, params);
}





export const TransactionRecord = (params: { tokenId: string }):Promise<TransactionRecordResponstData> => {
  return nftHttp.post(`/api/v2/productTransaction/transactionRecord`, params);
} 





export const CreateNft = (params: CreateNftParams):Promise<CreateNftResponstData> => {
  return nftHttp.post(`/api/v2/found/foundNft`, params);
} 


export const MyNfts = (params: Pagination):Promise<MyNftsResponstData> => {
  return nftHttp.post(`/api/v2/product/myProduct`, params);
}


export const SaleNft = (params: {
  sellValidTime: number,
  amount: number | string,
  tokenId: string
}):Promise<SaleNftResponstData> => {
  return nftHttp.post(`/api/v2/productTransaction/sell`, params);
} 

export const Upload = (params: FormData):Promise<string> => {
  return nftHttp.post(`/api/v2/oss/upload`, params);
} 

export const GetSeries = (params: { pageSize: number, page: number }):Promise<GetSeriestData> => {
  return nftHttp.post(`/api/v2/series/getSeries`, params);
} 

export const Search = (params: { likeName: string }):Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/productLike`, params);
} 


export const GetClassies = ():Promise<GetClassiesData> => {
  return nftHttp.post(`/api/v2/classify/classifyList`);
} 

export const OffSale = (params: { tokenId: string }):Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/unshelve`, params);
} 

export const BuyNft = (params: { tokenId: string, payMentAddress: string, collectionAddress: string }):Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/transactionProduct`, params);
} 


export const GetTxStatus = (params: { txId: string }):Promise<GetTxStatusData> => {
  return nftHttp.post(`/api/v2/found/getNftStatus`, params);
} 

export const CreateSerice = (params: { name: string, count: number }):Promise<GetTxStatusData> => {
  return nftHttp.post(`/api/v2/series/foundSeries`, params);
} 

