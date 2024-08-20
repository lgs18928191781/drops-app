import HttpRequest from '@/utils/request'
import {NftsLaunchPadChainSymbol} from '@/data/constants'
const NftOrders = new HttpRequest(`http://127.0.0.1:3001/nfts-orders`, {
  header: {
    //SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0 || response.data.code === 200) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.data,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const generateCommitAddress = async (params: FormData):Promise<apiMrc721Response> => {
  return NftOrders.post('/generate-commit-address', params, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const uploadNftsFile = async (params: FormData):Promise<apiMrc721Response> => {
  return NftOrders.post('/uploads', params, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const genesisCollection = async (params: { metaId: string; name: string }):Promise<apiMrc721Response> => {
  return NftOrders.post('/genesis-collection', params)
}

export const issueCollection = async (params: { collectionInfo: Mrc721CollectionItem }):Promise<apiMrc721Response> => {
  return NftOrders.post('/issue-collection', params)
}

export const mintNftItem = async (params: {
  creatorMetaId: string
  name: string
  commitAddress: string
  feeb: number
  receiverAddress: string
}):Promise<apiMrc721Response> => {
  return NftOrders.post('/mint-nft-item', params)
}

export const submitMintOrder=async(params:{
  creatorMetaId: string
  name: string
  commitAddress: string
  psbtHex:string
  feeb:number
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/submit-mint-order', params)
}

export const estimatedMintFee = async (params: {
  address: string
  outputAmount: number
  feeb: number
}):Promise<apiMrc721Response> => {
  return NftOrders.post('/get-fees', params)
}

export const getMyCollectionList =async (params:{
  metaid:string
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/get-my-collections', params)
}

export const getCollectionMintAmout =async (params:{
  metaid:string,
  name:string
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/get-collection-mint', params)
}


export const getMarketCollectionList=async(params:{
  chain:NftsLaunchPadChainSymbol,
  page:number,
  pageSize:number
}):Promise<apiMrc721Response>=>{
  return NftOrders.get(`/collection-list`, {
    params,
  })
}


export const getCollectionDetail =async (params:{
  collectionPinid:string
}):Promise<apiMrc721Response>=>{
  return NftOrders.get('/get-collection-detail', {
    params
  })
}

export const getCollectionMintableList=async(params:{
  metaid:string
  name:string
  page:number
  pageSize:number
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/get-collection-mintable',params)
}
