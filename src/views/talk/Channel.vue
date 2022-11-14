<template>
  <div class="relative  h-screen lg:flex">
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

      <div class="pt-12 pb-14 h-screen lg:relative w-full bg-dark-200">
        <div class="h-full">
          <MessageList :sendingMessage="sendingMessage" />
        </div>

        <TheInput :currentChannel="currentChannel" @send-message="handleSendMessage" />
      </div>

      <Transition name="slide">
        <ChannelMemberList v-show="showMembers" :members="members" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import TheInput from './components/TheInput.vue'
import CommunitySection from './components/CommunitySection.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import { computed, defineAsyncComponent, onMounted, reactive, Ref, ref } from 'vue'
import { getChannelMembers } from '@/api/talk'

const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

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
const sendingMessage: any = reactive({
  metaId: '',
  content: '',
})

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
  id: '1',
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

const currentChannel = computed(() => {
  return community.value.channels.find((channel: any) => channel.in)
})

const handleToggleMemberList = () => {
  showMembers.value = !showMembers.value
  localStorage.setItem('layout-show-right-drawer', showMembers.value ? '1' : '0')
}

const handleSendMessage = (message: any) => {
  console.log({ sending: message })
  sendingMessage.content = message.content
  sendingMessage.metaId = message.metaId
}

onMounted(async () => {
  // 拉取布局状态
  const layoutState = localStorage.getItem('layout-show-right-drawer')
  if (layoutState === '1') {
    showMembers.value = true
  }

  members.value = await getChannelMembers('1')
  channel.value = {
    name: '70亿人之家one 7 billion one family',
    description:
      '只要是地球人，都可以加入，无上限，目标是70亿地球人。 As long as the earth people,can join,no cap limit,the goal is 7 billion.',
    isPublic: true,
    groupId: '88a92826842757cade6e84378df9db88526578c3bce7b8cb6348b7f1f9598d0a',
  }
})
</script>

<style lang="scss" scoped>
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney'), url('@/assets/fonts/whitneybook.otf') format('opentype');
  font-weight: 400;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Medium'), url('@/assets/fonts/whitneymedium.otf') format('opentype');
  font-weight: 500;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Bold'), url('@/assets/fonts/whitneybold.otf') format('opentype');
  font-weight: 700;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
