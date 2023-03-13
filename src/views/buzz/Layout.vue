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
          <span class="name">{{ item.name() }}</span>
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
import { debug } from 'console'
import {
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import BuzzWarpVue from './components/BuzzWarp.vue'

const MenuRef = ref()
const i18n = useI18n()
let resizeObserver: ResizeObserver

const menus = [
  {
    name: () => i18n.t('Buzz.Timeline'),
    icon: 'feed',
    path: '/buzz/index',
  },
  {
    name: () => i18n.t('Buzz.Recommend'),
    icon: 'star',
    path: '/buzz/recommend',
  },
]

function setPosition() {
  const BuzzContainer = document.getElementById('buzz-container')!
  if (BuzzContainer) {
    MenuRef.value.style.left = BuzzContainer.offsetLeft - MenuRef.value.clientWidth - 12 + 'px'
    MenuRef.value.style.marginLeft = 0
  }
}

onMounted(() => {
  setPosition()
  resizeObserver = new ResizeObserver(entries => {
    setPosition()
  })

  //监听对应的dom
  resizeObserver.observe(document.getElementById('buzz-warp')!)
})

onBeforeUnmount(() => {
  resizeObserver.unobserve(document.getElementById('buzz-warp')!)
})
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
<style>
@font-face {
  font-family: TwitterChirp;
  font-style: normal;
  src: local('Chirp'), url('@/assets/fonts/chirp.otf') format('opentype');
  font-weight: 400;
}
html .buzz-warp {
  font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  font-weight: 400;
}
</style>
