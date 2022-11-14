<template>
  <header class="flex flex-align-center flex-pack-end">
    <LoginedUserOperateVue />
  </header>
  <div class="container flex">
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
      <router-view></router-view>
    </div>
  </div>

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

const rootStore = useRootStore()
const userStore = useUserStore()
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
    path: '/buzz/recomment',
  },
]

// // const isDark = useDark()
// const toggleDark = () => {}
</script>

<style lang="scss" src="./Layout.scss"></style>
