<template>
  <!-- 社区列表 -->
  <div
    class="w-22.5 bg-white space-y-9 left-navigation z-50"
    :class="[layoutStore.showLeftNav ? '' : 'hidden lg:block']"
  >
    <div class="space-y-4.5">
      <router-link
        :to="item.path"
        class="flex items-center justify-center left-navigation-item"
        v-for="(item, index) in apps"
        :key="index"
      >
        <span class="bg-primary w-13.5 h-13.5 flex items-center justify-center rounded-3xl">
          <Icon :name="item.icon" class="w-[22PX] h-[19PX] rounded-3xl" />
        </span>
      </router-link>
      <!-- <div class="rounded-3xl bg-primary w-13.5 h-13.5 flex items-center justify-center">
        <Icon name="talk" class="w-[22PX] h-[19PX]" />
      </div> -->
    </div>

    <div class="divide flex items-center justify-center">
      <div class="w-7.5 border-b-2 border-solid border-dark-100 "></div>
    </div>

    <div class="space-y-4.5">
      <router-link
        :to="item.path"
        class="flex items-center justify-center left-navigation-item"
        v-for="(item, index) in apps"
        :key="index"
      >
        <span class="bg-sky-200 w-13.5 h-13.5 flex items-center justify-center rounded-3xl">
          <Icon :name="item.icon" class="w-[22PX] h-[19PX] rounded-3xl" />
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
const layoutStore = useLayoutStore()
const apps = [
  {
    icon: 'feed',
    path: '/buzz',
  },
  {
    icon: 'talk',
    path: '/talk/channels/@me',
  },
]
</script>

<style lang="scss" scoped src="./LeftNavigation.scss"></style>
