<template>
  <StatusInfo
    :navigation="[$t('MetaName.Search'), $t('MetaName.Registration'), $t('MetaName.Registering')]"
    :order-id="($route.params.orderId as string)"
    :platform="($route.params.platform as string)"
    :productType="($route.params.productType as string)"
    :type="MetaNameOperateType.Register"
    :name="($route.params.metaName as string)"
  />
</template>

<script setup lang="ts">
import StatusInfo from '../components/StatusInfo/StatusInfo.vue'
import { MetaNameOperateType } from '@/enum'
</script>

<style lang="scss" scoped src="./Register.scss"></style>
