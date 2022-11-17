<template>
  <div class="bg-white rounded-lg">
    <!-- 上传图预览 -->
    <div v-if="hasImage" class="border-b-2 border-solid border-dark-200 pb-2 px-3 pt-3">
      <div class="bg-dark-220 p-2 w-50 h-50 main-border still relative">
        <div class="absolute right-0 top-0 z-10 -my-2 -mx-3 flex space-x-2 items-center">
          <!-- 删除按钮 -->
          <div class="main-border bg-white p-1 cursor-pointer" @click="deleteImage">
            <Icon name="x_mark" class="w-4 h-4 text-dark-800" />
          </div>

          <!-- 发送按钮 -->
          <div
            class="main-border bg-primary flex items-center justify-center px-2 py-1 divide-x divide-solid divide-dark-800 cursor-pointer"
            @click="trySendImage"
          >
            <div class="text-dark-400 font-medium pr-1.5 flex items-center space-x-0.5">
              <div class="">
                <Icon name="dollar" class="w-4 h-4 text-dark-800" />
              </div>
              <div class="">
                10 sats
              </div>
            </div>
            <div class="pl-1.5 ">
              <Icon name="send" class="w-3 h-3 text-dark-800 -rotate-6" />
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
          :original-size="true"
          @close="showImagePreview = false"
        />
      </Teleport>
    </div>

    <div class="h-11 flex lg:h-13.5 items-center">
      <!-- 左侧 + 按钮 -->
      <div
        class="w-14 flex items-center justify-center text-dark-800 self-stretch"
        @click="showMoreCommandsBox = true"
      >
        <div
          class="bg-primary w-7.5 h-7.5 flex items-center justify-center rounded-full cursor-pointer"
        >
          <Icon name="plus_2" class="w-3 h-3 text-dark-800" />
        </div>
      </div>

      <div class="flex-grow lg:ml-4">
        <div class="h-11 py-2 pr-4 lg:h-13.5">
          <input
            type="text"
            class="bg-inherit h-full w-full focus:outline-none placeholder:text-dark-250 placeholder:text-sm text-dark-800 text-base caret-gray-600"
            :placeholder="$t('Talk.Channel.message_to', { channel: '#' + currentChannel.name })"
            v-model="chatInput"
            @keyup.enter="trySendMessage"
          />
        </div>
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
              class="absolute bottom-[76PX] left-[16PX] lg:bottom-[86PX] lg:left-[346PX] bg-white py-1.5 px-2 rounded text-xs flex flex-col text-dark-400 font-medium space-y-0.5 shadow-lg"
            >
              <div
                class="p-2 flex items-center space-x-2 text-dark-800 rounded-sm lg:cursor-pointer lg:hover:text-white lg:hover:bg-primary"
                @click="openImageUploader"
              >
                <div class="">
                  <Icon name="photo" class="w-5 h-5" />
                </div>
                <div class="">
                  {{ $t('Talk.Channel.upload_image') }}
                </div>
              </div>
              <div
                class="p-2 flex items-center space-x-2 text-dark-800 rounded-sm lg:cursor-pointer lg:hover:text-white lg:hover:bg-primary"
              >
                <div class="">
                  <Icon name="link" class="w-5 h-5" />
                </div>
                <div class="">
                  {{ $t('Talk.Channel.use_onchain_image') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- 右侧发送按钮 -->
      <div class="flex h-full py-2 items-center shrink-0">
        <div class="flex items-center px-1 lg:mr-2">
          <div
            class="p-2 w-9 h-9 transition-all lg:hover:animate-wiggle cursor-pointer"
            @click="doNothing"
          >
            <Icon name="red_envelope" class="w-full h-full text-dark-800" />
          </div>

          <ElPopover placement="bottom-start" width="300px" trigger="click">
            <StickerVue @input="params => (chatInput = chatInput + params.value)" />
            <template #reference>
              <div class="p-1 w-9 h-9 transition-all lg:hover:animate-wiggle cursor-pointer">
                <Icon
                  name="face_smile"
                  class="w-full h-full text-dark-800 transition-all ease-in-out duration-300"
                  :class="{ 'text-primary -rotate-6 scale-110': showStickersBox }"
                />
              </div>
            </template>
          </ElPopover>
        </div>

        <div class="py-0.5 h-full lg:hidden">
          <div class="h-full border-l-2 border-solid border-dark-250"></div>
        </div>

        <div class="lg:hidden">
          <div class="py-2 px-3" @click="trySendMessage">
            <div
              class="transition-all ease-in-out duration-500"
              :class="[hasInput ? 'text-primary scale-110 -rotate-6' : 'text-dark-250']"
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
import { computed, ref } from 'vue'
import { sendMessage, validateMessage, MessageType } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import ImagePreview from './ImagePreview.vue'
import TheInputStickersBox from './TheInputStickersBox.vue'
import { FileToAttachmentItem } from '@/utils/util'
import { encrypt } from '@/utils/crypto'
import { useTalkStore } from '@/stores/talk'
import StickerVue from '@/components/Sticker/Sticker.vue'

const doNothing = () => {}

const props = defineProps(['currentChannel'])
const showMoreCommandsBox = ref(false)
const showStickersBox = ref(false)

const hasInput = computed(() => chatInput.value.length > 0)

/** 上传图片 */
const talkStore = useTalkStore()
const imageUploader = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const showImagePreview = ref(false)

const hasImage = computed(() => imageFile.value !== null)

const openImageUploader = () => {
  imageUploader.value?.click()
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

    if (isTooLarge(file)) {
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

const isImage = (file: File) => {
  const type = file.type

  return (
    type === 'image/jpeg' || type === 'image/png' || type === 'image/gif' || type === 'image/jpg'
  )
}

const isTooLarge = (file: File) => {
  const size = file.size
  return size > 2 * 1024 * 1024 // 2MB
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
    channelId: props.currentChannel.id,
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

const trySendMessage = async () => {
  if (!validateMessage(chatInput.value)) return

  const content = encrypt(chatInput.value, props.currentChannel.id.substring(0, 16))

  chatInput.value = ''

  const messageDto = {
    content,
    type: MessageType.Text,
    channelId: props.currentChannel.id,
    userName: userStore.user?.name || 'Riverrun46',
  }
  await sendMessage(messageDto)
}
/** ------ */
</script>

<style lang="scss" scoped></style>
