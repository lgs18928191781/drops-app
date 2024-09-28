<template>
  <header class="flex flex-align-center">
    <div class="flex1 flex flex-align-center">
      <div class="name flex flex-align-center">
        {{ $t('NFTS.NFTs Launch Pad') }}
      </div>
    </div>
    <LoginedUserOperateVue />
  </header>
  <div class="pl-[18px] pt-[18px] text-[30px] font-semibold font-sora text-white">Create NFTs</div>
  <div class="nft-warp">
    <!-- topBar -->
    <div class="nft-router-view-warp">
      <RouterView v-slot="{ Component, route }">
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
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginedUserOperateVue from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import PhoneMenuBtnVue from '@/components/PhoneMenuBtn/PhoneMenuBtn.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const i18n = useI18n()
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
