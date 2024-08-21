

declare interface apiResponse {
  code: number
  msg: string
  count: number
  data: any
  error?: string
}


declare interface apiMrc721Response {
  code: number
  msg: string
  count: number
  data: any
  error?: string
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
  data: SeriesItem[]
}
declare interface GetClassiesData extends apiResponse {
  data: Classify[]
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
  tokenId: string
  tokenIndex: string
  genesisTxId: string
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

declare interface GetMyNftSummaryListParams {
  Address: string
  Page: string
  PageSize: string
}

declare interface GetMyOnSellNftListParams {
  Page: string
  PageSize: string
  metaId: string
  orderType: number
  sortType: number
}

declare interface GetMyNftSummaryListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: MyNftSummaryItem[]
    }
  }
}

declare interface MyNftSummaryItem {
  nftCodehash: string
  nftDataStr: string
  nftDesc: string
  nftDetailItemList: {
    flag: string
    nftBackIcon: string
    nftBalance: number
    nftCertificationType: number
    nftChargeUnit: string
    nftClassifyList: string[]
    nftCodehash: string
    nftCurrentAuctionBidTxId: string
    nftCurrentAuctionCreateTxId: string
    nftCurrentAuctionState: number
    nftCurrentBidPrice: string
    nftCurrentBidPriceInt: number
    nftDataStr: string
    nftDesc: string
    nftDonateCount: number
    nftDonateValue: number
    nftEndTimeStamp: string
    nftGenesis: string
    nftGenesisCertificationName: string
    nftGenesisCertificationType: number
    nftGenesisTxId: string
    nftHasCompound: boolean
    nftHasDonate: boolean
    nftHasLike: boolean
    nftIcon: string
    nftIsFirstSell: boolean
    nftIsReady: boolean
    nftIssueAddress: string
    nftIssueAvatarTxId: string
    nftIssueAvatarType: string
    nftIssueMetaId: string
    nftIssueMetaTxId: string
    nftIssueVersion: string
    nftIssuer: string
    nftLikeCount: number
    nftMinBidIncrease: string
    nftMinBidIncreaseInt: number
    nftName: string
    nftOwnerAddress: string
    nftOwnerAvatarTxId: string
    nftOwnerAvatarType: string
    nftOwnerMetaId: string
    nftOwnerName: string
    nftPrice: number
    nftSatoshi: number
    nftSellContractTxId: string
    nftSellDesc: string
    nftSellState: number
    nftSellTxId: string
    nftSensibleId: string
    nftSeriesName: string
    nftStartingPrice: string
    nftStartingPriceInt: number
    nftSymbol: string
    nftTimestamp: number
    nftTokenId: string
    nftTokenIndex: string
    nftTotalSupply: number
    nftWebsite: string
  }[]
  nftGenesis: string
  nftGenesisTxId: string
  nftGenesisType: string
  nftHasCompound: boolean
  nftIcon: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueMetaId: string
  nftIssueVersion: string
  nftIssuer: string
  nftMyCount: number
  nftMyPendingCount: number
  nftName: string
  nftSensibleId: string
  nftSeriesName: string
  nftSymbol: string
  nftTimestamp: number
  nftTotalSupply: number
  nftWebsite: string
}

declare interface NFTSeriesItem {
  cover: string
  name: string
  nftDesc: string
  total: number
  hasCount: number
  genesis: string
  codehash: string
}

declare interface NFTSeriesItemData {
  cover: string
  name: string
  nftDesc: string
  total: number
  hasCount: number
}

declare interface GetSeriesNftListResItem {
  flag: string
  nftBackIcon: string
  nftBalance: number
  nftCertificationType: number
  nftChargeUnit: string
  nftClassifyList: string[]
  nftCodehash: string
  nftCurrentAuctionBidTxId: string
  nftCurrentAuctionCreateTxId: string
  nftCurrentAuctionState: number
  nftCurrentBidPrice: string
  nftCurrentBidPriceInt: number
  nftDataStr: string
  nftDesc: string
  nftDonateCount: number
  nftDonateValue: number
  nftEndTimeStamp: string
  nftGenesis: string
  nftGenesisCertificationName: string
  nftGenesisCertificationType: number
  nftGenesisTxId: string
  nftHasCompound: boolean
  nftHasDonate: boolean
  nftHasLike: boolean
  nftIcon: string
  nftIsFirstSell: boolean
  nftIsReady: boolean
  nftIssueAddress: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueMetaId: string
  nftIssueMetaTxId: string
  nftIssueVersion: string
  nftIssuer: string
  nftLikeCount: number
  nftMinBidIncrease: string
  nftMinBidIncreaseInt: number
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerAvatarType: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: number
  nftSatoshi: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellState: number
  nftSellTxId: string
  nftSensibleId: string
  nftSeriesName: string
  nftStartingPrice: string
  nftStartingPriceInt: number
  nftSymbol: string
  nftTimestamp: number
  nftTokenId: string
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
}

