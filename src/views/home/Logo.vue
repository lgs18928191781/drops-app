<template>
  <div class="logo flex flex-align-center">
    <Logo class="logo-icon" />
    <Icon class="logo-text" name="show3" />
    <VersionVue />
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/svg/show.svg'
import VersionVue from '@/components/Version/Version.vue'
</script>

<style lang="scss" scoped src="./Logo.scss"></style>
