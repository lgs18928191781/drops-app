import { ChannelPublicityType } from '@/enum'
import { ChannelType, GroupChannelType } from '@/utils/talk'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useTalkStore = defineStore('talk', {
  state: () => {
    return {
      communities: [{ id: '@me' }] as any[],
      members: [] as any,

      activeCommunityId: '' as string,
      activeChannelId: '' as string,

      error: {} as TalkError,
    }
  },

  getters: {
    realCommunities(state) {
      return state.communities.filter(community => community.id !== '@me')
    },

    atMeCommunity(state) {
      return state.communities.find(community => community.id === '@me')
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

    isAdmin(): any {
      return (selfMetaId: string) => {
        if (!this.activeCommunity) return false
        if (!this.activeCommunity.admins) return false

        return this.activeCommunity.admins.includes(selfMetaId)
      }
    },

    isActiveChannelPublic(): boolean {
      if (!this.activeChannel) return true

      return this.activeChannel.roomType === ChannelPublicityType.Public
    },

    newMessages(): any {
      if (!this.activeChannel) return []

      return this.activeChannel.newMessages
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
      if (!this.activeChannel.newMessages) {
        this.activeChannel.newMessages = []
      }

      this.activeChannel.newMessages.push(message)
    },

    // 有社区但没有频道的情况
    setDefaultChannel() {
      if (!this.activeCommunityId || !this.activeCommunity.channels?.length) {
        this.activeChannelId = ''
        return
      }

      this.activeChannelId = this.activeCommunity.channels[0].id
    },
  },
})

export const useCommunityFormStore = defineStore('communityForm', {
  state: () => {
    return {
      icon: null as File | null,
      name: 'test-1',
      description: 'test-1',
      cover: null as File | null,
    }
  },

  getters: {
    isStep1Finished(state) {
      return !!state.icon && !!state.name
    },

    isStep2Finished(state) {
      return !!state.description && !!state.cover
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

export const userChannelFormStore = defineStore('channelForm', {
  state: () => {
    return {
      type: GroupChannelType.PublicText,
      name: 'text channel',
    }
  },

  getters: {
    isFinished(state) {
      return !!state.name
    },
  },
})
