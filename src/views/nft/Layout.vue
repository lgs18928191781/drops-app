<template>
  <header class="flex flex-align-center">
    <div class="flex1">
      <div class="name">{{ $t('NFT.NFT Market') }}</div>
    </div>
    <LoginedUserOperateVue />
  </header>
  <div class="nft-warp">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import LoginedUserOperateVue from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
