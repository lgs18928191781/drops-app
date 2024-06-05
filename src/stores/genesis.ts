import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { DB } from '@/utils/db'
import { Mitt, MittEvent } from '@/utils/mitt'

export const useGenesisStore = defineStore('genesis', {
  state: () =>
    <
      {
        list: GenesisItem[]
        currentMetaId?: string
      }
    >{
      list: [],
    },
  getters: {
   

  },
  actions: {
    add: function(genesis: GenesisItem) {
      this.list.unshift(genesis)
      DB.genesis.add(genesis)
    },
    updateCurrentTotalSupply: function(params: {
      genesis: string
      codehash: string
      count?: number
    }) {
      const index = this.list.findIndex(
        item => item.codehash === params.codehash && item.genesis === params.genesis
      )
      if (index !== -1) {
        this.list[index].currentTotalSupply = params.count
          ? params.count
          : this.list[index].currentTotalSupply + 1

        //  更新本地数据
        DB.genesis.update(params.genesis, this.list[index])
      }
    },
    initGenesis: async function() {
      const userStore = useUserStore()
      if (userStore.isAuthorized) {
        const genesisLlist = await DB.genesis
          .where('metaId')
          .equals(userStore.user!.metaId)
          .toArray()
        this.list = genesisLlist
      } else {
        this.list = []
      }
    },
  },
})
