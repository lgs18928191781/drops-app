import { defineStore } from 'pinia'
import { networks } from 'bitcoinjs-lib'
import { NETWORK } from '@/data/constants'

export type Network = 'livenet' | 'testnet' | 'regtest'

export const useNetworkStore = defineStore('network', {
  getters: {
    network: () => NETWORK,
    btcNetwork: () =>
      NETWORK === 'livenet' ? 'bitcoin' : NETWORK === 'regtest' ? 'regtest' : 'testnet',
    typedNetwork: () =>
      NETWORK === 'livenet'
        ? networks.bitcoin
        : NETWORK === 'regtest'
        ? networks.regtest
        : networks.testnet,
    isTestnet: () => NETWORK === 'testnet',
  },
})