declare interface GetSeriesNftListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetSeriesNftListResItem[]
    }
  }
}

declare interface GetMyOnSellNftListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetNftIssueyTxIdResItem[]
    }
  }
}

declare interface GetMetaBotListResItem {
  nftBackIcon: string
  nftBalance: number
  nftBuyTimestamp: number
  nftBuyTxId: string
  nftCancelTimestamp: number
  nftCancelTxId: string
  nftCertificationType: number
  nftChargeUnit: string
  nftCodehash: string
  nftCurrentAuctionBidTxId: string
  nftCurrentAuctionCreateTxId: string
  nftCurrentAuctionState: number
  nftCurrentBidPrice: string
  nftCurrentBidPriceInt: number
  nftDataStr: string
  nftDesc: string
  nftDonateCount: number
  nftDonateValue: number
  nftEndTimeStamp: number
  nftGenesis: string
  nftGenesisCertificationType: number
  nftGenesisTxId: string
  nftHasCompound: boolean
  nftHasDonate: boolean
  nftHasLike: boolean
  nftIcon: string
  nftIsFirstSell: boolean
  nftIsReady: boolean
  nftIssueAddress: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueMetaId: string
  nftIssueMetaTxId: string
  nftIssueTimestamp: number
  nftIssueVersion: string
  nftIssuer: string
  nftLikeCount: number
  nftName: string
  nftNumber: number
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerAvatarType: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellState: number
  nftSellTimestamp: number
  nftSellTxId: string
  nftSensibleId: string
  nftSeriesName: string
  nftStartingPrice: string
  nftStartingPriceInt: number
  nftSymbol: string
  nftTimestamp: number
  nftTokenIndex: string
  nftTokenIndexInt: number
  nftWebsite: string
  nftIsLegal: boolean
  nftLegalUuid: string
  nftLegalPrice: number
  nftLegalSymbol: string
  nftAttachment: string
  nftIsOrderLock: boolean
  nftTotalSupply: number
}

declare interface GetMetaBotListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetMetaBotListResItem[]
    }
  }
}

