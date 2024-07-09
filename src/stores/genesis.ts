import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { DB } from '@/utils/db'
import { Mitt, MittEvent } from '@/utils/mitt'
import Decimal from 'decimal.js-light'

export const useGenesisStore = defineStore('genesis', {
  state: () =>
    <
      {
        list: Mrc20CollectionItem[]
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
    add: function(genesis: Mrc20CollectionItem) {
      this.list.unshift(genesis)
      DB.genesis.add(genesis)
    },
    updateCurrentTotalSupply: function(params: { collectionPinId: string; count: number }) {
      const index = this.list.findIndex(item => item.collectionPinId === params.collectionPinId)
      if (index !== -1) {
        this.list[index].currentTotalSupply = new Decimal(this.list[index].totalSupply)
          .sub(this.list[index].currentTotalSupply)
          .sub(params.count)
          .toString()

        //  更新本地数据
        DB.genesis.update(params.collectionPinId, this.list[index])
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
