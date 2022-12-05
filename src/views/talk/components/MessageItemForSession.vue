<template lang="">
  <div class="flex hover:bg-gray-200 px-4 py-1 relative group transition-all duration-150">
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
        <div class="font-medium text-sm text-dark-800">
          {{ senderName }}
        </div>
        <div class="text-dark-300 text-xs">
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

      <div class="w-full py-0.5" v-else-if="isImage">
        <div
          class="w-fit max-w-[90%] md:max-w-[50%] lg:max-w-[400px] max-h-[600px] overflow-y-hidden rounded bg-transparent cursor-pointer"
          @click="previewImage"
        >
          <Image :src="decryptedMessage" customClass="rounded py-0.5 object-scale-down" />
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
            <img :src="redEnvelopeImg" class="h-12" loading="lazy" />
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
          class="text-sm text-dark-800 font-normal break-all p-3 rounded-xl rounded-tl-md"
          :class="isMyMessage ? 'bg-primary' : 'bg-white'"
          v-html="parseTextMessage(decryptedMessage)"
        ></div>
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
import { PrivateKey } from 'sensible-sdk/dist/bsv'

const i18n = useI18n()

const channelId = '034d4effee511b5e6f21e8fb1c1b9188ed2fd1cd3dbcc726c122e916597117ba29'
const showImagePreview = ref(false)
const props = defineProps(['message'])
const userStore = useUserStore()
const talkStore = useTalkStore()
const activeChannel = computed(() => talkStore.activeChannel)

const senderName = computed(() => {
  if (props.message.from === userStore.user?.metaId) {
    return userStore.user?.name
  }

  return activeChannel.value?.name
})

const previewImage = () => {
  showImagePreview.value = true
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

const isGroupJoinAction = computed(() => props.message.protocol === 'SimpleGroupJoin')
const isGroupLeaveAction = computed(() => props.message.protocol === 'SimpleGroupLeave')
const isNftEmoji = computed(() => props.message.protocol === 'SimpleEmojiGroupChat')
const isImage = computed(() => props.message.protocol === 'SimpleFileGroupChat')
const isGiveawayRedEnvelope = computed(() => props.message.protocol === 'SimpleRedEnvelope')
const isReceiveRedEnvelope = computed(() => props.message.protocol === 'OpenRedEnvelope')
const isText = computed(() => props.message.protocol === 'ShowMsg')
</script>

<style lang="scss" scoped></style>
