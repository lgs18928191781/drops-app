<template>
  <div class="relative w-screen h-screen px-4">
    <TheHeader :title="channel.title" :description="channel.description" :showMembers="showMembers"
      @toggle-member-list="showMembers = !showMembers" />
    <ChannelMemberList v-show="showMembers" :members="members" />

    <div class="pt-12 pb-14 h-screen w-full">
      <div class="h-full overflow-y-scroll py-4 overflow-x-hidden space-y-4">
        <Message v-for="message in messages" :message="message" />
      </div>
    </div>
    <ChannelInput />

  </div>
</template>

<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import ChannelInput from './components/ChannelInput.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import Message from './components/Message.vue'
import { onMounted, Ref, ref } from 'vue';
import { getChannelMessages, getChannelMembers } from '@/api/talk'

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
  title: string
  description: string
}

const showMembers = ref(false)

// 获取频道信息
const channel: Ref<Channel> = ref({
  title: '',
  description: ''
})

const messages: Ref<Message[]> = ref([])
const members: Ref<Member[]> = ref([])

onMounted(async () => {
  messages.value = await getChannelMessages("1")
  members.value = await getChannelMembers("1")
  channel.value = {
    title: "ShowTalk活动群",
    description: "快来参与活动吧"
  }
})
</script>

<style lang="scss" scoped>

</style>
