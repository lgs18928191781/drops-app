<template>
  <div class="main">
    <router-view v-slot="{ Component, route }">
      <Transition name="fade">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </router-view>
  </div>

  <!-- ConnectWalletModalVue -->
  <ConnectWalletModalVue />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
</script>
<style lang="scss"></style>
