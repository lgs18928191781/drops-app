<template>
  <div class="fixed bottom-0 left-0 right-0 px-4 pb-4 lg:absolute">
    <div class="bg-white rounded-lg h-11 flex lg:h-13.5 items-center">
      <!-- 左侧 + 按钮 -->
      <div class="w-14 flex items-center justify-center text-dark-800">
        <div class="bg-primary w-7.5 h-7.5 flex items-center justify-center rounded-full">
          <Icon name="plus_2" class="w-3 h-3 text-dark-800" />
        </div>
      </div>

      <div class="flex-grow lg:ml-6">
        <div class="h-11 py-2 pr-4 lg:h-13.5">
          <input
            type="text"
            class="bg-inherit h-full w-full focus:outline-none placeholder:text-dark-250 placeholder:text-sm text-dark-800 text-base caret-gray-600"
            :placeholder="'发消息到 #' + currentChannel.name + '…'"
            v-model="chatInput"
          />
        </div>
      </div>

      <!-- 右侧发送按钮 -->
      <div class="flex h-full py-2 items-center shrink-0">
        <div class="flex items-center px-1">
          <div class="p-2 w-9 h-9 transition-all hover:animate-wiggle">
            <Icon name="red_envelope" class="w-full h-full text-dark-800" />
          </div>

          <div class="p-2 w-9 h-9 transition-all hover:animate-wiggle">
            <Icon name="emoji" class="w-full h-full text-dark-800" />
          </div>
        </div>

        <div class="py-0.5 h-full lg:hidden">
          <div class="h-full border-l-2 border-solid border-dark-250"></div>
        </div>

        <div class="flex items-center lg:hidden">
          <div class="py-2 px-3">
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

const props = defineProps(['currentChannel'])
const chatInput = ref('')
const hasInput = computed(() => chatInput.value.length > 0)
</script>

<style lang=""></style>
