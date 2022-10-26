<template>
  <div class="fixed bottom-0 left-0 right-0 px-4 pb-4">
    <div class="bg-gray-100 rounded-lg h-11 flex">
      <!-- 左侧 + 按钮 -->
      <div class="w-14 flex items-center justify-center text-gray-600">
        <Icon name="plus-fill" class="w-6 h-6" />
      </div>


      <div class="flex-grow">
        <div class="h-11 py-2.5 pr-4">
          <input type="text"
            class="bg-inherit h-full w-full focus:outline-none placeholder:text-gray-400 text-gray-700 text-base caret-gray-600"
            placeholder="想说些什么呢……" v-model="chatInput" />
        </div>

      </div>


      <!-- 右侧发送按钮 -->
      <div class="w-11 flex items-center">
        <div class="pl-3 border-l-2">
          <div class="transition-all ease-in-out duration-300"
            :class="[hasInput ? 'text-indigo-500 scale-110 -rotate-6' : 'text-gray-400']">
            <Icon name="send" class="w-5 h-5" />
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const chatInput = ref('')
const hasInput = computed(() => chatInput.value.length > 0)
</script>

<style lang="">
  
</style>