import { CreateNftParams } from "@/api"
import { rejects } from "assert/strict";
import MetaIdJs, { ProtocolOptions } from "metaidjs"
import { resolve } from "path/posix";
// @ts-ignore
import { v4 as uuid } from 'uuid';

export interface ConstructorOptionsTypes {
    baseUri?: string;
    oauthSettings: OauthSettingsTypes;
    onLoaded?: Function;
    onError?: Function;
}
export interface OauthSettingsTypes {
    clientId: string;
    redirectUri: string;
    clientSecret?: string;
    scope?: string;
    responseType?: string;
}
export interface ProtocolParamsTypes extends ProtocolOptions, BaseParamsType {
  accessToken: string;
  handlerId?: string;
}
export interface BaseParamsType {
    accessToken: string;
    callback?: Function;
    onCancel?: Function;
}

export interface appMetaIdJsParams {
    accessToken: string;
    data: any;
    onCancel?: Function;
}

export interface NftFunParams { 
    accessToken: string
}

export interface CreateMetaFileFunParams extends NftFunParams{
    data: {
        name: string,
        data: string,
        encrypt: 1,
        data_type: string
    }
}
export interface MetaIdJsRes extends NftFunParams{
    code: number,
    data: any,
    status: string,
    handlerId: string
}

export interface CreateNftFunParams extends NftFunParams{
    data: CreateNftParams
}

const metaIdTag = import.meta.env.VITE_MetaIdTag
export default class Sdk{
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
        const appMetaIdJs = window?.appMetaIdJsV2 ? window?.appMetaIdJsV2 : window?.appMetaIdJs ? window?.appMetaIdJs : null
        if (appMetaIdJs) {
            this.appMetaidjs = appMetaIdJs
            this.isApp = true
        } else {
            if (options) {
                this.metaidjs = new MetaIdJs(options)
            }
        }
    }

    sendMetaDataTx (params: ProtocolParamsTypes) {
        if (this.isApp) {
            const functionName: string = `sendMetaDataTxCallBack`
            // @ts-ignore
            window[functionName] = params.callback
            this.appMetaidjs?.sendMetaDataTx(
                params.accessToken,
                JSON.stringify(params),
                functionName
            )
        } else {
            this.metaidjs?.sendMetaDataTx(params)
        }
    }

    getUserInfo (params: {
        accessToken: string;
        callback?: Function;
    }) {
        if (this.isApp) {
            const functionName: string = `getUserInfoCallBack`
            // @ts-ignore
            window[functionName] = params.callback
            this.appMetaidjs?.getUserInfo(
                this.appId,
                this.appScrect,
                functionName
            )
        } else {
            this.metaidjs?.getUserInfo(params)
        }
    }

    eciesDecryptData (params: {
        accessToken: string;
        callback?: Function;
        data: string;
    }) {
        if (this.isApp) {
            const functionName: string = `eciesDecryptDataCallBack`
            // @ts-ignore
            window[functionName] = params.callback
            this.appMetaidjs?.decryptData(
                params.accessToken,
                params.data,
                functionName
            )
        } else {
            this.metaidjs?.eciesDecryptData(params)
        }
    }

    
    createMetaFile (params: CreateMetaFileFunParams) {
        return new Promise((resolve, reject) => {
            const { name, ...data } = params.data
            const nameArry =  name.split('.')
            let node_name: string = ''
            nameArry.map((item, index) => {
                node_name += item
                if (index === nameArry.length - 2){
                    node_name += uuid()
                }
            }) 
            this.sendMetaDataTx({
                accessToken: params.accessToken,
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
                    node_name
                }),
                needConfirm: false,
                isFirstProtocolChild: false,
                metaIdTag,
                callback: (res: MetaIdJsRes) => {
                    resolve(res)
                },
                onCancel: (res: MetaIdJsRes) => {
                    reject(res)
                },
            })
        })
    }

    genesisNFT (params: {
        nftTotal: number,
        callback?: () => any
    }) {
        return new Promise<MetaIdJsRes>((resolve, reject) => {
            if (this.isApp) {
                const functionName: string = `genesisNFTCallBack`
                // @ts-ignore
                window[functionName] = params.callback
                this.appMetaidjs?.genesisNFT(
                    params.nftTotal,
                    functionName
                )
            } else {
                this.metaidjs?.genesisNFT(params)
            }
        })
    }

    issueNFT (params: {
        receiverAddress: string; //  创建者接收地址
        genesisId: string;  //
        genesisTxid: string;
        codehash: string;
        nftname: string;
        nftdesc: string;
        nfticon: string;
        nftwebsite: string;
        nftissuerName: string;
        callback?: () => any;
        handlerId?: any;
    }) {
        return new Promise<MetaIdJsRes>((resolve, reject) => {
            if (this.isApp) {
                const functionName: string = `issueNFTCallBack`
                // @ts-ignore
                window[functionName] = params.callback
                this.appMetaidjs?.issueNFT(
                    params.nftTotal,
                    functionName
                )
            } else {
                this.metaidjs?.issueNFT(params)
            }
        })
    }
}