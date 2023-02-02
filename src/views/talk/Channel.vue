<template>
  <div class="relative h-screen lg:flex text-base">
    <CommunityInfo />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <ChannelHeader />

      <div class="pt-12 h-screen lg:relative w-full bg-dark-200 dark:bg-gray-900 lg:pt-15">
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
    <CommunityCardModal v-if="layout.isShowCommunityCardModal" />
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
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useTalkStore } from '@/stores/talk'
import { useLayoutStore } from '@/stores/layout'
import { isMetaName, resolveMetaName } from '@/utils/meta-name'

import ChannelHeader from './components/ChannelHeader.vue'
import CommunityInfo from './components/CommunityInfo.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import PasswordModal from './components/modals/consensus/Password.vue'
import CommunitySettingsModal from './components/modals/community/settings/Index.vue'
import RequireNftModal from './components/modals/consensus/RequireNft.vue'
import RequireFtModal from './components/modals/consensus/RequireFt.vue'
import RedPacketOpenModal from './components/modals/red-packet/Open.vue'
import RedPacketResultModal from './components/modals/red-packet/Result.vue'
import RedPacketCreateModal from './components/modals/red-packet/Create.vue'
import AcceptInviteModal from './components/modals/invite/Accept.vue'
import InviteModal from './components/modals/invite/Invite.vue'
import CommunityCardModal from './components/modals/invite/CommunityCard.vue'
import ShareToBuzzModal from './components/modals/invite/ShareToBuzz.vue'
import ShareSuccessModal from './components/modals/invite/ShareSuccess.vue'
import LoadingCover from './components/modals/LoadingCover.vue'

const talk = useTalkStore()
const route = useRoute()
const layout = useLayoutStore()

function init(communityId: string) {
  talk.checkMembership(communityId).then(async (isMember: boolean) => {
    if (!isMember) {
      await talk.invite(communityId)
      return
    }

    talk.initCommunity(communityId)
  })
}

const { communityId } = route.params as { communityId: string }

// 解析 communityId 为 metaName 的情况

if (isMetaName(communityId)) {
  resolveMetaName(communityId).then(({ communityId: realCommunityId }) => {
    init(realCommunityId)
  })
} else {
  init(communityId)
}

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

::-webkit-scrollbar {
  width: 0px;
}
</style>
