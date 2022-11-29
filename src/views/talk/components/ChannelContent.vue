<template>
  <div class="h-full">
    <MessageList />
  </div>

  <div class="fixed bottom-0 left-0 right-0 px-4 lg:absolute">
    <TheInput />
    <TheErrorBox />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import TheInput from './TheInput.vue'
import TheErrorBox from './TheErrorBox.vue'

const MessageList = defineAsyncComponent({
  loader: () => import('./MessageList.vue'),
})
</script>
