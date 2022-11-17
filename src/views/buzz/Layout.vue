<template>
  <header class="flex flex-align-center">
    <div class="flex1">
      <div class="phone-content flex flex-align-center">
        <Icon
          :name="layoutStore.showLeftNav ? 'x_mark' : 'bars'"
          class="phone-menu"
          @click="layoutStore.$patch({ showLeftNav: !layoutStore.showLeftNav })"
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
  <div class="buzz-warp">
    <div class="container flex flex1">
      <div class="buzz-menu-warp">
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
      <div class="buzz-container flex1">
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
      </div>

      <!--   -->
      <div class="fast-btn">
        <a class="main-border primary" @click="layoutStore.publish()">
          <Icon name="airdrop" />
        </a>
        <a class="main-border">
          <Icon name="top" />
        </a>
      </div>
    </div>
  </div>

  <!-- publish -->
  <PublishVue />

  <!-- <el-container>
    <el-aside width="200px">
      <CollapseItem></CollapseItem>
      <sideLeftBottom></sideLeftBottom>
    </el-aside>
    <div class="main">
      <router-view></router-view>
    </div>
    <el-aside width="200px">Aside</el-aside>
  </el-container> -->
</template>

<script setup lang="ts">
import { KeepAlive, Transition } from 'vue'
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
import PublishVue from './components/Publish.vue'

const rootStore = useRootStore()
const userStore = useUserStore()
const layoutStore = useLayoutStore()
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

// // const isDark = useDark()
// const toggleDark = () => {}
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
