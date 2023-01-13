<template>
  <StatusInfo
    :navigation="[$t('MetaName.My MetaName'), $t('MetaName.Renewing')]"
    :order-id="($route.params.orderId as string)"
    :platform="($route.params.platform as string)"
    :productType="($route.params.productType as string)"
    :type="MetaNameOperateType.Renew"
    :name="($route.params.metaName as string)"
  />
</template>

<script setup lang="ts">
import StatusInfo from '../components/StatusInfo/StatusInfo.vue'
import { MetaNameOperateType } from '@/enum'
</script>

<style lang="scss" scoped src="./Status.scss"></style>
