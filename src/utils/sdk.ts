import {
  ConstructorOptionsTypes,
  CreateMetaFileFunParams,
  IssueNFTResData,
  MetaIdJsRes,
  ProtocolParamsTypes,
  SdkCallBack,
  SdkGenesisNFTRes,
  SendMetaDataTxRes,
} from '@/typings/sdk'
import { rejects } from 'assert/strict'
import MetaIdJs, { ProtocolOptions } from 'metaidjs'
// @ts-ignore
import { v4 as uuid } from 'uuid'

import { ElMessage } from 'element-plus'

import { store } from '@/store'


const metaIdTag = import.meta.env.VITE_MetaIdTag
export default class Sdk {
  metaidjs: null | MetaIdJs = null
  appMetaidjs: null | {
    sendMetaDataTx: (accessToken: string, data: string, functionName: string) => Function
    decryptData: (accessToken: string, data: string, functionName: string) => Function
    getUserInfo: (appId: string, appScrect: string, functionName: string) => Function
    genesisNFT: (nftTotal: number, functionName: string) => Function
  } = null
  isApp: boolean = false
  appId: string = ''
  appScrect: string = ''
  constructor(options?: ConstructorOptionsTypes) {
    this.appId = import.meta.env.VITE_AppId
    this.appScrect = import.meta.env.VITE_AppSecret
    // @ts-ignore
    const appMetaIdJs = window?.appMetaIdJsV2
      ? window?.appMetaIdJsV2
      : window?.appMetaIdJs
      ? window?.appMetaIdJs
      : null
    if (appMetaIdJs) {
      this.appMetaidjs = appMetaIdJs
      this.isApp = true
    } else {
      if (options) {
        this.metaidjs = new MetaIdJs(options)
      }
    }
  }

  sendMetaDataTx(params: {
    data: string,
    nodeName: string,
    brfcId: string,
    attachments?: string [],
    path: string,
    payCurrency?: string,
    payTo?: { amount: number, address: string} [],
    needConfirm?: boolean,
    encrypt?: string,
    dataType?: string,
  }) {
    return new Promise<SendMetaDataTxRes>((resolve, reject) => {
      if (!params.payCurrency) params.payCurrency = 'BSV'
      if (!params.needConfirm) params.needConfirm = true
      if (!params.encrypt) params.encrypt = '0'
      if (!params.dataType) params.dataType = 'application/json'
      const accessToken = store.state.token ? store.state.token?.access_token : ''
      if (this.isApp) {
        const functionName: string = `sendMetaDataTxCallBack`
        // @ts-ignore
        window[functionName] = params.callback
        this.appMetaidjs?.sendMetaDataTx(accessToken, JSON.stringify(params), functionName)
      } else {
        const _params = {
          callback: (res: MetaIdJsRes) => {
            this.callback(res, resolve)
          },
          onCancel: (res: MetaIdJsRes) => {
            reject(res)
          },
          accessToken,
          ...params,
        }
        console.log(_params)
        this.metaidjs?.sendMetaDataTx({
          callback: (res: MetaIdJsRes) => {
            this.callback(res, resolve)
          },
          onCancel: (res: MetaIdJsRes) => {
            reject(res)
          },
          accessToken,
          ...params,
        })
      }
    })
  }

  getUserInfo(params: { accessToken: string; callback?: Function }) {
    if (this.isApp) {
      const functionName: string = `getUserInfoCallBack`
      // @ts-ignore
      window[functionName] = params.callback
      this.appMetaidjs?.getUserInfo(this.appId, this.appScrect, functionName)
    } else {
      this.metaidjs?.getUserInfo(params)
    }
  }

  eciesDecryptData(params: { accessToken: string; callback?: Function; data: string }) {
    if (this.isApp) {
      const functionName: string = `eciesDecryptDataCallBack`
      // @ts-ignore
      window[functionName] = params.callback
      this.appMetaidjs?.decryptData(params.accessToken, params.data, functionName)
    } else {
      this.metaidjs?.eciesDecryptData(params)
    }
  }

