<template>
  <div class="relative h-screen lg:flex">
    <DirectContactList />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <AtMeHeader />

      <div class="pt-12 pb-20 h-screen lg:relative w-full bg-dark-200">
        <div class="h-full">
          <MessageList />
        </div>

        <div class="fixed bottom-0 left-0 right-0 px-4 lg:absolute">
          <TheInput />
          <TheErrorBox />
        </div>
      </div>

      <!-- <Transition name="slide"> -->
      <!-- <ChannelMemberList v-show="showMembers" :members="members" /> -->
      <!-- </Transition> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTalkStore } from '@/stores/talk'
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DirectContactList from './components/DirectContactList.vue'
import AtMeHeader from './components/AtMeHeader.vue'
import { getChannelMessages, getAtMeChannels } from '@/api/talk'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import TheInput from './components/TheInput.vue'
import TheErrorBox from './components/TheErrorBox.vue'
import { ChannelType } from '@/utils/talk'

// import MessageList from './components/MessageList.vue'
const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

const router = useRouter()
const route = useRoute()
const talkStore = useTalkStore()
const layoutStore = useLayoutStore()
const userStore = useUserStore()

const channel = ref({
  id: 1,
  name: 'MetaBot',
  metaId: 'ada39724595ffed214990695c5bae373f58ca82a69238a83dd606c56e84b222b',
  avatar: '',
  lastMessage: '你好，我是MetaBot',
  lastMessageTimestamp: 1629200000000,
  unreadCount: 0,
})

const fetchAtMeChannels = async () => {
  const selfMetaId = userStore.user!.metaId
  const {
    data: { data },
  } = await getAtMeChannels({ metaId: selfMetaId })

  // 整理会话数据
  const atMeChannels = data.map((channel: any) => {
    const channelSide = channel.from === selfMetaId ? 'to' : 'from'

    channel.name = channel[`${channelSide}Name`]
    channel.id = channel[`${channelSide}`]
    channel.publicKeyStr = channel[`${channelSide}PublicKey`]
    channel.lastMessageTimestamp = channel.timestamp
    channel.lastMessage = '你收到了一条信息'
    channel.pastMessages = []
    channel.newMessages = []

    return channel
  })

  console.log('channelId', route.params.channelId)

  talkStore.$patch(state => {
    const activeCommunity = state.communities.find(community => community.id === '@me')
    if (!activeCommunity) {
      const newCommunity = {
        id: '@me',
        channels: atMeChannels,
      }
      state.communities.push(newCommunity)
    } else {
      activeCommunity.channels = atMeChannels
    }
  })

  talkStore.$patch({
    activeChannelId: route.params.channelId as string,
    activeCommunityId: '@me',
  })
}

watch(
  () => route.params.channelId,
  async () => {
    await fetchAtMeChannels()
  }
)

onMounted(async () => {
  const { channelId } = route.params
  talkStore.$patch({
    activeCommunityId: '@me',
  })

  if (!channelId) {
    let activeChannelId = talkStore.activeChannelId
    if (!activeChannelId) {
      activeChannelId = 'ada39724595ffed214990695c5bae373f58ca82a69238a83dd606c56e84b222b'
      talkStore.$patch({
        activeChannelId,
      })
    }

    layoutStore.$patch({
      isShowLeftNav: false,
    })

    router.push(`/talk/channels/@me/${activeChannelId}`)
  }

  await fetchAtMeChannels()
})
</script>

<style lang="scss" scoped></style>
