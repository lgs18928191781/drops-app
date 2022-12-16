<template>
  <header class="flex flex-align-center">
    <div class="flex1">
      <div class="phone-content flex flex-align-center">
        <Icon
          :name="layout.isShowLeftNav ? 'x_mark' : 'bars'"
          class="phone-menu"
          @click="layout.$patch({ isShowLeftNav: !layout.isShowLeftNav })"
        />

        <div class="dived"></div>

        <div class="buzz-menu flex flex-align-center">
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
    </div>
    <LoginedUserOperateVue />
  </header>
  <div class="buzz-warp" ref="BuuzWarpRef">
    <div class="buzz-container" ref="BuzzContainerRef">
      <slot></slot>
    </div>

    <!--   -->
    <div class="fast-btn" ref="FastBtnRef">
      <a class="top" @click="scrollTop">
        <Icon name="buzz_icon_top" />
      </a>
      <a class="main-border primary" @click="layout.publish()">
        <Icon name="buzz_icon_post" />
      </a>
    </div>
    <!--   -->
  </div>

  <!-- publish -->
  <PublishVue />
</template>

<script setup lang="ts">
import { KeepAlive, onBeforeUnmount, onMounted, ref, Transition, watch } from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
import CollapseItem from '@/components/Collapse/collapse-item.vue'
import sideLeftBottom from '@/components/Side/side-left-bottom.vue'
// const isDark = useDark()
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import LoginedUserOperateVue from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import { useI18n } from 'vue-i18n'
import { useLayoutStore } from '@/stores/layout'
import PublishVue from '@/views/buzz/components/Publish.vue'

const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()
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

const BuzzContainerRef = ref()
const MenuRef = ref()
const FastBtnRef = ref()
const BuuzWarpRef = ref()

onMounted(() => {
  setPosition()
})

watch(
  () => BuuzWarpRef.value?.clientWidth,
  () => {
    setPosition()
  }
)

function setPosition() {
  setTimeout(() => {
    // MenuRef.value.style.left =
    //   BuzzContainerRef.value.offsetLeft - MenuRef.value.clientWidth - 12 + 'px'
    // MenuRef.value.style.marginLeft = 0

    if (window.innerWidth > 750) {
      FastBtnRef.value.style.left =
        BuzzContainerRef.value.offsetLeft + BuzzContainerRef.value.clientWidth + 12 + 'px'
      FastBtnRef.value.style.marginRight = 0
    } else {
      FastBtnRef.value.style.right = '5%'
      FastBtnRef.value.style.marginRight = 0
    }
  }, 500)
}

function scrollTop() {
  window.document.documentElement.scrollTop = 0
}
</script>

<style lang="scss" scoped src="./BuzzWarp.scss"></style>
