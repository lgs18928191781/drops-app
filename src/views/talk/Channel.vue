<template>
  <div class="relative h-screen lg:flex text-base">
    <CommunityInfo />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <ChannelHeader />

      <div class="pt-12 pb-17.5 h-screen lg:relative w-full bg-dark-200 lg:pt-15 lg:pb-20">
        <div class="h-full">
          <MessageList />
        </div>

        <div class="fixed bottom-0 left-0 right-0 px-4 lg:absolute">
          <TheInput />
          <TheErrorBox />
        </div>
      </div>

      <Transition name="slide">
        <ChannelMemberList />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChannelHeader from './components/ChannelHeader.vue'
import TheInput from './components/TheInput.vue'
import TheErrorBox from './components/TheErrorBox.vue'
import CommunityInfo from './components/CommunityInfo.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import { defineAsyncComponent, onBeforeUnmount } from 'vue'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

const talkStore = useTalkStore()

const route = useRoute()
const userStore = useUserStore()
const { communityId, channelId } = route.params
const selfMetaId = userStore.user!.metaId
talkStore.initChannel(communityId as string, channelId as string).then(async initRes => {
  if (initRes === 'redirect') return

  await talkStore.initChannelMessages(selfMetaId)
  await talkStore.initWebSocket(selfMetaId)
})

onBeforeUnmount(() => {
  talkStore.saveReadPointers()
  talkStore.closeWebSocket()
  talkStore.closeReadPointerTimer()
})
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
