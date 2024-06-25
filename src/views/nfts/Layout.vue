<template>
  <header class="flex flex-align-center">
    <div class="flex1 flex flex-align-center">
      <div class="name flex flex-align-center">
        {{ $t('NFTS.NFTs Launch Pad') }}
      </div>
    </div>
    <LoginedUserOperateVue />
  </header>

  <div class="nft-warp">
    <!-- topBar -->
    <div class="top-bar-warp" v-if="$route.name !== 'launchpad'">
      <div class="top-bar flex flex-align-center">
        <div class="flex1 flex flex-align-center">
          <div class="flex1">
            <a
              class="back flex flex-align-center"
              @click="$router.back()"
              v-if="$route.name !== 'launchpad'"
            >
              <span class="flex flex-align-center flex-pack-center ">
                <Icon name="down" />
              </span>
              {{ $t('back') }}
            </a>
            <div class="flex flex-align-center text-sm" v-else>
              <Icon name="shapexs" customClass="h-4 w-3.5 mr-2" />
              {{ $t('NFTS.NFTs Launch Pad') }}
            </div>
          </div>
          <div class="flex1 flex items-center justify-center">
            <span>Autie the Duck</span>
          </div>
          <div class=" flex flex1  justify-end cursor-pointer text-[#5586BB]" @click="genesisNfts">
            {{ $t('NFTs.genesis_nfts') }}
          </div>
        </div>
        <!-- <nav>
            <a v-for="(item, index) in navs" :key="index" @click="commonSoon">{{ item.name }}</a>
          </nav> -->
      </div>
    </div>

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

function genesisNfts() {}
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
