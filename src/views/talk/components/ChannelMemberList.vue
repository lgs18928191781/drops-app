<template>
  <div
    class="fixed inset-0 pt-12 w-full bg-dark-100 h-screen z-10 px-4 pb-4 overflow-y-scroll lg:static lg:w-60 lg:shrink-0"
  >
    <div class="pt-6">
      <div class="flex items-center justify-between">
        <div class="text-base text-dark-800 capitalize">{{ $t('Talk.Channel.members') }}</div>
        <div class="text-sm text-dark-300">{{ members.length }}</div>
      </div>
      <ChannelMemberItem v-for="member in props.members" :member="member" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import ChannelMemberItem from './ChannelMemberItem.vue'
const props = defineProps(['members'])
</script>
<style lang=""></style>