declare interface GetNftIssueyTxIdResItem {
  nftBackIcon: string
  nftBalance: number
  nftCertificationType: number
  nftCodehash: string
  nftDataStr: string
  nftDesc: string
  nftDonateCount: number
  nftDonateValue: number
  nftGenesis: string
  nftGenesisCertificationName: string
  nftGenesisCertificationType: number
  nftGenesisTxId: string
  nftHasCompound: boolean
  nftHasDonate: boolean
  nftHasLike: boolean
  nftIcon: string
  nftIsReady: boolean
  nftIssueAddress: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueMetaId: string
  nftIssueMetaTxId: string
  nftIssueTimestamp: number
  nftIssueVersion: string
  nftIssuer: string
  nftLikeCount: number
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerAvatarType: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPart: string
  nftPrice: number
  nftSatoshi: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellTxId: string
  nftSensibleId: string
  nftSymbol: string
  nftTimestamp: number
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
  nftIsLegal: boolean
}
declare interface GetNftIssueyTxIdRes extends apiResponse {
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

declare interface GetLegalNftDetailRes extends apiResponse {
  data: NFTApiGetNFTDetailResDataItem
}

declare interface NFTApiGetNFTDetailRes extends apiResponse {
  data: {
    total: number
    results: {
      info: {
        version: string
        responseTime: string
      }
      items: NFTApiGetNFTDetailResDataItem[]
    }
  }
}

declare interface NFTApiGetNFTDetailResDataItem {
  uuid?: string
  nftBackIcon: string
  nftBalance: number
  nftCertificationType: number
  nftChargeUnit: string
  nftClassifyList: string[]
  nftCodehash: string
  nftCurrentAuctionBidTxId: string
  nftCurrentAuctionCreateTxId: string
  nftCurrentAuctionState: number
  nftCurrentBidPrice: string
  nftCurrentBidPriceInt: number
  nftDataStr: string
  nftDesc: string
  nftDonateCount: number
  nftDonateValue: number
  nftEndTimeStamp: string
  nftGenesis: string
  nftGenesisCertificationName: string
  nftGenesisCertificationType: number
  nftGenesisTxId: string
  nftHasCompound: boolean
  nftHasDonate: boolean
  nftHasLike: boolean
  nftIcon: string
  nftIsFirstSell: boolean
  nftIsReady: true
  nftIssueAddress: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueMetaId: string
  nftIssueMetaTxId: string
  nftIssueVersion: string
  nftIssuer: string
  nftLikeCount: number
  nftMinBidIncrease: string
  nftMinBidIncreaseInt: number
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerAvatarType: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: number
  nftSatoshi: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellState: number
  nftSellTxId: string
  nftSensibleId: string
  nftSeriesName: string
  nftStartingPrice: string
  nftStartingPriceInt: number
  nftSymbol: string
  nftTimestamp: number
  nftTokenId: string
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
  nftIsLegal: boolean
  nftLegalUuid: string
  nftLegalPrice: number
  nftLegalSymbol: string
  blindboxRemain?: number
  nftGenesisTxId?: string
  nftAttachment: string
  nftCanSellTimestamp: number
  nftIsOrderLock: boolean
  nftSpecialLegalCnyPrice: number
}

declare interface GetCertMetaIdListRes extends apiResponse {
  data: string[]
}

declare interface GetMarketBannersRes extends apiResponse {
  data: {
    total: number
    result: GetMarketBannersResDataItem[]
  }
}

declare interface GetMarketBannersResDataItem {
  [key: string]: {
    content: string
    issuerAvatarTxId: string
    issuerAvatarType: string
    issuerMetaId: string
    issuerName: string
    picUrl: string
    title: string
    url: string
    limitTime: number
  }
}

declare interface GetMarketHotTopicsRes extends apiResponse {
  data: {
    total: number
    result: GetMarketHotTopicsResDataItem[]
  }
}

declare interface GetMarketHotTopicsResDataItem {
  avatarTxId: string
  avatarType: string
  donateCount: number
  donateValue: number
  groupInfoMap: {
    [key: string]: {
      groupCover: {
        [key: string]: string
      }
      groupInfo: string
      groupName: string
    }
  }
  groupTime: number
  interactionCount: number
  issueMetaId: string
  likeCount: number
  metaId: string
  metanetId: string
  nftList: {
    icon: string
    name: string
  }[]
  seriesList: {
    codehash: string
    genesis: string
    seriesName: string
    tag: string
  }[]
  txId: string
  userName: string
  price?: number
  totalSupply?: number
}

declare interface GetNosGenesisInfoRes extends apiResponse {
  data: GenesisInfo
}

declare interface GenesisInfo {
  genesis: string
  seriesIconCn: string
  seriesIconEn: string
  seriesIconJp: string
  seriesInfoCn: string
  seriesInfoEn: string
  seriesInfoJp: string
  seriesNameCn: string
  seriesNameEn: string
  seriesNameJp: string
  website: string
}

declare interface GetNftHolderListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: {
        holderList: GetNftHolderListResItem[]
        issuer: GetNftHolderListResItem
        owner: GetNftHolderListResItem
      }
    }
  }
}

declare interface GetNftHolderListResItem {
  avatarTxId: string
  avatarType: string
  avatarImage: string
  codehash: string
  genesis: string
  issuerMetaId: string
  issuerMetaTxId: string
  memo: string
  metaId: string
  name: string
  nftHash: string
  protocol: string
  satoshisPrice: string
  timestamp: number
  tokenIndex: string
  txId: string
  userInfo: {
    address: string
    avatarImage: string
    avatarTxId: string
    avatarType: string
    coverPublicKey: string
    coverType: string
    coverUrl: string
    infoAvatarTxIdOssUrl: string
    metaIdTimestamp: number
    metaName: string
    name: string
    nameType: string
    nftNamePublicKey: string
    publicKey: string
  }
}

declare interface GetLegalBuyNft extends apiResponse {
  data: {
    buyOrderId: string
    wxCoreOrderId: string
    url: string
  }
}

declare interface GetMetaIdInfoRes extends apiResponse {
  data: SimpleUserInfo
}

declare interface SimpleUserInfo {
  address: string
  avatarTxId: string
  avatarType: string
  coverPublicKey: string
  coverType: string
  coverUrl: string
  infoTxId: string
  metaId: string
  metaIdTag: string
  name: string
  protocolTxId: string
  pubKey: string
  timestamp: number
}

declare interface GetExchangeRate extends apiResponse {
  code: number
  data: {
    cnyRate: number
    usdtRate: number
    feeRate: number
    message: string
  }
}

declare interface Collection {
  coverPicUrlEn: string
  coverPicUrlJp: string
  coverPicUrlZh: string
  createAvatarTxId: string
  createAvatarType: string
  createMetaId: string
  createName: string
  info: {
    [key: string]: string
  }
  key: string
  name: string
  sort: number
  tabList: {
    tabName: string
    tabTag: string
  }[]
  tag: string
  timestamp: number
  url: string
  limit: number
  coverPic392x196: {
    [key: string]: string
  }
  filterTagList: {
    tabName: {
      [key: string]: string
    }
    tabTag: string
  }[]
  filterIndex: number
}

