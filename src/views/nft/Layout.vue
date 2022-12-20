<template>
  <header class="flex flex-align-center">
    <div class="flex1 flex flex-align-center">
      <PhoneMenuBtnVue />
      <div class="name">{{ $t('NFT.NFT Market') }}</div>
    </div>
    <LoginedUserOperateVue />
  </header>
  <div class="nft-warp">
    <!-- topBar -->
    <div class="top-bar-warp">
      <div class="top-bar flex flex-align-center">
        <div class="flex1">
          <div class="search flex flex-align-center">
            <Icon name="search" />
            <input class="flex1" type="text" :placeholder="$t('NFT.SearchPlace')" />
          </div>
        </div>
        <nav>
          <a v-for="(item, index) in navs" :key="index">{{ item.name }}</a>
        </nav>
      </div>
    </div>

    <div class="nft-router-view-warp">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginedUserOperateVue from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import PhoneMenuBtnVue from '@/components/PhoneMenuBtn/PhoneMenuBtn.vue'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const navs = reactive([
  { name: i18n.t('NFT.Explore') },
  { name: i18n.t('NFT.Collection') },
  { name: i18n.t('NFT.Mystery Box') },
  { name: i18n.t('NFT.Market') },
  { name: i18n.t('NFT.NFT Tools') },
  { name: i18n.t('NFT.Help') },
])
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
