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
