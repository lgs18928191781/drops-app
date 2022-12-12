<template>
  <div class="bg-white dark:bg-gray-700 rounded-lg">
    <!-- 上传图预览 -->
    <div
      v-if="hasImage"
      class="border-b-2 border-solid border-dark-200 dark:border-gray-600 pb-2 px-3 pt-3"
    >
      <div class="p-2 w-50 h-50 main-border still relative">
        <div class="absolute right-0 top-0 z-10 -my-2 -mx-3 flex space-x-2 items-center">
          <!-- 删除按钮 -->
          <div
            class="main-border bg-white dark:bg-gray-700 p-1 cursor-pointer"
            @click="deleteImage"
          >
            <Icon name="x_mark" class="w-4 h-4 text-dark-800 dark:text-gray-100" />
          </div>

          <!-- 发送按钮 -->
          <div
            class="main-border bg-primary dark:bg-gray-700 flex items-center justify-center p-1 divide-x divide-solid divide-dark-800 dark:divide-gray-100 cursor-pointer"
            @click="trySendImage"
          >
            <div class="">
              <Icon name="send" class="w-4 h-4 text-dark-800 dark:text-gray-100 -rotate-6" />
            </div>
          </div>
        </div>
        <img
          :src="imagePreviewUrl"
          class="w-full h-full object-scale-down cursor-zoom-in"
          @click="showImagePreview = true"
        />
      </div>

      <Teleport to="body" v-if="showImagePreview">
        <ImagePreview
          v-if="showImagePreview"
          :src="imagePreviewUrl"
          @close="showImagePreview = false"
        />
      </Teleport>
    </div>

    <div :class="[rows > 1 ? 'items-start' : 'items-center', 'flex h-fit']">
      <!-- 左侧 + 按钮 -->
      <div
        class="w-14 flex items-center py-2 justify-center text-dark-800 dark:text-gray-100"
        @click="showMoreCommandsBox = true"
      >
        <div
          class="bg-primary w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
        >
          <Icon name="plus_2" class="w-3 h-3 text-dark-800 dark:text-gray-100" />
        </div>
      </div>

      <div class="self-stretch lg:ml-2 py-2 flex items-center grow">
        <textarea
          class=" w-full !outline-none placeholder:text-dark-250 placeholder:dark:text-gray-400 placeholder:text-base text-dark-800 dark:text-gray-100 text-base caret-gray-600 dark:caret-gray-400 resize-none !h-fit text-base rounded-md transition-all duration-150 delay-100"
          :class="rows > 1 ? 'bg-gray-100 dark:bg-gray-800 p-1 -m-1' : 'bg-inherit'"
          :rows="rows"
          ref="theTextBox"
          :placeholder="
            $t('Talk.Channel.message_to', {
              channel: talkStore?.activeChannelSymbol + (talkStore.activeChannel?.name || ''),
            })
          "
          v-model="chatInput"
          @keyup.enter.exact.prevent="trySendText"
        />
      </div>

      <Teleport to="body">
        <div
          v-show="showMoreCommandsBox"
          class="fixed z-50 inset-0 h-screen w-screen bg-transparent"
          @click="showMoreCommandsBox = false"
        >
          <div class="relative h-full w-full">
            <input
              type="file"
              id="imageUploader"
              ref="imageUploader"
              accept="image/*"
              @change="handleImageChange"
              class="hidden"
            />
            <div
              class="absolute bottom-[76PX] left-[16PX] lg:bottom-[86PX] lg:left-[346PX] bg-white dark:bg-gray-700 py-1.5 px-2 rounded text-xs flex flex-col text-dark-400 dark:text-gray-200 font-medium space-y-0.5 shadow-lg"
            >
              <div
                class="p-2 flex items-center space-x-2 text-dark-800 dark:text-gray-100 rounded-sm lg:cursor-pointer lg:hover:text-white lg:hover:text-gray-900 lg:hover:bg-primary"
                @click="openImageUploader"
              >
                <div class="">
                  <Icon name="photo" class="w-5 h-5" />
                </div>
                <div class="">
                  {{ $t('Talk.Channel.upload_image') }}
                </div>
              </div>
              <!-- <div
                class="p-2 flex items-center space-x-2 text-dark-800 dark:text-gray-100 rounded-sm lg:cursor-pointer lg:hover:text-white lg:hover:bg-primary"
              >
                <div class="">
                  <Icon name="link" class="w-5 h-5" />
                </div>
                <div class="">
                  {{ $t('Talk.Channel.use_onchain_image') }}
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </Teleport>

      <!-- 右侧发送按钮 -->
      <div class="flex h-full py-1 items-center shrink-0">
        <div class="flex items-center px-1 lg:mr-2">
          <!-- <div
            class="p-2 w-9 h-9 transition-all lg:hover:animate-wiggle cursor-pointer"
            @click="layout.isShowRedPacketModal = true"
          >
            <Icon name="red_envelope" class="w-full h-full text-dark-800 dark:text-gray-100" />
          </div> -->

          <Popover class="relative flex items-center">
            <PopoverButton as="div">
              <div class="p-2 w-9 h-9 transition-all lg:hover:animate-wiggle cursor-pointer">
                <Icon name="photo_3" class="w-full h-full text-dark-800 dark:text-gray-100" />
              </div>
            </PopoverButton>

            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <PopoverPanel
                class="absolute z-10 transform top-[-16PX] right-0 -translate-y-full"
                v-slot="{ close }"
              >
                <div
                  class="bg-white dark:bg-gray-700 p-2 rounded-xl shadow-lg w-60 divide-y divide-dark-200 dark:divide-gray-600"
                >
                  <div
                    class="mx-2 py-4 flex items-center space-x-2 text-dark-800 dark:text-gray-100 rounded-sm lg:cursor-pointer lg:hover:underline cursor-pointer"
                    @click="openImageUploader(close)"
                  >
                    <div class="cursor-pointer">
                      <Icon name="photo" class="w-5 h-5 rounded-full bg-primary p-2 box-content" />
                    </div>
                    <div class="">
                      {{ $t('Talk.Channel.upload_image') }}
                    </div>
                  </div>
                  <!-- <div
                    class="mx-2 py-4 flex items-center space-x-2 text-dark-800 dark:text-gray-100 rounded-sm lg:cursor-pointer lg:hover:underline cursor-pointer"
                  >
                    <div class=" ">
                      <Icon name="link" class="w-5 h-5 rounded-full bg-primary p-2 box-content" />
                    </div>
                    <div class="">
                      {{ $t('Talk.Channel.use_onchain_image') }}
                    </div>
                  </div> -->
                </div>
              </PopoverPanel>
            </transition>
          </Popover>

          <ElPopover placement="bottom-start" width="300px" trigger="click">
            <StickerVue @input="params => (chatInput = chatInput + params.value)" />
            <template #reference>
              <div class="p-1 w-9 h-9 transition-all lg:hover:animate-wiggle cursor-pointer">
                <Icon
                  name="face_smile"
                  class="w-full h-full text-dark-800 dark:text-gray-100 transition-all ease-in-out duration-300"
                  :class="{ 'text-primary -rotate-6 scale-110': showStickersBox }"
                />
              </div>
            </template>
          </ElPopover>
        </div>

        <div class="py-0.5 h-full lg:hidden">
          <div class="h-full border-l-2 border-solid border-dark-250 dark:border-gray-400"></div>
        </div>

        <div class="lg:hidden">
          <div class="py-2 px-3" @click="trySendText">
            <div
              class="transition-all ease-in-out duration-500"
              :class="[
                hasInput ? 'text-primary scale-110 -rotate-6' : 'text-dark-250 dark:text-gray-400',
              ]"
            >
              <Icon name="send" class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, Ref } from 'vue'
