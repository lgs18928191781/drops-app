<template>
  <div class="metaname">
    <HeaderVue />
    <RouterView />

    <!-- wallet -->
    <MyWalletVue v-model="layout.isShowWallet" />
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import HeaderVue from './components/Header/Header.vue'
import MyWalletVue from '@/components/LoginedUserOperate/MyWallet.vue'

const layout = useLayoutStore()
</script>
<style lang="scss" src="./Layout.scss"></style>
