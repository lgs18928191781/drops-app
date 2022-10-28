<template>
  <div class="relative w-screen h-screen lg:flex">
    <ServerSection :server="server" @close-server-section="showServerSection = false"
      :showServerSection="showServerSection" />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <TheHeader :name="channel.name" :description="channel.description" :showMembers="showMembers"
        @toggle-member-list="showMembers = !showMembers" @open-server-section="showServerSection = true" />


      <div class="pt-12 pb-14 h-screen lg:relative w-full">
        <div class="h-full overflow-y-scroll py-4 overflow-x-hidden space-y-4  px-4">
          <Message v-for="message in messages" :message="message" />
        </div>

        <ChannelInput />
      </div>

      <ChannelMemberList v-show="showMembers" :members="members" />
    </div>

  </div>
</template>

<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import ChannelInput from './components/ChannelInput.vue'
import ServerSection from './components/ServerSection.vue'
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
  name: string
  description: string
}

const showMembers = ref(false)
const showServerSection = ref(false)

// 获取频道信息
const channel: Ref<Channel> = ref({
  name: '',
  description: ''
})

const messages: Ref<Message[]> = ref([])
const members: Ref<Member[]> = ref([])
const server: Ref<any> = ref({
  name: 'ShowTalk活动群',
  id: "1",
  channels: [
    {
      id: "1",
      name: 'ShowTalk活动群'
    }
  ]
})

onMounted(async () => {
  messages.value = await getChannelMessages("1")
  members.value = await getChannelMembers("1")
  channel.value = {
    name: "ShowTalk活动群",
    description: "快来参与活动吧"
  }
})
</script>

<style lang="scss" scoped>

</style>
