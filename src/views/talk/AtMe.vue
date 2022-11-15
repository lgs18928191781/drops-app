<template>
  <div class="relative h-screen lg:flex">
    <DirectContactList :directContacts="directContacts" />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <!-- <AtMeHeader :contact="contact" /> -->

      <div class="pt-12 pb-20 h-screen lg:relative w-full bg-dark-200">
        789
        <!-- <div class="h-full">
        <MessageList />
      </div>

      <div class="fixed bottom-0 left-0 right-0 px-4 lg:absolute">
        <TheInput :currentChannel="contact" />
        <TheErrorBox />
      </div> -->
      </div>

      <!-- <Transition name="slide"> -->
      <!-- <ChannelMemberList v-show="showMembers" :members="members" /> -->
      <!-- </Transition> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTalkStore } from '@/stores/talk'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DirectContactList from './components/DirectContactList.vue'
import AtMeHeader from './components/AtMeHeader.vue'
import { getSessions } from '@/api/talk'

const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

const router = useRouter()
const talkStore = useTalkStore()

const directContacts = ref([])

const contact = ref({
  id: 1,
  name: 'MetaBot',
  metaId: 'ada39724595ffed214990695c5bae373f58ca82a69238a83dd606c56e84b222b',
  avatar: '',
  lastMessage: '你好，我是MetaBot',
  lastMessageTimestamp: 1629200000000,
  unreadCount: 0,
})

onMounted(async () => {
  const { channelId: currentChannelId } = router.currentRoute.value.params
  if (!currentChannelId) {
    let latestAtMe = talkStore.latestAtMe
    if (!latestAtMe) {
      latestAtMe = 'ada39724595ffed214990695c5bae373f58ca82a69238a83dd606c56e84b222b'
      talkStore.$patch({
        latestAtMe,
      })
    }

    router.push(`/talk/channels/@me/${latestAtMe}`)
  }

  const {
    result: { data },
  } = await getSessions()
  console.log(data)
  directContacts.value = data
})
</script>

<style lang="scss" scoped></style>
