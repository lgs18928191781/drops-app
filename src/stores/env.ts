import { defineStore } from 'pinia'

export const useEnvStore = defineStore('env', {
  getters: {
    network: () => {
      return import.meta.env.VITE_NET_WORK
    },

    metaIdTag: () => {
      if (import.meta.env.VITE_NET_WORK === 'testnet') {
        return import.meta.env.VITE_METAID_TAG_TESTNET
      }

      return import.meta.env.VITE_METAID_TAG_MAINNET
    },

    brfcIds: () => {
      return {
        simpleGroupChat: '96e2649ce8b6',
      }
    },
  },
})
