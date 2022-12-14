<template>
  <BuzzWarpVue>
    <!-- menu -->
    <div class="buzz-menu-warp" ref="MenuRef">
      <div class="buzz-menu">
        <router-link
          :to="item.path"
          class="buzz-menu-item flex flex-align-center"
          v-for="(item, index) in menus"
          :key="index"
        >
          <span class="icon-warp flex flex-align-center flex-pack-center">
            <Icon :name="item.icon" />
          </span>
          <span class="name">{{ item.name }}</span>
        </router-link>
      </div>
    </div>

    <!-- router view -->
    <RouterView v-slot="{ Component, route }">
      <KeepAlive>
        <component
          :is="Component"
          :key="route.fullPath"
          v-if="route.meta && route.meta.keepAlive"
        />
      </KeepAlive>
      <component
        :is="Component"
        :key="route.fullPath"
        v-if="!route.meta || (route.meta && !route.meta.keepAlive)"
      />
    </RouterView>
  </BuzzWarpVue>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BuzzWarpVue from './components/BuzzWarp.vue'

const MenuRef = ref()
const i18n = useI18n()

const menus = [
  {
    name: i18n.t('Buzz.Timeline'),
    icon: 'feed',
    path: '/buzz/index',
  },
  {
    name: i18n.t('Buzz.Recommend'),
    icon: 'star',
    path: '/buzz/recommend',
  },
]
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
