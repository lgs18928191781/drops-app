<template>
  <div class="relative h-screen lg:flex text-base">
    <CommunityInfo />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <ChannelHeader />

      <div class="pt-12 pb-17.5 h-screen lg:relative w-full bg-dark-200 lg:pt-15 lg:pb-20">
        <router-view :key="($route.params.channelId as string)"></router-view>
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
    <RedPacketOpenModal v-if="layout.isShowRedPacketOpenModal" />
    <RedPacketCreateModal v-if="layout.isShowRedPacketModal" />
  </div>
</template>

<script setup lang="ts">
import ChannelHeader from './components/ChannelHeader.vue'
import CommunityInfo from './components/CommunityInfo.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import DragonBall from './components/DragonBall.vue'
import { onBeforeUnmount, watch } from 'vue'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import PasswordModal from './components/modals/PasswordModal.vue'
import InviteModal from './components/modals/InviteModal.vue'
import AcceptInviteModal from './components/modals/AcceptInviteModal.vue'
import RedPacketOpenModal from './components/modals/red-packet/Open.vue'
import RedPacketCreateModal from './components/modals/red-packet/Create.vue'

import LoadingCover from './components/modals/LoadingCover.vue'

const talk = useTalkStore()
const route = useRoute()
const layout = useLayoutStore()

const { communityId } = route.params

talk.initCommunity(communityId as string)

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
