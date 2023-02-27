import mvc from 'mvc-lib'
// @ts-ignore
import { Message } from 'mvc-lib'
// @ts-ignore
import { Utf8 } from 'crypto-es/lib/core.js'
// @ts-ignore
import { AES } from 'crypto-es/lib/aes.js'
// @ts-ignore
import { CBC, Pkcs7 } from 'crypto-es/lib/cipher-core.js'
// @ts-ignore
import { MD5 } from 'crypto-es/lib/md5.js'
// @ts-ignore
import { SHA256 } from 'crypto-es/lib/sha256.js'
// @ts-ignore
import Ripemd128 from 'ripemd128-js/ripemd128.js'
import * as bip39 from 'bip39'
import { isBtcAddress, isNaturalNumber } from '@/utils/wallet/is'
import ShowmoneyProvider from './showmoney-provider'
// @ts-ignore
import * as ECIES from 'mvc-lib/ecies'
import { englishWords } from './english'
import { SA_utxo } from 'sensible-sdk/dist/sensible-api'
import { isEmail, sleep } from '../util'
import { Chains, HdWalletChain, IsEncrypt, Network, NodeName, WalletTxVersion } from '@/enum'
import { AttachmentItem, PayToItem } from '@/@types/hd-wallet'
import {
  CreateNodeOptions,
  TransferTypes,
  UtxoItem,
  HdWalletCreateBrfcChildNodeParams,
  CreateNodeBaseRes,
  CreateNodeMetaFileRes,
  CreateNodeBrfcRes,
} from '@/@types/sdk'
import { ElMessage } from 'element-plus'
import { NftManager, FtManager, API_TARGET } from 'meta-contract'
import { useUserStore } from '@/stores/user'
import { GetTxChainInfo } from '@/api/metaid-base'
import AllNodeName from '../AllNodeName'

export enum MetaIdTag {
  mainnet = 'metaid',
  testnet = 'testmetaid',
}

export enum MetaNameOp {
  register = 1,
  renew = 2,
  updataInfo = 3,
}

export enum MetaNameReqType {
  register = 'register',
  renew = 'renew',
  updataInfo = 'updateinfo',
}

export enum MetaNameReqCode {
  register = 1,
  renew = 21,
  updataInfo = 22,
}

export interface Reqswapargs {
  requestIndex: number
  nftToAddress: string
  mvcToAddress: string
  txFee: number
  feePerYear: number
  op: number
  nftCodeHash: string
  nftGenesisID: string
  nftTokenIndex: string
}

export interface MetaNameRequestDate {
  mvcRawTx?: string
  requestIndex: string
  mvcOutputIndex?: number
  nftRawTx?: string
  nftOutputIndex?: number
  years?: number
  infos?: {
    metaid?: string
    mvc?: string
    icon?: string
    [key: string]: any
  }
}

export interface BaseUserInfoTypes {
  accessKey?: string
  userType: string
  name: string
  phone: string
  email: string
  password?: string
  pk2: string
  token?: string
  accessKey?: string
  enCryptedMnemonic?: string
  tag?: 'new' | 'old'
  referrerId?: string
  appToken: string
  ethAddress?: string
  evmAddress?: string
  path: number
}
interface TransferNftParams {
  network?: string
  feeb?: number
  codehash: string
  genesis: string
  sensibleId: string
  tokenIndex: string
  receiverAddress: string
  senderWif: string
  opreturnData?: string
  utxos?: any[]
  purseWif?: string
}
export interface PaytoTypes {
  address: string
  amount: number
}

export interface NftTransferResult {
  txid: string
  tx: mvc.Transaction
  txHex: string
}
export interface BaseUtxo {
  txId: string
  outputIndex: number
  satoshis: number
  amount: number
  address: string
  script: string
  addressType?: number
  addressIndex?: number
}
export interface MetasvUtxoTypes extends BaseUtxo {
  xpub: string
  txid: string
  txIndex: number
  value: number
  height?: number
  isSpend?: boolean
  isLocal?: boolean
  spentTxId?: string | null
  flag?: string | null
}
interface OutputTypes {
  script: mvc.Script
  satoshis: number
}

interface PickUtxosResultTypes {
  isEnoughBalance: boolean
  newPickedUtxos: MetasvUtxoTypes[]
}
interface KeyPathRelationType {
  keyPath: string
  parentKeyPath: string
}

interface KeyPathObjTypes {
  [key: string]: KeyPathRelationType
}

interface MakeTxResultTypes {
  tx: mvc.Transaction
  changeUtxo: MetasvUtxoTypes
}
interface MetaIdInfoTypes {
  metaId: string
  metaIdTag: string
  infoTxId: string
  protocolTxId: string
  name?: string
  phone?: string
  email?: string
  pubKey?: string
}

declare interface UtxoWithWif extends SA_utxo {
  wif: string
}

export interface CreateBrfcChildNodeRes {
  payTo: CreateNodeBaseRes | null
  metaFileBrfc: CreateNodeBrfcRes | null
  metaFiles: CreateNodeMetaFileRes[] | []
  currentNodeBrfc: CreateNodeBrfcRes | null
  currentNode: CreateNodeBaseRes | null
}

export interface NodeOptions {
  nodeName: string
  version?: string
  parentTxId?: string | null
  encrypt?: number | string
  metaIdTag?: string
  appId?: string[]
  data?: string | Buffer
  dataType?: string
  keyPath?: string
  parentAddress?: string
  encoding?: string
  limit?: number
  payCurrency?: string
  payTo?: SendToTypes[]
  payAllAddress?: string
  needConfirm?: boolean
  utxos?: UtxoTypes[] // 指定使用 UTXO 集
  ecdh?: ECDHOptions
  attachmentsUseMetaSv?: boolean
  uploadAddr?: boolean
  parentKeyPath?: string
  publicKey?: string
  serviceAddress?: string
  protocolType?: string
  attachmentsServiceRate?: string
  payAll?: boolean
  privateKeyPath?: string
  useFeeb?: number
  externalUtxos?: UtxoTypes[]
  onlyUseExternalUtxos?: boolean
}
export interface ProtocolOptions extends NodeOptions {
  path: string
  brfcId: string
  useFeeb?: number
  nodeKey?: string
  autoRename?: boolean
  useThird?: boolean
  attachments?: AttachmentItem[]
  externalUtxos?: UtxoItem[]
}

export const DEFAULTS = {
  feeb: 1,
  minAmount: 546,
}

export const hdWalletFromMnemonic = async (
  mnemonic: string,
  tag: 'new' | 'old' = 'new',
  network: Network = Network.mainnet,
  path?: string | number = import.meta.env.VITE_WALLET_PATH
): Promise<mvc.HDPrivateKey> => {
  // const hdPrivateKey = Mnemonic.fromString(mnemonic).toHDPrivateKey()
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const hdPrivateKey = mvc.HDPrivateKey.fromSeed(seed, network)

  const hdWallet = hdPrivateKey.deriveChild(`m/44'/${path}'/0'`)
  return hdWallet
}

export const hdWalletFromAccount = async (
  account: BaseUserInfoTypes,
  network: Network = Network.mainnet,
  path: string | number
): Promise<any> => {
  // console.log(account)
  const loginName = account.userType === 'phone' ? account.phone : account.email
  const password = account.password

  // console.log('account', account)
  if (!loginName || !password) {
    throw new Error('参数错误')
  }
  let mnemonic: string
  if (account.enCryptedMnemonic) {
    mnemonic = decryptMnemonic(account.enCryptedMnemonic, password)
  } else {
    // 根据用户名、密码和 pk2 生成助记词
    const ppBuffer = Buffer.from([loginName, password].join('/'))
    const ppHex = mvc.crypto.Hash.sha256(ppBuffer).toString('hex')
    let hex: string | Buffer
    if (account.tag === 'old') {
      hex = Buffer.from(ppHex + account.pk2)
      hex = mvc.crypto.Hash.sha256sha256(hex).toString('hex')
    } else {
      hex = Buffer.from((ppHex + account.pk2).toLowerCase(), 'hex').toString('hex')
      hex = Ripemd128(hex).toString()
    }
    mnemonic = bip39.entropyToMnemonic(hex, englishWords)
  }
  // const mnemonic = new Mnemonic(Buffer.from(hex)).toString()
  const wallet = await hdWalletFromMnemonic(mnemonic, account.tag, network, path)

  const root = wallet.deriveChild(0).deriveChild(0).privateKey
  console.log({
    mnemonic: mnemonic,
    wallet: wallet,
    rootAddress: root.toAddress(network).toString(),
    rootWif: root.toString(),
    network,
  })
  return {
    mnemonic: mnemonic,
    wallet: wallet,
    rootAddress: root.toAddress(network).toString(),
    rootWif: root.toString(),
    network,
  }
}

