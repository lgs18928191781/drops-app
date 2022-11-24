const mvc = require('mvc-lib')
const bsv = mvc

const Network = {
  mainnet: 'mainnet',
  testnet: 'testnet',
}
const metasvToken = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpbnRlcm5hbF90ZXN0X3Nob3dwYXkiLCJpc3MiOiJNZXRhU1YiLCJleHAiOjE2NTM4OTc0MTB9.genUip-PcA3tdQtOMKZUzwuc7XxC3zF7Vy5wdYAfKsM`
import HttpRequest from '../api/request'
import HttpRequests from '../api/requests'
import axios from 'axios'
export default class ShowmoneyProvider {
  // private metaSvAuthorization: MetaSvAuthorizationOption
  constructor(apiPrefix) {
    this.metaSvApi = process.env.VUE_APP_METASVAPI
    this.metaSvMirror = `${process.env.VUE_APP_BASEAPI}/metasv`
    this.apiPrefix = apiPrefix
    this.metaSvHttp = new HttpRequest(this.metaSvApi).request
    this.serviceHttp = new HttpRequest(this.apiPrefix + '/serviceapi').request
    // 初始化 metasv签名接口 http
    this.metasvSignatureHttp = new HttpRequest(this.metaSvApi + '/metasv-signature', {
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

  async callApi(config) {
    const Http = new HttpRequests()
    const url = this.apiPrefix + config.url
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await Http.postFetch(url, config.params, config.options)
      return res
    } catch (error) {
      throw new Error('Network Error: ' + error.message)
    }
  }

  getMetasvSig(path) {
    return new Promise(async (resolve, reject) => {
      const res = await this.metasvSignatureHttp
        .post('/signature', { path })
        .catch(error => reject(error))
      if (res?.code === 0) {
        resolve(res.data)
      }
    })
  }

  async callMetasvApi(path, params, method = 'get') {
    // const signature = await this.getMetasvSig(path);
    const headers = {
      Authorization: `${metasvToken}`,
      //   "Content-Type": "application/json",
      //   "MetaSV-Timestamp": signature.timestamp,
      //   "MetaSV-Client-Pubkey": signature.publicKey,
      //   "MetaSV-Nonce": signature.nonce,
      //   "MetaSV-Signature": signature.signEncoded,
    }
    const url = this.metaSvApi + path
    const Http = new HttpRequests()
    let res
    try {
      if (method === 'get') {
        res = await Http.getFetch(url, params, { headers: headers })
      } else {
        res = await Http.postFetch(url, params, { headers: headers })
      }
    } catch (error) {
      const mirrorUrl = this.metaSvMirror + path
      if (method === 'get') {
        res = await Http.getFetch(mirrorUrl, params, {
          headers: headers,
        })
      } else {
        res = await Http.postFetch(mirrorUrl, params, {
          headers: headers,
        })
      }
    }
    if (!res) {
      throw new Error('Request Error metasv -- ')
    }
    return res
  }

  async getMetaId(rootAddress) {
    const res = await this.callApi({
      url: '/serviceapi/api/v1/metago/getMetaIdByZoreAddress',
      params: {
        data: JSON.stringify({
          zeroAddress: rootAddress,
        }),
      },
    })
    if (res.code === 200) {
      const result = res.result
      return result.rootTxId
    } else if (res.code === 601) {
      return null
    } else {
      throw new Error('无法获取 MetaId')
    }
  }

  async getMetaAccount(metaId) {
    const res = await this.callApi({
      url: '/serviceapi/api/v1/showService/getOwnShowAccount',
      params: {
        data: JSON.stringify({
          showId: metaId,
        }),
      },
    })
    if (res.code === 200) {
      return res.result
    } else if (res.code === 601) {
      return null
    } else {
      throw new Error('无法获取 MetaId')
    }
  }

  async getMetaIdInfo(metaId) {
    const Http = new HttpRequests()
    const url = this.apiPrefix + `/aggregation/v2/app/user/getUserInfo/${metaId}`
    const res = await Http.getFetch(url)
    if (res.code === 0) {
      return res.data
    }
  }

  async getInitAmount(params) {
    console.log('params', params)

    const res = await this.callApi({
      apiPrefix: process.env.VUE_APP_BASEAPI,
      // '/nodemvc/api/v1/pri/wallet/sendInitSatsForMetaSV',
      ///showpaycore/api/v1/wallet/sendInitSatsForMetaSV bsv链路径
      url: `/showpaycore/api/v1/wallet/sendInitSatsForMetaSV`,
      params: {
        address: params.address,
        xpub: params.xpub,
      },
      options: {
        headers: {
          'Content-Type': 'application/json',
          timestamp: new Date().getTime() + '',
          accessKey: params.accessKey,
          userName: params.userName,
        },
      },
    })
    console.log(res)

    if (res.code === 0) {
      const initUtxo = res.result || {}
      return {
        ...initUtxo,
        outputIndex: +initUtxo.index,
        satoshis: +initUtxo.amount,
        value: +initUtxo.amount,
        amount: +initUtxo.amount * 1e-8,
        address: bsv.Script.fromHex(initUtxo.scriptPubkey)
          .toAddress(Network.mainnet)
          .toString(),
        script: initUtxo.scriptPubkey,
        addressType: 0,
        addressIndex: 0,
      }
    } else {
      throw new Error(res.msg)
    }
  }

  async getUtxos(xpub) {
    const res = await this.callMetasvApi(`/xpubLite/${xpub}/utxo`)
    const utxos = []
    if (Array.isArray(res)) {
      res.forEach(item => {
        item.script = bsv.Script.fromAddress(item.address).toHex()
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

  async getAddressUtxos(params) {
    const res = await this.callMetasvApi(`/address/${params.address}/utxo`)
    const utxos = []
    if (Array.isArray(res)) {
      res.forEach(item => {
        item.script = bsv.Script.fromAddress(item.address).toHex()
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

  async getXpubLiteAddressInfo(xpub, address) {
    return new Promise(async (resolve, reject) => {
      const res = await this.callMetasvApi(`/xpubLite/${xpub}/address/${address}`).catch(err => {
        reject(err)
      })
      if (res) {
        resolve(res)
      }
    })
  }

  async broadcast(txHex) {
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

      if (res) {
        await this.sendRawTx(txHex)

        resolve(res)
      }
    })
  }

  // 上报RawTx
  async sendRawTx(txHex) {
    return new Promise(async (resolve, reject) => {
      const sendRawTx = () => {
        // return axios.post(
        //     this.apiPrefix + '/metanet/api/v1/service/sendRawTx',
        //     {
        //         data: JSON.stringify({
        //             rawTx: txHex,
        //             p: 10,
        //         }),
        //     }
        // )
        return axios.post(this.apiPrefix + '/metaid-base/v1/meta/upload/raw', {
          data: JSON.stringify({
            rawTx: txHex,
            // p: 10,
            type: 1,
          }),
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

  async getNftGenesisInfo(sensibleId) {
    const Http = new HttpRequests()
    const url = this.apiPrefix + `/aggregation/v2/app/sensible/getNftGenesisByTxId/${sensibleId}`
    const res = await Http.getFetch(url)
    if (res.code === 0) {
      return res.data
    }
  }

  async getPayMailAddress(email) {
    return axios.post('https://api.showmoney.app' + '/paymail/v2/paymail/address', {
      data: JSON.stringify({ Email: email }),
    })
  }

  async getPulicKeyForNewNode(xpub, parentTxId, count = 50) {
    return new Promise(async (resolve, reject) => {
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

  getPathWithNetWork(params) {
    return new Promise(async (resolve, reject) => {
      const res = await this.callMetasvApi(
        `/xpubLite/${params.xpub}/address/${params.address}`
      ).catch(error => reject(error))
      if (res) {
        resolve(res)
      }
    })
  }
}