declare interface GetCollectionRes extends apiResponse {
  data: Collection
}

declare interface BoxItem {
  tag: string
  codehashGenesisList: string[]
  issuerMetaId: string
  issuerName: string
  issuerAvatarTxId: string
  issuerAvatarType: string
  limit: number
  total: number
  timestamp: number
  url: string
  info: {
    [key: string]: {
      title: string
      content: string
      icon: string
    }
  }
  isOpen: boolean
  activityId: number
}

declare interface GetUserBoxsRes extends apiResponse {
  data: {
    total: number
    results: {
      items: BoxItem[]
    }
  }
}

declare interface GetAirdropResultsItem {
  metaid: string
  name: string
  address: string
  FirstLetter: string
  status: number
  shareIndex: number
}

declare interface GetAirdropResultsRes extends apiResponse {
  data: {
    total: number
    result: GetAirdropResultsItem[]
  }
}

declare interface GenesisVolumeInfo {
  topicKey?: string
  averagePricePercentageIncrease: string
  latestPercentageIncrease: string
  maxPrice: number
  maxPriceStr: string
  minPrice: number
  minPriceOnSell: number
  minPriceOnSellStr: string
  minPriceOnSellTxId: string
  minPriceStr: string
  totalSupply: number
  panicPrice: number
  panicPriceStr: string
  totalHolder: number
  totalCirculation: number
  totalLimit: number
  minLegalPriceOnSell: number
  dateCountList?: {
    date: string
    percentageIncrease: string
    totalTxPrice: number
    totalTxPriceStr: string
    volume: number
    averagePrice: number
    averagePricePercentageIncrease: string
  }[]
}

declare interface GetGenesisVolumeInfoRes extends apiResponse {
  data: GenesisVolumeInfo
}

declare interface OpenBoxRes extends apiResponse {
  data: {
    blindBoxName: string
    blindBoxIcon: string
    issueName: string
    issueAvatarIcon: string
    issueAvatarType: string
    issueMetaid: string
  }
}

declare interface GerFeeInfoResData {
  coin_service: number
  first_platform: number
  first_royalty: number
  other_platform: number
  other_royalty: number
  royalty: number
}

declare interface GerFeeInfoRes extends apiResponse {
  data: GerFeeInfoResData
}

declare interface GetMyLegalAmountRes extends apiResponse {
  data: {
    amount: number
  }
}

declare interface GetMyLegalCnyRes extends apiResponse {
  data: {
    amount: string
    freeze: string
    metaid: string
  }
}

declare interface withDrawListItem {
  ErrMsg: string
  Suggestion: string
  amount: number // 单位分
  audit_action: number // 审核状态 0 : 待审核 1 : 审核通过 2 : 审核失败 3 : 审核关闭
  create_time: number
  status: number // 提现状态 0 : 待审核 1 : 审核失败 2 : 审核通过待提现 3 : 第三方提现失败 4 : 第三方提现成功 5 : 管理员关闭
  withdrawals_id: string // 提现id
  withdrawals_order_id: string // 外部orderid
  withdrawals_status: number | string // 外部提现状态 0 : 未发起 1 : 已发起未确认 2 : 已经完成 3 : 管理员关闭
  withdrawals_update_time: number
  type?: WalletRecordType
}

declare interface withDrawHistroyListRes extends apiResponse {
  data: withDrawListItem[]
}

declare interface GetWithDrawRes extends apiResponse {
  data: {
    order_id: string
  }
}

declare interface BlindBoxItem {
  tag: string
  codehashGenesisList: any[]
  issuerMetaId: string
  issuerName: string
  issuerAvatarTxId: string
  issuerAvatarType: string
  limit: number
  timestamp: number
  url: string
  info: {
    [key: string]: {
      title: string
      content: string
      icon: string
      authorDescription: string
    }
  }
  isOpen: boolean
  total: number
  legalPrice: number
  platformRate: number
  activityId: number
  version: number
  detail: string
  attachment: string
}

declare interface GetBlindBoxList extends apiResponse {
  code: number
  data: {
    total?: number
    results: {
      items: BlindBoxItem[]
    }
  }
}

declare interface GetSaleLegalNftsRes extends apiResponse {
  data: any
}

declare interface GetLegalAddress extends apiResponse {
  code: number
  data: {
    address: string
  }
}

declare interface OrderMsg {
  order_id: string
  status: number
  transaction_id: string
}

