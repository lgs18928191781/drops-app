<template>
  <div class="main flex">
    <LeftNavigationVue />
    <div class="flex1 main-right">
      <RouterView />
    </div>
  </div>

  <!-- ConnectWalletModalVue -->
  <ConnectWalletModalVue />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
import LeftNavigationVue from './components/LeftNavigation/LeftNavigation.vue'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'

const rootStore = useRootStore()
const userStore = useUserStore()
</script>
<style lang="css" src="@/assets/styles/tailwind.css"></style>
<style lang="scss" scoped>
.main {
  height: 100%;
  .main-right {
    overflow: auto;
  }
}

@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney'), url('@/assets/fonts/whitneybook.otf') format('opentype');
  font-weight: 400;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Medium'), url('@/assets/fonts/whitneymedium.otf') format('opentype');
  font-weight: 500;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Bold'), url('@/assets/fonts/whitneybold.otf') format('opentype');
  font-weight: 700;
}
</style>
