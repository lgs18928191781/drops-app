<template>
  <ChannelWelcome v-if="talk.isActiveChannelTheVoid" />
  <ChannelSettings v-else-if="talk.isActiveChannelTheVoid" />
  <ChannelContent v-else />
</template>

<script lang="ts" setup>
import ChannelSettings from './ChannelSettings.vue'
import ChannelWelcome from './ChannelWelcome.vue'
import ChannelContent from './ChannelContent.vue'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { nextTick, onBeforeUnmount, watch } from 'vue'
import { GroupChannelType } from '@/enum'
import { verifyPassword } from '@/utils/talk'
import { useLayoutStore } from '@/stores/layout'
import { GetGenesisNFTs, GetNFT, GetFT, GetFTs } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'

const talk = useTalkStore()
const layout = useLayoutStore()
const user = useUserStore()
const route = useRoute()
const { communityId, channelId } = route.params

const tryInitChannel = async (status: string) => {
  if (status !== 'ready') return

  const initChannelStatus = await talk.initChannel(communityId as string, channelId as string)
  if (['redirect'].includes(initChannelStatus)) return

  const selfMetaId = talk.selfMetaId
  // 重置频道凭证
  talk.hasActiveChannelConsent = false
  await nextTick()
  if (!talk.canAccessActiveChannel) {
    let chain: string
    switch (talk.activeGroupChannelType) {
      case GroupChannelType.Password:
        // 先检查是否本地有存储该频道密码
        const _passwordLookup = localStorage.getItem(`channelPasswords-${selfMetaId}`)
        const passwordLookup = _passwordLookup ? JSON.parse(_passwordLookup) : {}
        const hashedPassword = passwordLookup[talk.activeChannelId]

        // 如果没有，则弹出密码输入框
        if (!hashedPassword) {
          layout.isShowPasswordModal = true
          return
        }

        // 检查密码是否正确
        const channelKey = talk.activeChannel.roomStatus
        const creatorMetaId = talk.activeChannel.createUserMetaId
        if (verifyPassword(channelKey, hashedPassword, creatorMetaId)) {
          talk.hasActiveChannelConsent = true
        } else {
          layout.isShowPasswordModal = true
        }

        return

      case GroupChannelType.NFT:
      case GroupChannelType.POLYGON_NFT:
      case GroupChannelType.BSV_NFT:
      case GroupChannelType.ETH_NFT: {
        let chain: string
        switch (talk.activeGroupChannelType) {
          case GroupChannelType.NFT:
            chain = 'mvc'
            break
          case GroupChannelType.BSV_NFT:
            chain = 'bsv'
            break
          case GroupChannelType.POLYGON_NFT:
            chain = import.meta.env.VITE_POLYGON_CHAIN
            break
          case GroupChannelType.ETH_NFT:
            chain = import.meta.env.VITE_ETH_CHAIN
            break
          default:
            chain = 'mvc'
            break
        }
        let selfAddress: string
        switch (chain) {
          case 'mvc':
            selfAddress = user.user!.address
            break
          case 'eth':
            selfAddress = user.user?.evmAddress as string
            break
          case 'goerli':
            selfAddress = user.user?.evmAddress as string
            break
          case 'polygon':
            selfAddress = user.user?.evmAddress as string
            break
          case 'mumbai':
            selfAddress = user.user?.evmAddress as string
            break
          default:
            selfAddress = user.user!.address
            break
        }
        const consensualGenesis = talk.activeChannel.roomGenesis
        const consensualCodehash = talk.activeChannel.roomCodeHash

        // 如果不存在该链地址，则直接拒绝进入
        if (!selfAddress) {
          const {
            data: {
              results: { items },
            },
          } = await GetNFT({
            codehash: consensualCodehash,
            genesis: consensualGenesis,
            chain,
            tokenIndex: 0,
          })
          const nftInfo = {
            codehash: consensualCodehash,
            genesis: consensualGenesis,
            icon: items[0].nftIcon,
            name: items[0].nftName,
            seriesName: items[0].nftSeriesName || items[0].nftName,
            chain,
          }
          talk.consensualNft = nftInfo
          layout.isShowRequireNftModal = true
          return
        }

        const {
          data: {
            results: { items: userNfts },
          },
        } = await GetGenesisNFTs({
          address: selfAddress,
          codehash: consensualCodehash,
          genesis: consensualGenesis,
          chain,
          page: 1,
          pageSize: 3,
        })

        if (userNfts.length > 0) {
          talk.hasActiveChannelConsent = true
        } else {
          const {
            data: {
              results: { items },
            },
          } = await GetNFT({
            codehash: consensualCodehash,
            genesis: consensualGenesis,
            chain,
            tokenIndex: 0,
          })
          const nftInfo = {
            codehash: consensualCodehash,
            genesis: consensualGenesis,
            icon: items[0].nftIcon,
            name: items[0].nftName,
            seriesName: items[0].nftSeriesName || items[0].nftName,
            chain,
          }
          talk.consensualNft = nftInfo
          layout.isShowRequireNftModal = true
        }
        return
      }

      case GroupChannelType.FT: {
        const chain: string = 'mvc'
        let selfAddress: string
        switch (chain) {
          case 'mvc':
            selfAddress = user.user!.address
            break
          case 'eth':
            selfAddress = user.user?.evmAddress as string
            break
          case 'goerli':
            selfAddress = user.user?.evmAddress as string
            break
          case 'polygon':
            selfAddress = user.user?.evmAddress as string
            break
          case 'mumbai':
            selfAddress = user.user?.evmAddress as string
            break
          default:
            selfAddress = user.user!.address
            break
        }
        const consensualGenesis = talk.activeChannel.roomGenesis
        const consensualCodehash = talk.activeChannel.roomCodeHash

        // 如果不存在该链地址，则直接拒绝进入
        if (!selfAddress) {
          const {
            data: {
              results: { items },
            },
          } = await GetFT({
            codehash: consensualCodehash,
            genesis: consensualGenesis,
            chain,
          })
          const ftInfo = {
            codehash: consensualCodehash,
            genesis: consensualGenesis,
            icon: items[0].icon,
            name: items[0].name,
            chain,
          }
          talk.consensualFt = ftInfo
          layout.isShowRequireFtModal = true
          return
        }

        const {
          data: {
            results: { items: userNfts },
          },
        } = await GetFTs({
          address: selfAddress,
          codehash: consensualCodehash,
          genesis: consensualGenesis,
          chain,
          page: 1,
          pageSize: 3,
        })

        if (userNfts.length > 0) {
          talk.hasActiveChannelConsent = true
        } else {
          // const {
          //   data: {
          //     results: { items },
          //   },
          // } = await GetFT({
          //   codehash: consensualCodehash,
          //   genesis: consensualGenesis,
          //   chain,
          // })
          const ftInfo = {
            codehash: '',
            genesis: '',
            icon: '',
            name: '',
            chain,
          }
          talk.consensualFt = ftInfo
          layout.isShowRequireFtModal = true
        }
        return
      }

      case GroupChannelType.Native:
        const chain: string = 'mvc'
        let selfAddress: string
        switch (chain) {
          case 'mvc':
            selfAddress = user.user!.address
            break
          case 'eth':
            selfAddress = user.user?.evmAddress as string
            break
          case 'goerli':
            selfAddress = user.user?.evmAddress as string
            break
          case 'polygon':
            selfAddress = user.user?.evmAddress as string
            break
          case 'mumbai':
            selfAddress = user.user?.evmAddress as string
            break
          default:
            selfAddress = user.user!.address
            break
        }

        // 如果不存在该链地址，则直接拒绝进入
        if (!selfAddress) {
          // const {
          //   data: {
          //     results: { items },
          //   },
          // } = await GetFT({
          //   codehash: consensualCodehash,
          //   genesis: consensualGenesis,
          //   chain,
          // })
          // const ftInfo = {
          //   codehash: consensualCodehash,
          //   genesis: consensualGenesis,
          //   icon: items[0].icon,
          //   name: items[0].name,
          //   chain,
          // }
          // talk.consensualFt = ftInfo
          // layout.isShowRequireFtModal = true
          return
        }

        // 检查币数量
        // 获取余额
        const balance = await user
          .showWallet!.wallet!.provider.getXpubBalance(
            user.showWallet!.wallet!.wallet.xpubkey.toString()
          )
          .catch(error => {
            ElMessage.error(error.message)
          })
        let requiredAmount = Number(talk.activeChannel.roomLimitAmount)
        if (balance >= requiredAmount) {
          talk.hasActiveChannelConsent = true
        } else {
          talk.consensualNative = {
            amount: requiredAmount,
            chain,
            balance,
          }
          layout.isShowRequireNativeModal = true
        }

        return
    }
  }

  await talk.initChannelMessages()
}

watch(
  () => talk.communityStatus,
  async (status: string) => await tryInitChannel(status),
  { immediate: true }
)

watch(
  () => talk.canAccessActiveChannel,
  async canAccess => {
    if (canAccess) {
      await talk.initChannelMessages()
    }
  }
)

onBeforeUnmount(() => {
  talk.resetCurrentChannel()
})
</script>
