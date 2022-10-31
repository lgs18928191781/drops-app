<template lang="">
  <div class="flex">
    <UserAvatar
      :type="message.avatarType"
      :metaId="message.avatarTxId || 'undefined'"
      class="w-10 h-10 shrink-0"
    />
    <div class="ml-4 grow pr-12">
      <div class="flex items-end space-x-2">
        <div class="font-medium text-sm" :class="randomNameColor">
          {{ message.nickName }}
        </div>
        <div class="text-gray-400 text-xs">
          {{ $filters.dateTimeFormat(message.timestamp, 'HH:mm') }}
        </div>
      </div>

      <div class="w-full py-0.5 text-gray-400 text-xs" v-if="isGroupJoinAction">加入了群聊</div>
      <div class="w-full py-0.5 text-gray-400 text-xs" v-else-if="isGroupLeaveAction">
        离开了群聊
      </div>

      <div class="w-full" v-else-if="isNftEmoji">
        <Image
          :src="decryptedMessage"
          customClass="max-w-[80%] md:max-w-[50%] lg:max-w-[320px] py-0.5"
        />

        <NftLabel class="w-8 mt-1" />
      </div>

      <div class="w-full py-0.5" v-else-if="isImage">
        <div
          class="max-w-[90%] md:max-w-[50%] lg:max-w-[400px] max-h-[600px] overflow-y-hidden rounded bg-white pr-2"
        >
          <Image :src="decryptedMessage" customClass="rounded py-0.5" />
        </div>
      </div>

      <div class="text-xs text-gray-400 my-0.5" v-else-if="isReceiveRedEnvelope">
        {{ redEnvelopeReceiveInfo }}
      </div>

      <div class="w-full py-0.5" v-else-if="isGiveawayRedEnvelope">
        <div
          class="max-w-full md:max-w-[50%] lg:max-w-[400px] shadow-lg rounded-xl cursor-pointer origin-top-left hover:shadow-xl hover:scale-105  transition-all duration-300"
        >
          <div class="rounded-xl bg-red-400 p-6 flex space-x-2">
            <img :src="redEnvelopeImg" class="h-12" />
            <div class="">
              <div class="text-white text-lg font-medium">领取红包</div>
              <div class="text-red-50 text-xs mt-0.5">{{ redEnvelopeMessage }}</div>
            </div>
          </div>
          <div class=" py-2 px-6 text-gray-400 text-xs">Show红包</div>
        </div>
      </div>

      <div class="text-sm text-gray-600 font-normal py-0.5 max-w-full break-all" v-else>
        {{ decryptedMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decrypt } from '@/utils/crypto'
import NftLabel from './NftLabel.vue'
import redEnvelopeImg from '@/assets/images/red-envelope.svg?url'
import { computed } from 'vue'

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
const message = props.message

const randomNameColor = computed(() => {
  const colors = [
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-red-500',
    'text-indigo-500',
    'text-amber-500',
  ]
  // 将用户名转换为数字
  const name = message.nickName
  const nameCode = name.split('').reduce((acc: number, cur: any) => acc + cur.charCodeAt(0), 0)

  return colors[nameCode % colors.length]
})

const decryptedMessage = computed(() => {
  if (message.encryption === '0') {
    return message.content
  }

  if (message.protocol !== 'simpleGroupChat' && message.protocol !== 'SimpleFileGroupChat') {
    return message.content
  }

  return decrypt(message.content, roomId.substring(0, 16))
})

const redEnvelopeReceiveInfo = computed(() => {
  const content: string = message.content

  if (message.metaId === message.data?.redEnvelopeMetaId) {
    return `领取了自己的红包`
  }

  const [_receiver, sender] = content.split('|-|')

  return `领取了 ${sender} 的红包`
})

const redEnvelopeMessage = computed(() => {
  return message.data?.content || '恭喜发财，大吉大利'
})

const isGroupJoinAction = computed(() => message.protocol === 'SimpleGroupJoin')
const isGroupLeaveAction = computed(() => message.protocol === 'SimpleGroupLeave')
const isNftEmoji = computed(() => message.protocol === 'SimpleEmojiGroupChat')
const isImage = computed(() => message.protocol === 'SimpleFileGroupChat')
const isGiveawayRedEnvelope = computed(() => message.protocol === 'SimpleRedEnvelope')
const isReceiveRedEnvelope = computed(() => message.protocol === 'OpenRedEnvelope')
</script>

<style lang="scss" scoped></style>