  createMetaFile(params: CreateMetaFileFunParams) {
    const { name, ...data } = params.data
    const nameArry = name.split('.')
    let node_name: string = ''
    nameArry.map((item, index) => {
      node_name += item
      if (index === nameArry.length - 2) {
        node_name += uuid()
      }
    })
    return this.sendMetaDataTx({
      nodeName: 'NftIssue-6d3eaf759bbc',
      brfcId: '6d3eaf759bbc',
      path: '/Protocols/MetaFile',
      payCurrency: 'bsv',
      // payTo: [
      //     { address: 'XXXXXXXXXX', amount: 1000 }
      // ],
      data: JSON.stringify({
        ...data,
        encoding: 'binary',
        node_name,
      }),
      needConfirm: false,
    })
  }

  genesisNFT(params: { nftTotal: number }): Promise<SdkGenesisNFTRes> {
    return new Promise<SdkGenesisNFTRes>((resolve, reject) => {
      const _params = {
        data: {
          nftTotal: params.nftTotal,
        },
        callback: (res: SdkGenesisNFTRes) => {
          this.callback(res, resolve)
        },
      }
      if (this.isApp) {
        const functionName: string = `genesisNFTCallBack`
        // @ts-ignore
        window[functionName] = _params.callback
        this.appMetaidjs?.genesisNFT(params.nftTotal, functionName)
      } else {
        this.metaidjs?.genesisNFT(_params)
      }
    })
  }

  
  issueNFT(params: {
    receiverAddress: string //  创建者接收地址
    genesisId: string //
    genesisTxid: string
    codehash: string
    nftname: string
    nftdesc: string
    nfticon: string
    nftwebsite: string
    nftissuerName: string
  }) {
    return new Promise<IssueNFTResData>((resolve, reject) => {
      const _params = {
        data: params,
        callback: (res: MetaIdJsRes) => {
          debugger
          this.callback(res, resolve)
        },
      }
      if (this.isApp) {
        const functionName: string = `issueNFTCallBack`
        // @ts-ignore
        window[functionName] = _params.callback
        // @ts-ignore
        this.appMetaidjs?.issueNFT(functionName)
      } else {
        // @ts-ignore
        this.metaidjs?.issueNFT(_params)
      }
    })
  }

  async createNftData(params: {
    type: number,
    name: string, // nft名称
    intro: string, // nft描述
    cover: MetaFile, // nft封面 MetaFile协议地址
    originalFile?: MetaFile, // nft原文件 MetaFile协议地址
    txId?: string // 使用txId创建时的txId
  }) {
    const { data, attachments } = await this.setAttachments(params, [ { name: 'cover', encrypt: '0'}, { name: 'originalFile', encrypt: '1'}])
    return this.sendMetaDataTx({
        data: JSON.stringify(data),
        nodeName: 'NFTData',
        brfcId: '123456789',
        path: '/Protocols/TestNFTData',
        attachments,
    })
  }

  // 统一回调处理
  callback(
    res: MetaIdJsRes,
    resolve: { (value: MetaIdJsRes | PromiseLike<MetaIdJsRes>): void; (arg0: MetaIdJsRes): void }
  ) {
    if (res.code !== 200) {
      ElMessage.error(res.data.message)
    }
    resolve(res)
  }

  // 处理附件
  setAttachments(_data: any, fileAttrs: { name: string, encrypt: string } []) {
    return new Promise<{ data: any; attachments: any}>(resolve => {
      const attachments: {
        fileName: string,
        fileType: string,
        data: string,
        encrypt: string
      } []= []
      const data = { ..._data }
      fileAttrs.map((item, index) => {
        for (let i in  data) {
          if (i === item.name) {
            if (typeof data[i] !== 'string') {
              attachments.push({
                fileName: data[i].name,
                fileType: data[i].data_type,
                data: data[i].hexData,
                encrypt: item.encrypt
              });
              data[i] = `![metafile](${index})`
            }
          }
        }
      })
      resolve({ data, attachments })
    })
  }
}
