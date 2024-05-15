import { Network } from '@/stores/network'
import  {type CreateOptions} from '@metaid/metaid'
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




