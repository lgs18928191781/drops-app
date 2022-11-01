<template>
  <!-- <ElButton @click="isShowMetaMak = true">MetaMak 登录</ElButton> -->

  <div class="main">
    <router-view v-slot="{ Component, route }">
      <Transition name="fade">
        <component :is="Component" :key="route.fullPath" />
      </Transition>
    </router-view>
  </div>

  <!-- MetaMask -->
  <!-- <MetaMask
    v-model="isShowMetaMak"
    :hd-wallet-from-mnemonic="hdWalletFromMnemonic"
    id="metamask"
    @success="metaMaskLoginSuccess"
  ></MetaMask> -->

  <!-- ConnectWalletModalVue -->
  <!-- <ConnectWalletModalVue /> -->
</template>

<script setup lang="ts">
import MetaMask from '@/plugins/MetaMak.vue'
import { ref } from 'vue'
import { hdWalletFromMnemonic } from './utils/wallet/hd-wallet'
import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'

const isShowMetaMak = ref(false)

function metaMaskLoginSuccess(res) {
  debugger
}
</script>
<style lang="scss"></style>
