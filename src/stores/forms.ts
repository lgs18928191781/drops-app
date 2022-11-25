import { GroupChannelType } from '@/enum'
import { defineStore } from 'pinia'

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

export const useChannelFormStore = defineStore('channelForm', {
  state: () => {
    return {
      type: GroupChannelType.PublicText,
      name: '',
      password: '',
    }
  },

  getters: {
    isFinished(state) {
      switch (state.type) {
        case GroupChannelType.PublicText:
          return !!state.name
        case GroupChannelType.Password:
          return !!state.name && !!state.password
        case GroupChannelType.NFT:
          return false
        case GroupChannelType.FT:
          return false

        default:
          return true
      }
    },
  },
})

export const usePasswordFormStore = defineStore('passwordForm', {
  state: () => {
    return {
      password: '',
    }
  },

  getters: {
    isFinished(state) {
      return !!state.password
    },
  },
})
