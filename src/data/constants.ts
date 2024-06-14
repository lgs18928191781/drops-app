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
          name: 'quoteTx',
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


