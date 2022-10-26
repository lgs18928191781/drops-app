<template lang="">
  <div class="flex">
    <UserAvatar :type="message.avatarType" :metaId="message.avatarTxId || 'undefined'"
      class="w-10 h-10 shrink-0" />
    <div class="ml-4 grow pr-12">
      <div class="flex items-end space-x-2">
        <div class="font-medium text-sm" :class="randomNameColor">
          {{ message.nickName }}
        </div>
        <div class="text-gray-400 text-xs">{{ $filters.dateTimeFormat(message.timestamp, 'HH:mm') }}</div>
      </div>

      <div class="w-full py-0.5 text-gray-400 text-xs" v-if="isGroupAction">加入了群聊</div>

      <div class="w-full py-0.5" v-else-if="isNftEmoji">
        <Image :src="decryptedMessage"  customClass="max-w-[60%]" />
        
        <NftLabel class="w-8 mt-1"/>
      </div>

      <div class="w-full py-0.5" v-else-if="isImage">
        <Image :src="decryptedMessage" customClass="max-w-[80%] rounded" />
      </div>

      <div class="text-sm text-gray-600 font-normal py-0.5" v-else>{{ decryptedMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decrypt } from '@/utils/crypto'
import NftLabel from './NftLabel.vue'
import { computed } from 'vue';

const roomId = 'b671caca627219c214f433497f9aba530a29a927bb5e32f242e36f8cbc26ba3b'

type Message = {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  nickName: string
  timestamp: number
}

const props = defineProps(['message'])

const randomNameColor = computed(() => {
  const colors = ['text-blue-500', 'text-green-500', 'text-yellow-500', 'text-red-500', 'text-indigo-500', 'text-amber-500']
  // 将用户名转换为数字
  const name = props.message.nickName
  const nameCode = name.split('').reduce((acc: number, cur: any) => acc + cur.charCodeAt(0), 0)

  return colors[nameCode % colors.length]
})

const decryptedMessage = computed(() => {
  const { message } = props

  if (message.protocol !== 'simpleGroupChat' && message.protocol !== 'SimpleFileGroupChat') {
    return message.content
  }

  return decrypt(message.content, roomId.substring(0, 16))
})

const isGroupAction = computed(() => {
  return props.message.protocol === 'SimpleGroupJoin'
})

const isNftEmoji = computed(() => {
  return props.message.protocol === 'SimpleEmojiGroupChat'
})

const isImage = computed(() => {
  return props.message.protocol === 'SimpleFileGroupChat'
})
</script>

<style lang="scss" scoped>

</style>