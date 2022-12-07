<template>
  <div
    class="fixed left-0 right-0 top-0 flex items-center px-4 h-12 border-b-2 border-solid border-gray-100 bg-white z-30 lg:h-15 lg:absolute"
  >
    <div class="max-w-[60%] flex items-center">
      <Icon
        name="bars"
        class="w-6 h-6 text-dark-800 mx-2 shrink-0 lg:hidden"
        @click="layout.isShowLeftNav = true"
      />

      <div class="flex shrink-0 items-center">
        <UserAvatar
          :metaId="activeChannel?.id"
          class="w-8 h-8 shrink-0 select-none hidden lg:block mr-2"
          :disabled="true"
        />
        <div
          class="text-base leading-tight no-wrap grow whitespace-nowrap truncate text-dark-800 pr-2 max-w-[35vw] lg:max-w-[600PX]"
        >
          {{ activeChannel?.name }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between grow">
      <div class="text-xs text-dark-300 bg-dark-100 px-3 py-1 rounded" v-if="activeChannel?.id">
        {{ shortenMetaId(activeChannel?.id) }}
      </div>
      <!-- 占位 -->
      <div v-else class="w-1"></div>

      <LoginedUserOperate />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import LoginedUserOperate from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import { useTalkStore } from '@/stores/talk'
import { computed } from 'vue'

const talkStore = useTalkStore()
const layout = useLayoutStore()
const activeChannel = computed(() => talkStore.activeChannel)

const shortenMetaId = (id: string) => {
  return id.substring(0, 6) + '...' + id.substring(id.length - 6)
}

const doNothing = () => {}
</script>

<style lang=""></style>
