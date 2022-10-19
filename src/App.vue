<template>
  <Header />
  <el-container>
    <el-aside width="200px">
      <CollapseItem></CollapseItem>
      <sideLeftBottom></sideLeftBottom>
    </el-aside>
    <div class="main">
      <router-view v-slot="{ Component, route }">
        <Transition name="fade">
          <div class="transition-warp">
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
          </div>
        </Transition>
      </router-view>
    </div>
    <el-aside width="200px">Aside</el-aside>
  </el-container>

  <!-- <Footer /> -->
</template>

<script setup lang="ts">
import { KeepAlive, Transition } from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
import CollapseItem from '@/components/Collapse/collapse-item.vue'
import sideLeftBottom from '@/components/Side/side-left-bottom.vue'
</script>
<style lang="scss">
.main {
  flex: 1;
  height: 100%;
  min-height: 0;
  margin: 0 10px;
  .transition-warp {
    height: 100%;
  }
}
</style>
