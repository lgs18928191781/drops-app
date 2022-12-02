<template>
  <div class="relative h-screen lg:flex text-base">
    <CommunityInfo />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <ChannelHeader />

      <div class="pt-12 pb-17.5 h-screen lg:relative w-full bg-dark-200 lg:pt-15 lg:pb-20">
        <ChannelWelcome v-if="talk.isActiveChannelTheVoid" />
        <ChannelSettings v-else-if="talk.isActiveChannelTheVoid" />
        <ChannelContent v-else />
      </div>

      <Transition name="slide">
        <ChannelMemberList v-show="layout.isShowMemberList" />
      </Transition>
    </div>

    <DragonBall />

    <!-- modals -->
    <PasswordModal />
    <InviteModal />
    <AcceptInviteModal />
    <LoadingCover />
  </div>
</template>

<script setup lang="ts">
import ChannelHeader from './components/ChannelHeader.vue'
import CommunityInfo from './components/CommunityInfo.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import ChannelContent from './components/ChannelContent.vue'
import ChannelSettings from './components/ChannelSettings.vue'
import ChannelWelcome from './components/ChannelWelcome.vue'
import DragonBall from './components/DragonBall.vue'
import { nextTick, onBeforeUnmount, watch } from 'vue'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { GroupChannelType } from '@/enum'
import { useLayoutStore } from '@/stores/layout'
import PasswordModal from './components/modals/PasswordModal.vue'
import InviteModal from './components/modals/InviteModal.vue'
import AcceptInviteModal from './components/modals/AcceptInviteModal.vue'
import LoadingCover from './components/modals/LoadingCover.vue'
import { verifyPassword } from '@/utils/talk'

const talk = useTalkStore()
const route = useRoute()
const userStore = useUserStore()
const layout = useLayoutStore()

const { communityId, channelId } = route.params
const selfMetaId = userStore.user!.metaId
talk.initChannel(communityId as string, channelId as string).then(async initRes => {
  if (['redirect', 'pending'].includes(initRes)) return

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

  await talk.initChannelMessages(selfMetaId)
})

watch(
  () => talk.canAccessActiveChannel,
  async canAccess => {
    if (canAccess) {
      await talk.initChannelMessages(selfMetaId)
    }
  }
)

onBeforeUnmount(() => {
  talk.saveReadPointers()
  talk.closeReadPointerTimer()
})
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  // transform: translateX(100%);
}
</style>
