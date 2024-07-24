import { Network } from '@/stores/network'
import {type EntitySchema} from '@metaid/metaid'

export const NETWORK: Network = import.meta.env.VITE_NETWORK || 'mainnet'

// type EntitySchema = {
//   name: string
//   path: string
//   versions: {
//     version: number
//     body: any[]
//   }[]
// }

export enum NftsLaunchPadChain{
  btc='Bitcoin',
  mvc='MicrovisionChain'
}

export enum NftsLaunchPadChainSymbol{
  btc='btc',
  mvc='mvc'
}


export type CustomSchemaParams={
  nodeName:string
  isProtocolSub:boolean
  version:number
  body:Array<{
    name:string
    type:'string' | 'number' | 'array'
  }>
}

export const followSchema:EntitySchema = {
  name: 'follow',
  nodeName: 'follow',
  path:'/follow',
  versions: [
    {
      version: 1,
      id:'',
      body: [
        {
          name: 'followTo',
          type: 'string',
        },
      ],
    },
  ],
}



export const payCommentSchema:EntitySchema = {
  name: 'paycomment',
  nodeName: 'paycomment',
  path:'/protocols/paycomment',
  versions: [
    {
      version: 1,
      id:'',
      body: [
        {
          name: 'content',
          type: 'string',
        },
        {
          name: 'commentTo',
          type: 'string',
        },
        {
          name: 'replyTo',
          type: 'string',
        },
        {
          name: 'pay',
          type: 'string',
        },
        {
          name: 'payTo',
          type: 'string',
        },
      ],
    },
  ],
}


export const mintNftNameSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'collection',
    nodeName: 'collection',
    path:`/nft/mrc721/${collectionName}`,
    versions:[
      {
        version: 1,
        id:'',
        body:[
          
        ]
      }
    ]
  }
}

export const mintNftDescSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'collectionDesc',
    nodeName: 'collectionDesc',
    path:`/nft/mrc721/${collectionName}/collection_desc`,
    versions:[
      {
        version: 1,
        id:'',
        body:[
          {
            name:'name',
            type:'string'
          },
          {
            name:'totalSupply',
            type:'number'
          },
          {
            name:'royaltyRate',
            type:'number'
          },
          {
            name:'desc',
            type:'string'
          },
          {
            name:'website',
            type:'string'
          },
          {
            name:'cover',
            type:'string'
          },
          {
            name:'metadata',
            type:'object'
          },
        ]
      }
    ]
  }
}


export const mintNftItemSchema = (collectionName:string,nftPinId:string):EntitySchema =>{
  return {
    name:'nftsItem',
    nodeName: 'nftsItem',
    path:`/nft/mrc721/${collectionName}/${nftPinId}`,
    versions:[
      {
        version: 1,
        id:'',
        body:[]
      }
    ]
  }
}






export const simpleRepostSchema:EntitySchema = {
  name: 'simplebuzz',
  nodeName: 'simplebuzz',
  path:'/protocols/simplebuzz',
  versions: [
    {
      version: 1,
      id:'',
      body: [
        {
          name: 'content',
          type: 'string',
        },
        {
          name: 'quotePin',
          type: 'string',
        },
        {
          name: 'attachments',
          type: 'array',
        },
       
      ],
    },
  ],
}



export const customizeSchema=(params:CustomSchemaParams):EntitySchema=>{
  const {nodeName,isProtocolSub,version,body}=params
  return {
    name:nodeName,
    nodeName:nodeName,
    path:isProtocolSub ? `/protocols/${nodeName}` : nodeName,
    versions:[
      {
          version:version ?? 1,
          id:'',
          body:body
      }
    ]
  }
}


export enum BufferEncoding {
  ascii = 'ascii',
  utf8 = 'utf8',
  //['utf-8']='utf-8',
  utf16le = 'utf16le',
  //['utf-16le']='utf-16le',
  ucs2 = 'ucs2',
  //['ucs-2']= 'ucs-2',
  base64 = 'base64',
  base64url = 'base64url',
  latin1 = 'latin1',
  binary = 'binary',
  hex = 'hex',
}


