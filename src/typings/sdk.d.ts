import { CreateNftParams } from "@/api";
import { ProtocolOptions } from "metaidjs";

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
        encrypt: string,
        data_type: string
    }
}
export interface MetaIdJsRes extends NftFunParams{
    code: number,
    data: any,
    status: string,
    handlerId: string
}
export interface SdkGenesisNFTRes extends MetaIdJsRes{
    data: {
        codehash: string
        genesisId: string
        genesisTxid: string
    }
}

export interface SendMetaDataTxRes extends MetaIdJsRes{
    data: {
        txId: string
    }
}

export interface CreateNftFunParams extends NftFunParams{
    data: CreateNftParams
}

export enum SdkCallBackCodes {
    success = 200
}


export interface SdkCallBack {
    code: SdkCallBackCodes
    data: any,
    status: string
}

export interface IssueNFTResData extends MetaIdJsRes {
    data:{
      metaTdid: string
      nftId: string
      tokenId: string
      txId: string
    }
}