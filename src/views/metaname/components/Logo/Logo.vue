<template>
  <div class="logo flex flex-align-center" @click="$router.push('/metaname')">
    <img class="logo" :src="MetaNameLogo" />
    <MetaNameLogoText class="logo-text" />
  </div>
</template>

<script setup lang="ts">
import MetaNameLogo from '@/assets/svg/meta_name.svg?url'
import MetaNameLogoText from '@/assets/svg/meta_name_text.svg'
</script>

<style lang="scss" scoped src="./Logo.scss"></style>
