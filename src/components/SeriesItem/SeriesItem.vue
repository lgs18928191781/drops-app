<template>
  <a @click="toDetail()" class="nft-item" >
    <div class="cover">
      <img class="cover-image" :src="metafileUrl(props.item.cover)" :alt="item?.name" />
    </div>
    <div class="cont">
      <div class="name">{{ item.name }}</div>
      <div class="operate" style="text-align: right;"><span class="timeleft">{{props.item.hasCount}}/{{props.item.total}}</span></div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { useStore, Mutation } from '@/store/index'
import { useRouter } from 'vue-router'
import { GetNftDetail, NftApiCode, OffSale } from '@/api'
import { ElDialog, ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Decimal } from 'decimal.js-light'
import NftOffSale from '@/utils/offSale'
// @ts-ignore
import dayjs from 'dayjs'
import { metafileUrl } from '@/utils/util';


const store = useStore()
const router = useRouter()
const i18n = useI18n()
const now = new Date().getTime()

const props = defineProps<{
  item: NFTSeriesItem
}>()

function toDetail() {
  router.push({ name: 'series', params: { genesisId: props.item.genesis, codehash: props.item.codehash}})
}


</script>

<style lang="scss" scoped src="./SeriesItem.scss"></style>
