import { HdWalletChain, IsEncrypt } from '@/enum'
import { PayToItem } from '@/typings/sdk'
import { MetaIdJs, ProtocolOptions } from 'metaidjs'

export interface NftCancelParams {
  codehash: string
  genesis: string
  genesisTxid: string
  tokenIndex: string
  sellContractTxId: string
  sellTxId: string
  checkOnly?: boolean
}
export interface NftSellParams {
  codehash: string
  genesis: string
  tokenIndex: string
  satoshisPrice: number
  genesisTxid: string
  sensibleId: string
  sellDesc: string
  checkOnly?: boolean
}
export interface NftBuyParams {
  codehash: string
  genesis: string
  tokenIndex: string
  sellTxId: string
  sellContractTxId: string
  genesisTxid: string
  sensibleId: string
  amount: number
  checkOnly?: boolean
}

export interface AppMsg {
  name: string
  website: string
  mode: AppMode
  isProduction?: boolean // 保留 isProduction 兼容旧版本
}

export interface NftBuyResData extends MetaIdJsRes {
  data: {
    tx: any
    txHex: string
    txid: string
    amount?: number
  }
}

export interface NftSellResData extends MetaIdJsRes {
  data: {
    message: string
    txId: string
    transactionHex: string
    fee: number
  }
}

export interface NFTCancelResData extends MetaIdJsRes {
  data: {
    tx: any
    txHex: string
    txid: string
    amount?: number
  }
}

export interface UtxoItem {
  address: string
  // utxo 所在的路径
  addressIndex: number
  addressType: number
  // txIndex: number
  outputIndex: number
  txId: string
  // value: number
  xpub?: string
  script: string
  amount: number
  satoshis: number
  wif?: string // nft需要
}

export interface PayMeParams {
  amount: number
  resolve: null | ((val: any) => void)
  type: PayMeParamsType
}

export interface CreateNodeOptions {
  nodeName: string
  metaIdTag?: string
  data?: string | Buffer
  parentTxId?: string
  outputs?: any[]
  change?: string
  utxos?: UtxoItem[]
  payTo?: PayToItem[]
  encrypt?: IsEncrypt
  version?: string
  dataType?: string
  encoding?: string
  node?: {
    // 创建新节点的信息， 当创建bfrc节点时需要传， 创建bfrc 子节点时不用传，自动生成
    address: string
    publicKey: string
    path: string
  }
  chain?: HdWalletChain
}

export interface TransferTypes {
  amount?: number
  to?: string
  payCurrency?: string
  outputs?: UtxoItem[]
  payTo?: PaytoTypes | PaytoTypes[]
  from?: BaseUtxo[]
  change?: string
  utxos?: MetasvUtxoTypes[]
  opReturn?: (string | Buffer)[]
  needConfirm?: boolean
  useFeeb?: number
  chain?: HdWalletChain
}

export interface ConstructorOptionsTypes {
  baseUri?: string
  oauthSettings: OauthSettingsTypes
  onLoaded?: Function
  onError?: Function
}
export interface OauthSettingsTypes {
  clientId: string
  redirectUri: string
  clientSecret?: string
  scope?: string
  responseType?: string
}
export interface ProtocolParamsTypes extends ProtocolOptions, BaseParamsType {
  accessToken: string
  handlerId?: string
}
export interface BaseParamsType {
  accessToken: string
  callback?: Function
  onCancel?: Function
}

export interface appMetaIdJsParams {
  accessToken: string
  data: any
  onCancel?: Function
}

export interface NftFunParams {
  accessToken: string
}

export interface CreateMetaFileFunParams extends NftFunParams {
  data: {
    name: string
    data: string
    encrypt: string
    data_type: string
  }
}
export interface MetaIdJsRes {
  code: number
  data: any
  status?: string
  handlerId?: string
  appAccessToken?: string
}
export interface SdkGenesisNFTRes extends MetaIdJsRes {
  data: {
    codehash: string
    genesisId: string
    genesisTxid: string
    sensibleId: string
    amount?: number
  }
}

export interface SendMetaDataTxRes extends MetaIdJsRes {
  data: {
    txId: string
    // checkOnly = true
    usedAmount?: number
    usedAmountCent?: number
    nodeAddress?: string
  }
}

export interface CreateNftFunParams extends NftFunParams {
  data: CreateNftParams
}

export enum SdkCallBackCodes {
  success = 200,
}

export interface SdkCallBack {
  code: SdkCallBackCodes
  data: any
  status: string
}

export interface IssueNFTResData extends MetaIdJsRes {
  data: {
    metaTdid: string
    nftId: string
    tokenId: string
    txId: string
    tokenIndex: string
    amount?: number
  }
}

export interface GetBalanceRes extends MetaIdJsRes {
  data: {
    bsv: number
    satoshis: number
  }
}

export interface NFTCancelResData extends MetaIdJsRes {
  data: {
    tx: any
    txHex: string
    txid: string
    amount?: number
  }
}

export interface NftBuyResData extends MetaIdJsRes {
  data: {
    tx: any
    txHex: string
    txid: string
    amount?: number
  }
}

export interface NftSellResData extends MetaIdJsRes {
  data: {
    sellTxHex: string
    sellTxId: string
    txHex: string
    txid: string
    amount?: number
  }
}

export interface NftDataProtocolParams {
  type: string
  name: string // nft名称
  intro: string // nft描述
  cover: MetaFile // nft封面 MetaFile协议地址
  originalFile?: MetaFile | string // nft原文件 MetaFile协议地址
  txId?: string // 使用txId创建时的txId
  checkOnly?: boolean //
}

