import { ChannelType } from '@/utils/talk'
import { defineStore } from 'pinia'

export const useTalkStore = defineStore('talk', {
  state: () => {
    return {
      communities: [{ id: '@me' }] as any[],

      activeCommunityId: '' as string,
      activeChannelId: '' as string,

      error: {} as TalkError,
    }
  },

  getters: {
    groupCommunities(state) {
      return state.communities.filter(community => community.id !== '@me')
    },

    activeCommunity(state) {
      return state.communities.find(community => community.id === state.activeCommunityId)
    },

    activeChannel(state): any {
      if (!this.activeCommunity) return null

      return this.activeCommunity.channels?.find((channel: any) => {
        return channel.id === state.activeChannelId
      })
    },

    activeChannelType: state =>
      state.activeCommunityId === '@me' ? ChannelType.Session : ChannelType.Group,
    activeChannelSymbol: state => (state.activeCommunityId === '@me' ? '@' : '#'),
  },

  actions: {
    initChannelMessages(messages: any[]) {
      if (!this.activeChannel) return
      this.activeChannel.pastMessages = messages
      this.activeChannel.newMessages = []
    },

    addMessage(message: any) {
      if (!this.activeChannel) return
      this.activeChannel.newMessages.push(message)
    },
  },
})

export const useCommunityFormStore = defineStore('communityForm', {
  state: () => {
    return {
      icon: null as File | null,
      name: '123',
      description: '',
      cover: null as File | null,
    }
  },

  getters: {
    isStep1Finished(state) {
      return !!state.icon && !!state.name
    },

    isStep2Finished(state) {
      return !!state.description || !!state.cover
    },

    isFinished(state) {
      return !!state.icon && !!state.name
    },

    iconPreviewUrl(state) {
      return state.icon ? URL.createObjectURL(state.icon) : ''
    },

    coverPreviewUrl(state) {
      return state.cover ? URL.createObjectURL(state.cover) : ''
    },
  },
})
