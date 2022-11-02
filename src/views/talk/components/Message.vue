<template lang="">
  <div class="flex">
    <UserAvatar
      :type="props.message.avatarType"
      :metaId="props.message.avatarTxId || 'undefined'"
      class="w-13.5 h-13.5 shrink-0"
    />
    <div class="ml-4 grow pr-12">
      <div class="flex items-end space-x-2">
        <div class="font-medium text-sm" :class="randomNameColor">
          {{ message.nickName }}
        </div>
        <div class="text-dark-250 text-sm">
          <!-- {{ $filters.dateTimeFormat(message.timestamp, 'HH:mm') }} -->
          {{ formatTime(message.timestamp) }}
        </div>
      </div>

      <div class="w-full py-0.5 text-dark-400 text-xs capitalize" v-if="isGroupJoinAction">
        {{ $t('Talk.Channel.join_channel') }}
      </div>
      <div class="w-full py-0.5 text-dark-400 text-xs capitalize" v-else-if="isGroupLeaveAction">
        {{ $t('Talk.Channel.leave_channel') }}
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
          class="max-w-[90%] md:max-w-[50%] lg:max-w-[400px] max-h-[600px] overflow-y-hidden rounded bg-dark-100 cursor-pointer"
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

      <div class="text-xs text-dark-400 my-0.5 capitalize" v-else-if="isReceiveRedEnvelope">
        {{ redEnvelopeReceiveInfo }}
      </div>

      <div class="w-full py-0.5" v-else-if="isGiveawayRedEnvelope">
        <div
          class="max-w-full md:max-w-[50%] lg:max-w-[400px] shadow-lg rounded-xl cursor-pointer origin-top-left hover:shadow-xl hover:scale-105  transition-all duration-300"
        >
          <div class="rounded-xl bg-red-400 p-6 flex space-x-2">
            <img :src="redEnvelopeImg" class="h-12" />
            <div class="">
              <div class="text-white text-lg font-medium capitalize">
                {{ $t('Talk.Channel.come_get_red_envelope') }}
              </div>
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
import { computed, onMounted, ref } from 'vue'
import { dateTimeFormat } from '@/utils/filters'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

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
  const name = props.message.nickName
  const nameCode = name.split('').reduce((acc: number, cur: any) => acc + cur.charCodeAt(0), 0)

  return colors[nameCode % colors.length]
})

const previewImage = () => {
  console.log(decryptedMessage)
  showImagePreview.value = true
}

const formatTime = (timestamp: Date) => {
  const day = dayjs(timestamp)
  // 如果是今天，则显示为“今天 hour:minute”
  if (day.isSame(dayjs(), 'day')) {
    return `${i18n.t('Talk.Datetime.today')}${day.format('HH:mm')}`
  }

  // 如果是昨天，则显示为“昨天 hour:minute”
  if (day.isSame(dayjs().subtract(1, 'day'), 'day')) {
    return `${i18n.t('Talk.Datetime.yesterday')}${day.format('HH:mm')}`
  }

  // 如果是今年，则显示为“month day hour:minute”
  if (day.isSame(dayjs(), 'year')) {
    return day.format('MM/DD HH:mm')
  }

  // 如果不是今年，则显示为“year month day hour:minute”
  return day.format('YYYY/MM/DD HH:mm')
}

const decryptedMessage = computed(() => {
  if (props.message.encryption === '0') {
    return props.message.content
  }

  if (
    props.message.protocol !== 'simpleGroupChat' &&
    props.message.protocol !== 'SimpleFileGroupChat'
  ) {
    return props.message.content
  }

  return decrypt(props.message.content, roomId.substring(0, 16))
})

const redEnvelopeReceiveInfo = computed(() => {
  const content: string = props.message.content

  if (props.message.metaId === props.message.data?.redEnvelopeMetaId) {
    return i18n.t('Talk.Channel.receive_own_red_envelope')
  }

  const [_receiver, sender] = content.split('|-|')

  return i18n.t('Talk.Channel.receive_red_envelope', {
    sender,
  })
})

const redEnvelopeMessage = computed(() => {
  return props.message.data?.content || i18n.t('Talk.Channel.default_red_envelope_message')
})

const isMyMessage = computed(() => {
  return props.message.metaId === '261562cd13734c7e9f3809e32d3d7c56f0b27788f88d6738fc95f96ddb89eb01' // TODO:
})

const isGroupJoinAction = computed(() => props.message.protocol === 'SimpleGroupJoin')
const isGroupLeaveAction = computed(() => props.message.protocol === 'SimpleGroupLeave')
const isNftEmoji = computed(() => props.message.protocol === 'SimpleEmojiGroupChat')
const isImage = computed(() => props.message.protocol === 'SimpleFileGroupChat')
const isGiveawayRedEnvelope = computed(() => props.message.protocol === 'SimpleRedEnvelope')
const isReceiveRedEnvelope = computed(() => props.message.protocol === 'OpenRedEnvelope')
</script>

<style lang="scss" scoped></style>
