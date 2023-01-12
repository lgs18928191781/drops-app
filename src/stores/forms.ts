import { Chains, ChannelPublicityType, GroupChannelType, RedPacketDistributeType } from '@/enum'
import {
  createAnnouncement,
  deleteAnnouncement,
  editAnnouncement,
  giveRedPacket,
  updateCommunity,
} from '@/utils/talk'
import { sleep } from '@/utils/util'
import { defineStore } from 'pinia'
import { useLayoutStore } from './layout'
import { getCommunityAuth } from '@/api/talk'
import { useTalkStore } from './talk'
import { useUserStore } from './user'
import { Channel } from '@/@types/talk'
import { GetFT, GetGenesis } from '@/api/aggregation'

export const useCommunityFormStore = defineStore('communityForm', {
  state: () => {
    return {
      icon: null as File | null,
      description: '',
      cover: null as File | null,
      name: '',
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
      this.name = ''
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
      name: '',
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
      this.name = ''
    },

    resetInForm() {
      this.icon = null
      this.cover = null
      this.description = this.original.description
      this.name = this.original.name
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
  chain: null | Chains
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
      chain: null,
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
    // 从现有数据恢复填充表单，用于编辑
    async recover(channel: Channel) {
      this.reset()

      if (channel.roomType === ChannelPublicityType.Public) {
        this.type = GroupChannelType.PublicText
      }

      if (channel.roomType === ChannelPublicityType.Private) {
        switch (channel.roomJoinType) {
          case '1':
            this.type = GroupChannelType.Password
            break
          case '2':
            this.type = GroupChannelType.NFT
            this.chain = Chains.MVC
            break
          case '3':
            this.type = GroupChannelType.FT
            break
          case '2001':
            this.type = GroupChannelType.NFT
            this.chain = import.meta.env.VITE_ETH_CHAIN as Chains
            break
          case '2002':
            this.type = GroupChannelType.NFT
            this.chain = import.meta.env.VITE_POLYGON_CHAIN as Chains
          default:
            this.type = GroupChannelType.PublicText
        }
      }
      if (this.type === GroupChannelType.NFT) {
        const nftSeriesRes = await GetGenesis({
          chain: this.chain as string,
          codehash: channel.roomCodeHash,
          genesis: channel.roomGenesis,
        })
        if (nftSeriesRes.code === 0) {
          this.nft = nftSeriesRes.data.results.items[0]
        }
      }
      if (this.type === GroupChannelType.FT) {
        const ftSeriesRes = await GetFT({
          chain: this.chain as string,
          codehash: channel.roomCodeHash,
          genesis: channel.roomGenesis,
        })
        if (ftSeriesRes.code === 0) {
          this.ft = ftSeriesRes.data.results.items[0]
          this.amount = channel.roomLimitAmount
        }
      }

      this.name = channel.name
      this.adminOnly = channel.chatSettingType === 1
      this.publicKey = channel.roomPublicKey
      this.uuid = channel.uuid
      this.txId = channel.txId
    },

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

// 新公告、编辑公告
export const useCreateAnnouncementFormStore = defineStore('createAnnouncementForm', {
  state: () => {
    return {
      title: '',
      content: '',
      communityId: '',
      type: 'create' as 'create' | 'edit',
      txId: null as null | string,
      publickey: null as null | string,
    }
  },

  getters: {
    isFinished(state) {
      return !!state.title && !!state.content
    },
  },

  actions: {
    async submit() {
      if (!this.isFinished) return

      const user = useUserStore()
      const layout = useLayoutStore()
      layout.isShowLoading = true

      const form: {
        title: string
        content: string
        communityId: string
        txId?: string
        publickey?: string
      } = {
        title: this.title,
        content: this.content,
        communityId: this.communityId,
      }
      if (this.type === 'edit') {
        form.txId = this.txId as string
        form.publickey = this.publickey as string
        await editAnnouncement(form, user.showWallet)
      } else {
        await createAnnouncement(form, user.showWallet)
      }

      layout.isShowLoading = false
      this.reset()
    },

    reset() {
      this.title = ''
      this.content = ''
      this.communityId = ''
      this.type = 'create'
      this.txId = null
      this.publickey = null
    },
  },
})

// 删除公告
export const useDeleteAnnouncementFormStore = defineStore('deleteAnnouncementForm', {
  state: () => {
    return {
      announcementId: '',
      communityId: '',
      title: '',
    }
  },

  getters: {
    isFinished(state) {
      return !!state.announcementId && !!state.communityId
    },
  },

  actions: {
    async submit() {
      if (!this.isFinished) return

      const user = useUserStore()
      const layout = useLayoutStore()
      layout.isShowLoading = true

      await deleteAnnouncement(
        {
          announcementId: this.announcementId,
          communityId: this.communityId,
        },
        user.showWallet
      )

      layout.isShowLoading = false
      this.reset()
    },

    reset() {
      this.announcementId = ''
      this.communityId = ''
      this.title = ''
    },
  },
})
