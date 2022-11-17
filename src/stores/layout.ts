import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      isShowLeftNav: false,
      isShowPublishBuzz: false,
      repostTxId: '',
      isShowCreateCommunityModal: false,
    }
  },
  actions: {
    publish(params?: { repostTxId?: string }) {
      this.repostTxId = params?.repostTxId || ''
      this.isShowPublishBuzz = true
    },
  },
})
