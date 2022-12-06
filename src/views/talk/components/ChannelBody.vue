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

const talk = useTalkStore()
const layout = useLayoutStore()
const route = useRoute()
const { communityId, channelId } = route.params

const tryInitChannel = async (status: string) => {
  if (status !== 'ready') return

  const initChannelStatus = await talk.initChannel(communityId as string, channelId as string)
  if (['redirect', 'pending'].includes(initChannelStatus)) return

  const selfMetaId = talk.selfMetaId
  // 重置频道凭证
  talk.hasActiveChannelConsent = false
  await nextTick()
  if (!talk.canAccessActiveChannel) {
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

      /**
       * todo 检查NFT
       */
      case GroupChannelType.NFT:
        talk.hasActiveChannelConsent = true
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
