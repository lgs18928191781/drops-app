<template>
  <div class="side-left-bottom-wrap">
    <div class="title">{{ $t('uploadFromPlatform') }}</div>
    <div class="itemWrap">
      <div class="item" v-for="(item, index) in platform" :key="index" @click="toLink()">
        <img :src="item.icon" alt="" />
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Apk from '@/assets/svg/APK_icon.svg?url'
import AppStore from '@/assets/svg/AppStore_icon.svg?url'
import Android from '@/assets/svg/Android_icon.svg?url'
const platform = reactive([
  {
    name: 'App Store',
    icon: AppStore,
  },
  {
    name: 'Android',
    icon: Android,
  },
  {
    name: 'APK',
    icon: Apk,
  },
])

const toLink = () => {
  window.open(`https://www.show.sv/`, 'blank')
}
</script>

<style lang="scss" src="./side-left-bottom.scss"></style>
