<template>
  <div
    class="flex hover:bg-gray-200 hover:bg-gray-800 px-4 py-1.5 relative group transition-all duration-150"
  >
    <!-- 消息菜单 -->
    <MessageMenu
      :message="props.message"
      :parsed="parseTextMessage(decryptedMessage)"
      v-if="isText"
    />
    <MessageMenu :message="props.message" v-else />

    <UserAvatar
      :metaId="props.message.from || 'undefined'"
      class="w-13.5 h-13.5 shrink-0 select-none"
      :disabled="true"
    />
    <div class="ml-4 grow pr-12">
      <div class="flex items-baseline space-x-2">
        <div class="font-medium text-sm text-dark-800 dark:text-gray-100">
          {{ senderName }}
        </div>
        <div class="text-dark-300 dark:text-gray-400 text-xs">
          {{ formatTimestamp(message.timestamp, i18n) }}
        </div>
      </div>

      <div class="w-full" v-if="isNftEmoji">
        <Image
          :src="decryptedMessage"
          customClass="max-w-[80%] md:max-w-[50%] lg:max-w-[320px] py-0.5 object-scale-down"
        />

        <NftLabel class="w-8 mt-1" />
      </div>

      <div class="my-1.5 flex" v-else-if="isFollow">
        <div
          class="text-sm text-dark-800 dark:text-gray-100 font-normal break-all p-3 rounded-xl rounded-tl flex items-center"
          :class="isMyMessage ? 'bg-primary dark:text-gray-800' : 'bg-white dark:bg-gray-700'"
        >
          <Icon name="message_follow" class="w-4 h-4 mr-1.5" />
          <span>
            {{ $t('Talk.Messages.follow') }}
          </span>
        </div>
      </div>

      <div class="my-1.5 flex" v-else-if="isFtTransfer">
        <div class="max-w-full min-w-[240PX] md:w-[300PX] shadow rounded-xl rounded-tl bg-blue-400">
          <div
            class="rounded-xl p-4 flex space-x-4.5 bg-white dark:bg-gray-700 items-center rounded-tl"
          >
            <Image :src="message.icon" customClass="h-15 w-15 rounded-full" loading="lazy" />
            <div class="flex flex-col space-y-1.5">
              <div class="text-dark-800 dark:text-gray-100 text-base font-medium capitalize">
                {{ message.memo }}
              </div>
              <div class="text-dark-400 dark:text-gray-200 text-xs">
                {{ message.amountStr.split('.')[0] + ' ' + message.symbol }}
              </div>
            </div>
          </div>

          <div class="flex py-2.5 items-center space-x-1.5 px-4">
            <Icon name="message_token" class="w-4 h-4 text-white" />
            <div class="text-white text-xs">{{ $t('Talk.Messages.token_transfer') }}</div>
          </div>
        </div>
      </div>

      <div class="my-1.5 flex flex-col items-start" v-else-if="isRepost">
        <div
          class="text-sm text-dark-800 dark:text-gray-100 font-normal break-all p-3 rounded-xl rounded-tl flex items-center"
          :class="isMyMessage ? 'bg-primary dark:text-gray-800' : 'bg-white dark:bg-gray-700'"
        >
          <Icon name="message_repost" class="w-4 h-4 mr-1.5" />
          <span>
            {{
              message.data.rePostComment
                ? $t('Talk.Messages.repost_with_comment')
                : $t('Talk.Messages.repost')
            }}
          </span>
        </div>
        <div
          class="mt-1.5 bg-dark-800/5 dark:bg-gray-800  text-sm text-dark-400 dark:text-gray-200 rounded-xl px-3 py-2"
          v-if="message.data.rePostComment"
        >
          {{ message.data.rePostComment }}
        </div>
      </div>

      <div class="my-1.5 flex flex-col items-start" v-else-if="isLike">
        <div
          class="text-sm text-dark-800 dark:text-gray-100 font-normal break-all p-3 rounded-xl rounded-tl flex items-center"
          :class="isMyMessage ? 'bg-primary dark:text-gray-800' : 'bg-white dark:bg-gray-700'"
        >
          <Icon name="message_like" class="w-4 h-4 mr-1.5" />
          <span>
            {{ $t('Talk.Messages.like') }}
          </span>
        </div>
      </div>

      <div class="my-1.5 flex flex-col items-start" v-else-if="isComment">
        <div
          class="text-sm text-dark-800 dark:text-gray-100 font-normal break-all p-3 rounded-xl rounded-tl flex items-center"
          :class="isMyMessage ? 'bg-primary dark:text-gray-800' : 'bg-white dark:bg-gray-700'"
        >
          <Icon name="message_comment" class="w-4 h-4 mr-1.5" />
          <span>
            {{ $t('Talk.Messages.comment') }}
          </span>
        </div>
        <div
          class="mt-1.5 bg-dark-800/5 dark:bg-gray-800 text-sm text-dark-400 dark:text-gray-200 rounded-xl px-3 py-2"
        >
          {{ message.data.content }}
        </div>
      </div>

      <div class="w-full py-0.5 flex items-center" v-else-if="isImage">
        <div
          class="w-fit max-w-[90%] md:max-w-[50%] lg:max-w-[400px] max-h-[600px] overflow-y-hidden rounded bg-transparent cursor-pointer transition-all duration-200"
          :class="[message.error && 'opacity-50']"
          @click="previewImage"
        >
          <Image :src="decryptedMessage" customClass="rounded py-0.5 object-scale-down" />
        </div>
        <button v-if="message.error" class="ml-3" :title="resendTitle" @click="tryResend">
          <Icon
            name="arrow_path"
            class="w-4 h-4 text-dark-400 dark:text-gray-200 hover:animate-spin-once"
          />
        </button>
        <Teleport to="body" v-if="isImage && showImagePreview">
          <ImagePreview
            v-if="showImagePreview"
            :src="decryptedMessage"
            @close="showImagePreview = false"
          />
        </Teleport>
      </div>

      <div
        class="text-xs text-dark-400 dark:text-gray-200 my-0.5 capitalize"
        v-else-if="isReceiveRedEnvelope"
      >
        {{ redEnvelopeReceiveInfo }}
      </div>

      <div class="w-full py-0.5" v-else-if="isGiveawayRedEnvelope">
        <div
          class="max-w-full md:max-w-[50%] lg:max-w-[400px] shadow-lg rounded-xl cursor-pointer origin-top-left hover:shadow-xl hover:scale-105  transition-all duration-300"
        >
          <div class="rounded-xl bg-red-400 p-6 flex space-x-2">
            <img :src="redEnvelopeImg" class="h-12" loading="lazy" />
            <div class="">
              <div class="text-white text-lg font-medium capitalize">
                {{ $t('Talk.Channel.come_get_red_envelope') }}
              </div>
              <div class="text-red-50 text-xs mt-0.5">{{ redEnvelopeMessage }}</div>
            </div>
          </div>
          <div class=" py-2 px-6 text-dark-400 dark:text-gray-200 text-xs">Show红包</div>
        </div>
      </div>

      <div class="my-1.5 max-w-full flex" v-else>
        <div
          class="text-sm text-dark-800 dark:text-gray-100 font-normal break-all p-3 rounded-xl rounded-tl transition-all duration-200"
          :class="[
            isMyMessage ? 'bg-primary dark:text-gray-800' : 'bg-white dark:bg-gray-700',
            message.error && 'bg-red-200 opacity-50',
          ]"
          v-html="parseTextMessage(decryptedMessage)"
        ></div>
        <button v-if="message.error" class="ml-3" :title="resendTitle" @click="tryResend">
          <Icon
            name="arrow_path"
            class="w-4 h-4 text-dark-400 dark:text-gray-200 hover:animate-spin-once"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ecdhDecrypt } from '@/utils/crypto'
