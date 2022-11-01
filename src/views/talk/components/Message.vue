<template lang="">
  <div class="flex">
    <UserAvatar
      :type="message.avatarType"
      :metaId="message.avatarTxId || 'undefined'"
      class="w-13.5 h-13.5 shrink-0"
    />
    <div class="ml-4 grow pr-12">
      <div class="flex items-end space-x-2">
        <div class="font-medium text-sm" :class="randomNameColor">
          {{ message.nickName }}
        </div>
        <div class="text-dark-250 text-sm">
          {{ $filters.dateTimeFormat(message.timestamp, 'HH:mm') }}
        </div>
      </div>

      <div class="w-full py-0.5 text-dark-400 text-xs" v-if="isGroupJoinAction">加入了群聊</div>
      <div class="w-full py-0.5 text-dark-400 text-xs" v-else-if="isGroupLeaveAction">
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
          class="max-w-[90%] md:max-w-[50%] lg:max-w-[400px] max-h-[600px] overflow-y-hidden rounded bg-dark-100"
          @click="previewImage"
        >
          <Image :src="decryptedMessage" customClass="rounded py-0.5" />
        </div>
        <Teleport to="body" v-if="isImage && showImagePreview">
          <ImagePreview
            v-if="showImagePreview"
            :src="decryptedMessage"
            @close="showImagePreview = false"
          />
        </Teleport>
      </div>

      <div class="text-xs text-dark-400 my-0.5" v-else-if="isReceiveRedEnvelope">
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
          <div class=" py-2 px-6 text-dark-400 text-xs">Show红包</div>
        </div>
      </div>

      <div class="my-1.5 max-w-full flex" v-else>
        <div
          class="text-sm text-dark-800 font-normal break-all p-4 rounded-xl rounded-tl-md"
          :class="isMyMessage ? 'bg-primary' : 'bg-white'"
        >
          {{ decryptedMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decrypt } from '@/utils/crypto'
import NftLabel from './NftLabel.vue'
import redEnvelopeImg from '@/assets/images/red-envelope.svg?url'
import ImagePreview from './ImagePreview.vue'
import { computed, ref } from 'vue'

const roomId = 'b671caca627219c214f433497f9aba530a29a927bb5e32f242e36f8cbc26ba3b'
const showImagePreview = ref(false)

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

const previewImage = () => {
  console.log(decryptedMessage)
  showImagePreview.value = true
}

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

const isMyMessage = computed(() => {
  return message.metaId === '261562cd13734c7e9f3809e32d3d7c56f0b27788f88d6738fc95f96ddb89eb01' // TODO:
})

const isGroupJoinAction = computed(() => message.protocol === 'SimpleGroupJoin')
const isGroupLeaveAction = computed(() => message.protocol === 'SimpleGroupLeave')
const isNftEmoji = computed(() => message.protocol === 'SimpleEmojiGroupChat')
const isImage = computed(() => message.protocol === 'SimpleFileGroupChat')
const isGiveawayRedEnvelope = computed(() => message.protocol === 'SimpleRedEnvelope')
const isReceiveRedEnvelope = computed(() => message.protocol === 'OpenRedEnvelope')
</script>

<style lang="scss" scoped></style>
