<template>
  <div class="relative w-screen h-screen lg:flex">
    <CommunitySection
      :community="community"
      @close-community-section="showCommunitySection = false"
      :showCommunitySection="showCommunitySection"
    />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <TheHeader
        :channel="channel"
        :showMembers="showMembers"
        @toggle-member-list="handleToggleMemberList"
        @open-community-section="showCommunitySection = true"
      />

      <div class="pt-12 pb-14 h-screen lg:relative w-full bg-dark-100">
        <LoadingList v-if="loading" />
        <MessageList :messages="messages" v-else />

        <ChannelInput :currentChannel="currentChannel" />
      </div>

      <Transition name="slide">
        <ChannelMemberList v-show="showMembers" :members="members" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import ChannelInput from './components/ChannelInput.vue'
import CommunitySection from './components/CommunitySection.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import LoadingList from './components/LoadingList.vue'
import { computed, defineAsyncComponent, onMounted, Ref, ref } from 'vue'
import { getChannelMessages, getChannelMembers } from '@/api/talk'
import { sleep } from '@/utils/util'

const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

type Message = {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  nickName: string
  timestamp: number
}

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
const showCommunitySection = ref(false)
const loading = ref(false)

// 获取频道信息
const channel: Ref<Channel> = ref({
  name: '',
  description: '',
  isPublic: true,
  groupId: '',
})

const messages: Ref<Message[]> = ref([])
const members: Ref<Member[]> = ref([])
const community: Ref<any> = ref({
  name: '一代MetaBot',
  id: '1',
  description:
    'MetaBot是元拓邦中重要的一员，也是元拓邦中第一个被创造出来的NFT种群，一代MetaBot总量为999个。',
  channels: [
    {
      id: '1',
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

const currentChannel = computed(() => {
  return community.value.channels.find((channel: any) => channel.in)
})

const scrollToMessagesBottom = () => {
  const bottomAnchor = document.getElementById('bottomAnchor')
  bottomAnchor?.scrollIntoView()
}

const handleToggleMemberList = () => {
  showMembers.value = !showMembers.value
  localStorage.setItem('layout-show-right-drawer', showMembers.value ? '1' : '0')
}

onMounted(async () => {
  // 拉取布局状态
  const layoutState = localStorage.getItem('layout-show-right-drawer')
  if (layoutState === '1') {
    showMembers.value = true
  }

  loading.value = true
  const channelId = 'b671caca627219c214f433497f9aba530a29a927bb5e32f242e36f8cbc26ba3b'
  const {
    data: {
      results: { items },
    },
  } = await getChannelMessages(channelId)
  messages.value = items.reverse()
  await sleep(200)
  loading.value = false

  members.value = await getChannelMembers('1')
  channel.value = {
    name: '一代MetaBot',
    description: '',
    isPublic: true,
    groupId: 'b671caca627219c214f433497f9aba530a29a927bb5e32f242e36f8cbc26ba3b',
  }

  scrollToMessagesBottom()
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
