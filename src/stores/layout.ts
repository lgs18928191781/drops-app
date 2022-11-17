import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      showLeftNav: false,
      isShowPublishBuzz: false,
      repostTxId: '',
    }
  },
  actions: {
    publish(params?: { repostTxId?: string }) {
      this.repostTxId = params?.repostTxId || ''
      this.isShowPublishBuzz = true
    },
  },
})
