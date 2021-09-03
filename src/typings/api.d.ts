
declare interface apiResponse {
  code: number
  msg: string
  count: number,
  data: any
}
declare interface TransactionRecordItem {
  headUrl: string
  username: string
  ownerTime: number
  amount: string
  metaId: string
}

declare interface Classify {
  id: number
  classify: string
  disabled?: boolean
}

declare interface SaleNftResponstData extends apiResponse {
  data: {
    tokenId: string
  }
}

declare interface SeriesItem {
  currentNumber: number
  maxNumber: number
  series: string
}
declare interface GetSeriestData extends apiResponse {
  data: SeriesItem []
}
declare interface GetClassiesData extends apiResponse {
  data: Classify []
}
declare interface GetTxStatusData extends apiResponse {
  data: {
    found: boolean
  }
}

declare interface GetProductListResponstData extends apiResponse {
  data: NftItem[]
}

declare interface GetProductDetailResponstData extends apiResponse {
  data: NftItemDetail
}

declare interface TransactionRecordResponstData extends apiResponse {
  data: TransactionRecordItem[]
}

declare interface CreateNftResponstData extends apiResponse {
  data: {
    tokenId: string
  }
}

declare interface CreateNftParams {
  nftName: string
  type: string
  fileUrl: string
  coverUrl: string
  intro: string
  seriesName: string
  tx: string
  classify: string
  codeHash: string
  genesis: string
  nftId: string
  tokenId: string,
  tokenIndex: string,
  genesisTxId: string,
}

declare interface MyNftsResponstData extends apiResponse {
  data: NftItem[]
}

declare interface GetNftIssueRes extends apiResponse {
  data: {
    txId: string
    type: string
    genesisId: string
    genesisTxId: string
    receiverAddress: string
    name: string
    desc: string
    icon: string
    website: string
    issuerName: string
    tokenId: string
    dataStr: string
    timestamp: number
  }
}


declare interface GetMyNftSummaryListParams{
  Address: string
  Page: string
  PageSize: string
}

declare interface GetMyOnSellNftListParams{
  Address: string
  Page: string
  PageSize: string
  metaId: string
}

declare interface GetMyNftSummaryListRes extends apiResponse{
  data:{
    total: number,
    results: {
      items: MyNftSummaryItem []
    }
  }
}

declare interface MyNftSummaryItem {
  nftCodehash: string
  nftGenesis: string
  nftSensibleId:string
  nftSymbol: Symbol
  nftMyCount:number
  nftMyPendingCount: number
  nftTotalSupply: number
  nftName: string
  nftDesc: string
  nftIcon: string
  nftWebsite:string
  nftIssuer:string
  nftTimestamp:number
  nftIssueVersion: string
  nftDataStr: string
  nftSeriesName: string
  genesisTxId: string
  nftOwnerName: string
  nftTokenIndex: string
  nftIsReady: boolean
  nftOwnerMetaId: string
  nftIssueMetaId: string
  nftDetailItemList?: {
    nftBalance: number
    nftCodehash: string
    nftDataStr: string
    nftDesc: string
    nftGenesis: string
    nftGenesisTxId: string
    nftIcon: string
    nftIsReady: boolean
    nftIssueAvatarTxId: string
    nftIssueMetaId: string
    nftIssueVersion: string
    nftIssuer: string
    nftName: string
    nftOwnerAddress: string
    nftOwnerAvatarTxId: string
    nftOwnerMetaId: string
    nftOwnerName: string
    nftPrice: number
    nftSatoshi: number
    nftSellTxId: string
    nftSensibleId: string
    nftSeriesName: string
    nftSymbol: string
    nftTimestamp: number
    nftTokenId: string
    nftTokenIndex: string
    nftTotalSupply: number
    nftWebsite: string
  } []
}


declare interface NFTSeriesItem {
  cover: string,
  name: string,
  nftDesc: string
  total: number
  hasCount: number,
  genesis: string
  codehash: string
}

declare interface NFTSeriesItemData {
  cover: string,
  name: string,
  nftDesc: string
  total: number
  hasCount: number
}

declare interface GetSeriesNftListResItem{
  nftCodehash: string
  nftGenesis: string
  nftGenesisTxid: string
  nftSymbol: string
  nftBalance: string
  nftName: string
  nftDesc: string
  nftIcon: string
  nftWebsite: string
  nftIssuer: string
  nftTimestamp: number
  nftTotalSupply: string
  nftTokenIndex: string
  nftIssueVersion: string
  nftDataStr: string
  nftIsReady: boolean
  nftOwnerMetaId: string
}

declare interface GetSeriesNftListRes extends apiResponse{
  data: {
    total: number
    results: {
      items: GetSeriesNftListResItem []
    }
  }
}

declare interface GetMyOnSellNftListRes extends apiResponse{
  data: {
    total: number
    results: {
      items: GetNftIssueyTxIdResItem []
    }
  }
}

declare interface GetNftIssueyTxIdResItem{
  nftBalance: number
  nftCodehash: string
  nftDataStr: string
  nftDesc: string
  nftGenesis: string
  nftGenesisTxId: string
  nftIcon: string
  nftIsReady: boolean
  nftIssueAvatarTxId: string
  nftIssueMetaId: string
  nftIssueVersion: string
  nftIssuer: string
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: number
  nftSatoshi: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellTxId: string
  nftSensibleId: string
  nftSymbol: string
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
}
declare interface GetNftIssueyTxIdRes extends apiResponse{
  data: {
    dataStr: string
    desc: string
    genesisId: string
    genesisTxId: string
    icon: string
    issuerName: string
    metaId: string
    metaIdName: string
    metanetId: string
    name: string
    receiverAddress: string
    timestamp: number
    tokenId: string
    txId: string
    type: string
    version: string
    website: string
  }
}

declare interface NFTApiGetNFTDetailRes extends apiResponse{
  data: {
    total: number
    results: {
      info: {
        version: string
        responseTime: string
      }
      items: NFTApiGetNFTDetailResDataItem []
    }
  }
}

declare interface NFTApiGetNFTDetailResDataItem {
  nftPrice: number
  nftCodehash: string
  nftGenesis: string
  nftGenesisTxId: string
  nftSensibleId: string
  nftSymbol: symbol
  nftBalance: number
  nftName: string
  nftDesc: string
  nftIcon: string
  nftWebsite: string
  nftIssuer: string
  nftTimestamp: number
  nftTotalSupply: number
  nftTokenIndex: string
  nftIssueVersion: string
  nftIssueMetaId: string
  nftDataStr: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftSellTxId: string
  nftIsReady: boolean
  nftSellContractTxId: string
  nftSellDesc: string
  nftTokenId: string
  nftIssueMetaTxId: string
}