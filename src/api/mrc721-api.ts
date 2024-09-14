import HttpRequest from '@/utils/request'
import {NftsLaunchPadChainSymbol} from '@/data/constants'
const manHost=import.meta.env.VITE_MAN_API
const nftOrderHost=`http://127.0.0.1:3001`//`https://general.mvcscan.com/mrc721`//`http://127.0.0.1:3001`//` //`http://127.0.0.1:3001`// //https://general.mvcscan.com/mrc721
const nftFilerHost=`https://general.mvcscan.com/mrc721-file` //https://general.mvcscan.com/mrc721
const NftOrders = new HttpRequest(`${nftOrderHost}/nfts-orders`, {
  header: {
    //SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0 || response.data.code === 200) {
          resolve(response.data)
        }else if(response.data.code === -1){
          
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

const txHelp=new HttpRequest(`${nftOrderHost}`, {
  header: {
    //SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      
      if (response?.data && typeof response.data?.code === 'number') {
        
        if (response.data.code === 0 || response.data.code === 200) {
          resolve(response.data)
        }else if(response.data.code === -1){
          
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

const manService=new HttpRequest(`${manHost}/api`, {
  header: {
    //SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 1 || response.data.code === 200) {
          resolve(response.data.data)
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


const NftFiles = new HttpRequest(`${nftFilerHost}`, {
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
  return NftFiles.post('/uploads', params, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const uploadNftsFilePath = async (params: UploadFileData):Promise<apiMrc721Response> => {
  return NftOrders.post('/uploads', params )
}

export const genesisCollection = async (params: { collectionPinid: string,collectionName:string,address:string }):Promise<apiMrc721Response> => {
  return NftOrders.post('/genesis-collection', params)
}

export const issueCollection = async (params: { collectionInfo: Mrc721CollectionItem }):Promise<apiMrc721Response> => {
  return NftOrders.post('/issue-collection', params)
}

export const mintNftItem = async (params: {
  commitAddress: string
  feeb: number
  receiverAddress: string
  collectionPinid:string
  //dummyPsbtHex:string
}):Promise<apiMrc721Response> => {
  return NftOrders.post('/mint-nft-item', params)
}

export const submitMintOrder=async(params:{
  commitAddress: string
  collectionPinId:string
  psbtHex:string,
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
  collectionPinid:string
}):Promise<apiMrc721Response>=>{
  
  return NftOrders.post('/get-collection-mint', params)
}


export const getMarketCollectionList=async(params:{
  chain:NftsLaunchPadChainSymbol,
  page:number,
  pageSize:number
  canMint:boolean
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
  collectionPinid:string
  page:number
  pageSize:number
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/get-collection-mintable',params)
}

export const getPoolInfo= async (params:{
  collectionPinid:string
  
}):Promise<apiMrc721Response>=>{
  return NftOrders.get('/get-pool-order',{
    params
  })
}


export const getNFTItemDetail=async(params:{
  collectionPinid:string //专辑的pinid
  nftPinid:string //nft pinid
  
}):Promise<apiMrc721Response>=>{
  return NftOrders.get('/get-nft-item',{
    params
  })
}

export const getRawTx = async (txid: string, net: string): Promise<string> => {
  const res = await txHelp.get(`/rawtx`,{
    params:{
      txid,
      net
    }
  })
  if (!res) return ''
  return res as unknown as string
}

export const getPinfromPinid=async (pinid:string):Promise<Mrc721PinItemType>=>{
    
  return manService.get(`/pin/${pinid}`)
}

export const getPinfromPinidList=async (params:{
  pinList:string[]
}):Promise<Mrc721PinListType>=>{
    
  return manService.post(`/pin/check`,params)
}

export const getSaleOrderList=async(params:{
  collectionPinid:string
  page:number,
  pageSize:number
}): Promise<apiMrc721Response> => {
  return NftOrders.get(`/get-nft-sale-order`,{
    params
  })
  
}

export const getNftStatus=async(params:{
  nftPinid:string
}): Promise<apiMrc721Response> => {
  return NftOrders.get(`/get-nft-status`,{
    params
  })
  
}

export const GetMyNFTs=async(params:{
  page:string,
  size:string,
  metaid:string,
  collectionPinid?:string 
}): Promise<apiMrc721Response> => {
  return NftOrders.get(`/get-my-nfts`,{
    params
  })
  
}


export const submitSaleOrder=async(params:{
  psbtHex:string
  nftPinid: string
  collectionPinid:string
  salePrice:number
  salerAddress:string
  salerMetaid:string
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/submit-nft-sale', params)
}

export const submitBuyOrder=async(params:{
  psbtHex:string
  buyerAddress:string
  chain?: NftsLaunchPadChainSymbol
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/submit-nft-buy', params)
}

export const finalySignAndBuyNft=async(params:{
  revealPsbtHex:string
  originalPsbtHex:string
  buyerAddress: string
  nftPinid:string
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/final-nft-buy', params)
}


export const getFakerUtxo=async():Promise<apiMrc721Response>=>{
  return NftOrders.get('/get-dummy-utxo')
}

export const submitNftOffSale=async(params:{
  salerMetaid:string,
      salerAddress:string,
      itemPinid:string,
      psbtHex:string
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/submit-nft-offsale',params)
}


export const getRedeemOrder=async(params:{
  nftPinid:string,
  collectionPinid:string,
  address:string,
  psbtHex:string,
  feeb:number
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/get-redeem-order',params)
}


export const submitRedeemOrder=async(params:{
  psbtHex:string,
  nftPinid:string,
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/submit-redeem-order',params)
}

export const cancelBuyNft=async(params:{
  psbtHex:string,
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/cancel-buy-order',params)
}

export const cancelOrder=async(params:{
  orderId:string,
}):Promise<apiMrc721Response>=>{
  return NftOrders.post('/cancel-tx-order',params)
}

export const getPriceRecord=async(params:{
  collectionPinid:string,
}):Promise<apiMrc721Response>=>{
  return NftOrders.get('/get-sale-price-record',{
    params
  })
}

export const getDummyForCommit=async():Promise<apiMrc721Response>=>{
  return NftOrders.get('/get-dummy-utxo-commit')
}

export const getOwnerNftOnsale=async(params:{
  address:string
  page:number
  pageSize:number
}):Promise<apiMrc721Response>=>{
  return NftOrders.get('/get-self-nft-onsale',{
    params
  })
}

export const broadcastBTCTx=async(rawTx:string,net:string):Promise<apiMrc721Response>=>{
  return txHelp.post('/tx/broadcast',{
    rawTx,
    net
  })
}
