<template>
  <div
    class="bg-white fixed inset-0 h-screen w-screen z-40 lg:static lg:shrink-0 lg:w-auto"
    :class="[layoutStore.isShowLeftNav ? '' : 'hidden lg:block']"
  >
    <div class="w-full h-full flex">
      <!-- 占位 -->
      <div class="shrink-0 bg-white w-22.5 lg:hidden"></div>

      <div class="h-full bg-dark-100 grow lg:w-60 flex flex-col justify-between items-stretch">
        <div class="flex flex-col overflow-y-hidden">
          <!-- 搜索栏 -->
          <DirectContactSearch />

          <!-- 联系人列表 -->
          <div class="overflow-y-auto">
            <DirectContactItem
              v-for="session in talkStore.sessions"
              :key="session.timestamp"
              :session="session"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import DirectContactSearch from './DirectContactSearch.vue'
import DirectContactItem from './DirectContactItem.vue'
import { useTalkStore } from '@/stores/talk'

const layoutStore = useLayoutStore()
const talkStore = useTalkStore()
</script>

<style lang="scss" scoped></style>
