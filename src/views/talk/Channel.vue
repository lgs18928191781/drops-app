<template>
  <div class="relative w-screen h-screen lg:flex">
    <community-section
      :community="community"
      @close-community-section="showCommunitySection = false"
      :showCommunitySection="showCommunitySection"
    />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <the-header
        :channel="channel"
        :showMembers="showMembers"
        @toggle-member-list="handleToggleMemberList"
        @open-community-section="showCommunitySection = true"
      />

      <div class="pt-12 pb-14 h-screen lg:relative w-full bg-dark-100">
        <div class="h-full">
          <message-list />
        </div>

        <the-input :currentChannel="currentChannel" />
      </div>

      <Transition name="slide">
        <channel-member-list v-show="showMembers" :members="members" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import TheInput from './components/TheInput.vue'
import CommunitySection from './components/CommunitySection.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import { computed, defineAsyncComponent, onMounted, Ref, ref } from 'vue'
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

const handleToggleMemberList = () => {
  console.log(123)
  showMembers.value = !showMembers.value
  localStorage.setItem('layout-show-right-drawer', showMembers.value ? '1' : '0')
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
    groupId: 'b671caca627219c214f433497f9aba530a29a927bb5e32f242e36f8cbc26ba3b',
  }
})
</script>

<style lang="css" src="../../assets/styles/tailwind.css"></style>
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
