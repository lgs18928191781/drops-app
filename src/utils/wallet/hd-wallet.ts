// @ts-ignore
import mvc from 'mvc-lib'
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
// import * as Mnemonic from 'bsv/mnemonic'
import { englishWords } from './english'
import { API_NET, API_TARGET, SensibleNFT, Wallet } from 'sensible-sdk'
import { SA_utxo } from 'sensible-sdk/dist/sensible-api'
import { isEmail } from '../util'
import { IsEncrypt } from '@/enum'
import { AttachmentItem, PayToItem } from '@/@types/hd-wallet'
import { CreateNodeOptions, TransferTypes, UtxoItem } from '@/@types/sdk'

const bsv = mvc

export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export enum MetaIdTag {
  mainnet = 'metaid',
  testnet = 'testmetaid',
}

export interface BaseUserInfoTypes {
  userType: 'phone' | 'email'
  name: string
  phone: string
  email: string
  password?: string
  pk2: string
  token?: string
  enCryptedMnemonic?: string
  tag?: 'new' | 'old'
  referrerId?: string
  appToken: string
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
  tx: bsv.Transaction
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
  script: bsv.Script
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
  tx: bsv.Transaction
  changeUtxo: MetasvUtxoTypes
}
interface MetaIdInfoTypes {
  metaId: string
  metaIdTag: MetaIdTag
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

export interface CreateNodeRes {
  raw: bsv.Transaction
  hex: string
  txId: string
  nodeAddress: string
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
  attachments?: AttachmentTypes[]
  externalUtxos?: UtxoTypes[]
}

export const DEFAULTS = {
  feeb: 0.05,
  minAmount: 546,
}

export const hdWalletFromMnemonic = async (
  mnemonic: string,
  tag: 'new' | 'old' = 'new',
  network: Network = Network.mainnet
): Promise<bsv.HDPrivateKey> => {
  // const hdPrivateKey = Mnemonic.fromString(mnemonic).toHDPrivateKey()
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const hdPrivateKey = bsv.HDPrivateKey.fromSeed(seed, network)
  const hdWallet = hdPrivateKey.deriveChild(tag === 'new' ? "m/44'/236'/0'" : "m/44'/145'/0'")
  return hdWallet
}

export const hdWalletFromAccount = async (
  account: BaseUserInfoTypes,
  network: Network = Network.mainnet
): Promise<any> => {
  debugger
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
    const ppHex = bsv.crypto.Hash.sha256(ppBuffer).toString('hex')
    let hex: string | Buffer
    if (account.tag === 'old') {
      hex = Buffer.from(ppHex + account.pk2)
      hex = bsv.crypto.Hash.sha256sha256(hex).toString('hex')
    } else {
      hex = Buffer.from((ppHex + account.pk2).toLowerCase(), 'hex').toString('hex')
      hex = Ripemd128(hex).toString()
    }
    mnemonic = bip39.entropyToMnemonic(hex, englishWords)
  }
  // const mnemonic = new Mnemonic(Buffer.from(hex)).toString()
  const wallet = await hdWalletFromMnemonic(mnemonic, account.tag, network)
  const root = wallet.deriveChild(0).deriveChild(0).privateKey
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

function reverceFtByteString(str) {
  str = str.substr(0, str.length - 8)
  let ret = ''
  for (let i = 0; i < str.length; i += 2) {
    ret = str[i] + str[i + 1] + ret
  }
  return ret
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
  private network = Network.mainnet
  public mnemonic: string
  public wallet: bsv.HDPrivateKey
  public provider: ShowmoneyProvider
  private _utxos: MetasvUtxoTypes[] = []
  public _root: bsv.PrivateKey
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

  public usedPublicekeyAddress: string[] = [] // 已使用的publickey 地址，避免重复使用

  get rootAddress(): string {
    return this._root.toAddress(this.network).toString()
  }

  constructor(mnemonic: string, wallet: bsv.HDPrivateKey) {
    this.network = wallet.network.name
    this.mnemonic = mnemonic
    this.wallet = wallet
    const root = wallet.deriveChild(0).deriveChild(0).privateKey
    this._root = root
    // this.rootAddress = root.toAddress(Network.mainnet).toString()
    this.provider = new ShowmoneyProvider(
      import.meta.env.VITE_BASEAPI,
      import.meta.env.VITE_META_SV_API
    )
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
    const metaId = await this.provider.getMetaId(rootAddress)
    if (metaId) {
      const info = await this.provider.getMetaIdInfo(metaId)
      metaIdInfo = {
        ...metaIdInfo,
        ...info,
      }
    }
    return metaIdInfo
  }

  // 初始化 metaId
  public initMetaIdNode(account: BaseUserInfoTypes) {
    return new Promise<MetaIdInfoTypes>(async (resolve, reject) => {
      try {
        debugger
        const metaIdInfo: MetaIdInfoTypes = await this.getMetaIdInfo(this.rootAddress)
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
                token: account.token || '',
                userName: account.userType === 'phone' ? account.phone : account.email,
              })
              debugger
              utxos = [initUtxo]
            }

            let outputs = []
            if (account.referrerId) {
              outputs = [
                {
                  script: bsv.Script.buildSafeDataOut(['ref:' + account.referrerId]),
                  satoshis: 0,
                },
              ]
            }
            const rootTx = await this.createNode({
              nodeName: 'Root',
              metaIdTag: MetaIdTag[this.network],
              data: 'NULL',
              dataType: 'NULL',
              encoding: 'NULL',
              utxos: utxos,
              outputs: outputs,
            })
            hexTxs.push(rootTx.hex)
            metaIdInfo.metaId = rootTx.txId
            const newUtxo = await this.utxoFromTxChange(rootTx.raw, {
              addressType: 0,
              addressIndex: 0,
            })
            if (newUtxo) {
              utxos = [newUtxo]
            }
          }

          // 初始化 metaId
          if (!metaIdInfo.protocolTxId) {
            const protocolTx = await this.createNode({
              nodeName: 'Protocols',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: MetaIdTag[this.network],
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
            })
            hexTxs.push(protocolTx.hex)
            metaIdInfo.protocolTxId = protocolTx.txId
            const newUtxo = await this.utxoFromTxChange(protocolTx.raw, {
              addressType: 0,
              addressIndex: 0,
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 infoTxId
          if (!metaIdInfo.infoTxId) {
            const infoTx = await this.createNode({
              nodeName: 'Info',
              parentTxId: metaIdInfo.metaId,
              metaIdTag: MetaIdTag[this.network],
              data: 'NULL',
              version: 'NULL',
              utxos: utxos,
              change: infoAddress.publicKey.toAddress(this.network).toString(),
            })
            console.log('Info', infoTx)
            hexTxs.push(infoTx.hex)
            metaIdInfo.infoTxId = infoTx.txId
            const newUtxo = await this.utxoFromTxChange(infoTx.raw, {
              addressType: 0,
              addressIndex: 1,
            })
            if (newUtxo) utxos = [newUtxo]
          }

          // 初始化 name
          if (!metaIdInfo.name) {
            const nameTx = await this.createNode({
              nodeName: 'name',
              parentTxId: metaIdInfo.infoTxId,
              metaIdTag: MetaIdTag[this.network],
              data: account.name,
              utxos: utxos,
              change: infoAddress.publicKey.toAddress(this.network).toString(),
            })
            console.log('Info', nameTx)
            hexTxs.push(nameTx.hex)
            metaIdInfo.name = account.name
            const newUtxo = await this.utxoFromTxChange(nameTx.raw, {
              addressType: 0,
              addressIndex: 1,
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
              metaIdTag: MetaIdTag[this.network],
              data: loginName,
              encrypt: 1,
              utxos: utxos,
              change: infoAddress.publicKey.toAddress(this.network).toString(),
            })
            hexTxs.push(loginNameTx.hex)
            metaIdInfo[account.userType] = loginName
            const newUtxo = await this.utxoFromTxChange(loginNameTx.raw, {
              addressType: 0,
              addressIndex: 1,
            })
            if (newUtxo) utxos = [newUtxo]
          }

          let errorMsg: Error
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

  public async transferNft(
    payload: {
      receiverAddress: string
      codehash: string
      genesis: string
      tokenIndex: string
      sensibleId: string
    },
    isBroadcast = true
  ) {
    const genesisTxid = this.reverceFtByteString(payload.sensibleId)
    const signersRes = await this.provider.getNftGenesisInfo(genesisTxid)
    const signersRaw = signersRes.signers
    const { signers, signerSelecteds } = await SensibleNFT.selectSigners(signersRaw)
    const nft = new SensibleNFT({
      network: API_NET.MAIN,
      apiTarget: API_TARGET.METASV,
      feeb: 0.1,
      signers,
      signerSelecteds,
    })
    nft.sensibleApi.authorize({
      privateKey: metasvServiceSecret,
    })
    const utxoRes = await this.provider.getUtxos(this.wallet.xpubkey.toString())
    const utxos = utxoRes.map(item => {
      item.wif = this.getPathPrivateKey(`${item.addressType}/${item.addressIndex}`).toString()
      return item
    })
    console.log('params: ', {
      senderWif: this._root.toString(),
      receiverAddress: payload.receiverAddress,
      codehash: payload.codehash,
      genesis: payload.genesis,
      tokenIndex: payload.tokenIndex,
      utxos: utxos,
    })
    const res = await nft.transfer({
      senderWif: this._root.toString(),
      receiverAddress: payload.receiverAddress,
      codehash: payload.codehash,
      genesis: payload.genesis,
      tokenIndex: payload.tokenIndex,
      utxos: utxos,
      opreturnData: '',
      noBroadcast: true,
    })

    let result
    if (isBroadcast) {
      result = await this.provider.broadcast(res.txHex)
    }
    if ((isBroadcast && result) || !isBroadcast) {
      return {
        txId: res.txid,
        ...res,
      }
    }
  }

  public sigMessage(msg: string, path = '0/0') {
    const privateKey = this.getPathPrivateKey(path)
    return bsv.Message.sign(msg, privateKey)
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
    parentAddress,
    parentKeyPath,
    keyPath,
    payTo = [],
    utxos = [],
    change,
    metaIdTag = MetaIdTag[this.network],
    parentTxId = 'NULL',
    data = 'NULL',
    encrypt = IsEncrypt.No,
    version = '1.0.1',
    dataType = 'text/plain',
    encoding = 'UTF-8',
    outputs = [],
  }: CreateNodeOptions) {
    return new Promise<CreateNodeRes>(async (resolve, reject) => {
      try {
        if (!nodeName) {
          throw new Error('Parameter Error: NodeName can not empty')
        }
        let nodeAddress, parentUtxos: MetasvUtxoTypes[]
        let privateKey = this.getPathPrivateKey('0/0')
        let nodeKeyPath: string
        // TODO: 自定义节点支持
        if (this.keyPathMap[nodeName]) {
          const nodeInfo = this.keyPathMap[nodeName]
          parentKeyPath = nodeInfo.parentKeyPath
          const nodeKeyPath = nodeInfo.keyPath
          parentAddress = this.createAddress(parentKeyPath)
          nodeAddress = this.createAddress(nodeKeyPath)
          privateKey = this.getPathPrivateKey(nodeKeyPath)
        } else if (keyPath && parentAddress) {
          nodeKeyPath = keyPath
          nodeAddress = this.createAddress(keyPath)
          // 查找 parentKeyPath
          try {
            const pathInfo = await this.provider.getPathWithNetWork({
              address: parentAddress,
              xpub: this.wallet.xpubkey.toString(),
            })
            parentKeyPath = `${pathInfo.addressType}/${pathInfo.addressIndex}`
          } catch (error) {
            if (parentKeyPath === '-1/-1') {
              const protocolAddr = this.createAddress(this.keyPathMap.Protocols.keyPath).address
              if (parentAddress === protocolAddr) {
                parentKeyPath = this.keyPathMap.Protocols.keyPath
                this._addressList.push({
                  Address: protocolAddr,
                  Path: parentKeyPath,
                })
              }
            }
          }
        } else {
          throw new Error('Unsupported Node Type')
        }
        // 数据加密
        if (+encrypt === 1) {
          debugger
          data = this.eciesEncryptData(data, privateKey, privateKey.publicKey).toString('hex')
        } else {
          if (encoding.toLowerCase() === 'binary') {
            data = Buffer.from(data.toString('hex'), 'hex')
          }
        }

        const scriptPlayload = [
          'meta',
          nodeAddress.publicKey.toString(),
          parentTxId,
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
            raw: nodeTx,
            hex: nodeTx.toString(),
            txId: nodeTx.id,
            nodeAddress: nodeAddress?.address,
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
    from = [],
    change = this.rootAddress,
    opReturn,
    utxos,
    useFeeb = DEFAULTS.feeb,
  }: TransferTypes): Promise<bsv.Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const { tx, amount } = await this.makeTxNotUtxos({
          payTo,
          outputs,
          from,
          change,
          opReturn,
          useFeeb,
        })
        tx.change(change)
        // @ts-ignore
        tx.useFeeb = useFeeb
        // @ts-ignore
        tx.getNeedFee = function() {
          // @ts-ignore
          const amount = Math.ceil(
            // @ts-ignore
            (30 + this._estimateSize() + 182) * this.useFeeb
          )
          // @ts-ignore
          const offerFed = Math.ceil(amount * this.useFeeb)
          // if (amount < minAmount) amount = minAmount
          const total =
            offerFed + amount < bsv.Transaction.DUST_AMOUNT
              ? bsv.Transaction.DUST_AMOUNT + 30
              : offerFed + amount

          return total
        }
        // @ts-ignore
        tx.isNeedChange = function() {
          return (
            // @ts-ignore
            ((this._getUnspentValue() - this.getNeedFee()) as number) >= bsv.Transaction.DUST_AMOUNT
          )
        }
        // @ts-ignore
        tx.getChangeAmount = function() {
          // @ts-ignore
          return (this._getUnspentValue() - this.getNeedFee()) as number
        }
        // @ts-ignore
        const fee = Math.ceil(tx._estimateSize() * useFeeb)
        let balance = 0
        // let pickedUtxos: MetasvUtxoTypes[] = []

        // 如果指定了输入 utxos，则计算输入金额
        if (from.length) {
          balance = from.reduce((a, c) => a + c.satoshis, 0)
        }

        console.log('===费用')
        // @ts-ignore
        console.log('fee2', tx._estimateSize() * useFeeb)
        console.log(tx)

        // 如果指定的 utxos 金额不足，则选取其它 utxos 来补充
        if (balance < fee + amount) {
          // @ts-ignore
          const pickUtxosRes = this.pickUtxosByAmount(from, utxos, fee + amount)
          // if (!pickUtxosRes.isEnoughBalance) {
          //   throw new Error('余额不足')
          // }
          for (const utxo of pickUtxosRes.newPickedUtxos) {
            tx.from(utxo)
          }
          from.push(...pickUtxosRes.newPickedUtxos)
        } else {
          tx.from(from)
        }

        // 手续费指定
        // if (tx._getUnspentValue() - (34 + tx._estimateSize()) * useFeeb >= 546 * useFeeb) {
        //   tx.addOutput(
        //     new bsv.Transaction.Output({
        //       satoshis: Math.floor(tx._getUnspentValue() - (34 + tx._estimateSize()) * fee),
        //       script: bsv.Script.fromAddress(changeAddress),
        //     })
        //   )
        // }
        console.log(tx)
        // @ts-ignore
        console.log('fee2', tx._estimateSize() * useFeeb)
        // @ts-ignore
        tx.fee(Math.ceil(tx._estimateSize() * useFeeb))
        const privateKeys = this.getUtxosPrivateKeys(from)
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
    from = [],
    change = this.rootAddress,
    opReturn,
    useFeeb = DEFAULTS.feeb,
  }: TransferTypes) {
    if (!this.wallet) {
      throw new Error('Wallet uninitialized! (core-makeTx)')
    }
    const tx = new bsv.Transaction()
    tx.feePerKb(useFeeb * 1000)
    let amount = 0
    // 添加 payto
    if (Array.isArray(payTo) && payTo.length) {
      payTo.forEach(item => {
        if (!this.isValidOutput(item)) {
          throw new Error('Output format error.')
        }
        amount += Math.ceil(item.amount)
        tx.to(item.address, item.amount)
      })
    }

    // 添加 opReturn 内容
    if (opReturn) {
      tx.addOutput(
        new bsv.Transaction.Output({
          script: bsv.Script.buildSafeDataOut(opReturn),
          satoshis: 0,
        })
      )
    }

    if (Array.isArray(outputs) && outputs.length) {
      outputs.forEach(output => {
        tx.addOutput(new bsv.Transaction.Output(output))
      })
    }

    tx.from(from)
    return {
      tx,
      amount,
    }
  }

  public async getOneUtxoFee(params?: { useFeeb?: number; utxo?: UtxoItem }) {
    return new Promise<number>(resolve => {
      if (!params) params = {}
      if (!params?.useFeeb) params.useFeeb = DEFAULTS.feeb
      const tx = new bsv.Transaction()
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

  utxoFromTxChange(
    tx: bsv.Transaction,
    params?: {
      addressType: number
      addressIndex: number
    }
  ) {
    return new Promise<UtxoItem>(async (resolve, reject) => {
      try {
        const changeOutPut = tx.outputs[tx._changeIndex]
        if (!params) {
          const addressInfo = await this.provider.getPathWithNetWork({
            address: changeOutPut.script.toAddress(this.network).toString(),
            xpub: this.wallet.xpubkey.toString(),
          })
          if (addressInfo) {
            params = {
              addressType: addressInfo.addressType,
              addressIndex: addressInfo.addressIndex,
            }
          }
        }

        resolve({
          address: changeOutPut.script.toAddress(this.network).toString(),
          satoshis: changeOutPut.satoshis,
          value: changeOutPut.satoshis,
          amount: changeOutPut.satoshis * 1e-8,
          script: changeOutPut.script.toHex(),
          outputIndex: tx._changeIndex,
          txId: tx.id,
          addressType: params!.addressType,
          addressIndex: params!.addressIndex,
          xpub: this.wallet.xpubkey.toString(),
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
    console.log('amount', amount)

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

  public getUtxosPrivateKeys(utxos: UtxoItem[]): bsv.PrivateKey[] {
    return utxos.map(u => {
      return this.wallet.deriveChild(u.addressType || 0).deriveChild(u.addressIndex || 0).privateKey
    })
  }

  /**
   * ECIES 加密
   */
  public eciesEncryptData(
    data: string | Buffer,
    privateKey?: bsv.PrivateKey,
    publicKey?: bsv.PublicKey
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
    privateKey?: bsv.PrivateKey | string,
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
    const nftManager = await this.getSensibleNftManager(nft.sensibleId)

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
      throw new Error('BSV余额不足，不能进行NFT传输')
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

  private getSensibleNftManager = async (sensibleId: string): Promise<SensibleNFT> => {
    const genesisTxid = this.reverceFtByteString(sensibleId)
    const signersRes = await this.provider.getNftGenesisInfo(genesisTxid)
    const signersRaw = signersRes.signers
    const { signers } = await SensibleNFT.selectSigners(signersRaw)
    const signerSelecteds = [0, 1, 3]

    const nftManager = new SensibleNFT({
      network: API_NET.MAIN,
      apiTarget: API_TARGET.METASV,
      feeb: 0.05,
      signers,
      signerSelecteds,
    })
    nftManager.sensibleApi.authorize({
      privateKey: metasvServiceSecret,
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

    const tx = new bsv.Transaction()
    const fee = Math.ceil((utxosFromAll.length * 148 + 34 + 10) * 0.5)
    const totalAmount = utxosFromAll.reduce((acc: number, utxo: any) => acc + utxo.value, 0)
    tx.addOutput(
      new bsv.Transaction.Output({
        satoshis: totalAmount - fee,
        script: bsv.Script.fromAddress(this.rootAddress),
      })
    )

    const utxos = utxosFromAll.map((utxo: any) => {
      return {
        txId: utxo.txid,
        outputIndex: utxo.txIndex,
        satoshis: utxo.value,
        script: bsv.Script.buildPublicKeyHashOut(utxo.address).toHex(),
      }
    })
    const privateKeys = utxosFromAll.map((utxo: any) => {
      return bsv.HDPrivateKey.fromString(this.wallet.xprivkey.toString())
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

  private async getProtocolInfo(protocolType: string, protocolsTxId: string, brfcId: string) {
    return new Promise<{
      address: string
      data: string
      nodeName: string
      parentPublicKey: string
      parentTxId: string
      publicKey: string
      timestamp: number
      txId: string
      version: string
      xpub: string
      addressType: number
      addressIndex: number
    } | null>(async (resolve, reject) => {
      try {
        const protocols: any = await this.getProtocols({
          protocolsTxId: protocolsTxId,
          protocolType: protocolType,
        })
        const protocol = protocols.filter((item: any) => {
          return item.nodeName === protocolType && item.data === brfcId
        })[0]
        if (protocol) {
          const protocolInfo = await this.provider.getXpubLiteAddressInfo(
            this.wallet.xpubkey.toString(),
            protocol.address
          )
          if (protocolInfo) {
            if (protocolInfo.addressIndex <= 150) {
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
  public createBrfcNode(params: {
    nodeName: string
    metaIdTag: string
    parentTxId: string
    data: string
    keyPath?: string
    parentAddress: string
    payTo?: { amount: number; address: string }[]
    utxos?: UtxoTypes[]
    useFeeb?: number
    needConfirm?: boolean
    isBroadcast?: boolean
  }) {
    return new Promise<{
      address: string
      txId: string
      addressType: number
      addressIndex: number
      tx?: bsv.Transaction
    }>(async (resolve, reject) => {
      try {
        if (!params.useFeeb) params.useFeeb = DEFAULTS.feeb
        if (!params.payTo) params.payTo = []
        if (params.needConfirm === undefined) params.needConfirm = true
        if (params.isBroadcast === undefined) params.isBroadcast = true

        let protocol = await this.getProtocolInfo(params.nodeName, params.parentTxId, params.data)
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
          if (!params.keyPath) {
            const newBfrcNodekeyPath = await this.getKeyPath({ parentTxid: params.parentTxId })
            if (newBfrcNodekeyPath) {
              params.keyPath = newBfrcNodekeyPath.join('/')
            }
          }

          const protocolRoot = await this.createNode(params)
          if (protocolRoot) {
            // @ts-ignore
            protocol = {
              address: protocolRoot.nodeAddress,
              txId: protocolRoot.txId,
              addressType: parseInt(params.keyPath!.split('/')[0]),
              addressIndex: parseInt(params.keyPath!.split('/')[1]),
              // @ts-ignore
              tx: protocolRoot.raw,
            }
            resolve(protocol)
          }
        }

        // if (params.utxos.length < 1) {
        //   reject(Error('用户余额不足'))
        // } else {
        //   const protocol = await this.getProtocolInfo(
        //     params.nodeName,
        //     params.parentTxId,
        //     params.data
        //   )
        //   if (protocol) {
        //     resolve(protocol)
        //   } else {
        //     const res = await this.createNode(params)
        //     if (res) {
        //       if (params.isBroadcast) {
        //         const response = await this.provider.broadcast(res.hex)
        //         if (response?.txid) {
        //           resolve(res)
        //         }
        //       } else {
        //         resolve(res)
        //       }

        //       // this._protocolsTxId = res.data.txId
        //       // 地址已使用，path + 1
        //       // keyPath = [0, Number(keyPath[1]) + 1]
        //       // protocolTypeAddress = res.data.nodeAddress
        //       // protocolTypeTxId = res.data.txId
        //       // usedAmount += Number(res.data.usedAmount) - 546
        //       // // txArray.push(res.data.tran)
        //       // txArray = txArray.concat(res.data.transactionHex)
        //       // txDetail.push({ txId: res.data.txId, amount: res.data.usedAmount })
        //       // utxos = res.data.utxos
        //       // return res
        //     }
        //   }
        // }
      } catch (error) {
        reject(error)
      }
    })
  }

  public async createBrfcChildNode(params: {
    nodeName: string
    autoRename?: boolean
    metaIdTag?: string
    brfcId: string
    appId?: string[]
    encrypt?: IsEncrypt
    version?: string
    data: string
    dataType: string
    payCurrency?: string
    payTo?: PayToItem[]
    encoding?: string
    path: string
    needConfirm?: boolean // 是否需要确认
    attachments?: AttachmentItem[] // 附件
    utxos?: any[] // 传入的utxos
    publickey?: string // 修改时 用的publicekey
    ecdh?: { type: string; publickey: string } // ecdh
    useFeeb?: number // 费率
    isBroadcast?: boolean // 是否广播
    meConvertSatoshi?: number
    brfc: {
      txId: string
      address: string
    }
  }): Promise<{
    raw: bsv.Transaction
    hex: string
    txId: string
  }> {
    return new Promise<CreateNodeRes>(async (resolve, reject) => {
      if (!params.autoRename) params.autoRename = true
      if (!params.metaIdTag) params.metaIdTag = MetaIdTag[this.network]
      if (!params.version) params.version = '0.0.9'
      if (!params.data) params.data = 'NULL'
      if (!params.dataType) params.dataType = 'application/json'
      if (!params.encoding) params.encoding = 'UTF-8'
      if (!params.payCurrency) params.payCurrency = 'BSV'
      if (!params.payTo) params.payTo = []
      if (!params.needConfirm) params.needConfirm = true
      if (!params.attachments) params.attachments = []
      if (!params.utxos) params.utxos = []
      if (!params.useFeeb) params.useFeeb = DEFAULTS.feeb
      if (typeof params.isBroadcast === 'undefined') params.isBroadcast = true

      let keyPath: number[] | string[]
      try {
        // 是否指定地址
        if (params.publickey) {
          let address
          if (params.publickey === '0') {
            address = this.rootAddress
          } else {
            address = bsv.PublicKey.fromHex(params.publickey)
              .toAddress(this.network)
              .toString()
          }
          const addressInfo = await this.provider.getPathWithNetWork({
            address,
            xpub: this.wallet.xpubkey.toString(),
          })
          if (!addressInfo) {
            Error('Permission denied')
          }
          keyPath = [addressInfo.addressType, addressInfo.addressIndex]
        } else {
          keyPath = await this.getKeyPath({ parentTxid: params.brfc.txId })
        }

        // const nodeAddress = this.createAddress(keyPath.join('/'))
        // const protocolNodeOptions = {
        //   nodeName: params.autoRename
        //     ? [params.nodeName, nodeAddress.publicKey.toString().slice(0, 11)].join('-')
        //     : params.nodeName,
        //   metaIdTag: metaIdTag,
        //   parentTxId: protocol!.txId,
        //   appId: params.appId,
        //   keyPath: keyPath.join('/'),
        //   encrypt: params.encrypt,
        //   parentAddress: protocol!.address,
        //   data: params.data,
        //   payCurrency: params.payCurrency,
        //   payTo: params.payTo,
        //   needConfirm: params.needConfirm,
        //   dataType: params.dataType,
        //   version: params.version,
        //   encoding: params.encoding,
        //   utxos: params.utxos,
        //   useFeeb: params.useFeeb,
        //   broadcast: false,
        // }
        // const res = await this.createNode(protocolNodeOptions)
        // if (res) {
        //   brfcChildTx = res.raw
        //   const oneUtxoUseAmount = await this.getOneUtxoFee()
        //   useAmount = brfcChildTx._estimateFee() + oneUtxoUseAmount
        //   const useMe = Math.ceil(useAmount / params.meConvertSatoshi!) * 100
        //   const getMeUtxos = await GetMeUtxos({
        //     address: user.value!.address!,
        //     amount: useMe,
        //     meta_id: user.value!.metaId!,
        //     protocol: params.nodeName,
        //   })
        // }

        // 获取 Utxos
        // if (params.utxos.length <= 0) {
        //   params.utxos = await this.provider.getAddressUtxos({
        //     address: protocol!.address,
        //     xpub: this.wallet.xpubkey.toString(),
        //     addressIndex: protocol!.addressIndex,
        //     addressType: protocol!.addressType,
        //   })
        //   if (params.utxos.length <= 0) {
        //     // 打钱给brfcId 节点
        //     const res = await this.sendMoney({
        //       to: protocol!.address,
        //       amount: 2000,
        //     })
        //     if (res) {
        //       // 再获取会 节点的utxo
        //       params.utxos = await this.provider.getAddressUtxos({
        //         address: protocol!.address,
        //         xpub: this.wallet.xpubkey.toString(),
        //         addressIndex: protocol!.addressIndex,
        //         addressType: protocol!.addressType,
        //       })
        //     }
        //   }
        // }

        // if (params.utxos.length <= 0) {
        //   Error('余额不足')
        // }

        const usedAmount = 0
        let protocolTypeTxId: string | undefined
        let protocolTypeAddress: string | undefined
        const txArray: string[] = []
        let attachmentsRes: AttachmentResTypes | undefined
        const txDetail: any = []

        // 处理附件
        // if (attachments.length) {
        //   this.debugLog('开始上传附件')
        //   try {
        //     attachmentsRes = await this.createProtocolAttachments(attachments, utxos, useFeeb)
        //     this.debugLog('attachmentsRes: ', attachmentsRes)
        //     utxos = attachmentsRes.utxos
        //     usedAmount += attachmentsRes.totalAmount
        //     // 替换内容里的附件占位符为对应的 metafile 地址
        //     if (typeof data === 'string') {
        //       const replaceReg = /(?:!\[(metafile)\]\((.*?)\))/g
        //       data = data.replace(replaceReg, function(item, tag, id) {
        //         let tx
        //         if (attachmentsRes) {
        //           tx = attachmentsRes.txArray[attachmentsRes.hasProtocol ? +id + 1 : +id]
        //         }
        //         const isMedia = dataType === 'metafile/index'
        //         return tx ? (isMedia ? tx.data.txId : 'metafile://' + tx.data.txId) : ''
        //       })
        //     }
        //     // const attachmentsTx = this._pendingTrans[protocolTypeRes.data.transactionTask].transactions : []
        //     attachmentsRes.txArray.forEach(res => {
        //       txArray = txArray.concat(res.data.transactionHex)
        //       txDetail.push({ txId: res.data.txId, amount: res.data.usedAmount })
        //       // return res.data.transactionHex
        //     })
        //     let needRate = 0
        //     if (serviceAddress) {
        //       if (attachmentsServiceRate) {
        //         if (isNaN(+attachmentsServiceRate)) {
        //           throw generateResponse(204, 'attachmentsServiceRate must be number')
        //         }
        //         needRate = Math.ceil((usedAmount * +attachmentsServiceRate) / 100)
        //         payTo.push({
        //           amount: needRate,
        //           address: serviceAddress,
        //         })
        //       }
        //     }
        //     usedAmount += needRate
        //   } catch (error) {
        //     console.error(error)
        //     if (error.code) {
        //       throw error
        //     } else {
        //       throw generateResponse(204, 'Add attachments error')
        //     }
        //   }
        // }

        let protocolRes: ResponseTypes
        if (params.ecdh) {
          if (params.data !== 'NULL' && typeof params.data === 'string') {
            let r: any
            r = JSON.parse(params.data)
            r[params.ecdh.type] = this.ecdhEncryptData(
              r[params.ecdh.type],
              params.ecdh.publickey,
              keyPath.join('/')
            )
            params.data = JSON.stringify(r)
          }
        }
        const nodeAddress = this.createAddress(keyPath.join('/'))
        const protocolNodeOptions = {
          nodeName: params.autoRename
            ? [params.nodeName, nodeAddress.publicKey.toString().slice(0, 11)].join('-')
            : params.nodeName,
          metaIdTag: MetaIdTag[this.network],
          parentTxId: params.brfc.txId,
          appId: params.appId,
          keyPath: keyPath.join('/'),
          encrypt: params.encrypt,
          parentAddress: params.brfc.address,
          data: params.data,
          payCurrency: params.payCurrency,
          payTo: params.payTo,
          needConfirm: params.needConfirm,
          dataType: params.dataType,
          version: params.version,
          encoding: params.encoding,
          utxos: params.utxos,
          useFeeb: params.useFeeb,
        }
        const res = await this.createNode(protocolNodeOptions)
        if (res) {
          if (params.isBroadcast) {
            const response = await this.provider.broadcast(res.hex)
            if (response?.txid) {
              resolve(res)
            }
          } else {
            resolve(res)
          }
        }
        // return protocolQueue.result().then(result => {
        //   const sendTask = this.createTransTask(txArray)
        //   protocolRes.data.transactionHex = txArray
        //   protocolRes.data.transactionTask = sendTask
        //   protocolRes.data.usedAmount = Math.ceil(usedAmount)
        //   protocolRes.data.txDetai = txDetail
        //   protocolRes.data.usedAmountCent = this.satToCent(usedAmount)
        //   // protocolRes.data.utxos = utxos
        //   if (needConfirm) {
        //     return protocolRes
        //   } else {
        //     return this.resumeTransaction(protocolRes.data.transactionTask)
        //   }
        // })
      } catch (error) {
        reject(error)
      }
    })
  }

  async getKeyPath(params: {
    parentTxid: string
    count?: number
    refresh?: boolean
    checkOnly?: true
  }) {
    return new Promise<string[]>(async (resolve, reject) => {
      try {
        if (!params.count) params.count = 15
        if (typeof params.count === 'undefined') params.checkOnly = true
        const result = await this.provider.getPulicKeyForNewNode(
          this.wallet.xpubkey.toString(),
          params.parentTxid,
          params.count
        )
        if (result.length > 0) {
          // 过滤掉已使用的地址， 避免重复使用
          const unUseResult = result.filter(
            item => !this.usedPublicekeyAddress.includes(item.address)
          )
          // 标记已使用
          if (unUseResult.length > 0) {
            this.usedPublicekeyAddress.push(unUseResult[0].address)
            resolve(unUseResult[0].path.split('/'))
          } else {
            throw new Error('getPublicKeyForNewNode fail')
          }
        } else {
          throw new Error('getPublicKeyForNewNode fail')
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
    isBroadcast?: boolean
    payTo: PayToItem[]
    opReturn?: string[]
    utxos?: UtxoItem[]
  }) {
    return new Promise<bsv.Transaction>(async (resolve, reject) => {
      try {
        if (typeof params.isBroadcast === 'undefined') params.isBroadcast = true
        if (!params.opReturn) params.opReturn = ['nos.art']
        if (!params.utxos) {
          params.utxos = await this.provider.getUtxos(this.wallet.xpubkey.toString())
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
          payCurrency: 'BSV',
          payTo: params.payTo,
          opReturn: params.opReturn,
          utxos: params.utxos,
        })
        if (params.isBroadcast) {
          const res = await this.provider.broadcast(tx.toString())
          if (res) {
            resolve(tx)
          }
        } else {
          resolve(tx)
        }

        // this.sendTx(tx.toString())
      } catch (error) {
        reject(error)
      }
    })
  }
}