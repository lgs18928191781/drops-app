<template>
  <div class="relative h-screen lg:flex">
    <ChannelList :community="community" />

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
import ChannelList from './components/ChannelList.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import { computed, defineAsyncComponent, onMounted, reactive, Ref, ref } from 'vue'
import { getChannelMembers, getChannels, getCommunities } from '@/api/talk'
import { useUserStore } from '@/stores/user'
import { useTalkStore } from '@/stores/talk'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'

const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

const userStore = useUserStore()
const talkStore = useTalkStore()
const layoutStore = useLayoutStore()
const router = useRouter()

type Member = {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  name: string
  timestamp: number
}

type Channel = {
  name: string
  description: string
  groupId: string
  isPublic: boolean
}

const showMembers = ref(false)
const hasChannels = computed(() => talkStore.activeChannelId !== '')

// 获取频道信息
const channel: Ref<Channel> = ref({
  name: '',
  description: '',
  isPublic: true,
  groupId: '',
})

const members: Ref<Member[]> = ref([])
const community: Ref<any> = ref({
  name: '一代MetaBot',
  id: '123',
  description:
    'MetaBot是元拓邦中重要的一员，也是元拓邦中第一个被创造出来的NFT种群，一代MetaBot总量为999个。',
  channels: [
    {
      id: '88a92826842757cade6e84378df9db88526578c3bce7b8cb6348b7f1f9598d0a',
      name: '聊天',
      in: true,
    },
    {
      id: '2',
      name: 'DAO',
    },
    {
      id: '3',
      name: '公告',
    },
  ],
})

const handleToggleMemberList = () => {
  showMembers.value = !showMembers.value
  localStorage.setItem('layout-show-right-drawer', showMembers.value ? '1' : '0')
}

/** 获取频道数据处理 */
const route = useRoute()
const { communityId, channelId } = route.params
const fetchChannels = async () => {
  const channels = await getChannels({ communityId })

  talkStore.$patch(state => {
    state.activeCommunityId = communityId as string
    if (channelId) {
      state.activeChannelId = channelId as string
    }
    state.communities.find(
      community => community.id === state.activeCommunityId
    )!.channels = channels
  })
}
fetchChannels()

// 处理没有channelId的跳转情况
if (!channelId) {
  talkStore.setDefaultChannel()

  let activeChannelId = talkStore.activeChannelId

  layoutStore.$patch({
    isShowLeftNav: false,
  })

  router.push(`/talk/channels/${communityId}/${activeChannelId}`)
}

/** ------ */

onMounted(async () => {
  const selfMetaId = userStore.user!.metaId
  // 拉取布局状态
  const layoutState = localStorage.getItem('layout-show-right-drawer')
  if (layoutState === '1') {
    showMembers.value = true
  }

  // await fetchChannels()

  members.value = await getChannelMembers('1')
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