declare interface PayOrderStatus {
  address: string
  amount: string
  count: number
  create_time: number
  error_status: string
  goods_name: string
  metaid: string
  outside_order_id: string
  price: number
  status: number
  url: string
  uuid: string
  buyOrderId: string
  wxCoreOrderId: string
  pay_decimal_num: number
  pay_amount?: number
  pay_currency?: string
  order_id: string
}
declare interface GetOrderStatusRes extends apiResponse {
  data: PayOrderStatus
}

declare interface LegalGetUserOnSaleResItem {
  nftBackIcon: string
  nftBalance: number
  nftCertificationType: number
  nftChargeUnit: string
  nftClassifyList: string[]
  nftCodehash: string
  nftCurrentAuctionBidTxId: string
  nftCurrentAuctionCreateTxId: string
  nftCurrentAuctionState: number
  nftCurrentBidPrice: string
  nftCurrentBidPriceInt: number
  nftDesc: string
  nftDonateCount: number
  nftEndTimeStamp: string
  nftGenesis: string
  nftGenesisCertificationName: string
  nftGenesisCertificationType: number
  nftGenesisTxId: string
  nftHasCompound: boolean
  nftHasDonate: boolean
  nftHasLike: boolean
  nftIcon: string
  nftIsFirstSell: true
  nftIsReady: boolean
  nftIssueAddress: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueMetaId: string
  nftIssueMetaTxId: string
  nftIssueVersion: string
  nftIssuer: string
  nftLikeCount: number
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerAvatarType: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: string
  nftSatoshi: number
  nftSellDesc: string
  nftSellState: number
  nftSensibleId: string
  nftSeriesName: string
  nftStartingPrice: string
  nftStartingPriceInt: number
  nftSymbol: string
  nftTimestamp: string
  nftTokenId: string
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
  uuid: string
}

declare interface LegalGetUserOnSaleRes extends apiResponse {
  data: {
    items: LegalGetUserOnSaleResItem[]
    total: number
  }
}

declare interface BlindBoxMsg {
  total: number // 轮次总量
  remain: number // 剩餘数
  round: number // 轮次
  bsvPrice: number // bsv价格
  rmbPrice: number // 人民币价格
  codehash: string
  genesis: string
  sellDesc: string // 销售上架描述
}
declare interface BlindBoxSaleDetail extends apiResponse {
  code: number
  data: BlindBoxMsg
}

declare interface BuyBlindBoxData extends apiResponse {
  code: number
  error: string
  data: {
    buyOrderId: string
    wxCoreOrderId: string
    url: string
    address: string
    amount: number
  }
}

declare interface MyBlindBoxListResItem {
  SSRBlindBoxQuantity: number
  SRBlindBoxQuantity: number
  RBlindBoxQuantity: number
  avatarPriorityQuantity: number
  otherPriorityQuantity: number
  dunhuangPriorityQuantity: number
}
declare interface MyBlindBoxList extends apiResponse {
  code: number
  data: MyBlindBoxListResItem
}

declare interface GetBlindboxClassifyItem {
  name: string
  issuAmount: number
  probability: number
  cover: {
    url: string
    formats: {
      thumbnail: url
    }
  }
  model: number
}

declare interface GetUserBlindboxRes extends apiResponse {
  data: {
    r_blindbox_count: number
    sr_blindbox_count: number
  }
}

declare interface GetProdTestMetaIdsItem {
  created_at: string
  id: number
  metaId: string
  published_at: string
  updated_at: string
}

declare interface GetUserRightsResItem {
  codehashGenesisList: string[]
  info: {
    [key: string]: {
      title: string
      content: string
      icon: string
    }
  }
  isOpen: boolean
  issuerAvatarTxId: string
  issuerAvatarType: string
  issuerMetaId: string
  issuerName: string
  legalPrice: number
  limit: number
  tag: string
  timestamp: number
  total: number
  url: string
}

declare interface GetUserRightsRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetUserRightsResItem[]
    }
  }
}

declare interface Pic {
  id: number
  name: string
  alternativeText: string
  caption: string
  width: number
  height: number
  formats: {
    thumbnail: {
      name: string
      hash: string
      ext: string
      mime: string
      width: number
      height: number
      size: number
      path: null
      url: string
    }
  }
  hash: number
  ext: number
  mime: number
  size: number
  url: string
  previewUrl: null
  provider: number
  provider_metadata: null
  created_at: number
  updated_at: number
}

declare interface HomeBanner {
  id: number
  network: 'mainnet' | 'testnet'
  title: string
  url: string
  index: number
  published_at: string
  created_at: string
  updated_at: string
  cover: Pic
}

