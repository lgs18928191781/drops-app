<template>
  <a @click="toDetail(item?.tokenId)" class="nft-item" :key="item?.tokenId">
    <div class="cover">
      <img :src="item?.coverUrl" :alt="item?.name" />
    </div>
    <div class="cont">
      <div class="name">{{ isSelf ? item.productName : item?.name }}</div>
      <div class="price" v-if="!isSelf">
        <div class="label">{{ $t('price') }}</div>
        <div class="aount">{{item?.amount}} BSV</div>
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
        <a>{{ $t('getmore') }}<img src="@/assets/images/card_icon_ins.svg" /></a>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useStore, Mutation } from '@/store/index'
import { useRouter } from 'vue-router'
import { NftApiCode, OffSale } from '@/api'
import { ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

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
    const res = await OffSale({ tokenId: props.item!.tokenId})
    if (res.code === NftApiCode.success) {
      props.item!.putAway = false
      ElMessage.success(i18n.t('offsale') + i18n.t('success'))
    } else {
      ElMessage.success(i18n.t('offsale') + i18n.t('fail'))
    }
  })
}
</script>

<style lang="scss" scoped src="./Nft-item.scss"></style>
