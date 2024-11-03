import { Network } from '@/stores/network'
import {type EntitySchema} from '@metaid/metaid'

// Sighash types
export const SIGHASH_DEFAULT = 0x00
export const SIGHASH_ALL = 0x01
export const SIGHASH_NONE = 0x02
export const SIGHASH_SINGLE = 0x03
export const SIGHASH_ANYONECANPAY = 0x80
export const SIGHASH_SINGLE_ANYONECANPAY = 0x83
export const SIGHASH_NONE_ANYONECANPAY = 0x82
export const SIGHASH_ALL_ANYONECANPAY = 0x81

export const RELEASE_PAYLOAD_SIZE = 391
export const RELEASE_TX_SIZE = RELEASE_PAYLOAD_SIZE + 68 + 31
export const RECOVER_TX_SIZE = 363
export const BUY_TX_SIZE = 500
export const SELL_TX_SIZE = 673
export const BID_TX_SIZE = 111 + 154 // pay + grant
export const SEND_TX_SIZE = 140
export const SWAP_TX_SIZE = 298
export const SWAP_2X_TX_SIZE = 212 + 240 // 3 inputs
export const RUNES_SWAP_2X_TX_SIZE = 260 + 280 // 3 inputs
export const SWAP_POOL_ADD_TX_SIZE = 255
export const INSCRIBE_TX_SIZE_FACTOR = 380
export const TX_BASE_SIZE = 300

export const DUMMY_UTXO_VALUE = 600
export const DUMMY_UTXO_OUTPUT_VALUE = 1200
export const DUST_UTXO_VALUE = 546
export const PIN_UTXO_VALUE=546
export const MS_BRC20_UTXO_VALUE = 1000
export const ONE_SERVICE_FEE = 10_000
export const SELL_SERVICE_FEE = 16_000
export const EXTRA_INPUT_MIN_VALUE = 600
export const DUMMY_UTXO_INPUT_LEGACY=1001
export const DUMMY_UTXO_OUTPUT_LEGACY=2002
export const NETWORK: Network = import.meta.env.VITE_NETWORK || 'mainnet'
export const PlatformRate=6
export const MinPlatformFee=2000
export const MinRoyaltyFee=1000
export const REDEEM_SERVICE_FEE=1000
export const CONVERT_SERVICE_FEE=2000
export const MRC721PlatformAddress=`tb1plh4xg3ks7jfcrrx9hpa9exrrzq6gq9jc48n0cch48tcxttlppuas9trkyh`
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

export enum NftOrderState{
  empty=0,
  onSale=1,
  isSaled=2,
  offSale=3,
  destory=4
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


export const mintNftItemSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'nftsItem',
    nodeName: 'nftsItem',
    path:`/nft/mrc721/${collectionName}`,
    versions:[
      {
        version: 1,
        id:'',
        body:[]
      }
    ]
  }
}

export const mintNftItemDescSchema = (collectionName:string):EntitySchema =>{
  return {
    name:'nftsItemDesc',
    nodeName: 'nftsItemDesc',
    path:`/nft/mrc721/${collectionName}/item_desc`,
    versions:[
      {
        version: 1,
        id:'',
        body:[
          {
            name:'pinid',
            type:'string'
          },
          {
            name:'name',
            type:'string'
          },
          {
            name:'desc',
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