import { sendMessage, validateTextMessage, isImage, isFileTooLarge } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import ImagePreview from './ImagePreview.vue'
import { FileToAttachmentItem } from '@/utils/util'
import { encrypt, ecdhEncrypt } from '@/utils/crypto'
import { useTalkStore } from '@/stores/talk'
import StickerVue from '@/components/Sticker/Sticker.vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChannelType, MessageType } from '@/enum'
import { useLayoutStore } from '@/stores/layout'

const doNothing = () => {}

const showMoreCommandsBox = ref(false)
const showStickersBox = ref(false)

const layout = useLayoutStore()

const hasInput = computed(() => chatInput.value.length > 0)

/** 上传图片 */
const talkStore = useTalkStore()
const imageUploader = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const showImagePreview = ref(false)

const hasImage = computed(() => imageFile.value !== null)

const openImageUploader = (close: Function) => {
  imageUploader.value?.click()
  close()
}

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    if (!isImage(file)) {
      talkStore.$patch({
        error: {
          type: 'image_only',
          message: 'image_only',
          timestamp: Date.now(),
        },
      })
      return
    }

    if (isFileTooLarge(file)) {
      talkStore.$patch({
        error: {
          type: 'image_too_large',
          message: 'image_too_large',
          timestamp: Date.now(),
        },
      })
      return
    }

    imageFile.value = file
  }
}

