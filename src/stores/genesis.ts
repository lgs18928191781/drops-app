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
      localStorage.setItem(key, JSON.stringify({ ...this.list }))
    },
  },
})
