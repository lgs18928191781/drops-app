<template>
  <div class="collection-wrap">
    <div class="top-bar flex flex-align-center">
      <div class="flex1 flex flex-align-center">
        <div class="flex1">
          <a class="back flex flex-align-center" @click="$router.back()">
            <span class="flex flex-align-center flex-pack-center ">
              <Icon name="down" />
            </span>
            {{ $t('back') }}
          </a>
          <!-- <div class="flex flex-align-center text-sm" v-else>
              <Icon name="shapexs" customClass="h-4 w-3.5 mr-2" />
              {{ $t('NFTS.NFTs Launch Pad') }}
            </div> -->
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

    <div class="content-wrap">
      <div class="nfts-card">
        <div class="nfts-cover">
          <img src="" alt="" />
        </div>
        <div class="nfts-detail">
          <div class="flex-col">
            <div class="nfts-name">
              <span>1123132</span>
              <LucideIcon name="external-link"></LucideIcon>
            </div>
            <div class="nfts-intro"></div>
          </div>
          <div class="flex"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LucideIcon from '@/components/LucideIcon/index.vue'
function genesisNfts() {}
</script>

<style scoped src="./collection.scss"></style>
