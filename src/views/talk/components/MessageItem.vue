<template>
  <div class="flex hover:bg-gray-200 px-4 py-1 relative group transition-all duration-150">
    <!-- 消息菜单 -->
    <MessageMenu
      :message="props.message"
      :parsed="parseTextMessage(decryptedMessage)"
      v-if="isText"
    />
    <MessageMenu :message="props.message" v-else />

    <UserAvatar
      :metaId="props.message.metaId || 'undefined'"
      class="w-13.5 h-13.5 shrink-0 select-none"
      :disabled="true"
    />
    <div class="ml-4 grow pr-12">
      <div class="flex items-baseline space-x-2">
        <div class="font-medium text-sm" :class="randomNameColor">
          {{ message.nickName }}
        </div>
        <div class="text-dark-300 text-xs">
          {{ formatTimestamp(message.timestamp, i18n) }}
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
          customClass="max-w-[80%] md:max-w-[50%] lg:max-w-[320px] py-0.5 object-scale-down"
        />

        <NftLabel class="w-8 mt-1" />
      </div>

      <div class="w-full py-0.5" v-else-if="isImage">
        <div
          class="w-fit max-w-[90%] md:max-w-[50%] lg:max-w-[400px] max-h-[600px] overflow-y-hidden rounded bg-dark-100 cursor-pointer"
          @click="previewImage"
        >
          <Image :src="decryptedMessage" customClass="rounded-xl py-0.5 object-scale-down" />
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
          class="max-w-full md:max-w-[50%] lg:max-w-[300PX] shadow rounded-xl cursor-pointer origin-center hover:shadow-md transition-all duration-200 bg-white hover:animate-wiggle-subtle group"
        >
          <div
            class="rounded-xl p-4 flex space-x-2 bg-gradient-to-br from-[#FFE8D2] via-[#FFF1B9] to-[#FEFFE3] items-center"
          >
            <img :src="giftImage" class="h-12 w-12" loading="lazy" />
            <div class="">
              <div class="text-dark-800 text-base font-medium capitalize">
                {{ $t('Talk.Channel.come_get_red_envelope') }}
              </div>
              <div class="text-dark-300 text-sm mt-1">{{ redEnvelopeMessage }}</div>
            </div>
          </div>

          <div class="flex py-2.5 items-center space-x-1.5 px-4">
            <Icon name="gift" class="w-4 h-4 text-dark-300" />
            <div class="text-dark-300 text-xs">{{ $t('Talk.Input.giveaway') }}</div>
          </div>
        </div>
      </div>

      <div class="my-1.5 max-w-full flex" v-else>
        <div
          class="text-sm text-dark-800 font-normal break-all p-3 rounded-xl rounded-tl-md"
          :class="isMyMessage ? 'bg-primary' : 'bg-white'"
          v-html="parseTextMessage(decryptedMessage)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { decrypt } from '@/utils/crypto'
import NftLabel from './NftLabel.vue'
import MessageMenu from './MessageMenu.vue'
import ImagePreview from './ImagePreview.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatTimestamp } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import { useTalkStore } from '@/stores/talk'
import giftImage from '@/assets/images/gift.svg?url'

const i18n = useI18n()

const showImagePreview = ref(false)
const userStore = useUserStore()
const talkStore = useTalkStore()

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
  showImagePreview.value = true
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

  // 处理mock的图片消息
  if (props.message.isMock && props.message.protocol === 'SimpleFileGroupChat') {
    return props.message.content
  }

  return decrypt(props.message.content, talkStore.activeChannelId.substring(0, 16))
})

const parseTextMessage = (text: string) => {
  if (typeof text == 'undefined') {
    return ''
  }

  const HTML = /<\/?.+?>/gi
  const COOKIE = /document\.cookie/gi
  const HTTP = /(http|https):\/\//gi
  const re = /(f|ht){1}(tp|tps):\/\/([\w-]+\S)+[\w-]+([\w-?%#&=]*)?(\/[\w- ./?%#&=]*)?/g

  if (HTML.test(text)) {
    return '无效输入,别耍花样!'
  }
  if (COOKIE.test(text)) {
    return '无效输入,你想干嘛!'
  }
  text = text.replace(re, function(url) {
    if (HTTP.test(text)) {
      return `<a href=${url} target="_blank" style="text-decoration: underline;cursor: pointer;" class="url"> ${url} </a>`
    }
    return `<a onClick="window.open('http://${text}','_blank')" style="text-decoration: underline;cursor: pointer;" target="_blank">${text}</a>`
  })
  text = text.replace(/\\n/g, '\n')
  return text.replace(/\n/g, '<br />')
}

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
  return userStore.user?.metaId && userStore.user.metaId === props.message.metaId
})

const isGroupJoinAction = computed(() => props.message.protocol === 'SimpleGroupJoin')
const isGroupLeaveAction = computed(() => props.message.protocol === 'SimpleGroupLeave')
const isNftEmoji = computed(() => props.message.protocol === 'SimpleEmojiGroupChat')
const isImage = computed(() => props.message.protocol === 'SimpleFileGroupChat')
const isGiveawayRedEnvelope = computed(() => props.message.protocol === 'SimpleRedEnvelope')
const isReceiveRedEnvelope = computed(() => props.message.protocol === 'OpenRedEnvelope')
const isText = computed(() => props.message.protocol === 'simpleGroupChat')
</script>

<style lang="scss" scoped></style>
