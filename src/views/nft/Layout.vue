<template>
  <!-- <header class="flex flex-align-center">
    <div class="flex1 flex flex-align-center">
   
    </div>
    <LoginedUserOperateVue />
  </header> -->
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
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const i18n = useI18n()
const navs = reactive([
  { name: i18n.t('NFT.Explore'), path: '/nft/index' },
  { name: i18n.t('NFT.Collection') },
  { name: i18n.t('NFT.Mystery Box') },
  { name: i18n.t('NFT.Market') },
  { name: i18n.t('NFT.NFT Tools') },
  { name: i18n.t('NFT.Help') },
])

function commonSoon() {
  ElMessage.info(i18n.t('Comming Soon'))
}
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
