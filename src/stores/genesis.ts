import { defineStore } from 'pinia'
import { useUserStore } from './user'

const userStore = useUserStore()
const key = `UserGenesis_${userStore.user?.metaId}`
const genesis = !userStore.isAuthorized
  ? []
  : localStorage.getItem(key)
  ? JSON.parse(localStorage.getItem(key)!)
  : []
export const useGenesisStore = defineStore('genesis', {
  state: () =>
    <
      {
        list: GenesisItem[]
      }
    >{
      list: genesis,
    },
  getters: {},
  actions: {
    add: function(genesis: GenesisItem) {
      this.list.unshift(genesis)
      localStorage.setItem(key, JSON.stringify([...this.list]))
    },
    updateCurrentTotalSupply: function(params: {
      genesis: string
      codehash: string
      count?: number
    }) {
      const index = this.list.findIndex(
        item => item.codehash === params.codehash && item.genesis === params.codehash
      )
      if (index !== -1) {
        this.list[index].totalSupply = params.count
          ? params.count
          : this.list[index].totalSupply + 1

        //  更新本地数据
        localStorage.setItem(key, JSON.stringify([...this.list]))
      }
    },
  },
})
