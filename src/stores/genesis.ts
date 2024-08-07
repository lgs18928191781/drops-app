import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { DB } from '@/utils/db'
import { Mitt, MittEvent } from '@/utils/mitt'
import Decimal from 'decimal.js-light'

export const useGenesisStore = defineStore('genesis', {
  state: () =>
    <
      {
        list: Mrc721CollectionItem[]
        currentMetaId?: string
      }
    >{
      list: [],
    },
  getters: {
    getList: state => {
      return state.list
    },
  },
  actions: {
    add: function(genesis: Mrc721CollectionItem) {
      this.list.unshift(genesis)
      DB.genesis.add(genesis)
    },
    updateItem: function(genesis: Mrc721CollectionItem) {
      DB.genesis.update(genesis.name, genesis)
    },
    updateCurrentTotalSupply: function(params: { name: string; count: number }) {
      const index = this.list.findIndex(item => item.name === params.name)
      if (index !== -1) {
        this.list[index].currentTotalSupply = new Decimal(this.list[index].currentTotalSupply)
          .sub(params.count)
          .toString()

        //  更新本地数据
        DB.genesis.update(params.name, this.list[index])
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
