declare interface Pagination {
  page: number
  pageSize: number
  loading?: boolean
  nothing?: boolean
  totalPages?: number
  isRefreshing?: boolean
  refreshing?: boolean
  [key: string]: any
}

declare interface Token {
  access_token: string
  token_type?: string
  refresh_token?: string
  expires_in?: number
  expires_time?: number
}

declare interface UserInfo {
  showId: string
  metaId: string
  xpub: string
  address: string
  pubKey: string
  infoTxId: string
  protocolTxId: string
  name: string
  nameEncrypt: string
  phone: string
  phoneEncrypt: string
  email: string
  emailEncrypt: string
  headUrl: string
  headUrlEncrypt: string
  avatarTxId: string
  timestamp: number
  userType: UserType
  flag?: boolean
}

declare interface TabItem {
  name: string
  value: any
}

declare interface NFT {
  uuid?: string
  cover: string
  backCover?: string
  classify: string
  issueMetaId?: string
  issueName: string
  issueAvatarType: string
  issueAddress?: string
  issueTxId?: string
  ownerMetaId: string
  ownerName: string
  ownerAvatarType: string
  ownerAddress?: string
  status: number
  likeCount?: number
  isHasLike?: boolean
  price?: number
  genesis: string
  codehash: string
  tokenIndex: string
  name: string
  auctionTxId?: string
  genesisTxId?: string
  sensibleId?: string
  seriesName?: string
  hasSeriesCount?: number
  seriesTotal?: number
  isFirstSell?: boolean
  acutionEndTime?: number
  isCompound: boolean
  isReady?: boolean
  isLegal?: boolean // 是否法币
  attachment?: string
  isOrderLock: boolean
  flag?: string
}

declare interface ExchangeRate {
  cnyRate: number
  usdtRate: number
  feeRate: number
  message: string
}

declare interface Page {
  onRefresh: false | ((callback?: () => void) => void)
  onLoad: false | (() => void)
  pageContentRef: Ref<HTMLDivElement | null>
  pullRef: Ref<HTMLDivElement | null>
  isPaddingHeader: ref<boolean>
}

declare interface Application {
  title: string
  link: string
  icon: string
  key: string
}

declare interface BuzzItem {
  applauseCount: number
  attachments: string[]
  avatarTxId: string
  avatarType: string
  blockHeight: number
  comment: {
    metaId: string
    timestamp: number
    txId: string
    userName: string
    value: number
  }[]
  commentCount: number
  confirmState: number
  content: string
  contentType: string
  data: string
  displayType: string
  donate: string[]
  encrypt: '0' | '1'
  history: {
    timestamp: number
    txId: string
  }[]
  isEdit: boolean
  isFull: boolean
  isNew: boolean
  isSelling: boolean
  isValid: boolean
  like: {
    metaId: string
    timestamp: number
    txId: string
    userName: string
    value: number
  }[]
  likeCount: number
  metaAccessCodeHash: string
  metaAccessContentAmount: string
  metaAccessContentEncryptContent: string
  metaAccessContentOwnerAvatarTxId: string
  metaAccessContentOwnerAvatarType: string
  metaAccessContentOwnerMetaId: string
  metaAccessContentOwnerName: string
  metaAccessContentRevenueAmount: number
  metaAccessGenesisId: string
  metaAccessHasPay: boolean
  metaAccessMetanetId: string
  metaAccessPayTx: string
  metaAccessPutAway: boolean
  metaAccessSellTx: string
  metaAccessServiceConfigMetanetId: string
  metaAccessServiceConfigTxId: string
  metaAccessServiceFee: string
  metaAccessServiceMetaId: string
  metaAccessServiceName: string
  metaAccessServiceUrl: string
  metaAccessTokenIndex: string
  metaAccessTxId: string
  metaId: string
  metanetId: string
  protocol: string
  publicKey: string
  quoteItem: BuzzItem
  rePost: {
    metaId: string
    timestamp: number
    txId: string
    userName: string
    value: number
  }[]
  rePostCount: number
  serverCode: string
  serverPublicKey: string
  timestamp: number
  totalValue: number
  txId: string
  userName: string
  zeroAddress: string
}

declare interface BatchSaleSessionItem {
  genesis: string
  codehash: string
  tokenIndex: string
  cover?: string
  name?: string
  genesisTxId?: string
  sensibleId?: string
}

declare interface BatchSaleItem extends BatchSaleSessionItem {
  priceType: NFTSaleAmountType
  amount: string
  address: string
}
