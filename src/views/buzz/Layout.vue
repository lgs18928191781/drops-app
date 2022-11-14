<template>
  <header class="flex flex-align-center flex-pack-end">
    <LoginedUserOperateVue />
  </header>
  <el-container>
    <el-aside width="200px">
      <CollapseItem></CollapseItem>
      <sideLeftBottom></sideLeftBottom>
    </el-aside>
    <div class="main">
      <router-view></router-view>
    </div>
    <el-aside width="200px">Aside</el-aside>
  </el-container>
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

const rootStore = useRootStore()
const userStore = useUserStore()

// // const isDark = useDark()
// const toggleDark = () => {}
</script>

<style lang="scss" src="./Layout.scss"></style>
