import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      isShowLeftNav: false,
      isShowPublishBuzz: false,
      isShowCreateCommunityModal: false,
      isShowCreateChannelModal: false,
      isShowRedPacketModal: false,
      isShowMessagesLoading: false,
      publishBuzzOption: {
        repostTxId: '', // 转发的TxId
        topic: '', // 发表话题
      },
    }
  },
  actions: {
    publish(params?: { repostTxId?: string; topic?: string }) {
      this.publishBuzzOption.repostTxId = params?.repostTxId || ''
      this.publishBuzzOption.topic = params?.topic || ''
      this.isShowPublishBuzz = true
    },
  },
})
