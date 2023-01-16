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
  name: string
  pk2: string
  tag: 'new' | 'old'
  avatarType: string
  avatarTxId: string
  avatarImage: string
  email: string
  phone: string
  token: string
  appToken: string
  metaId: string
  address: string
  register: string
  lastLoginTime: number | null
  enCryptedMnemonic: string
  userType: string
  infoTxId: string
  protocolTxId: string
  flag?: boolean
  evmAddress?: string
  loginType: 'MetaId' | 'MetaMask'
}

declare interface SetUserInfo extends UserInfo {
  password?: string
}

declare interface TabItem {
  name: string
  value: any
}

declare interface BaseNFT {
  cover: string
  genesis: string
  codehash: string
  tokenIndex: string
  chain: string
}

declare interface NFT {
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
  symbol: string
  price: {
    CNY: string
    USD: string
  }
  remark: string
  updateTime: number
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
  avatarImage: string
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
  encrypt: 'number' | '1'
  history: {
    timestamp: number
    txId: string
  }[]
  isEdit: boolean
  isFull: boolean
  isNew: boolean
  isSelling: boolean
  isMyFollow: boolean
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
  postTag: string
  postTagId: number
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

declare interface BindUserInfo {
  address: string
  appToken: string
  did: null
  email: string
  enCryptedMnemonic: string
  lastLoginTime: number
  metaId: string
  name: string
  phone: string
  pk2: string
  register: string
  registerType?: string
  tag: 'new' | 'old'
  token: string
}

declare interface BindMetaIdRes {
  userInfo: MetaMaskLoginUserInfo
  wallet: bsv.HDPrivateKey
  password: string
  // type: 'register' | 'login'
}

declare interface MetaFileInfo {
  txId: string
  metaId: string
  userName: string
  avatarTxId: string
  avatarType: string
  zeroAddress: string
  metanetId: string
  address: string
  publicKey: string
  hash: string
  md5: string
  resUrl: string
  fileType: number
  width: number
  height: number
  imgCompressUrl: string
  duration: number
  fileDataType: string
  fileSize: number
  fileSizeStr: string
  fileName: string
  encrypt: string
  version: string
  dataType: string
  encoding: string
  buzzTxId: string
  isValid: boolean
  isNew: boolean
  blockHeight: number
  confirmState: number
  timestamp: number
}

declare interface recommnedCommunity {
  communityId: string
  cover: string
  description: string
  icon: string
  memberTotal: number
  name: string
  isMyJoin: boolean
}
declare interface RecommnedUser {
  address: string
  avatarTxId: string
  avatarType: string
  avatarImage: string
  isMyFollow: boolean
  metaId: string
  name: string
  total: number
}

declare interface UserNFTItem {
  nftCodehash: string
  nftDataStr: string
  nftDesc: string
  nftDetailItemList: GenesisNFTItem[]
  nftGenesis: string
  nftGenesisTxId: string
  nftGenesisType: string
  nftHasCompound: boolean
  nftIcon: string
  nftIsReady: boolean
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

declare interface FungibleToken {
  balance: string
  codehash: string
  decimalNum: number
  desc: string
  genesis: string
  genesisTxId: string
  icon: string
  iconUrl: string
  issueList: any[]
  issueVersion: string
  issuer: string
  name: string
  sensibleId: string
  symbol: string
  timestamp: number
  totalSupply: number
  totalSupplyStr: string
  website: string
}

declare interface GenesisNFTItem {
  flag: string
  nftAttachment: string
  nftAttachmentType: string
  nftBackIcon: string
  nftBalance: number
  nftCanSellTimestamp: number
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
  nftHasCompound: true
  nftHasDonate: true
  nftHasLike: true
  nftIcon: string
  nftIsFirstSell: true
  nftIsLegal: true
  nftIsOrderLock: true
  nftIsReady: true
  nftIssueAddress: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueAvatarImage: string
  nftIssueMetaId: string
  nftIssueMetaTxId: string
  nftIssueVersion: string
  nftIssuer: string
  nftLegalPrice: number
  nftLegalSymbol: string
  nftLegalUuid: string
  nftLikeCount: number
  nftMinBidIncrease: string
  nftMinBidIncreaseInt: number
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerAvatarType: string
  nftOwnerAvatarImage: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPart: string
  nftPartBase: string
  nftPrice: number
  nftSatoshi: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellState: number
  nftSellTxId: string
  nftSensibleId: string
  nftSeriesName: string
  nftSpecialLegalCnyPrice: number
  nftStartingPrice: string
  nftStartingPriceInt: number
  nftSymbol: string
  nftTimestamp: number
  nftTokenId: string
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
  nftChain: string
}

declare interface NodeTransactions {
  payToAddress?: CreateNodeRes
  metaFileBrfc?: CreateNodeRes
  metaFiles?: CreateNodeRes[]
  currentNodeBrfc?: CreateNodeRes
  currentNode?: CreateNodeRes
  issueNFT?: {
    transaction: bsv.Transaction
    txId?: string
  }
  subscribeId?: string
}

declare interface JobStep {
  txId?: string
  txHex: string
  status: import('@/enum').JobStepStatus
  resultTxId?: string
  resultTxMessage?: string
  metanetId?: string
}

declare interface Job {
  id: string
  name: string
  steps: JobStep[]
  status: import('@/enum').JobStatus
}

declare interface GenesisItem {
  codehash: string
  count: number
  currentTotalSupply: number
  genesis: string
  genesisTimestamp: number
  genesisTxId: string
  minted: string
  pendingCount: number
  sensibleId: string
  seriesName: string
  symbol: string
  totalSupply: number
}

declare interface Order {
  status: number
  order_id: string
  transaction_id: string
  pay_amount: number
}
declare interface MetaNameInfo {
  metaid: string
  eth: string
  polygon: string
  solana: string
  BTC: string
  BSV: string
  mvc: string
  IPFS: string
  icon: string //metafile
  DNS: string
  Content: string
  email: string
  url: string
  discord: string
  github: string
  reddit: string
  twitter: string
  telegram: string
}
declare interface AnnouncementItem {
  address: string
  attachments: string[]
  blockHeight: number
  content: string
  contentType: string
  isNew: boolean
  isValid: boolean
  metaId: string
  metanetId: string
  publicKey: string
  timestamp: number
  title: string
  txId: string
}

declare interface MetaNameItem {
  codeHash: string
  expiredBlockHeight: number
  genesis: string
  icon: string
  infos: {
    IPFS: string
    discord: string
    icon: string
    mvc: string
    url: string
  }
  mnsIndex: number
  op: number
  resolver: string
  tokenIndex: string
  txid: string
  communityId: string
  signature?: string
}