export interface CreateNFTRes extends MetaIdJsRes {
  data: {
    // IssueNFTResData
    metaTdid: string
    nftId: string
    tokenId: string
    txId: string
    tokenIndex: string
    // SdkGenesisNFTRes
    codehash: string
    genesisId: string
    genesisTxid: string
    sensibleId: string
  }
}

export interface NftBuyParams {
  codehash: string
  genesis: string
  tokenIndex: string
  sellTxId: string
  sellContractTxId: string
  genesisTxid: string
  sensibleId: string
  amount: number
  checkOnly?: boolean
}

export interface CreateNftBuyProtocolParams {
  txId: string // nft bug txId
  txHex: string // sell的utxo
  sellTxId: string // sell txId
  codehash: string // nft codehash
  genesis: string // nft genesis
  genesisTxid: string // nft genesisTxid
  tokenIndex: string // nft tokenIndex
  satoshisPrice: number // 出售的价格，单位聪
  opreturnData: string // buy 备注信息
  createdAt: number // 创建时间
  buyerMetaId: string // 购买者metaId
}

export interface BuyNFTParams extends NftBuyParams {
  amount: number
  address: string
}

export interface NftSellParams {
  codehash: string
  genesis: string
  tokenIndex: string
  satoshisPrice: number
  genesisTxid: string
  sensibleId: string
  sellDesc: string
  checkOnly?: boolean
}

export interface SellNFTParams extends NftSellParams {}

export interface CreateNftSellProtocolParams extends NftSellParams {
  txid: string // sell交易tx
  sellTxId: string // sellUtxoTxId
  sellTxHex: any // sell的utxo
  createdAt: number // 创建时间
}

export interface NftCancelParams {
  codehash: string
  genesis: string
  genesisTxid: string
  tokenIndex: string
  sellContractTxId: string
  sellTxId: string
  checkOnly?: boolean
}
export interface CancelSellNFTParams extends NftCancelParams {
  sellTxId: string
  satoshisPrice: number
}

export interface PayToItem {
  address: string
  amount: number
}
export interface NFTIssueParams {
  receiverAddress: string //  创建者接收地址
  genesisId?: string //
  genesisTxid?: string
  codehash?: string
  sensibleId?: string
  nftname: string
  nftdesc: string
  nfticon: {
    fileType: string
    fileName: string
    data: string
  }
  nftwebsite: string
  nftissuerName: string
  content: NFTIssueData
  checkOnly?: boolean
}

export interface NFTIssueData {
  nftType: string
  classifyList: string
  originalFileTxid: {
    fileType: string
    fileName: string
    data: string
  }
  contentTxId: string
}

export interface NFTGenesisParams {
  nftTotal?: string
  seriesName?: string
  checkOnly?: boolean
}

export interface CreateNFTParams extends NFTGenesisParams, NFTIssueParams {
  codeHash?: string
  genesis?: string
  genesisTxId?: string
  sensibleId?: string
}

export interface NFTLIstRes extends MetaIdJsRes {
  data: NFTListItem[]
}

export interface NFTListItem {
  nftBalance: number
  nftCodehash: string
  nftDesc: string
  nftGenesis: string
  nftGenesisTxid: string
  nftIcon: string
  nftIssuer: string
  nftName: string
  nftSymbol: undefined
  nftTimestamp: number
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
  data: {
    nftname: string
    nftdesc: string
    nfticon: string
    nftwebsite: string
    nftissuerName: string
    nftType: string
    classifyList: string
    originalFileTxid: string
    contentTxId?: string
  }
  nftDataStr?: string
}

export interface GetMcRes extends apiResponse {
  data: FTItem[]
}

export interface FTItem {
  balance: number
  codehash: string
  decimal: number
  genesis: string
  name: string
  pendingBalance: number
  sensibleId: string
  symbol: string
}

export interface createBrfcChildNodeParams {
  nodeName: NodeName
  autoRename?: boolean
  appId?: string[]
  encrypt?: IsEncrypt
  version?: string
  data?: string
  dataType?: string
  payCurrency?: string
  payTo?: PayToItem[]
  encoding?: string
  needConfirm?: boolean // 是否需要确认
  attachments?: AttachmentItem[] // 附件
  utxos?: any[] // 传入的utxos
  ecdh?: { type: string; publickey: string } // ecdh
  useFeeb?: number // 费率
  meConvertSatoshi?: number // 1Me 等于多少聪
  loading?: { close: () => void }
  payType?: SdkPayType
  // 修改
  publickey?: string // 修改时 用的publicekey
  txId?: string
}

export interface CreateNodeBaseRes {
  txId: string
  transaction?: bsv.Transaction
  scriptPlayload?: (string | Buffer)[]
  hex?: string
}

export interface CreateNodeBrfcRes extends CreateNodeBaseRes {
  address: string
  addressType: number
  addressIndex: number
}
export interface SendMetaNameTransationResult {
  registerMetaNameResp: any
  MvcToAddress: string
  NftToAddress: string
  TxFee: number
  FeePerYear: number
}

export interface HdWalletCreateBrfcChildNodeParams {
  nodeName: string
  autoRename?: Boolean
  appId?: string[]
  encrypt?: IsEncrypt
  version?: string
  data?: string
  dataType?: string
  payCurrency?: string
  payTo?: PayToItem[]
  encoding?: string
  needConfirm?: boolean // 是否需要确认
  attachments?: AttachmentItem[] // 附件
  utxos?: any[] // 传入的utxos
  publickey?: string // 修改时 用的publicekey
  ecdh?: { type: string; publickey: string } // ecdh
  useFeeb?: number // 费率
  meConvertSatoshi?: number
  brfcTxId: string
}
