import { defineStore } from 'pinia'

export const useModalsStore = defineStore('modals', {
  state: () => {
    return {
      openRedPacket: null as any,
    }
  },
})
