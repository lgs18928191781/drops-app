import { Network } from '@/stores/network'

export const NETWORK: Network = import.meta.env.VITE_NETWORK || 'regtest'

export type BufferEncoding =
  | 'ascii'
  | 'utf8'
  | 'utf-8'
  | 'utf16le'
  | 'utf-16le'
  | 'ucs2'
  | 'ucs-2'
  | 'base64'
  | 'base64url'
  | 'latin1'
  | 'binary'
  | 'hex'

export type EntityCreateOptions = {
  body?: string | Buffer
  contentType?: string
  encryption?: '0' | '1' | '2'
  version?: string
  encoding?: BufferEncoding
}

export type EntityItem = {
  [key: string]: EntityCreateOptions
}

export const EntityOption: EntityItem = {
  buzz: {},
}
