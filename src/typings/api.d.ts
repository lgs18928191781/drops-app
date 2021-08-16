
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