// 加密密码
export const encryptPassword = (password: string): string => {
  if (!password) return ''
  const md5Password = MD5(password).toString()
  const sha256Str = SHA256(md5Password).toString()
  return sha256Str.toUpperCase()
}

// AES 加密
export const aesEncrypt = (str: string, key: string): string => {
  // 密码长度不足 16/32 位用 0 补够位数
  key = key.length > 16 ? key.padEnd(32, '0') : key.padEnd(16, '0')
  const iv = '0000000000000000'
  const utf8Str = Utf8.parse(str)
  const utf8Key = Utf8.parse(key)
  const utf8Iv = Utf8.parse(iv)
  const cipherText = AES.encrypt(utf8Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  const bufferData = Buffer.from(cipherText.toString(), 'base64')
  const res = bufferData.toString('hex')
  return res
}

// AES 解密
export const aesDecrypt = (encryptedStr: string, key: string): string => {
  key = key.length > 16 ? key.padEnd(32, '0') : key.padEnd(16, '0')
  const iv = '0000000000000000'
  const utf8Key = Utf8.parse(key)
  const utf8Iv = Utf8.parse(iv)
  let bufferData
  try {
    bufferData = Buffer.from(encryptedStr.toString(), 'hex')
  } catch {
    return encryptedStr
  }
  const base64Str = bufferData.toString('base64')
  const bytes = AES.decrypt(base64Str, utf8Key, {
    iv: utf8Iv,
    mode: CBC,
    padding: Pkcs7,
  })
  return bytes.toString(Utf8)
}

// 加密助记词
export const encryptMnemonic = (mnemonic: string, password: string): string => {
  const mnemonicStr = mnemonic.split(' ').join(',')
  return aesEncrypt(mnemonicStr, password)
}

// 解密助记词
export const decryptMnemonic = (encryptedMnemonic: string, password: string): string => {
  const mnemonic = aesDecrypt(encryptedMnemonic, password)
  return mnemonic.split(',').join(' ')
}

export function eciesDecryptData(
  data: Buffer | string,
  privateKey: mvc.PrivateKey | string,
  publicKey?: string
): string {
  publicKey = publicKey || data.toString().substring(8, 74)
  let ecies = ECIES()
    .privateKey(privateKey)
    .publicKey(publicKey)
  if (!Buffer.isBuffer(data)) {
    data = Buffer.from(data, 'hex')
  }
  let res = ''
  try {
    res = ecies.decrypt(data).toString()
  } catch (error) {
    try {
      ecies = ECIES({ noKey: true })
        .privateKey(privateKey)
        .publicKey(publicKey)
      res = ecies.decrypt(data).toString()
    } catch (error) {
      throw new Error('error')
    }
  }
  return res
}

export const signature = (message: string, privateKey: string) => {
  const hash = mvc.crypto.Hash.sha256(Buffer.from(message))
  const sign = mvc.crypto.ECDSA.sign(hash, new mvc.PrivateKey(privateKey))

  return sign.toBuffer().toString('base64')
}

function reverceFtByteString(str) {
  str = str.substr(0, str.length - 8)
  let ret = ''
  for (let i = 0; i < str.length; i += 2) {
    ret = str[i] + str[i + 1] + ret
  }
  return ret
}

export const createMnemonic = (address: string) => {
  const ppBuffer = Buffer.from(address)
  const ppHex = mvc.crypto.Hash.sha256(ppBuffer).toString('hex')
  let hex
  let mnemonic
  hex = Buffer.from(ppHex.toLowerCase(), 'hex').toString('hex')
  hex = Ripemd128(hex).toString()
  mnemonic = bip39.entropyToMnemonic(hex, englishWords)
  return mnemonic
}

const metasvServiceSecret = 'KxSQqTxhonc5i8sVGGhP1cMBGh5cetVDMfZjQdFursveABTGVbZD'

const defaultSigners = [
  {
    satotxApiPrefix: 'https://s1.satoplay.cn,https://s1.satoplay.com',
    satotxPubKey:
      '2c8c0117aa5edba9a4539e783b6a1bdbc1ad88ad5b57f3d9c5cba55001c45e1fedb877ebc7d49d1cfa8aa938ccb303c3a37732eb0296fee4a6642b0ff1976817b603404f64c41ec098f8cd908caf64b4a3aada220ff61e252ef6d775079b69451367eda8fdb37bc55c8bfd69610e1f31b9d421ff44e3a0cfa7b11f334374827256a0b91ce80c45ffb798798e7bd6b110134e1a3c3fa89855a19829aab3922f55da92000495737e99e0094e6c4dbcc4e8d8de5459355c21ff055d039a202076e4ca263b745a885ef292eec0b5a5255e6ecc45534897d9572c3ebe97d36626c7b1e775159e00b17d03bc6d127260e13a252afd89bab72e8daf893075f18c1840cb394f18a9817913a9462c6ffc8951bee50a05f38da4c9090a4d6868cb8c955e5efb4f3be4e7cf0be1c399d78a6f6dd26a0af8492dca67843c6da9915bae571aa9f4696418ab1520dd50dd05f5c0c7a51d2843bd4d9b6b3b79910e98f3d98099fd86d71b2fac290e32bdacb31943a8384a7668c32a66be127b74390b4b0dec6455',
  },
  {
    satotxApiPrefix: 'https://cnsatotx.showpay.top',
    satotxPubKey:
      '5b94858991d384c61ffd97174e895fcd4f62e4fea618916dc095fe4c149bbdf1188c9b33bc15cbe963a63b2522e70b80a5b722ac0e6180407917403755df4de27d69cc115c683a99face8c823cbccf73c7f0d546f1300b9ee2e96aea85542527f33b649f1885caebe19cf75d9a645807f03565c65bd4c99c8f6bb000644cfb56969eac3e9331c254b08aa279ceb64c47ef66be3f071e28b3a5a21e48cdfc3335d8b52e80a09a104a791ace6a2c1b4da88c52f9cc28c54a324e126ec91a988c1fe4e21afc8a84d0e876e01502386f74e7fc24fc32aa249075dd222361aea119d4824db2a797d58886e93bdd60556e504bb190b76a451a4e7b0431973c0410e71e808d0962415503931bbde3dfce5186b371c5bf729861f239ef626b7217d071dfd62bac877a847f2ac2dca07597a0bb9dc1969bed40606c025c4ff7b53a4a6bd921642199c16ede8165ed28da161739fa8d33f9f483212759498c1219d246092d14c9ae63808f58f03c8ca746904ba51fa326d793cea80cda411c85d35894bdb5',
  },
  {
    satotxApiPrefix: 'https://satotx.volt.id',
    satotxPubKey:
      '3a62ce90c189ae322150cfc68cd00739cd681babf46a9b27793413ad780ea7c4ef22afd0042bc3711588587c2b8a953ced78496cb95579b1272b8979183ea3c66d204c8eeffebfa115c596c0c561f3569fe6d6e8e06d7e82192a24a84b739838ac846db8594a565679d617695f184eb85a3902a036eb8e82f95b83acc207f0deeac87291539865765899d97cfe41169c555480372195729269ae30b6c39324a6731d6f4e46da5ba1789c6e9bd14b16426d35fd4449eecd177e2834e87fb65d9d469176ffe0c12097fcc7e2393dbaa504631487a3ad725235b4d25fe3d09c2460f8a6c0bf4defc1ffe65d5fa28e85fae11eace2a66e48a0ae2ed6bcfb4bb94296717a4a5b1b3fa9b0fb3c165e517b9b69fa8aaca7fdc7351a0ac14d110258f442f423a780bebd87ac10173ca00ee4e9f56ced0510e7f53ed41411b91286f288438c361d2a15868d1c84d6a73510ef23eee9312ae2a7162c1fcd5438788236c0571ee822c326ebd123b8a6636e7b192db2911725a20da027bfaa79c33f58174285',
  },
  {
    satotxApiPrefix: 'https://satotx.metasv.com',
    satotxPubKey:
      '19d9193ee2e95d09445d28408e8a3da730b2d557cd8d39a7ae4ebbfbceb17ed5d745623529ad33d043511f3e205c1f92b6322833424d19823c3b611b3adabb74e1006e0e93a8f1e0b97ab801c6060a4c060f775998d9f003568ab4ea7633a0395eb761c36106e229394f2c271b8522a44a5ae759254f5d22927923ba85b3729460ecccca07a5556299aa7f2518814c74a2a4d48b48013d609002631f2d93c906d07077ef58d473e3d971362d1129c1ab9b8f9b1365519f0c023c1cadad5ab57240d19e256e08022fd0708951ff90a8af0655aff806c6382d0a72c13f1e52b88222d7dfc6357179b06ffcf937f9da3b0419908aa589a731e26bbaba2fa0b754bf722e338c5627b11dc24aadc4d83c35851c034936cf0df18167e856a5f0a7121d23cd48b3f8a420869a37bd1362905d7f76ff18a991f75a0f9d1bcfc18416d76691cc357cbdcc8cc0df9dbd9318a40e08adb2fb4e78b3c47bdf07eeed4f3f4e0f7e81e37460a09b857e0194c72ec03bb564b5b409d8a1b84c153186ecbb4cfdfd',
  },
  {
    satotxApiPrefix: 'https://satotx.tswap.io',
    satotxPubKey:
      'a36531727b324b34baef257d223b8ba97bac06d6b631cccb271101f20ef1de2523a0a3a5367d89d98ff354fe1a07bcfb00425ab252950ce10a90dc9040930cf86a3081f0c68ea05bfd40aab3e8bfaaaf6b5a1e7a2b202892dc9b1c0fe478210799759b31ee04e842106a58d901eb5bc538c1b58b7eb774a382e7ae0d6ed706bb0b12b9b891828da5266dd9f0b381b05ecbce99fcde628360d281800cf8ccf4630b2a0a1a25cf4d103199888984cf61edaa0dad578b80dbce25b3316985a8f846ada9bf9bdb8c930e2a43e69994a9b15ea33fe6ee29fa1a6f251f8d79a5de9f1f24152efddedc01b63e2f2468005ecce7da382a64d7936b22a7cac697e1b0a48419101a802d3be554a9b582a80e5c5d8b998e5eb9684c7aaf09ef286d3d990c71be6e3f3340fdaeb2dac70a0be928b6de6ef79f353c868def3385bccd36aa871eb7c8047d3f10b0a38135cdb3577eaafa512111a7af088e8f77821a27b195c95bf80da3c59fda5ff3dd1d40f60d61c099a608b58b6de4a76146cf7b89444c1055',
  },
]
export class HdWallet {
  public network = Network.mainnet
  public mnemonic: string = ''
  public wallet: mvc.HDPrivateKey
  public provider: ShowmoneyProvider
  private _utxos: MetasvUtxoTypes[] = []
  public _root: mvc.PrivateKey
  private protocols = []
  public keyPathMap: KeyPathObjTypes = {
    Root: {
      keyPath: '0/0',
      parentKeyPath: '0/0',
    },
    Info: {
      keyPath: '0/1',
      parentKeyPath: '0/0',
    },
    name: {
      keyPath: '0/2',
      parentKeyPath: '0/1',
    },
    email: {
      keyPath: '0/3',
      parentKeyPath: '0/1',
    },
    phone: {
      keyPath: '0/4',
      parentKeyPath: '0/1',
    },
    avatar: {
      keyPath: '0/5',
      parentKeyPath: '0/1',
    },
    bio: {
      keyPath: '0/6',
      parentKeyPath: '0/1',
    },
    Protocols: {
      keyPath: '0/2',
      parentKeyPath: '0/0',
    },
  }

  // 已使用的publickey 地址，避免重复使用
  private publishkeyList: {
    address: string
    index: number
    path: string
    publicKey: string
    isUsed: boolean
  }[] = []

  // 当查询是有某个节点时， 查询完存到这里， 反之重复调接口查询
  private userBrfcNodeList: UserProtocolBrfcNode[] = []

  constructor(
    wallet: mvc.HDPrivateKey,
    params?: {
      baseApi?: string
      mvcMetaSvApi?: string
      bsvMetaSvApi?: string
    }
  ) {
    // @ts-ignore
    this.network = wallet.network.alias ? wallet.network.alias : wallet.network.name
    this.wallet = wallet
    const root = wallet.deriveChild(0).deriveChild(0).privateKey
    this._root = root

    if (!params) {
      params = {}
    }
    this.provider = new ShowmoneyProvider({
      ...params,
      network: this.network,
    })
  }

  get rootAddress(): string {
    return this._root.toAddress(this.network).toString()
  }

  get protocolAddress(): string {
    return this.createAddress(this.keyPathMap.Protocols.keyPath).address
  }

  get infoAddress(): string {
    return this.createAddress(this.keyPathMap.Info.keyPath).address
  }

  static async createFromAccount(
    account: BaseUserInfoTypes,
    network: Network = Network.mainnet
  ): Promise<HdWallet> {
    try {
      // console.log(account)
      const walletObj = await hdWalletFromAccount(account, network)
      const hdWallet = new HdWallet(walletObj.mnemonic, walletObj.wallet)
      return hdWallet
    } catch (error) {
      throw new Error('生成钱包失败-' + error.message)
    }
  }

  public async getMetaIdInfo(rootAddress: string): Promise<MetaIdInfoTypes> {
    let metaIdInfo: MetaIdInfoTypes = {
      metaId: '',
      infoTxId: '',
      protocolTxId: '',
      name: '',
      phone: '',
      email: '',
    }
    const metaId = await this.provider.getMetaId(rootAddress).catch(error => {
      ElMessage.error(error.message)
    })
    if (metaId) {
      const info = await this.provider.getMetaIdInfo(metaId)
      metaIdInfo = {
        ...metaIdInfo,
        ...info,
      }
    }
    return metaIdInfo
  }

  //单独创建metaid

  public onlyCreateMetaidNode() {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const metaIdInfo: any = await this.getMetaIdInfo(this.rootAddress)
        metaIdInfo.pubKey = this._root.toPublicKey().toString()
        //  检查 metaidinfo 是否完整
        if (metaIdInfo.metaId && metaIdInfo.infoTxId && metaIdInfo.protocolTxId) {
          console.log('metaidinfo 完整')
          resolve(metaIdInfo)
        } else {
          let utxos: UtxoItem[] = []
          utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
          if (!metaIdInfo.metaId) {
            // TODO: 尝试获始资金
            if (!utxos.length) {
              const initUtxo = await this.provider.getInitAmount({
                address: this.rootAddress,
                xpub: this.wallet.xpubkey.toString(),
              })
              utxos = [initUtxo]
            }

            let outputs: any[] = []
            const rootTx = await this.createNode({
              nodeName: 'Root',
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: 'NULL',
              dataType: 'NULL',
              encoding: 'NULL',
              utxos: utxos,
              outputs: outputs,
            })
            metaIdInfo.metaId = rootTx.txId
            let errorMsg: any
            // 广播
            try {
              await this.provider.broadcast(rootTx.hex!)
            } catch (error) {
              errorMsg = error
            }
            if (errorMsg) {
              throw new Error(errorMsg.message)
            } else {
              resolve(metaIdInfo.metaId)
            }
          }
        }
      } catch (error) {}
    })
  }

  // 初始化 metaId
  public initMetaIdNode(account: BaseUserInfoTypes) {
    return new Promise<MetaIdInfoTypes>(async (resolve, reject) => {
      try {
        const metaIdInfo: any = await this.getMetaIdInfo(this.rootAddress)
        metaIdInfo.pubKey = this._root.toPublicKey().toString()
        //  检查 metaidinfo 是否完整
        if (metaIdInfo.metaId && metaIdInfo.infoTxId && metaIdInfo.protocolTxId) {
          console.log('metaidinfo 完整')
          resolve(metaIdInfo)
        } else {
          let utxos: UtxoItem[] = []
          const hexTxs = []
          const infoAddress = this.getPathPrivateKey(this.keyPathMap.Info.keyPath)
          utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
          // 初始化 metaId
          if (!metaIdInfo.metaId) {
            // TODO: 尝试获始资金
            if (!utxos.length) {
              const initUtxo = await this.provider.getInitAmount({
                address: this.rootAddress,
                xpub: this.wallet.xpubkey.toString(),
                token: account.token || account.accessKey || '',
                userName: account.userType === 'phone' ? account.phone : account.email,
              })
              utxos = [initUtxo]
            }

            let outputs = []
            if (account.referrerId) {
              outputs = [
                {
                  script: mvc.Script.buildSafeDataOut(['ref:' + account.referrerId]),
                  satoshis: 0,
                },
              ]
            }
            const root = await this.createNode({
              nodeName: 'Root',
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: 'NULL',
              dataType: 'NULL',
              encoding: 'NULL',
              utxos: utxos,
              outputs: outputs,
            })
            hexTxs.push(root.transaction.toString())
            metaIdInfo.metaId = root.txId
            const newUtxo = await this.utxoFromTx({
              tx: root.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 0,
              },
            })
            if (newUtxo) {
              utxos = [newUtxo]
            }
          }

          // 初始化 metaId
          if (!metaIdInfo.protocolTxId) {
            const protocol = await this.createNode({
              nodeName: 'Protocols',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
            })
            hexTxs.push(protocol.transaction.toString())
            metaIdInfo.protocolTxId = protocol.txId
            const newUtxo = await this.utxoFromTx({
              tx: protocol.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 0,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 infoTxId
          if (!metaIdInfo.infoTxId) {
            const info = await this.createNode({
              nodeName: 'Info',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
              change: infoAddress.publicKey.toAddress(this.network).toString(),
            })
            hexTxs.push(info.transaction.toString())
            metaIdInfo.infoTxId = info.txId
            const newUtxo = await this.utxoFromTx({
              tx: info.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 1,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 name
          if (!metaIdInfo.name) {
            const name = await this.createNode({
              nodeName: 'name',
              parentTxId: metaIdInfo.infoTxId,
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: account.name,
              utxos: utxos,
              change: infoAddress.publicKey.toAddress(this.network).toString(),
            })
            hexTxs.push(name.transaction.toString())
            metaIdInfo.name = account.name
            const newUtxo = await this.utxoFromTx({
              tx: name.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 1,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 loginName
          if (!metaIdInfo[account.userType]) {
            const loginName = account.userType === 'phone' ? account.phone : account.email
            // const keyPath =
            //   account.userType === 'phone'
            //     ? this.keyPathMap.phone.keyPath
            //     : this.keyPathMap.email.keyPath
            // const address = this.getPathPrivateKey(keyPath)

            const loginNameTx = await this.createNode({
              nodeName: account.userType,
              parentTxId: metaIdInfo.infoTxId,
              metaIdTag: import.meta.env.VITE_METAID_TAG,
              data: loginName,
              encrypt: 1,
              utxos: utxos,
              change: infoAddress.publicKey.toAddress(this.network).toString(),
            })
            hexTxs.push(loginNameTx.transaction.toString())
            metaIdInfo[account.userType] = loginName
            const newUtxo = await this.utxoFromTx({
              tx: loginNameTx.transaction,
              addressInfo: {
                addressType: 0,
                addressIndex: 1,
              },
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // eth 绑定新 metaId 账号

          if (account.ethAddress) {
            // 先把钱打回到 infoAddress
            const transfer = await this.makeTx({
              utxos: utxos,
              opReturn: [],
              change: this.rootAddress,
              payTo: [
                {
                  amount: 1000,
                  address: infoAddress.publicKey.toAddress(this.network).toString(),
                },
              ],
            })

            if (transfer) {
              hexTxs.push(transfer.toString())
              const newUtxo = await this.utxoFromTx({
                tx: transfer,
                addressInfo: {
                  addressType: 0,
                  addressIndex: 1,
                },
                outPutIndex: 0,
              })
              if (newUtxo) utxos = [newUtxo]

              // 创建 eth brfc节点 brfcId = ehtAddress
              const privateKey = this.getPathPrivateKey('0/6')
              const node: NewNodeBaseInfo = {
                address: privateKey.toAddress().toString(),
                publicKey: privateKey.toPublicKey().toString(),
                path: '0/6',
              }
              const ethBindBrfc = await this.createNode({
                nodeName: NodeName.ETHBinding,
                parentTxId: metaIdInfo.infoTxId,
                metaIdTag: import.meta.env.VITE_METAID_TAG,
                data: JSON.stringify({ evmAddress: account.ethAddress! }),
                utxos: utxos,
                change: this.rootAddress,
                node,
              })
              if (ethBindBrfc) {
                hexTxs.push(ethBindBrfc.transaction.toString())
              }
            }
          }

          let errorMsg: any
          // 广播
          for (let i = 0; i < hexTxs.length; i++) {
            try {
              const tx = hexTxs[i]
              await this.provider.broadcast(tx)
            } catch (error) {
              errorMsg = error
            }
            if (errorMsg) {
              break
            }
          }

          if (errorMsg) {
            throw new Error(errorMsg.message)
          } else {
            resolve(metaIdInfo)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private reverceFtByteString(str) {
    str = str.substr(0, str.length - 8)
    let ret = ''
    for (let i = 0; i < str.length; i += 2) {
      ret = str[i] + str[i + 1] + ret
    }
    return ret
  }

  public transferNft(
    params: {
      receiverAddress: string
      codehash: string
      genesis: string
      tokenIndex: string
      utxos?: any[]
    },
    option?: {
      isBroadcast: boolean
    }
  ) {
    return new Promise<{
      txHex: string
      txid: string
      tx: mvc.Transaction
    }>(async (resolve, reject) => {
      const initOption = {
        isBroadcast: true,
      }
      option = {
        ...initOption,
        ...option,
      }
      const nftManager = await this.getNftManager()
      let transferParams: any = {
        codehash: params.codehash,
        genesis: params.genesis,
        receiverAddress: params.receiverAddress,
        senderWif: this.wallet!.deriveChild(0)
          .deriveChild(0)
          .privateKey.toString(),
        tokenIndex: params.tokenIndex,
        noBroadcast: !option!.isBroadcast,
      }
      if (params.utxos?.length) {
        transferParams = { ...transferParams, utxos: params.utxos }
      }
      const result = await nftManager.transfer(transferParams)
      resolve(result)
    })

    // const genesisTxid = this.reverceFtByteString(payload.sensibleId)
    // const signersRes = await this.provider.getNftGenesisInfo(genesisTxid)
    // const signersRaw = signersRes.signers
    // const { signers, signerSelecteds } = await SensibleNFT.selectSigners(signersRaw)
    // const nft = new SensibleNFT({
    //   network: API_NET.MAIN,
    //   apiTarget: API_TARGET.METASV,
    //   feeb: 0.1,
    //   signers,
    //   signerSelecteds,
    // })
    // nft.sensibleApi.authorize({
    //   privateKey: metasvServiceSecret,
    // })
    // const utxoRes = await this.provider.getUtxos(this.wallet.xpubkey.toString())
    // const utxos = utxoRes.map(item => {
    //   item.wif = this.getPathPrivateKey(`${item.addressType}/${item.addressIndex}`).toString()
    //   return item
    // })
    // console.log('params: ', {
    //   senderWif: this._root.toString(),
    //   receiverAddress: payload.receiverAddress,
    //   codehash: payload.codehash,
    //   genesis: payload.genesis,
    //   tokenIndex: payload.tokenIndex,
    //   utxos: utxos,
    // })
    // const res = await nft.transfer({
    //   senderWif: this._root.toString(),
    //   receiverAddress: payload.receiverAddress,
    //   codehash: payload.codehash,
    //   genesis: payload.genesis,
    //   tokenIndex: payload.tokenIndex,
    //   utxos: utxos,
    //   opreturnData: '',
    //   noBroadcast: true,
    // })

    // let result
    // if (isBroadcast) {
    //   result = await this.provider.broadcast(res.txHex)
    // }
    // if ((isBroadcast && result) || !isBroadcast) {
    //   return {
    //     txId: res.txid,
    //     ...res,
    //   }
    // }
  }

  public sigMessage(msg: string, path = '0/0') {
    const privateKey = this.getPathPrivateKey(path)
    const message = new Message(msg)
    return message.sign(privateKey)
  }

  // 根据 path 生成 privateKey
  public getPathPrivateKey(keyPath: string) {
    const privateKey = this.wallet
      .deriveChild(+keyPath.split('/')[0])
      .deriveChild(+keyPath.split('/')[1]).privateKey
    return privateKey
  }

  public async createNode({
    nodeName,
    payTo = [],
    utxos = [],
    change,
    metaIdTag = import.meta.env.VITE_METAID_TAG,
    parentTxId = 'NULL',
    data = 'NULL',
    encrypt = IsEncrypt.No,
    version = '1.0.1',
    dataType = 'text/plain',
    encoding = 'UTF-8',
    outputs = [],
    node,
    chain = HdWalletChain.MVC,
  }: CreateNodeOptions) {
    return new Promise<CreateNodeBaseRes>(async (resolve, reject) => {
      try {
        if (!nodeName) {
          throw new Error('Parameter Error: NodeName can not empty')
        }
        let privateKey = this.getPathPrivateKey('0/0')
        // TODO: 自定义节点支持
        if (this.keyPathMap[nodeName]) {
          const nodeInfo = this.keyPathMap[nodeName]
          node = {
            path: nodeInfo.keyPath,
            publicKey: this.createAddress(nodeInfo.keyPath).publicKey,
            address: this.createAddress(nodeInfo.keyPath).address,
          }
        } else {
          if (encoding === encoding) {
            // 文件
            if (!node) {
              // @ts-ignore
              const _privateKey = new mvc.PrivateKey(undefined, this.network)
              const _publickey = _privateKey.toPublicKey().toString()
              const _address = _privateKey.toAddress().toString()
              node = {
                address: _address,
                publicKey: _publickey,
                path: `-1/-1`,
              }
            }
          } else {
            if (!node) {
              throw new Error('Parameter Error: node can not empty')
            }
          }
        }
        // 数据加密
        if (+encrypt === 1) {
          data = this.eciesEncryptData(data, privateKey, privateKey.publicKey).toString('hex')
        } else {
          if (encoding.toLowerCase() === 'binary') {
            data = Buffer.from(data.toString('hex'), 'hex')
          }
        }

        const chainInfoRes = await GetTxChainInfo(parentTxId)
        const chain =
          chainInfoRes.code === 0 && chainInfoRes.data.chainFlag
            ? chainInfoRes.data.chainFlag
            : Chains.MVC

        const scriptPlayload = [
          'mvc',
          node.publicKey.toString(),
          `${chain}:${parentTxId}`,
          metaIdTag.toLowerCase(),
          nodeName,
          data,
          encrypt.toString(),
          version,
          dataType,
          encoding,
        ]
        const makeTxOptions = {
          from: [],
          utxos: utxos,
          opReturn: scriptPlayload,
          change: change,
          outputs,
          payTo,
          chain,
        }

        // TODO: 父节点 utxo 管理
        // if (parentTxId !== 'NULL' && !parentAddress) {
        //   console.log('get parent utxos')
        // } else {
        //   throw new Error("Cant't get parent address")
        // }
        const nodeTx = await this.makeTx(makeTxOptions)

        if (nodeTx) {
          resolve({
            hex: nodeTx.toString(),
            transaction: nodeTx,
            txId: nodeTx.id,
            address: node.address,
            addressType: parseInt(node.path.split('/')[0]),
            addressIndex: parseInt(node.path.split('/')[1]),
            scriptPlayload: scriptPlayload,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  public createAddress(
    keyPath: string
  ): {
    address: string
    publicKey: string
  } {
    const privateKey = this.getPathPrivateKey(keyPath)
    const address = privateKey.toAddress(this.network).toString()
    return {
      address: address,
      publicKey: privateKey.toPublicKey(),
    }
  }

  public async makeTx({
    payTo = [],
    outputs = [],
    change = this.rootAddress,
    opReturn,
    utxos,
    useFeeb = DEFAULTS.feeb,
    chain = HdWalletChain.MVC,
  }: TransferTypes): Promise<mvc.Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const { tx } = await this.makeTxNotUtxos({
          payTo,
          outputs,
          opReturn,
          useFeeb,
          utxos,
          chain,
        })
        tx.change(change)
        // @ts-ignore
        tx.getNeedFee = function() {
          // @ts-ignore
          const amount = Math.ceil(
            // @ts-ignore
            (30 + this._estimateSize() + 182) * useFeeb
          )
          // @ts-ignore
          const offerFed = Math.ceil(amount * useFeeb)
          // if (amount < minAmount) amount = minAmount
          const total =
            offerFed + amount < mvc.Transaction.DUST_AMOUNT
              ? mvc.Transaction.DUST_AMOUNT + 30
              : offerFed + amount

          return total
        }
        // @ts-ignore
        tx.isNeedChange = function() {
          return (
            // @ts-ignore
            ((this._getUnspentValue() - this.getNeedFee()) as number) >= mvc.Transaction.DUST_AMOUNT
          )
        }
        // @ts-ignore
        tx.getChangeAmount = function() {
          // @ts-ignore
          return (this._getUnspentValue() - this.getNeedFee()) as number
        }

        if (utxos) {
          tx.from(utxos)
        }

        tx.fee(Math.ceil(tx._estimateSize() * useFeeb))
        const privateKeys = this.getUtxosPrivateKeys(utxos)
        tx.sign(privateKeys)
        resolve(tx)
      } catch (error) {
        reject(error)
      }
    })
  }

  public async makeTxNotUtxos({
    payTo = [],
    outputs = [],
    utxos = [],
    opReturn,
    useFeeb = DEFAULTS.feeb,
    chain = HdWalletChain.MVC,
  }: TransferTypes) {
    if (!this.wallet) {
      throw new Error('Wallet uninitialized! (core-makeTx)')
    }
    const tx = new mvc.Transaction()
    // 更改 Transaction 为 Bsv  Transaction
    if (chain === HdWalletChain.BSV) tx.version = WalletTxVersion.BSV
    // 添加 payto
    if (Array.isArray(payTo) && payTo.length) {
      payTo.forEach(item => {
        if (!this.isValidOutput(item)) {
          throw new Error('Output format error.')
        }
        tx.to(item.address, item.amount)
      })
    }

    // 添加 opReturn 内容
    if (opReturn) {
      tx.addOutput(
        new mvc.Transaction.Output({
          script: mvc.Script.buildSafeDataOut(opReturn),
          satoshis: 0,
        })
      )
    }

    if (Array.isArray(outputs) && outputs.length) {
      outputs.forEach(output => {
        tx.addOutput(new mvc.Transaction.Output(output))
      })
    }

    if (utxos.length > 0) {
      tx.from(utxos)
    }

    return {
      tx,
    }
  }

  public async getOneUtxoFee(params?: { useFeeb?: number; utxo?: UtxoItem }) {
    return new Promise<number>(resolve => {
      if (!params) params = {}
      if (!params?.useFeeb) params.useFeeb = DEFAULTS.feeb
      const tx = new mvc.Transaction()
      tx.change(this.rootAddress)
      // @ts-ignore
      tx.from(params.utxo)
      // @ts-ignore
      const privateKeys = this.getUtxosPrivateKeys([params.utxo])
      tx.sign(privateKeys)
      // @ts-ignore
      const amount = Math.ceil(tx._estimateSize() * params!.useFeeb!)
      resolve(amount)
    })
  }

  utxoFromTx(params: {
    tx: mvc.Transaction
    addressInfo?: {
      addressType: number
      addressIndex: number
    }
    outPutIndex?: number
    chain?: HdWalletChain
  }) {
    return new Promise<UtxoItem>(async (resolve, reject) => {
      try {
        // 默认  outPutIndex = changeIndex
        if (typeof params?.outPutIndex === 'undefined') {
          if (params.tx._changeIndex) {
            params.outPutIndex = params.tx._changeIndex
          } else {
            params.outPutIndex = params.tx.outputs.length - 1
          }
        }
        const OutPut = params.tx.outputs[params.outPutIndex]
        if (!params.chain) params.chain = HdWalletChain.MVC
        if (!params.addressInfo) {
          const addressInfo = await this.provider.getPathWithNetWork({
            address: OutPut.script.toAddress(this.network).toString(),
            xpub: this.wallet.xpubkey.toString(),
            chain: params.chain,
          })
          if (addressInfo) {
            params.addressInfo = {
              addressType: addressInfo.addressType,
              addressIndex: addressInfo.addressIndex,
            }
          }
        }

        // 把Utxo 标记为已使用， 防止被其他地方用了
        this.provider.isUsedUtxos.push({
          txId: params.tx.id,
          address: OutPut.script.toAddress(this.network).toString(),
        })
        resolve({
          address: OutPut.script.toAddress(this.network).toString(),
          satoshis: OutPut.satoshis,
          value: OutPut.satoshis,
          amount: OutPut.satoshis * 1e-8,
          script: OutPut.script.toHex(),
          outputIndex: params.outPutIndex!,
          txIndex: params.outPutIndex!,
          txId: params.tx.id,
          addressType: params!.addressInfo?.addressType!,
          addressIndex: params!.addressInfo?.addressIndex!,
          xpub: this.wallet.xpubkey.toString(),
          wif: this.getPathPrivateKey(
            `${params!.addressInfo?.addressType!}/${params!.addressInfo?.addressIndex!}`
          )!.toString(),
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  // 验证交易输出 TODO：地址只验证长度，后续要做合法性验证
  private isValidOutput(output: OutputTypes): boolean {
    return (
      isNaturalNumber(output.amount) &&
      +output.amount >= DEFAULTS.minAmount &&
      isBtcAddress(output.address)
    )
  }

  /**
   * 选取足够金额的 utxos
   * @param tx
   * @param utxos 指定来源 utxo 集
   * @param amount 金额
   * @returns
   */
  public pickUtxosByAmount(
    pickedUtxos: MetasvUtxoTypes[],
    utxos: MetasvUtxoTypes[],
    amount: number
  ): PickUtxosResultTypes {
    let balance = 0
    let unUsedInputs: MetasvUtxoTypes[] = []
    // console.log('amount', amount)

    for (const utxo of utxos) {
      let isPicked = false
      // 排除已经选择的 utxos
      for (const pickedItem of pickedUtxos) {
        if (utxo.txId === pickedItem.txId && utxo.outputIndex === pickedItem.outputIndex) {
          isPicked = true
          break
        }
      }
      if (!isPicked && !utxo.isSpend) {
        unUsedInputs = [...unUsedInputs, utxo]
      }
    }

    // utxos = unUsedInputs

    let isEnoughBalance = false
    const newPickedUtxos: MetasvUtxoTypes[] = []
    for (const utxo of unUsedInputs) {
      balance += Number(utxo.value)
      newPickedUtxos.push(utxo)
      // 检查是否已经足够，加 200 浮动
      if (balance > amount + DEFAULTS.minAmount + 200) {
        isEnoughBalance = true
        break
      }
    }
    return {
      isEnoughBalance: isEnoughBalance,
      newPickedUtxos: newPickedUtxos,
    }
  }

  public getUtxosPrivateKeys(utxos: UtxoItem[]): mvc.PrivateKey[] {
    return utxos.map(u => {
      return this.wallet.deriveChild(u.addressType || 0).deriveChild(u.addressIndex || 0).privateKey
    })
  }

  /**
   * ECIES 加密
   */
  public eciesEncryptData(
    data: string | Buffer,
    privateKey?: mvc.PrivateKey,
    publicKey?: mvc.PublicKey
  ): Buffer {
    privateKey = privateKey || this.getPathPrivateKey('0/0')
    publicKey = publicKey || this.getPathPrivateKey('0/0').toPublicKey()
    const ecies = ECIES()
      .privateKey(privateKey)
      .publicKey(publicKey)
    return ecies.encrypt(data)
  }

  /**
   * ECIES 解密
   */
  public eciesDecryptData(
    data: Buffer | string,
    privateKey?: mvc.PrivateKey | string,
    publicKey?: string
  ): string {
    privateKey = privateKey || this.getPathPrivateKey('0/0')
    publicKey = publicKey || data.toString().substring(8, 74)
    let ecies = ECIES()
      .privateKey(privateKey)
      .publicKey(publicKey)
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data, 'hex')
    }
    let res = ''
    try {
      res = ecies.decrypt(data).toString()
    } catch (error) {
      try {
        ecies = ECIES({ noKey: true })
          .privateKey(privateKey)
          .publicKey(publicKey)
        res = ecies.decrypt(data).toString()
      } catch (error) {
        throw new Error('error')
      }
    }
    return res
  }

  // 拆UTXO逻辑
  public devideUtxo(
    devides: { amount: number; address: string }[],
    utxos?: UtxoItem[],
    isBroadcast = true
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!utxos) {
          utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
        }
        let balance = 0 // utxo 余额
        let useAmount = 50 * (devides.length - 1) // 需要花费 ： 初始转账费用50 * （n-1）
        for (const item of devides) {
          useAmount += item.amount
        }
        for (const item of utxos) {
          balance += item.value
        }
        if (balance < useAmount) {
          throw new Error('拆分失败，余额不足')
        }
        // 开始拆分
        const tx = await this.sendMoney({
          payTo: devides,
          utxos: utxos,
          isBroadcast,
        })
        if (tx) {
          resolve(tx)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 批量转NFT
  /**
   *
   * @param nftList
   * {
      receiverAddress: string
      codehash: string
      genesis: string
      tokenIndex: string
      sensibleId: string
      gensisiTxid:string
    }
   * @returns
   */
  public async batchTransferNft(NftList: any[], receiverAddress: string, noBroadcast = false) {
    return new Promise<PromiseSettledResult<NftTransferResult>[]>(async (resolve, reject) => {
      try {
        const utxos = await this.getUsefulUtxos(NftList.length)
        const transferTasks: Promise<NftTransferResult>[] = []
        for (let i = 0; i < NftList.length; i++) {
          const transferTask = this.createTransferTask(
            NftList[i],
            utxos[i],
            receiverAddress,
            noBroadcast
          )

          transferTasks.push(transferTask)
        }
        const transferResult = await Promise.allSettled(transferTasks)

        resolve(transferResult)
      } catch (error) {
        reject(error)
      }
    })
  }

  private async createTransferTask(
    nft: any,
    utxo: UtxoWithWif,
    receiverAddress: string,
    noBroadcast = false
  ): Promise<NftTransferResult> {
    const nftManager = await this.getSensibleNftManager()

    return await nftManager.transfer({
      senderWif: this._root.toString(),
      receiverAddress,
      codehash: nft.codehash,
      genesis: nft.genesis,
      tokenIndex: String(nft.tokenIndex),
      utxos: [utxo],
      noBroadcast,
    })
  }

  // 获取1000聪以上的UTXO，如果数量不足则进行拆分重组
  public getUsefulUtxos = async (neededUtxosCount = 1): Promise<UtxoWithWif[]> => {
    const wallet = this.getSensibleWallet()

    const usefulThreshold = 1000 // 1千聪以上足够transfer花费
    // 先查询账号中有多少有效的utxo
    const allUtxos = await wallet.blockChainApi.getUnspents(this.rootAddress)
    const usefulUtxos = allUtxos.filter(utxo => utxo.satoshis >= usefulThreshold)

    // 如果数量大于需要tranfer的nft的数量，则返回现有的utxo
    if (usefulUtxos.length >= neededUtxosCount) {
      return this.addWifToUtxos(usefulUtxos)
    }

    // UPDATE: 如果数量不足，将多地址的utxo合并到根地址
    try {
      await this.gatherAllUtxos()
    } catch (e) {
      console.log(e)
    }

    // 如果数量不足，则执行拆分操作
    const balance = await wallet.blockChainApi
      .getBalance(this.rootAddress)
      .then(res => res.balance + res.pendingBalance)

    if (balance < usefulThreshold * neededUtxosCount) {
      throw new Error('Space余额不足，不能进行NFT传输')
    }

    // 开始拆分
    const satsPerUtxo = Math.floor((balance / neededUtxosCount) * 0.9) // 留点剩余金额，不取那么极限

    const receivers = []
    for (let i = 0; i < neededUtxosCount; i++) {
      receivers.push({
        address: this.rootAddress,
        amount: satsPerUtxo,
      })
    }
    await wallet.sendArray(receivers)

    const divided = await wallet.blockChainApi.getUnspents(this.rootAddress)
    return this.addWifToUtxos(divided)

    // TODO: 其他拆分策略
  }

  private addWifToUtxos = (utxos: SA_utxo[]): UtxoWithWif[] => {
    const wif = this._root.toString()
    return utxos.map(utxo => {
      const u = utxo as UtxoWithWif
      u.wif = wif

      return u
    })
  }

  private getSensibleWallet = (): Wallet => {
    const wallet = new Wallet(this._root.toString(), API_NET.MAIN, 0.05, API_TARGET.METASV)
    wallet.blockChainApi.authorize({
      privateKey: metasvServiceSecret,
    })

    return wallet
  }

  public getNftManager = (): NftManager => {
    const nftManager = new NftManager({
      apiTarget: API_TARGET.MVC,
      apiHost: process.env.VITE_META_SV_API,
      // @ts-ignore
      network: this.network,
      purse: this.wallet!.deriveChild(0)
        .deriveChild(0)
        .privateKey.toString(),
      feeb: DEFAULTS.feeb,
      apiHost: import.meta.env.VITE_META_SV_API,
    })
    return nftManager
  }

  private async gatherAllUtxos() {
    const utxosFromAll = await this.getAllAddressUtxos()
    if (
      utxosFromAll.length === 0 ||
      (utxosFromAll.length === 1 && utxosFromAll[0].address === this.rootAddress)
    ) {
      return
    }

    const tx = new mvc.Transaction()
    const fee = Math.ceil((utxosFromAll.length * 148 + 34 + 10) * 0.5)
    const totalAmount = utxosFromAll.reduce((acc: number, utxo: any) => acc + utxo.value, 0)
    tx.addOutput(
      new mvc.Transaction.Output({
        satoshis: totalAmount - fee,
        script: mvc.Script.fromAddress(this.rootAddress),
      })
    )

    const utxos = utxosFromAll.map((utxo: any) => {
      return {
        txId: utxo.txid,
        outputIndex: utxo.txIndex,
        satoshis: utxo.value,
        script: mvc.Script.buildPublicKeyHashOut(utxo.address).toHex(),
      }
    })
    const privateKeys = utxosFromAll.map((utxo: any) => {
      return mvc.HDPrivateKey.fromString(this.wallet.xprivkey.toString())
        .deriveChild(utxo.addressType)
        .deriveChild(utxo.addressIndex).privateKey
    })

    tx.from(utxos)
    tx.fee(fee)
    tx.sign(privateKeys)

    const result = await this.broadcast(tx.serialize())

    return result.txid
  }

  private async getAllAddressUtxos() {
    const xPublicKey = this.wallet.xpubkey.toString()

    return await fetch(`https://apiv2.metasv.com/xpubLite/${xPublicKey}/utxo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlcm5hbF90ZXN0X3Nob3dwYXkiLCJpc3MiOiJNZXRhU1YiLCJleHAiOjE2NTM4OTc0MTB9.genUip-PcA3tdQtOMKZUzwuc7XxC3zF7Vy5wdYAfKsM',
      },
    }).then(response => {
      return response.json()
    })
  }

  private async broadcast(hex: string) {
    const response = await fetch('https://apiv2.metasv.com/tx/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlcm5hbF90ZXN0X3Nob3dwYXkiLCJpc3MiOiJNZXRhU1YiLCJleHAiOjE2NTM4OTc0MTB9.genUip-PcA3tdQtOMKZUzwuc7XxC3zF7Vy5wdYAfKsM',
      },
      body: JSON.stringify({ hex }),
    }).then(async response => JSON.parse(await response.text()))

    return response
  }

  async getProtocolInfo(
    nodeName: NodeName,
    protocolsTxId: string,
    brfcId: string,
    chain = HdWalletChain.MVC
  ) {
    return new Promise<ProtocolBrfcNode | null>(async (resolve, reject) => {
      try {
        let brfcNode = this.userBrfcNodeList.find(
          item => item.nodeName == nodeName && item.brfcId === brfcId
        )
        if (brfcNode) {
          resolve(brfcNode)
        } else {
          const protocols: any = await this.getProtocols({
            protocolsTxId: protocolsTxId,
            protocolType: nodeName,
          })

          const protocol = protocols.filter((item: any) => {
            return item?.nodeName === nodeName && item?.data === brfcId
          })[0]
          if (protocol) {
            const protocolInfo = await this.provider.getXpubLiteAddressInfo(
              this.wallet.xpubkey.toString(),
              protocol.address,
              chain
            )
            if (protocolInfo) {
              if (protocolInfo.addressIndex <= 150) {
                this.userBrfcNodeList.push({
                  ...protocol,
                  ...protocolInfo,
                  nodeName,
                  brfcId,
                })
                resolve({
                  ...protocol,
                  ...protocolInfo,
                })
              } else {
                throw new Error('path>150 异常，请联系客服处理')
              }
            }
          } else {
            resolve(null)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 获取协议类型数据
  private async getProtocols({ protocolsTxId, protocolType }: GetProtocolsTypes) {
    return new Promise((resolve, reject) => {
      fetch(import.meta.env.VITE_BASEAPI + '/serviceapi/api/v1/protocol/getProtocolDataList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: JSON.stringify({
            protocolTxId: protocolsTxId,
            nodeName: protocolType,
          }),
        }),
      })
        .then((response: Response) => {
          return response.json()
        })
        .then(json => {
          if (json && json.code === 200 && json.result.data) {
            resolve(json.result.data)
          } else {
            resolve([])
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  // 创建协议节点
  public createBrfcNode(
    params: CreateBrfcNodePrams,
    option?: {
      isBroadcast?: boolean
      chain?: HdWalletChain
    }
  ) {
    return new Promise<CreateNodeBrfcRes>(async (resolve, reject) => {
      try {
        const initParams = {
          useFeeb: DEFAULTS.feeb,
          payTo: [],
          utxos: [],
        }
        const initOption = {
          isBroadcast: true,
          chain: HdWalletChain.MVC,
        }
        params = {
          ...initParams,
          ...params,
        }
        option = {
          ...initOption,
          ...option,
        }
        if (!params.useFeeb) params.useFeeb = DEFAULTS.feeb
        if (!params.payTo) params.payTo = []

        const nodeName = AllNodeName[params.nodeName]

        let protocol = await this.getProtocolInfo(
          params.nodeName,
          params.parentTxId,
          nodeName.brfcId,
          option!.chain!
        )

        //  处理根节点
        if (protocol) {
          resolve({
            address: protocol.address,
            txId: protocol.txId,
            addressType: protocol.addressType,
            addressIndex: protocol.addressIndex,
          })
          // 已存在根节点
        } else {
          // 不存在根节点
          const newBrfcNodeBaseInfo = await this.provider.getNewBrfcNodeBaseInfo(
            this.wallet.xpubkey.toString(),
            params.parentTxId
          )

          const protocolRoot = await this.createNode({
            ...params,
            metaIdTag: import.meta.env.VITE_METAID_TAG,
            data: nodeName.brfcId,
            utxos: params.utxos,
            node: newBrfcNodeBaseInfo,
            chain: option!.chain!,
          })
          if (protocolRoot) {
            if (option.isBroadcast) {
              await this.provider.broadcast(protocolRoot.transaction.toString(), option!.chain)
            }

            resolve({
              address: protocolRoot.address,
              txId: protocolRoot.txId,
              addressType: parseInt(newBrfcNodeBaseInfo.path!.split('/')[0]),
              addressIndex: parseInt(newBrfcNodeBaseInfo.path!.split('/')[1]),
              transaction: protocolRoot.transaction,
            })
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  public async createBrfcChildNode(
    params: HdWalletCreateBrfcChildNodeParams,
    option?: {
      isBroadcast: boolean // 是否广播
      chain?: HdWalletChain
    }
  ): Promise<CreateNodeBrfcRes> {
    return new Promise<CreateNodeBrfcRes>(async (resolve, reject) => {
      const initParams = {
        autoRename: true,
        version: '0.0.9',
        data: 'NULL',
        dataType: 'application/json',
        encoding: 'UTF-8',
        payCurrency: 'Space',
        payTo: [],
        attachments: [],
        utxos: [],
        useFeeb: DEFAULTS.feeb,
      }
      const initOption = {
        isBroadcast: true,
        chain: HdWalletChain.MVC,
      }
      params = {
        ...initParams,
        ...params,
      }
      option = {
        ...initOption,
        ...option,
      }
      try {
        // 是否指定地址
        let address
        let publickey
        const addressType = -1 // 叶子节点都用 -1
        const addressIndex = -1 // 叶子节点都用 -1
        if (params.publickey) {
          publickey = params.publickey
          address = mvc.PublicKey.fromHex(params.publickey)
            .toAddress(this.network)
            .toString()
        } else {
          // 随机生生产 私钥
          // @ts-ignore
          const privateKey = new mvc.PrivateKey(undefined, this.network)
          publickey = privateKey.toPublicKey().toString()
          address = privateKey.toAddress().toString()
        }
        const node: NewNodeBaseInfo = {
          address,
          publicKey: publickey,
          path: `${addressType}/${addressIndex}`,
        }

        if (params.ecdh) {
          // 付费Buzz 待完善
          // if (params.data !== 'NULL' && typeof params.data === 'string') {
          //   let r: any
          //   r = JSON.parse(params.data)
          //   r[params.ecdh.type] = this.ecdhEncryptData(
          //     r[params.ecdh.type],
          //     params.ecdh.publickey,
          //     keyPath.join('/')
          //   )
          //   params.data = JSON.stringify(r)
          // }
        }
        const res = await this.createNode({
          nodeName: params.autoRename
            ? [params.nodeName, publickey.toString().slice(0, 11)].join('-')
            : params.nodeName,
          metaIdTag: import.meta.env.VITE_METAID_TAG,
          parentTxId: params.brfcTxId,
          encrypt: params.encrypt,
          data: params.data,
          payTo: params.payTo,
          dataType: params.dataType,
          version: params.version,
          encoding: params.encoding,
          utxos: params.utxos,
          node,
          chain: option.chain,
        })
        if (res) {
          if (option.isBroadcast) {
            const response = await this.provider.broadcast(res.transaction!.toString())
            if (response?.txid) {
              resolve(res)
            }
          } else {
            resolve(res)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * sendMoney
   */
  public async sendMoney(params: {
    payTo: PayToItem[]
    isBroadcast?: boolean
    opReturn?: string[]
    utxos?: UtxoItem[]
    chain?: HdWalletChain
  }) {
    return new Promise<mvc.Transaction>(async (resolve, reject) => {
      try {
        const initParams = {
          payTo: [],
          isBroadcast: true,
          opReturn: [import.meta.env.VITE_App_Key],
          utxos: [],
          chain: HdWalletChain.MVC,
        }
        params = {
          ...initParams,
          ...params,
        }
        if (!params.utxos!.length) {
          let totalAmount = mvc.Transaction.DUST_AMOUNT
          for (const item of params.payTo) {
            totalAmount += item.amount
          }
          params.utxos = await this.provider.getAmountUnUesedUtxos(
            totalAmount,
            this.wallet.xpubkey.toString(),
            params.chain
          )
        }
        for (const item of params.payTo) {
          if (!item.address) {
            throw new Error('需要指定转账地址')
          }
          if (isEmail(item.address)) {
            item.address = await this.provider.getPayMailAddress(item.address)
          }
        }
        const tx = await this.makeTx({
          payCurrency: 'SPACE',
          payTo: params.payTo,
          opReturn: params.opReturn,
          utxos: params.utxos,
          chain: params!.chain,
        })
        if (params.isBroadcast) {
          const res = await this.provider.broadcast(tx.toString(), params.chain)
          if (res) {
            resolve(tx)
          }
        } else {
          resolve(tx)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  ftGenesis() {
    return new Promise(async resolve => {
      const userStore = useUserStore()
      const tokenName = 'SPACE-MIT'
      const tokenSymbol = 'SMIT'
      const decimalNum = 8

      let utxos
      let bFrcRes = await this.createBrfcNode(
        {
          nodeName: NodeName.FtGenesis,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
        },
        {
          isBroadcast: false,
        }
      )
      if (bFrcRes.transaction) {
        const allUtxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
        const tx = await this.sendMoney({
          payTo: [{ amount: 1000, address: this.protocolAddress }],
          utxos: allUtxos,
        })
        const utxo = await this.utxoFromTx({
          tx,
          addressInfo: {
            addressType: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[0]),
            addressIndex: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[1]),
          },
          outPutIndex: 0,
        })
        utxo.wif = this.getPathPrivateKey(`${utxo.addressType}/${utxo.addressIndex}`).toString()
        utxos = [utxo]
        bFrcRes = await this.createBrfcNode({
          nodeName: NodeName.FtGenesis,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
          utxos,
        })
      }

      const allUtxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
      const tx = await this.sendMoney({
        payTo: [{ amount: 20000, address: bFrcRes.address }],
        utxos: allUtxos,
      })
      const utxo = await this.utxoFromTx({
        tx,
        addressInfo: {
          addressType: bFrcRes.addressType,
          addressIndex: bFrcRes.addressIndex,
        },
        outPutIndex: 0,
      })
      utxo.wif = this.getPathPrivateKey(`${utxo.addressType}/${utxo.addressIndex}`).toString()
      utxos = [utxo]
      const response = await this.createBrfcChildNode(
        {
          nodeName: NodeName.FtGenesis,
          data: JSON.stringify({
            type: 'metacontract',
            tokenName,
            tokenSymbol,
            decimalNum,
            desc:
              'SPACE-MIT(SMIT) is a reward token launched for the MVC Incentivized Testnet (MIT). You can swap the reward to the Mainnet coin in a specific ratio after the launch of MVC Mainnet.',
            icon: 'metafile://37657797410a92f7ed37440ea54d2b7940c1e0acc150a86f4e677565fc8c3e05.png',
            website: 'https://mvc.space/',
            issuerName: 'MVC Foundation',
            utxos,
            useFeeb: 1,
          }),
          ...AllNodeName[NodeName.FtGenesis],
          brfcTxId: bFrcRes.txId,
        },
        {
          isBroadcast: false,
        }
      )

      const ft = new FtManager({
        network: this.network,
        feeb: 1,
        purse: this.getPathPrivateKey(`0/0`).toString(),
      })

      const genesis = await ft.genesis({
        tokenName,
        tokenSymbol,
        decimalNum,
        opreturnData: response.scriptPlayload,
        // noBroadcast: true,
        utxos,
        changeAddress: userStore.user!.address,
        genesisWif: this.getPathPrivateKey(`0/0`).toString(),
      })
      console.log('genesisWif', this.getPathPrivateKey(`0/0`).toString())
      // await this.provider.broadcast(genesis.txHex)

      let IssueFrfcRes = await this.createBrfcNode(
        {
          nodeName: NodeName.FtIssue,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
        },
        {
          isBroadcast: false,
        }
      )
      if (IssueFrfcRes.transaction) {
        const allUtxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
        const tx = await this.sendMoney({
          payTo: [{ amount: 20000, address: this.protocolAddress }],
          utxos: allUtxos,
        })
        await sleep(2000)
        const utxo = await this.utxoFromTx({
          tx,
          addressInfo: {
            addressType: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[0]),
            addressIndex: parseInt(this.keyPathMap['Protocols'].keyPath.split('/')[1]),
          },
          outPutIndex: 0,
        })
        utxo.wif = this.getPathPrivateKey(`${utxo.addressType}/${utxo.addressIndex}`).toString()
        utxos = [utxo]
        IssueFrfcRes = await this.createBrfcNode({
          nodeName: NodeName.FtIssue,
          parentTxId: userStore.user!.protocolTxId,
          useFeeb: 1,
          utxos,
        })
      }

      await sleep(2000)

      const allUtxos2 = await this.provider.getUtxos(this.wallet.xpubkey.toString())
      const tx2 = await this.sendMoney({
        payTo: [{ amount: 20000, address: IssueFrfcRes.address }],
        utxos: allUtxos2,
      })
      await sleep(2000)
      const utxo2 = await this.utxoFromTx({
        tx: tx2,
        addressInfo: {
          addressType: IssueFrfcRes.addressType,
          addressIndex: IssueFrfcRes.addressIndex,
        },
        outPutIndex: 0,
      })
      utxo2.wif = this.getPathPrivateKey(`${utxo2.addressType}/${utxo2.addressIndex}`).toString()
      utxos = [utxo2]
      const response2 = await this.createBrfcChildNode(
        {
          nodeName: NodeName.FtIssue,
          data: JSON.stringify({
            type: 'metacontract',
            genesisId: genesis.genesis,
            sensibleId: genesis.sensibleId,
            tokenAmount: '30000000000000',
            genesisAddress: userStore.user!.address,
            address: userStore.user!.address,
            allowIncreaseIssues: true,
          }),
          ...AllNodeName[NodeName.FtIssue],
          brfcTxId: IssueFrfcRes.txId,
          utxos,
          useFeeb: 1,
        },
        {
          isBroadcast: false,
        }
      )
      console.log('genesisWif', this.getPathPrivateKey(`0/0`).toString())
      console.log({
        brfcAddress: bFrcRes.address,
        address1: utxos[0].address,
        address2: mvc.PrivateKey.fromWIF(utxos[0].wif)
          .toAddress('testnet')
          .toString(),
        path: `${utxos[0].addressType}/${utxos[0].addressIndex}`,
      })
      const result = await ft.issue({
        genesis: genesis.genesis,
        codehash: genesis.codehash,
        sensibleId: genesis.sensibleId,
        genesisWif: this.getPathPrivateKey(`0/0`).toString(),
        receiverAddress: userStore.user!.address,
        tokenAmount: '30000000000000',
        allowIncreaseMints: true, //if true then you can issue again
        opreturnData: response2.scriptPlayload,
        utxos,
        // noBroadcast: true,
        changeAddress: userStore.user!.address,
      })

      // await this.provider.broadcast(result.txHex)
    })
  }

  //发起MetaName交易前请求
  public async MetaNameBeforeReq(params: { name: string; op: MetaNameOp }) {
    return this.provider.reqMetaNameArgs({ ...params, address: this.rootAddress })
  }
}
