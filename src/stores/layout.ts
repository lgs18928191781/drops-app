import { checkUserLogin } from '@/utils/util'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      isShowLeftNav: false,
      isShowPublishBuzz: false,
      isShowCreateCommunityModal: false,
      isShowCreatePublicChannelModal: false,
      isShowCreateConsensualChannelModal: false,
      isShowSettingsModal: false,
      isShowChooseTokenModal: false,
      isShowChooseMetaNameModal: false,
      isShowRedPacketModal: false,
      isShowInviteModal: false,
      isShowAcceptInviteModal: false,
      isShowMessagesLoading: false,
      isShowMemberList: true,
      isShowPasswordModal: false,
      isShowRequireNftModal: false,
      isShowLoading: false,
      isShowRedPacketOpenModal: false,
      never: false,
      publishBuzzOption: {
        repostTxId: '', // 转发的TxId
        topic: '', // 发表话题
      },
    }
  },
  actions: {
    async publish(params?: { repostTxId?: string; topic?: string }) {
      await checkUserLogin()
      this.publishBuzzOption.repostTxId = params?.repostTxId || ''
      this.publishBuzzOption.topic = params?.topic || ''
      this.isShowPublishBuzz = true
    },
  },
})
