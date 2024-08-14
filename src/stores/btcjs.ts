import { defineStore } from 'pinia'
type BitcoinJs = typeof import('bitcoinjs-lib')
import { type ECPairAPI } from 'ecpair'
import * as secp256k1 from 'tiny-secp256k1'
export const useBtcJsStore = defineStore('btcjs', {
  state: () => {
    return {
      btcjs: undefined as BitcoinJs | undefined,
      ECPair: undefined as ECPairAPI | undefined,
    }
  },

  getters: {
    get: (state) => state.btcjs,
  },

  actions: {
    set(btcjs: BitcoinJs) {
      btcjs.initEccLib(secp256k1)
      this.btcjs = btcjs
    },
    setECPair(ECPair: ECPairAPI) {
      this.ECPair = ECPair
    },
  },
})
