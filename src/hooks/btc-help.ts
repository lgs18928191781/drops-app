import { PsbtTxOutput, type Psbt, TxOutput } from 'bitcoinjs-lib'

export function toXOnly(pubKey: Buffer) {
  return pubKey.length === 32 ? pubKey : pubKey.slice(1, 33)
}



