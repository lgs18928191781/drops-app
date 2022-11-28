import * as _BSV from '@sensible-contract/bsv'
import { HttpRequests, ApiRequestTypes } from '@/utils/wallet/request2'
import HttpRequest from 'request-sdk'
import { BaseUtxo, MetasvUtxoTypes, Network } from './hd-wallet'
import axios, { AxiosInstance } from 'axios'
import { UtxoItem } from '@/@types/sdk'

interface BaseApiResultTypes<T> {
  code: number
  msg?: string
  message?: string
  data?: T
  result?: T
}
interface MetaSvAuthorizationOption {
  authorization?: string
  privateKey?: string
}
interface MetasvSigTypes {
  signEncoded: string
  publicKey: string
  nonce: string
  timestamp: string
}
export interface InitUtxoTypes {
  txId: string
  index: string
  amount: number
  scriptPubkey: string
  broadcast: string
}

interface AccountInfo {
  address: string
  avatarTxId: string
  avatarType: string
  customizeAvatarTxId: string
  email: string
  emailEncrypt: string
  headUrl: string
  headUrlEncrypt: string
  infoTxId: string
  metaId: string
  name: string
  nameEncrypt: string
  phone: string
  phoneEncrypt: string
  protocolTxId: string
  pubKey: string
  showId: string
  timestamp: number
  xpub: string
}
interface GetBalanceData {
  address: string
  confirmed: number
  unconfirmed: number
}

// const metaSvPrivateKey = 'KxSQqTxhonc5i8sVGGhP1cMBGh5cetVDMfZjQdFursveABTGVbZD'