declare interface HomeCollect {
  buttonStatus: boolean // 按钮是否可以点击进去内页
  buttonText: string | null // 自动按钮文字， 盲盒情况下适用
  classify: string // 分类
  cover: Pic // 封面
  created_at: string
  genesis: string | null // 专辑genesis 通过这个判断是专辑还是盲盒， 专辑要通过接口去地板价格
  id: number
  index: number
  issueMeatId: string
  issueName: string
  published_at: string
  startTime: string | null
  title: string // 标题
  updated_at: string
  url: string // 跳转url，有可能是站外链接要适配
  isNFTAvatar: boolean // 铸造者是否NFT头像
  price?: number
  total: string // 数量
  [key: string]: any
}
declare interface Collect {
  id: number
  index: number
  name: string
  topicType: string
  creatorName: string
  creatorMetaName: string
  creatorMetaId: string
  creatorAvatarImage: string
  intro: string
  network: string
  published_at: string
  created_at: string
  updated_at: string
  icon: Pic
  banner: Pic
  cover: Pic
  circulatingSupply?: number
  floorPrice?: number
}

declare interface NFTCreatore{
  number: number;
  rootTxId: string;
  name: string;
  nameId: string;
  address: string;
  avatar: string | null;
  avatarId: string;
  bio: string;
  bioId: string;
  soulbondToken: string;
  unconfirmed: string;
  isInit: boolean;
  metaid: string;

}

declare interface NftsCollection{
  address:string
  auto_market:number
  chain:string
  collection_pinid:string
  cover_pinid:string
  created_at:string
  id:number
  init_price:number
  meta_data:string
  metaid:string
  name:string
  nft_desc:string
  price_growth:number
  royalty_rate:number
  total_supply:number
  updated_at:string
  website:string
  current_supply?:number
  minted?:number
  current_mint_price?:number
  collection_creator?:NFTCreatore
}

declare interface NftMintItemType{
 id:number
 item_pinid:string
 item_cover:string
 pic_path:string
 pic_id:string
 nft_name:string
 item_desc:string
 classify:Array<string>
 meta_data:any
 mint_price:number
 commit_address:string
 reveal_address:string
 is_minted:number
 is_destroy:number
}


declare interface HomeActivityItem {
  cover: PIC
  created_at: string
  id: number
  index: 0
  name: string
  published_at: string
  status: string
  updated_at: string
  url: string
}

declare interface GetMetaSpaceV2EligiblityRes extends apiResponse {
  data: {
    eligibilityInfo: {
      additionalProp1: number
      additionalProp2: number
      additionalProp3: number
      [key: string]: number
    }
  }
}

declare interface GetUserDateByActivityRes extends apiResponse {
  data: {
    address: string
    metaid: string
    status: number
    tag: number
    timestamp: number
  }
}

declare interface GetUserGenesisNftsResItem {
  attachment: string
  attachmentType: string
  backIcon: string
  codehash: string
  genesis: string
  hasCompound: false
  icon: string
  name: string
  part: string
  partBase: string
  tokenIndex: string
  isChoose?: boolean
}
declare interface GetUserGenesisNftsRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetUserGenesisNftsResItem[]
    }
  }
}
declare interface GetComposeInfo extends apiResponse {
  data: string
}

declare interface SetCompseFlag extends apiResponse {
  data: string
}

declare interface reciverAddrss extends apiResponse {
  data: string
}

declare interface GetOwnerSnapshotListResItem {
  metaId: string
  address: string
  name: string
  holdTotal: number
  tokenIndexList: number[]
}

declare interface GetOwnerSnapshotListRes extends apiResponse {
  data: {
    total: number
    result: GetOwnerSnapshotListResItem[]
  }
}

declare interface BalanceUserByBackendRes extends apiResponse {
  data: string[]
}

declare interface MetaBotItem {
  Sig: string
  avatarTxId: string
  avatarType: string
  codehash: string
  desc: string
  genesis: string
  genesisTxId: string
  icon: string
  issueMetaTxId: string
  issuerName: string
  metaBotType: number
  metaId: string
  metaIdName: string
  metanetId: string
  name: string
  part: string
  timestamp: number
  tokenId: string
  tokenIndex: string
  txId: string
  website: string
  hasCompound: boolean
}

declare interface MetaBotRes extends apiResponse {
  data: {
    total: number
    results: {
      items: MetaBotItem[]
    }
  }
}

declare interface RemintPreviewRes extends apiResponse {
  data: {
    image: string
    count: number
    canRemint?: boolean
  }
}

declare interface BindBankCardRes extends apiResponse {
  data: {
    message: 'failure' | 'success'
    description: string
    result: string
  }
}

declare interface GetUserKycInfoRes extends apiResponse {
  data: {
    name: string
    phone: string
    bank_card: string
    id_card: string
  }
}

