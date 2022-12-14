import { GroupChannelType } from '@/enum'
import { giveRedPacket, updateCommunity } from '@/utils/talk'
import { sleep } from '@/utils/util'
import { defineStore } from 'pinia'
import { useLayoutStore } from './layout'
import { useTalkStore } from './talk'
import { useUserStore } from './user'

export const useCommunityFormStore = defineStore('communityForm', {
  state: () => {
    return {
      icon: null as File | null,
      description: '',
      cover: null as File | null,
      metaName: null as any,
    }
  },

  getters: {
    isStep1Finished(state) {
      return !!state.icon && !!state.metaName
    },

    isStep2Finished(state) {
      return !!state.description && !!state.cover
    },

    isFinished(state) {
      return !!state.icon && !!state.metaName
    },

    isAllFinished(state) {
      return !!state.icon && !!state.metaName && !!state.description && !!state.cover
    },

    iconPreviewUrl(state) {
      return state.icon ? URL.createObjectURL(state.icon) : ''
    },

    coverPreviewUrl(state) {
      return state.cover ? URL.createObjectURL(state.cover) : ''
    },
  },

  actions: {
    reset() {
      this.icon = null
      this.description = ''
      this.cover = null
      this.metaName = null
    },
  },
})

export const useCommunityUpdateFormStore = defineStore('communityUpdateForm', {
  state: () => {
    return {
      icon: null as File | null,
      description: '',
      cover: null as File | null,
      original: null as any,
    }
  },

  getters: {
    isChanged(state) {
      const descriptionChanged = state.description !== state.original.description
      return state.icon || state.cover || descriptionChanged
    },

    isFinished(state): boolean {
      return this.isChanged && this.description !== ''
    },

    iconPreviewUrl(state) {
      return state.icon ? URL.createObjectURL(state.icon) : ''
    },

    coverPreviewUrl(state) {
      return state.cover ? URL.createObjectURL(state.cover) : ''
    },
  },

  actions: {
    reset() {
      this.icon = null
      this.description = ''
      this.cover = null
    },

    resetInForm() {
      this.icon = null
      this.cover = null
      this.description = this.original.description
    },

    async submit() {
      if (!this.isFinished) return

      const layout = useLayoutStore()
      const user = useUserStore()
      layout.isShowCreateCommunityModal = false
      layout.isShowLoading = true
      const form = {
        icon: this.icon,
        description: this.description,
        cover: this.cover,
        original: this.original,
      }
      const { communityId } = await updateCommunity(form, user.showWallet)
      layout.isShowLoading = false
      this.reset()

      return
    },
  },
})

export const useChannelFormStore = defineStore('channelForm', {
  state: () => {
    return {
      type: GroupChannelType.PublicText,
      name: '',
      password: '',
      chain: null as any,
      nft: null as any,
      ft: null as any,
      amount: 1,
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
          return !!state.name && !!state.nft && !!state.chain
        case GroupChannelType.FT:
          return !!state.name && !!state.ft && !!state.chain

        default:
          return true
      }
    },
  },

  actions: {
    reset() {
      this.type = GroupChannelType.PublicText
      this.name = ''
      this.password = ''
      this.nft = null
      this.ft = null
      this.chain = null
      this.amount = 1
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

export const useRedPacketFormStore = defineStore('redPacketForm', {
  state: () => {
    return {
      amount: 0.0003 as number | '',
      quantity: 5,
      message: '',
    }
  },

  getters: {
    nicerAmount(state): string {
      if (state.amount === '') return '0'
      // 小于 0.01 的红包金额，会使用sat为单位
      return state.amount < 0.01 ? (state.amount * 100000000).toFixed(0) : state.amount.toFixed(2)
    },

    amountUnit(state) {
      if (state.amount === 0 || state.amount === '') return 'Space'
      return state.amount < 0.01 ? 'sats' : 'Space'
    },

    nicerAmountWithUnits(state): string {
      return this.nicerAmount + ' ' + this.amountUnit
    },

    isFinished(state) {
      return !!state.amount || !!state.quantity
    },
  },

  actions: {
    reset() {
      this.amount = 0
      this.quantity = 1
      this.message = ''
    },

    async submit() {
      const talk = useTalkStore()
      const user = useUserStore()
      const layout = useLayoutStore()
      if (!this.isFinished) return

      layout.isShowRedPacketModal = false
      layout.isShowLoading = true
      await giveRedPacket(
        {
          amount: this.amount,
          message: this.message,
          quantity: this.quantity,
        },
        talk.activeChannelId,
        talk.selfMetaId,
        user.showWallet
      )
      layout.isShowLoading = false
      this.reset()
    },
  },
})
