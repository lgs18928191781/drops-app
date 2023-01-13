<template>
  <div class="bg-inherit p-3 pr-3.5">
    <div class="flex items-center space-x-3 max-w-full">
      <div class="bg-white dark:bg-gray-950 grow p-2 rounded-full relative flex items-center h-9">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon name="search" class="w-3.5 h-3.5 text-dark-250" />
        </span>
        <input
          type="text"
          class="dark:bg-gray-950 text-dark-800 dark:text-gray-100 text-sm leading-tight font-normal placeholder-dark-250 outline-0 m-0 w-full pl-6"
          :placeholder="$t('Talk.Channel.search')"
          :value="keyword"
          @input="handleSearch"
        />
      </div>

      <div class="">
        <Icon name="user_bars" class="w-6 h-6 p-0.5 cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const keyword = ref('')
const handleSearch = () => {
  console.log(keyword.value)

  // 先进行名字搜索
}
</script>
