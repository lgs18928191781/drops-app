<template>
  <div class="relative h-screen lg:flex text-base">
    <CommunityInfo />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <ChannelHeader />

      <div
        class="pt-12 pb-17.5 h-screen lg:relative w-full bg-dark-200 dark:bg-gray-900 lg:pt-15 lg:pb-20"
      >
        <router-view :key="($route.params.channelId as string)"></router-view>
      </div>

      <Transition name="slide">
        <ChannelMemberList v-show="layout.isShowMemberList" />
      </Transition>
    </div>

    <!-- modals -->
    <PasswordModal v-if="layout.isShowPasswordModal" />
    <RequireNftModal v-if="layout.isShowRequireNftModal" />
    <RequireFtModal v-if="layout.isShowRequireFtModal" />
    <InviteModal v-if="layout.isShowInviteModal" />
    <AcceptInviteModal v-if="layout.isShowAcceptInviteModal" />
    <LoadingCover v-if="layout.isShowLoading" />
    <RedPacketOpenModal v-if="layout.isShowRedPacketOpenModal" />
    <RedPacketCreateModal v-if="layout.isShowRedPacketModal" />
    <RedPacketResultModal v-if="layout.isShowRedPacketResultModal" />
    <ShareToBuzzModal v-if="layout.isShowShareToBuzzModal" />
    <ShareSuccessModal v-if="layout.isShowShareSuccessModal" />
    <CommunitySettingsModal v-if="layout.isShowCommunitySettingsModal" />
  </div>
</template>

<script setup lang="ts">
import ChannelHeader from './components/ChannelHeader.vue'
import CommunityInfo from './components/CommunityInfo.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import { onBeforeUnmount, watch } from 'vue'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import PasswordModal from './components/modals/consensus/Password.vue'
import CommunitySettingsModal from './components/modals/community/Settings.vue'
import RequireNftModal from './components/modals/consensus/RequireNft.vue'
import RequireFtModal from './components/modals/consensus/RequireFt.vue'
import RedPacketOpenModal from './components/modals/red-packet/Open.vue'
import RedPacketResultModal from './components/modals/red-packet/Result.vue'
import RedPacketCreateModal from './components/modals/red-packet/Create.vue'
import AcceptInviteModal from './components/modals/invite/Accept.vue'
import InviteModal from './components/modals/invite/Invite.vue'
import ShareToBuzzModal from './components/modals/invite/ShareToBuzz.vue'
import ShareSuccessModal from './components/modals/invite/ShareSuccess.vue'

import LoadingCover from './components/modals/LoadingCover.vue'
import { buildCryptoInfo } from '@/utils/crypto'

const talk = useTalkStore()
const route = useRoute()
const layout = useLayoutStore()

const { communityId } = route.params

// const code = '6C9IUJ'
// const subId = '3ab41c4a90d3'
// const createTime = '1671509888031'
// const key = `${subId.toLocaleLowerCase()}${code.toLocaleLowerCase()}${createTime}`
// const { wif, addressStr } = buildCryptoInfo(key, 'testnet')
// console.log('wif', wif, 'addressStr', addressStr)

talk.checkMembership(communityId as string).then(async (isMember: boolean) => {
  if (!isMember) {
    await talk.invite(communityId as string)
    return
  }

  talk.initCommunity(communityId as string)
})

watch(
  () => talk.communityStatus,
  async (status: string) => {
    if (status === 'invited') {
      await talk.initCommunity(communityId as string)
    }
  },
  { immediate: true }
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
}

*::-webkit-scrollbar {
  width: 0px !important;
}
</style>
