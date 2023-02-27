<template>
  <ElRow
    :gutter="22"
    class="nft-list"
    v-infinite-scroll="getMore"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="100"
  >
    <ElCol
      :xs="12"
      :sm="12"
      :md="8"
      :lg="8"
      :xl="8"
      v-for="(item, index) in list"
      :key="isSkeleton ? index : item.nftGenesis + item.nftCodehash + item.nftTokenIndex"
    >
      <NFTItemVue :nft="item" @buy="buyNFT" :loading="isSkeleton" />
    </ElCol>

    <ElCol v-if="!isSkeleton && nfts.length === 0">
      <IsNull />
    </ElCol>

    <template v-if="nft.val">
      <NFTBuyVue
        :nft="nft.val!"
        v-model="isShowNftBuy"
        :is-hide-detail="true"
        @success="refreshDatas"
      />
    </template>
  </ElRow>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { computed, reactive, ref } from 'vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import NFTBuyVue from '@/components/NFTBuy/NFTBuy.vue'

const nfts: GenesisNFTItem[] = reactive([])
const isSkeleton = ref(true)
const pagination = reactive({ ...initPagination })
const nft = reactive({ val: null as null | GenesisNFTItem })
const isShowNftBuy = ref(false)

const list = computed(() => {
  if (isSkeleton.value) {
    return Array.from({ length: pagination.pageSize }) as GenesisNFTItem[]
  } else {
    return nfts
  }
})

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, rject) => {
    if (isCover) nfts.length = 0
    resolve()
  })
}

function refreshDatas() {
  isSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
}

function buyNFT(item: GenesisNFTItem) {
  nft.val = item
  isShowNftBuy.value = true
}
</script>

<style lang="scss" scoped></style>