export default class ShowmoneyProvider {
  public apiPrefix: string
  public metaSvApi: string
  public metaSvMirror = 'https://api.showmoney.app/metasv'
  public metaSvHttp
  public metasvSignatureHttp
  public serviceHttp
  // private metaSvAuthorization: MetaSvAuthorizationOption
  constructor(apiPrefix: string, metaSvApi: string) {
    this.apiPrefix = apiPrefix || 'https://api.showmoney.app'
    this.metaSvApi = metaSvApi
    this.metaSvHttp = new HttpRequest(this.metaSvApi).request
    this.serviceHttp = new HttpRequest(this.apiPrefix + '/serviceapi').request
    // 初始化 metasv签名接口 http
    // this.metasvSignatureHttp = new HttpRequest(this.apiPrefix + '/metasv-signature', {
    this.metasvSignatureHttp = new HttpRequest('https://api.showmoney.app/metasv-signature', {
      responseHandel(response) {
        return new Promise((resolve, reject) => {
          if (response.data.code && response.data.code !== 0) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              message: response.data.msg,
              data: response.data,
            })
          } else {
            resolve(response.data)
          }
        })
      },
    }).request
  }

  private async callApi<T = any>(config: ApiRequestTypes): Promise<BaseApiResultTypes<T>> {
    const Http = new HttpRequests()
    const url = this.apiPrefix + config.url
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await Http.postFetch<any>(url, config.params, config.options)
      return res
    } catch (error) {
      throw new Error('Network Error: ' + error.message)
    }
  }

  private getMetasvSig(path: string): Promise<MetasvSigTypes> {
    return new Promise(async (resolve, reject) => {
      const res = await this.metasvSignatureHttp
        .post('/signature', { path })
        .catch(error => reject(error))
      if (res?.code === 0) {
        resolve(res.data as MetasvSigTypes)
      }
    })
  }

  private async callMetasvApi(
    path: string,
    params: ObjTypes<string | number> = {},
    method = 'get'
  ): Promise<any> {
    const signature = await this.getMetasvSig(path)
    const headers = {
      'Content-Type': 'application/json',
      'MetaSV-Timestamp': signature.timestamp,
      'MetaSV-Client-Pubkey': signature.publicKey,
      'MetaSV-Nonce': signature.nonce,
      'MetaSV-Signature': signature.signEncoded,
    }
    const url = this.metaSvApi + path
    const Http = new HttpRequests()
    let res
    try {
      if (method === 'get') {
        res = await Http.getFetch(url, params, { headers })
      } else {
        res = await Http.postFetch(url, params, { headers })
      }
    } catch (error) {
      const mirrorUrl = this.metaSvMirror + path
      if (method === 'get') {
        res = await Http.getFetch(mirrorUrl, params, { headers: headers })
      } else {
        res = await Http.postFetch(mirrorUrl, params, { headers: headers })
      }
    }
    if (!res) {
      throw new Error('Request Error metasv -- ')
    }
    return res
  }

  public async getMetaId(rootAddress: string): Promise<string | null> {
    const res = await this.callApi({
      url: '/serviceapi/api/v1/metago/getMetaIdByZoreAddress',
      params: {
        data: JSON.stringify({
          zeroAddress: rootAddress,
        }),
      },
    })
    if (res.code === 200) {
      const result = res.result as ObjTypes<string>
      return result.rootTxId
    } else if (res.code === 601) {
      return null
    } else {
      throw new Error('无法获取 MetaId')
    }
  }

  public async getMetaAccount(metaId: string): Promise<AccountInfo | null> {
    const res = await this.callApi({
      url: '/serviceapi/api/v1/showService/getOwnShowAccount',
      params: {
        data: JSON.stringify({
          showId: metaId,
        }),
      },
    })
    if (res.code === 200) {
      return res.result as AccountInfo
    } else if (res.code === 601) {
      return null
    } else {
      throw new Error('无法获取 MetaId')
    }
  }

  public async getMetaIdInfo(metaId: string): Promise<any> {
    const Http = new HttpRequests()
    const url = this.apiPrefix + `/aggregation/v2/app/user/getUserInfo/${metaId}`
    const res = await Http.getFetch<BaseApiResultTypes<unknown>, any>(url)
    if (res.code === 0) {
      return res.data
    }
  }

  public async getInitAmount(params: {
    address: string
    xpub: string
    token?: string
    userName?: string
  }): Promise<BaseUtxo> {
    console.log('paramsparamsparams', params)
    let options = {
      headers: {
        'Content-Type': 'application/json',
        accessKey: params?.token,
        timestamp: new Date().getTime() + '',
        userName: params?.userName,
      },
    }

    const res = await this.callApi({
      url: '/nodemvc/api/v1/pri/wallet/sendInitSatsForMetaSV',
      params: {
        address: params.address,
        xpub: params.xpub,
      },
      options: params?.token ? options : {},
    })
    if (res.code === 0) {
      const initUtxo = res.result || {}
      let result = {
        ...initUtxo,
        outputIndex: +initUtxo.index,
        satoshis: +initUtxo.amount,
        value: +initUtxo.amount,
        amount: +initUtxo.amount * 1e-8,
        address: initUtxo.toAddress,
        script: initUtxo.scriptPubkey,
        addressType: 0,
        addressIndex: 0,
      }
      console.log('resultresult', result)
      return result
    } else {
      throw new Error(res.msg)
    }
  }

  public async getUtxos(xpub: string): Promise<UtxoItem[]> {
    const res = await this.callMetasvApi(`/xpubLite/${xpub}/utxo`)
    const utxos: UtxoItem[] = []
    if (Array.isArray(res)) {
      res.forEach(item => {
        item.script = _BSV.Script.fromAddress(item.address).toHex()
        item.amount = +item.value / 1e8
        item.vout = item.txIndex
        // sensible need satoshis,outputIndex,txId
        item.satoshis = item.value
        item.outputIndex = item.txIndex
        item.txId = item.txid
        utxos.push(item)
      })
    }
    return utxos
  }

  public getXpubBalance(xpub: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const res = await this.callMetasvApi(`/xpubLite/${xpub}/balance`).catch(error => {
        reject(error)
      })
      if (res) {
        resolve(res.balance)
      }
    })
  }

  public async getAddressUtxos(params: {
    address: string
    flag?: string
    xpub: string
    addressIndex: number
    addressType: number
  }): Promise<BaseUtxo[]> {
    const res = await this.callMetasvApi(`/address/${params.address}/utxo`)
    const utxos: BaseUtxo[] = []
    if (Array.isArray(res)) {
      res.forEach(item => {
        item.script = _BSV.Script.fromAddress(item.address).toHex()
        item.amount = +item.value / 1e8
        item.vout = item.outIndex
        item.txIndex = item.outIndex
        // sensible need satoshis,outputIndex,txId
        item.satoshis = item.value
        item.outputIndex = item.outIndex
        item.txId = item.txid
        item.xpub = params.xpub
        item.addressIndex = params.addressIndex
        item.addressType = params.addressType
        utxos.push(item)
      })
    }
    return utxos
  }

  public async getXpubLiteAddressInfo(
    xpub: string,
    address: string
  ): Promise<{
    xpub: string
    address: string
    addressType: number
    addressIndex: number
  }> {
    return new Promise(async (resolve, reject) => {
      const res = await this.callMetasvApi(`/xpubLite/${xpub}/address/${address}`).catch(err => {
        reject(err)
      })
      if (res) {
        resolve(res)
      }
    })
  }

  public async broadcast(txHex: string): Promise<BaseApiResultTypes<any>> {
    return new Promise(async (resolve, reject) => {
      const res = await this.callMetasvApi(
        '/tx/broadcast',
        {
          hex: txHex,
        },
        'post'
      ).catch(error => {
        // 广播容错，忽略返回
        // this.sendRawTx(txHex)
        reject(error)
      })
      if (res?.txid) {
        await this.sendRawTx(txHex)
        resolve(res)
      } else {
        const response = JSON.parse(res.message)
        reject({
          code: response.code,
          message: response.message,
        })
      }
    })
  }

  // 上报RawTx
  public async sendRawTx(txHex: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const sendRawTx = () => {
        return axios.post(this.apiPrefix + '/metaid-base/v1/meta/upload/raw', {
          raw: txHex,
          type: 1,
        })
      }
      const sendRawTxUtxo = () => {
        return axios.post(this.apiPrefix + '/utxo/sendRawTx', {
          raw: txHex,
          unCheck: false.toString(),
        })
      }
      const res = await Promise.all([sendRawTxUtxo(), sendRawTx()])
      resolve(res)
    })
  }

  public async getNftGenesisInfo(sensibleId: string): Promise<any> {
    const Http = new HttpRequests()
    const url = this.apiPrefix + `/aggregation/v2/app/sensible/getNftGenesisByTxId/${sensibleId}`
    const res = await Http.getFetch<BaseApiResultTypes<unknown>, any>(url)
    if (res.code === 0) {
      return res.data
    }
  }

  async getPayMailAddress(email: string) {
    return axios.post('https://api.showmoney.app' + '/paymail/v2/paymail/address', {
      data: JSON.stringify({ Email: email }),
    })
  }

  async getPulicKeyForNewNode(xpub: string, parentTxId: string, count = 50) {
    return new Promise<
      {
        address: string
        index: number
        path: string
        publicKey: string
      }[]
    >(async (resolve, reject) => {
      const res = await this.serviceHttp
        .post('/api/v1/showService/getPublicKeyForNewNode', {
          data: JSON.stringify({ xpub, parentTxId, count }),
        })
        .catch(error => reject(error))
      if (res.code === 200) {
        resolve(res.result.data)
      }
    })
  }

  getPathWithNetWork(params: { xpub: string; address: string }) {
    return new Promise<{
      address: string
      addressIndex: number
      addressType: number
      xpub: string
    }>(async (resolve, reject) => {
      const res = await this.callMetasvApi(
        `/xpubLite/${params.xpub}/address/${params.address}`
      ).catch(error => reject(error))
      if (res) {
        resolve(res)
      }
    })
  }
}
