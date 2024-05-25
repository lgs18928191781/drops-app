import { Network } from '@/stores/network'

export const NETWORK: Network = import.meta.env.VITE_NETWORK || 'testnet'

type EntitySchema = {
  name: string
  path: string
  versions: {
    version: number
    body: any[]
  }[]
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

export const buzzSchema: EntitySchema = {
  name: 'buzz',
  path: '/protocols/simplebuzz',
  versions: [
    {
      version: 1,
      body: [
        {
          name: 'content',
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

export const fileSchema = {
  name: 'file',
  nodeName: 'MetaFile',
  encoding: 'binary',
  versions: [
    {
      version: '1.0.1',
      body: '',
    },
  ],
}

export const followSchema = {
  name: 'follow',
  nodeName: 'follow',
  path: '/follow',
  encoding: 'utf8',
  versions: [
    {
      version: '1.0.1',
      id:'',
      body: '',
    },
  ],
}

export const likeSchema = {
  name: 'like',
  path: '/protocols/payLike',
  versions: [
    {
      version: 1,
      body: [
        {
          name: 'likeTo',
          type: 'string',
        },
        {
          name: 'isLike',
          type: 'string',
        },
      ],
    },
  ],
}
