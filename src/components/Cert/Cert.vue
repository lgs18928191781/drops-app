<template>
  <div class="cert flex flex-pack-end">
    <a class="flex flex-align-center flex-pack-end">
      <img v-if="props.isCert" class="icon-cert" src="@/assets/images/icon_cer.svg" />
      <span>{{props.isCert ? $t('isCert') : $t('unCert') }}</span>
      <i class="el-icon-arrow-right icon-right"></i>
    </a>
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from "@vue/runtime-core";

const props = defineProps<{
  isCert?: boolean
}>()
</script>
<style lang="scss" scoped src="./Cert.scss"></style>
