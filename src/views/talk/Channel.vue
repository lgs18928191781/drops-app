<template>
  <div class="relative h-screen lg:flex text-base">
    <CommunityInfo />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <ChannelHeader :showMembers="showMembers" @toggle-member-list="handleToggleMemberList" />

      <div class="pt-12 pb-20 h-screen lg:relative w-full bg-dark-200">
        <div class="h-full">
          <MessageList />
        </div>

        <div class="fixed bottom-0 left-0 right-0 px-4 lg:absolute">
          <TheInput />
          <TheErrorBox />
        </div>
      </div>

      <Transition name="slide">
        <ChannelMemberList v-show="showMembers" :members="members" />
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
import { defineAsyncComponent, onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

const talkStore = useTalkStore()

type Member = {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  name: string
  timestamp: number
}

const showMembers = ref(false)

const members: Ref<Member[]> = ref([])

const handleToggleMemberList = () => {
  showMembers.value = !showMembers.value
  localStorage.setItem('layout-show-right-drawer', showMembers.value ? '1' : '0')
}

const route = useRoute()
const userStore = useUserStore()
const { communityId, channelId } = route.params
const selfMetaId = userStore.user!.metaId
talkStore.initChannel(communityId as string, channelId as string).then(async () => {
  await talkStore.initChannelMessages(selfMetaId)
  await talkStore.initWebSocket(selfMetaId)
})

onMounted(async () => {
  // 拉取布局状态
  const layoutState = localStorage.getItem('layout-show-right-drawer')
  if (layoutState === '1') {
    showMembers.value = true
  }
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
