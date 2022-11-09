<template>
  <div class="fixed bottom-0 left-0 right-0 px-4 pb-4 lg:absolute">
    <div class="bg-white rounded-lg h-11 flex lg:h-13.5 items-center">
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
            <div
              class="absolute bottom-[68PX] left-[16PX] lg:bottom-[78PX] lg:left-[346PX] bg-white py-1.5 px-2 rounded text-xs flex flex-col text-dark-400 font-medium space-y-0.5 shadow-lg"
            >
              <div class="py-1.5 px-2">{{ $t('Talk.Channel.upload_image') }}</div>
              <div class="py-1.5 px-2">{{ $t('Talk.Channel.use_onchain_image') }}</div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- 右侧发送按钮 -->
      <div class="flex h-full py-2 items-center shrink-0">
        <div class="flex items-center px-1 lg:mr-2">
          <div class="p-2 w-9 h-9 transition-all lg:hover:animate-wiggle cursor-pointer">
            <Icon name="red_envelope" class="w-full h-full text-dark-800" />
          </div>

          <div class="p-2 w-9 h-9 transition-all lg:hover:animate-wiggle cursor-pointer">
            <Icon name="emoji" class="w-full h-full text-dark-800" />
          </div>
        </div>

        <div class="py-0.5 h-full lg:hidden">
          <div class="h-full border-l-2 border-solid border-dark-250"></div>
        </div>

        <div class="flex items-center lg:hidden">
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
import { encrypt } from '@/utils/crypto'

const emit = defineEmits(['sendMessage'])
const props = defineProps(['currentChannel'])
const chatInput = ref('')
const showMoreCommandsBox = ref(false)
const hasInput = computed(() => chatInput.value.length > 0)

const userStore = useUserStore()

const trySendMessage = async () => {
  if (!validateMessage(chatInput.value)) return

  const content = encrypt(chatInput.value, props.currentChannel.id.substring(0, 16))
  const sending = {
    content,
    metaId: '74cc371c55d9fa38fc98467396c22fe6b20bfc3459a11530362fcdb1b6c07c5c',
  }
  emit('sendMessage', sending)

  chatInput.value = ''

  const messageDto = {
    content,
    type: MessageType.Text,
    channelId: props.currentChannel.id,
    userName: userStore.user?.name || 'Riverrun46',
  }
  await sendMessage(messageDto)
}
</script>

<style lang=""></style>
