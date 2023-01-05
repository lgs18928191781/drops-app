import { GroupChannelType, RedPacketDistributeType } from '@/enum'
import { giveRedPacket, updateCommunity } from '@/utils/talk'
import { sleep } from '@/utils/util'
import { defineStore } from 'pinia'
import { useLayoutStore } from './layout'
import { getCommunityAuth } from '@/api/talk'
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

      const metaName = await getCommunityAuth(this.original.communityId)

      const layout = useLayoutStore()
      const user = useUserStore()
      layout.isShowCreateCommunityModal = false
      layout.isShowLoading = true
      const form = {
        icon: this.icon,
        description: this.description,
        cover: this.cover,
        original: this.original,
        metaName,
      }
      await updateCommunity(form, user.showWallet)

      this.reset()
      await sleep(1000)
      layout.isShowCommunitySettingsModal = false
      layout.isShowLoading = false

      // 跳转刷新
      window.location.reload()
    },
  },
})

export interface ChannelFormState {
  type: GroupChannelType
  name: string
  password: string
  chain: null | string
  nft: null | UserNFTItem
  ft: null | FungibleToken
  amount: number
  adminOnly: boolean // 发言设置，0：所有人，1：管理员
  uuid?: string
  // 修改
  publicKey?: string
  txId?: string
}
export const useChannelFormStore = defineStore('channelForm', {
  state: () => {
    return <ChannelFormState>{
      type: GroupChannelType.PublicText,
      name: '',
      password: '',
      chain: null as any,
      nft: null as any,
      ft: null as any,
      amount: 1,
      adminOnly: false, // 发言设置，0：所有人，1：管理员
      publicKey: undefined,
      uuid: undefined, // 用于 订阅和 key， 不可修改
      txId: undefined,
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
      this.adminOnly = false
      this.publicKey = undefined
      this.uuid = undefined
      this.txId = undefined
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
      amount: 1000 as number | '',
      each: 1000 as number,
      quantity: 1,
      message: '',
      type: RedPacketDistributeType.Random,
      nft: null as any,
      chain: null as any,
    }
  },

  getters: {
    nicerAmount(state): string {
      if (state.amount === '') return '0'
      // 小于 0.01 的红包金额，会使用sat为单位

      return state.amount.toFixed(0)
      // return state.amount < 0.01 ? (state.amount * 100000000).toFixed(0) : state.amount.toFixed(2)
    },

    amountUnit(state) {
      return 'sats'
      // if (state.amount === 0 || state.amount === '') return 'Space'
      // return state.amount < 0.01 ? 'sats' : 'Space'
    },

    nicerAmountWithUnit(state): any {
      return {
        amount: this.nicerAmount,
        unit: this.amountUnit,
      }
    },

    isFinished(state) {
      if (state.type === RedPacketDistributeType.Nft) {
        return !!state.each && !!state.quantity && !!state.nft && !!state.chain
      }

      return !!state.amount && !!state.quantity
    },
  },

  actions: {
    validateQuantity() {
      if (this.quantity < 1) {
        this.quantity = 1
      }
      if (this.quantity > 100) {
        this.quantity = 100
      }

      // 金额校验
      if (this.type === RedPacketDistributeType.Random) {
        this.validateAmount()
      }
    },
    validateAmount() {
      // 每个人最少 1000 sat（0.00001 Space）
      console.log('hi')
      const minAmount = 1000 * this.quantity
      const maxAmount = 1_000_000
      if (this.amount < minAmount) {
        this.amount = minAmount
      }
      if (this.amount > maxAmount) {
        this.amount = maxAmount
      }
    },
    validateEach() {
      console.log('what?')
      if (this.each < 1000) {
        this.each = 1000
      }
      if (this.each > 1_000_000) {
        this.each = 1_000_000
      }
    },

    reset() {
      this.amount = 1000
      this.each = 1000
      this.quantity = 1
      this.message = ''
      this.nft = null
      this.chain = null
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
          each: this.each,
          quantity: this.quantity,
          chain: this.chain,
          nft: this.nft,
          type: this.type,
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
