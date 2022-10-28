<template>
  <div
    class="fixed inset-0 pt-12 w-full bg-gray-50 h-screen z-10 px-4 pb-4 overflow-y-scroll lg:static lg:w-60 lg:shrink-0 lg:bg-gray-100">
    <div class="pt-6">
      <div class="text-xs font-medium text-gray-600">群聊成员 — {{ props.members.length }}</div>
      <ChannelMemberItem v-for="member in props.members" :member="member" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import ChannelMemberItem from './ChannelMemberItem.vue'
const props = defineProps(['members'])
</script>
<style lang="">
  
</style>