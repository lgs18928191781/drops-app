<template>
  <div class="fixed bottom-0 left-0 right-0 px-4 pb-4">
    <div class="bg-gray-100 rounded-lg h-11 flex">
      <!-- 左侧 + 按钮 -->
      <div class="w-14 flex items-center justify-center text-gray-600">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
          <g>
            <path class="attachButtonPlus-3IYelE" fill="currentColor"
              d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z">
            </path>
          </g>
        </svg>
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
        <div class="pl-3 p-1 w-5 h-6 border-l-2">
          <div class="transition-all ease-in-out duration-300"
            :class="[hasInput ? 'text-indigo-500 scale-110 -rotate-6' : 'text-gray-400']">
            <svg aria-hidden="true" role="img" class="" width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M8.2738 8.49222L1.99997 9.09877L0.349029 14.3788C0.250591 14.691 0.347154 15.0322 0.595581 15.246C0.843069 15.4597 1.19464 15.5047 1.48903 15.3613L15.2384 8.7032C15.5075 8.57195 15.6781 8.29914 15.6781 8.00007C15.6781 7.70101 15.5074 7.4282 15.2384 7.29694L1.49839 0.634063C1.20401 0.490625 0.852453 0.535625 0.604941 0.749376C0.356493 0.963128 0.259941 1.30344 0.358389 1.61563L2.00932 6.89563L8.27093 7.50312C8.52405 7.52843 8.71718 7.74125 8.71718 7.99531C8.71718 8.24938 8.52406 8.46218 8.27093 8.4875L8.2738 8.49222Z"
                fill="currentColor"></path>
            </svg>
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