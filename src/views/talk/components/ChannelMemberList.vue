<template>
  <div
    class="hidden fixed inset-0 pt-12 w-full bg-dark-100 h-screen z-10 px-4 pb-4 overflow-y-auto lg:static lg:w-60 lg:shrink-0 lg:block"
  >
    <div class="pt-6">
      <div class="flex items-baseline justify-between mb-2">
        <div class="text-sm text-dark-800 uppercase font-medium">
          {{ $t('Talk.Channel.members') }}
        </div>
        <div class="text-sm text-dark-300">{{ talkStore.members.length }}</div>
      </div>
      <ChannelMemberItem v-for="member in talkStore.members" :member="member" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTalkStore } from '@/stores/talk'
import ChannelMemberItem from './ChannelMemberItem.vue'

const talkStore = useTalkStore()
</script>
<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #edeff2;
}

*::-webkit-scrollbar-thumb {
  background-color: #bfc2cc;
  border-radius: 20px;
}
</style>