declare interface GetUserBuyRecordsresItem {
  amount: number
  icon: string
  order_id: string
  order_type: number
  pay_type: number
  timestamp: number
  name: string
  genesis: string
  codehash: string
  tokenIndex: string
}
declare interface GetUserBuyRecordsres extends apiResponse {
  data: {
    total: number
    result: GetUserBuyRecordsresItem[]
  }
}

declare interface GetInvitateCountRes extends apiResponse {
  data: {
    count: number
    rank: number
  }
}

declare interface GetMyInvitationsResData {
  actionIndex: number
  activityId: number
  avatarTxId: string
  avatarType: string
  consumptionIndex: number
  metaId: string
  name: string
  realNameIndex: number
  tag: number
}

declare interface GetMyInvitationsRes extends apiResponse {
  data: {
    total: number
    result: GetMyInvitationsResData[]
  }
}

declare interface GetTicketResData {
  activity_id: number
  begin_time: number
  end_time: number
  count: number
  metaid: string
  tag: number
}
declare interface GetTicketRes extends apiResponse {
  data: GetTicketResData[]
}
declare interface OpenbilindboxResData {
  activity_id: number
  code_hash: string
  create_time: number
  genessis: string
  nft_index: number
  send_status: number
  send_tx: string
}
declare interface OpenbilindboxRes extends apiResponse {
  data: OpenbilindboxResData
}

declare interface CreateBilidboxOrderResData {
  create_time: number
  id: number
  name: string
  url: string
}
declare interface CreateBilidboxOrderRes extends apiResponse {
  data: OpenbilindboxResData
}

declare interface GetUserBilindboxOrdersResData {
  activity_id: number
  amount: string
  count: number
  create_time: number
  error_status: string
  goods_name: string
  metaid: string
  outside_order_id: string
  price: number
  status: number
  url: string
  uuid: string
}

declare interface GetUserBilindboxOrdersRes extends apiResponse {
  data: GetUserBilindboxOrdersResData
}

declare interface GetBlindBoxOrderStatusRes extends apiResponse {
  data: GetUserBilindboxOrdersResData
}

declare interface CreateBlindboxOrderIdRes extends apiResponse {
  data: { uuid: string }
}

declare interface BlindboxUUIDData {
  activity_id: number
  amount: string
  count: number
  create_time: number
  error_status: string
  goods_name: string
  metaid: string
  outside_order_id: string
  order_id: string
  price: number
  status: BlindboxUUIDStatus
  url: string
  uuid: string
  uuid: string
}

declare interface BlindboxUUIDDataRes extends apiResponse {
  data: BlindboxUUIDData[]
}

declare interface CheckBlindboxOrderStatusRes extends apiResponse {
  data: BlindboxUUIDData
}

declare interface BlindBoxActivityInfo {
  begin_time: number
  count: number
  enable: boolean
  fee: number
  first_end_time: number
  price: number
  primaryKey: number
  second_end_time: number
  total: number
}

declare interface GetActivityInfoRes extends apiResponse {
  data: BlindBoxActivityInfo
}

declare interface OpenBilindboxResData {
  activity_id: number
  code_hash: string
  create_time: number
  genessis: string
  nft_index: number
  send_status: number
  send_tx: string
}
declare interface OpenBilindboxRes extends apiResponse {
  data: OpenBilindboxResData
}
declare interface GetHomeRecommentData {
  content: string
  cover: Pic
  created_at: string
  endTime: string
  id: number
  published_at: string
  startTime: string
  title: string
  updated_at: string
  url: string
}

declare interface MetaBotItem {
  Sig: string
  avatarTxId: string
  avatarType: string
  codehash: string
  desc: string
  genesis: string
  genesisTxId: string
  icon: string
  issueMetaTxId: string
  issuerName: string
  metaBotType: number
  metaId: string
  metaIdName: string
  metanetId: string
  name: string
  part: string
  timestamp: number
  tokenId: string
  tokenIndex: string
  txId: string
  website: string
  hasCompound: boolean
}

declare interface MetaBotRes extends apiResponse {
  data: {
    total: number
    results: {
      items: MetaBotItem[]
    }
  }
}

declare interface RemintPreviewRes extends apiResponse {
  data: {
    image: string
    count: number
    canRemint?: boolean
  }
}

declare interface GetTeamRankingsRes extends apiResponse {
  data: {
    total: number
    result: [
      {
        activityId: number
        avatarTxId: string
        avatarType: string
        count: number
        metaId: string
        name: string
      }
    ]
  }
}

