<template>
  <div class="main flex">
    <LeftNavigationVue />
    <div class="flex1">
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
</script>
<style lang="css" src="@/assets/styles/tailwind.css"></style>
<style lang="scss" scoped>
.main {
  height: 100%;
}
</style>
