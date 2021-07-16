import HttpRequest from '@/utils/request'
// @ts-ignore
import qs from 'qs'

const env = import.meta.env

export enum NftApiCode {
  success = 0
}
declare interface apiResponse{
  code: NftApiCode
  msg: string,
  count: number
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
export const GetProductList = (params: { pageSize: number, page: number, classifyName?: string}):Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/productList`, params);
} 

export const GetProductClassifyList = (params: { pageSize: number, page: number, classifyName?: string}):Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/classify`, params);
} 

interface GetProductDetailResponstData extends apiResponse {
  data: NftItemDetail
}
export const GetNftDetail = (params: { tokenId: string }):Promise<GetProductDetailResponstData> => {
  return nftHttp.post(`/api/v2/product/productDetails`, params);
}



interface TransactionRecordResponstData extends apiResponse {
  data: TransactionRecordItem []
}

export const TransactionRecord = (params: { tokenId: string }):Promise<TransactionRecordResponstData> => {
  return nftHttp.post(`/api/v2/productTransaction/transactionRecord`, params);
} 


interface CreateNftResponstData extends apiResponse {
  data: {
    tokenId: string
  }
}


export interface CreateNftParams { 
  nftName: string,
  type: string,
  fileUrl: string,
  coverUrl: string,
  intro: string,
  series: string,
  seriesNumber: number,
  tx?: string,
  classify?: string,
}
export const CreateNft = (params: CreateNftParams):Promise<CreateNftResponstData> => {
  return nftHttp.post(`/api/v2/found/foundNft`, params);
} 

interface MyNftsResponstData extends apiResponse {
  data: NftItem []
}
export const MyNfts = (params: Pagination):Promise<MyNftsResponstData> => {
  return nftHttp.post(`/api/v2/product/myProduct`, params);
}

interface SaleNftResponstData extends apiResponse {
  data: {
    tokenId: string
  }
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


interface GetSeriestData extends apiResponse {
  data: any []
}
export const GetSeries = ():Promise<GetSeriestData> => {
  return nftHttp.post(`/api/v2/series/getSeries`);
} 

export const Search = (params: { likeName: string }):Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/productLike`, params);
} 


interface GetClassiesData extends apiResponse {
  data: Classify []
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