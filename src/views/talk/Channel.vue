<template>
  <div class="relative w-screen h-screen px-4">
    <TheHeader />
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
import Message from './components/Message.vue'
import { onMounted, Ref, ref } from 'vue';
import { getChannelMessages } from '@/api/talk'

type Message = {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  nickName: string
  timestamp: number
}

// 获取频道信息
const messages: Ref<Message[]> = ref([])
onMounted(async () => {
  messages.value = await getChannelMessages("1")
})
</script>

<style lang="scss" scoped>

</style>
