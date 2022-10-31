<template>
  <div class="h-full overflow-y-scroll py-4 overflow-x-hidden space-y-4 px-4">
    <Message v-for="message in props.messages" :message="message" />

    <div class="w-full h-px bg-inherit bg-inherit" id="bottomAnchor"></div>
  </div>
</template>

<script setup lang="ts">
import Message from './Message.vue'

const props = defineProps(['messages'])
</script>

<style lang="">
  
</style>