import MetaIdJs, { ProtocolOptions } from "metaidjs"

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
export default class Sdk{
    metaidjs: null | MetaIdJs = null
    appMetaidjs: null | {
        sendMetaDataTx: (accessToken: string, data: string, functionName: string) => Function
        decryptData: (accessToken: string, data: string, functionName: string) => Function
        getUserInfo: (appId: string, appScrect: string, functionName: string) => Function
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
}