const deleteImage = () => {
  imageFile.value = null
  imageUploader.value!.value = ''
}

const imagePreviewUrl = computed(() => {
  if (imageFile.value) {
    return URL.createObjectURL(imageFile.value)
  }

  return ''
})

const trySendImage = async () => {
  const hexedFiles = await FileToAttachmentItem(imageFile.value!)
  const attachments = [hexedFiles]

  // clone
  const originalFileUrl = imagePreviewUrl.value
  deleteImage()

  const messageDto = {
    type: MessageType.Image,
    channelId: talkStore.activeChannel.id,
    userName: userStore.user?.name || 'Riverrun46',
    attachments,
    content: '',
    originalFileUrl,
  }
  await sendMessage(messageDto)

  return
}
/** ------ */

/** 发送消息 */
const chatInput = ref('')
const userStore = useUserStore()
const isSending = ref(false)
const theTextBox: Ref<HTMLTextAreaElement | null> = ref(null)

const rows = computed(() => {
  if (isSending.value) {
    return 1
  }

  // 行数=换行符+过长的行数+1
  const lines = chatInput.value.split('\n')
  // 计算列数：当前textarea宽度/字体宽度 TODO

  // const cols = Math.floor(
  //   (theTextBox.value?.clientWidth || 0) / (theTextBox.value?.offsetWidth || 0)
  // )

  const rowsCount = lines.reduce((acc, line) => {
    // const lineRows = Math.max(1, Math.ceil(line.length / cols))
    const lineRows = 1
    return acc + lineRows
  }, 0)

  return Math.min(Math.max(rowsCount, 1), 10)
})

const trySendText = async () => {
  isSending.value = true
  // 去除首尾空格
  chatInput.value = chatInput.value.trim()
  if (!validateTextMessage(chatInput.value)) return

  // 私聊会话和频道群聊的加密方式不同
  let content = ''
  if (talkStore.activeChannelType === 'group') {
    content = encrypt(chatInput.value, talkStore.activeChannel.id.substring(0, 16))
  } else {
    const privateKey = toRaw(userStore?.wallet)!.getPathPrivateKey('0/0')
    const privateKeyStr = privateKey.toHex()
    const otherPublicKeyStr = talkStore.activeChannel.publicKeyStr
    console.log(chatInput.value, privateKeyStr, otherPublicKeyStr)

    content = ecdhEncrypt(chatInput.value, privateKeyStr, otherPublicKeyStr)
  }

  chatInput.value = ''

  const messageDto = {
    content,
    type: MessageType.Text,
    channelId: talkStore.activeChannel.id,
    userName: userStore.user?.name || '',
    channelType: talkStore.activeChannelType as ChannelType,
  }
  await sendMessage(messageDto)

  isSending.value = false
}
/** ------ */
</script>

<style lang="scss" scoped></style>
