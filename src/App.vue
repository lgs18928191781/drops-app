<template>
  <button @click="isShowMetaMak = true">MetaMak 登录</button>
  <MetaMask v-model="isShowMetaMak" :hd-wallet-from-mnemonic="hdWalletFromMnemonic" id="metamask"
    @success="metaMaskLoginSuccess"></MetaMask>
  <div class="main">
    <router-view v-slot="{ Component, route }">
      <Transition name="fade">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import MetaMask from '@/plugins/MetaMak.vue'
import { ref } from 'vue';
import { hdWalletFromMnemonic } from './utils/wallet/hd-wallet';


const isShowMetaMak = ref(false)

function metaMaskLoginSuccess(res) {
  debugger
}
</script>
<style lang="scss">

</style>
