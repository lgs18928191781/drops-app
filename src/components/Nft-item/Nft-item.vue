<template>
  <a @click="toDetail(item?.tokenId)" class="nft-item" :key="item?.tokenId">
    <div class="cover">
      <img class="cover-image" :src="item?.coverUrl" :alt="item?.name" />
    </div>
    <div class="cont">
      <div class="name">{{ isSelf ? item.productName : item?.name }}</div>
      <div class="price" v-if="!isSelf">
        <div class="label">{{ $t('price') }}</div>
        <div class="aount">{{ new Decimal(item?.amount).div(10**8).toString() }} BSV</div>
      </div>
      <div class="author flex flex-align-center">
        <img :src="$filters.avatar(item?.metaId)" :alt="item?.foundryName" />
        <span class="username">{{ item?.foundryName }}</span>
      </div>
      <div class="operate" v-if="props.isSelf">
        <a class="btn btn-min btn-plain" v-if="item?.putAway" @click.stop="offSale">{{ $t('offsale') }}</a>
        <a class="btn btn-min" v-else @click.stop="toSale">{{ $t('sale') }}</a>
      </div>
    </div>
    <div class="recommend-card flex flex-v" v-if="props.isRecommendCard">
      <div class="icon">
        <img src="@/assets/images/card_icon_fire.svg" />
      </div>
      <div class="title">{{ $t('recommentprod') }}</div>
      <div class="drsc flex1">
        {{ $t('recommenttext') }}
      </div>
      <div class="more">
        <router-link :to="{ name: 'recommned' }">{{ $t('getmore') }}<img src="@/assets/images/card_icon_ins.svg" /></router-link>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useStore, Mutation } from '@/store/index'
import { useRouter } from 'vue-router'
import { GetNftDetail, NftApiCode, OffSale } from '@/api'
import { ElDialog, ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Decimal } from 'decimal.js-light'
import NftOffSale from '@/utils/offSale'


const store = useStore()
const router = useRouter()
const i18n = useI18n()
const appVersion = store.state.version // not reactive!
const count = computed(() => store.state.count)
const props = defineProps<{
  item: NftItem,
  isRecommendCard?: boolean,
  isSelf?: boolean
}>()

function toDetail(tokenId: string | undefined) {
  if (tokenId) {
    router.push({ name: 'detail', params: { tokenId }})
  }
}

function toSale () {
  if (props.item?.tokenId) {
    router.push({ name: 'sale', params: { tokenId: props.item?.tokenId } })
  }
}

function offSale () {
  ElMessageBox.confirm(`${i18n.t('offsaleConfirm')} ${props.item.productName} ?`, i18n.t('niceWarning'))
  .then(async () => {
    
  const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'full-loading',
  })
  
    // 先获取详情
    const detailRes = await GetNftDetail({
      tokenId: props.item.tokenId
    }).catch(() => {
        loading.close()
    })
    if (detailRes && detailRes.code === NftApiCode.success) {
      NftOffSale(detailRes.data)
      .then(() => {
        props.item.putAway = false
        loading.close()
      })
      .catch(() => {
        loading.close()
      })
    }
  })
}
</script>

<style lang="scss" scoped src="./Nft-item.scss"></style>
