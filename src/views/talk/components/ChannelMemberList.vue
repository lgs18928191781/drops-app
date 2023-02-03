<template>
  <div
    class="hidden fixed inset-0 pt-20 w-full bg-dark-100 dark:bg-gray-800 h-screen z-10 pb-4 overflow-y-auto lg:static lg:w-60 lg:shrink-0 lg:flex lg:flex-col"
  >
    <div class="flex items-baseline justify-between mb-2 px-4">
      <div class="text-sm text-dark-800 dark:text-gray-100 uppercase font-medium">
        {{ $t('Talk.Channel.core_members') }}
      </div>
      <div class="text-sm text-dark-300 dark:text-gray-400">
        {{ talkStore.activeCommunity?.memberTotal || 0 }}
      </div>
    </div>

    <div class="w-full overflow-y-auto grow" ref="membersContainer">
      <div
        class="w-full relative"
        :style="{ height: vir.getTotalSize() + 'PX' }"
        v-if="talkStore.members.length"
      >
        <ChannelMemberItem
          v-for="item in vir.getVirtualItems()"
          class="absolute top-0 left-0 w-full z-0"
          :id="item.index"
          :style="{ transform: `translateY(${item.start}px)` }"
          :member="talkStore.members.at(item.index)"
          :key="item.index"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'

import { useTalkStore } from '@/stores/talk'

import ChannelMemberItem from './ChannelMemberItem.vue'

const talkStore = useTalkStore()

// 虚拟列表
const membersContainer = ref(null)

let vir: any

watch(
  () => talkStore.members.length,
  count => {
    if (count) {
      vir = useVirtualizer({
        count,
        getScrollElement: () => membersContainer.value,
        estimateSize: () => 52,
      })
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #edeff2;
}

.dark *::-webkit-scrollbar-track {
  background: #111827;
}

*::-webkit-scrollbar-thumb {
  background-color: #bfc2cc;
  border-radius: 20px;
}

.dark *::-webkit-scrollbar-thumb {
  background-color: #374151;
}
</style>
