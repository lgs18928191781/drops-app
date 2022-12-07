<template>
  <div class="animate-pulse flex space-x-4 w-full py-4">
    <div class="h-0 w-1/5 w-2/5 w-3/5 w-4/5 w-5/5 hidden"></div>
    <div class="rounded-3xl bg-gray-300 h-13.5 w-13.5"></div>
    <div class="flex-1 space-y-4 py-1">
      <div class="h-2.5 bg-gray-300 rounded w-1/4 max-w-[200PX]"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-4 gap-4">
          <div class="h-2.5 bg-gray-200 rounded col-span-2"></div>
        </div>
        <div class="h-2.5 bg-gray-300 rounded w-1/4"></div>
        <div class="h-2.5 bg-gray-200 rounded" :class="randomWidth"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const randomWidth = computed(() => {
  const width = Math.floor(Math.random() * 4) + 1
  return `w-${width}/5`
})
</script>

<style lang=""></style>
