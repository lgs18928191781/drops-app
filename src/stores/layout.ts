import { Channel } from '@/@types/talk'
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
      isShowRedPacketOpenModal: false,
      isShowRedPacketResultModal: false,
      isShowInviteModal: false,
      isShowShareToBuzzModal: false,
      isShowShareSuccessModal: false,
      isShowAcceptInviteModal: false,
      isShowMessagesLoading: false,
      isShowCommunitySettingsModal: false,
      isShowMemberList: true,
      isShowPasswordModal: false,
      isShowRequireNftModal: false,
      isShowRequireFtModal: false,
      isShowUserInfo: true,
      isShowLoading: false,
      never: false,
      isShowWallet: false,
    }
  },
  actions: {},
})
