<template>
  <Header />
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
  <Footer />
</template>

<script setup lang="ts">
import { KeepAlive, Transition } from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
</script>
<style lang="scss" scoped>
.main {
  padding-top: 60px;
  padding-bottom: 100px;
  flex: 1;
  height: 100%;
  min-height: 0;
  .transition-warp {
    height: 100%;
  }
}
</style>