declare interface GetTeamMembersResData {
  teamMetaId: string
  teamId: string
  address: string
  leaderIndex: boolean
  additionFactor: number
  consumptionCount: number
  consumptionIndex: boolean
  contribution: number
  contributionPercentage: string
  activityId: number
  avatarTxId: string
  avatarType: string
  count: number
  metaId: string
  name: string
}
declare interface GetTeamMembersRes extends apiResponse {
  data: {
    total: number
    result: GetTeamMembersResData[]
  }
}

declare interface GetMyTeamsRes extends apiResponse {
  data: {
    total: number
    result: [
      {
        teamMetaId: string
        teamId: string
        address: string
        leaderIndex: boolean
        additionFactor: number
        consumptionCount: number
        consumptionIndex: boolean
        contribution: number
        contributionPercentage: string

        activityId: number
        avatarTxId: string
        avatarType: string
        count: number
        metaId: string
        name: string
      }
    ]
  }
}
declare interface AnnounceItem {
  content: string
  created_at: string
  id: number
  published_at: string
  title: string
  updated_at: string
  url: string
}

declare interface GetUnSendNFTsRes extends apiResponse {
  data: {
    ActivityId: number
    CodeHash: string
    Genessis: string
    NftIndex: number
    SendStatus: number
    UpdateTime: number
  }[]
}

declare interface AvatarNFT {
  avatarTxId: string
  avatarType: string
  codehash: string
  desc: string
  genesis: string
  genesisId: string
  genesisTxId: string
  icon: string
  issueMetaTxId: string
  issuerName: string
  metaId: string
  metaIdName: string
  metanetId: string
  name: string
  timestamp: number
  tokenId: string
  tokenIndex: string
  txId: string
  website: string
}

declare interface StakingItem {
  sort?: number
  address: string
  tokenAmount: string
}

interface GetTopStakingRes extends apiResponse {
  data: {
    total: number
    results: {
      info: {
        version: string
        responseTime: string
      }
      items: StakingItem[]
    }
  }
}
declare interface GetUserNFTListRes extends apiResponse {
  data: {
    results: {
      items: AvatarNFT[]
    }
    total: number
  }
}

declare interface GetTigerCountRes extends apiResponse {
  success: boolean
  data: {
    mold: number
    molding: number
    inFrontOfMe: number
  }
}

declare interface GetTigerListResDataItem {
  NftDna: string
  NftName: string
  NftPreviewUrl: string
}

declare interface GetTigerListRes extends apiResponse {
  success: boolean
  data: GetTigerListResDataItem[]
}

declare interface GetDisCountRes extends apiResponse {
  data: {
    platform_discount: number
  }
}

declare interface GetUserKycInfoByAllRes extends apiResponse {
  data: {
    bank_card: string
    id_card: string
    name: string
    phone: string
    timestamp: number
  }
}

declare interface NFTApiGetNFTDetailResDataItem {
  [x: string]: any
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
  nftSellState: number
  nftOwnerAvatarType: string
  nftIssueAvatarType: string
  nftGenesisCertificationType: number
  nftCertificationType: number
  nftGenesisCertificationName: string
  nftCurrentAuctionCreateTxId: string
  nftIssueAddress: string
  nftBackIcon: string
  nftHasCompound: boolean
  nftIsFirstSell: boolean
  nftMinBidIncreaseInt: number
}

declare interface GetSeriesNftListResItem {
  nftCodehash: string
  nftIssueMetaId?: string
  nftIssueAvatarType?: string
  nftGenesis: string
  nftGenesisTxId: string
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
  nftSensibleId: string
  nftHasCompound: boolean
}

declare interface GetLegalNftDetail extends apiResponse {
  code: number
  data: any
}

declare interface GetCertUserInfoRes extends apiResponse {
  data: CertUserInfo
}

declare interface CertUserInfo {
  idNumber: string
  information: string
  metaId: string
  metaIdName: string
  organizationName: string
  realName: string
  userCertificationType: number
  userProfile: string
}

declare interface MetaNameIndexerInfo {
  name: string
  expiredBlockTime: number
  nftCodeHash: string
  genesisId: string
  tokenIndex: string
  resolver: string
  infos?: Partial<MetaNameInfo>
  txid: string
  registerState: import('@/enum').MetaNameRegisterState
  resolveAddress: string
  ownerAddress: string
}

declare type Ens = string

declare interface TypeCollction {
  id: number
  name: string
  topicType: string
  index: number
  network: string
  published_at: string
  created_at: string
  updated_at: string
  show_3_collection: Collect
}

declare interface MyFollowList extends apiResponse {
  data: {
    list: string[]
    total: number
  }
}

declare interface FollowInfo extends apiResponse {
  data: {
    metaId: string
    followMetaId: string
    followTime: string
    followPinId: string
    unFollowPinId: string
    status: boolean
  }
}
