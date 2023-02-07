<template>
  <div
    class="flex p-4 hover:bg-primary/30 rounded-lg items-center justify-between cursor-pointer -mx-4"
  >
    <!-- 左侧 -->
    <div class="flex gap-x-3 items-center">
      <UserAvatar
        :image="result.avatar"
        :meta-id="result.metaId"
        :name="result.name"
        class="w-12 h-12 shrink-0 select-none"
        :disabled="true"
      />
      <div class="flex flex-col gap-y-0.5 items-start">
        <UserName :name="result.name" class="text-base truncate w-22 lg:w-36" />
        <div class="text-dark-300 dark:text-gray-400 text-xs">{{ shortenedMetaId }}</div>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="flex gap-x-1.5">
      <button class="main-border the-button bg-white">Home</button>
      <button class="main-border the-button bg-primary">Follow</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type SearchResult = {
  metaId: string
  name: string
  avatar: string
}

const props = defineProps<{
  result: SearchResult
}>()

const shortenedMetaId = computed(() => {
  const metaId = props.result.metaId
  return `${metaId.slice(0, 6)}`
})
</script>

<style lang="css" scoped>
.the-button {
  @apply py-1.5 px-3 rounded-full w-18;
}
</style>