import NftLabel from './NftLabel.vue'
import MessageMenu from './MessageMenu.vue'
import redEnvelopeImg from '@/assets/images/red-envelope.svg?url'
import ImagePreview from './ImagePreview.vue'
import { computed, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatTimestamp } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import { useTalkStore } from '@/stores/talk'
import { useJobsStore } from '@/stores/jobs'

const i18n = useI18n()

const showImagePreview = ref(false)
const props = defineProps(['message'])
const userStore = useUserStore()
const talkStore = useTalkStore()
const activeChannel = computed(() => talkStore.activeChannel)
const jobs = useJobsStore()

const senderName = computed(() => {
  if (props.message.from === userStore.user?.metaId) {
    return userStore.user?.name
  }

  return activeChannel.value?.name
})

const previewImage = () => {
  showImagePreview.value = true
}

const resendTitle = computed(() => {
  return i18n.t('Talk.Messages.resend')
})

const tryResend = async () => {
  props.message.error = false
  await jobs.resend(props.message.timestamp)
}

const decryptedMessage = computed(() => {
  if (props.message.data.encrypt !== '1') {
    return props.message.data.content
  }

  // if (
  //   props.message.protocol !== 'simpleGroupChat' &&
  //   props.message.protocol !== 'SimpleFileGroupChat'
  // ) {
  //   return props.message.data.content
  // }

  // 处理mock的图片消息
  if (props.message.isMock && props.message.protocol === 'SimpleFileGroupChat') {
    return props.message.data.content
  }

  if (!talkStore.activeChannel) return ''

  const privateKey = toRaw(userStore?.wallet)!.getPathPrivateKey('0/0')
  const privateKeyStr = privateKey.toHex()
  const otherPublicKeyStr = talkStore.activeChannel.publicKeyStr

  return ecdhDecrypt(props.message.data.content, privateKeyStr, otherPublicKeyStr)
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
  if (!content) return ''

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
  return userStore.user?.metaId && userStore.user.metaId === props.message.from
})

const isNftEmoji = computed(() => props.message.protocol === 'SimpleEmojiGroupChat')
const isImage = computed(() => props.message.protocol === 'SimpleFileGroupChat')
const isGiveawayRedEnvelope = computed(() => props.message.protocol === 'SimpleRedEnvelope')
const isReceiveRedEnvelope = computed(() => props.message.protocol === 'OpenRedEnvelope')
const isText = computed(() => props.message.protocol === 'ShowMsg')
const isLike = computed(() => props.message.protocol === 'PayLike')
const isFollow = computed(() => props.message.protocol === 'PayFollow')
const isRepost = computed(() => props.message.protocol === 'SimpleRePost')
const isComment = computed(() => props.message.protocol === 'PayComment')
const isFtTransfer = computed(() => props.message.protocol === 'FtTransfer')
</script>

<style lang="scss" scoped></style>
