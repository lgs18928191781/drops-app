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
      <NFTItemVue
        :nft="item"
        @buy="buyNFT"
        @offsale="onOffsale"
        @sale="onSale"
        :loading="isSkeleton"
        :is-simple="true"
      />
    </ElCol>

    <ElCol v-if="!isSkeleton && nfts.length === 0">
      <IsNull />
    </ElCol>

    <template v-if="nft.val">
      <NFTBuyVue
        :nft="nft.val!"
        v-model="isShowNftBuy"
        :is-hide-detail="true"
        @success="onOperateSuccess"
      />

      <!-- NFTSellVue -->
      <NFTSellVue :nft="nft.val!" v-model="isShowNftSale" @success="onOperateSuccess" />
    </template>
  </ElRow>

  <LoadMore v-if="!isSkeleton && nfts.length" :pagination="pagination" />
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { computed, nextTick, reactive, ref } from 'vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import NFTBuyVue from '@/components/NFTBuy/NFTBuy.vue'
import { GeUserSaleNFTs } from '@/api/aggregation'
import { useRoute } from 'vue-router'
import { Chains } from '@/enum'
import NFTItemVue from '@/components/NFTItem/NFTItem.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import NFTSellVue from '@/components/NFTSell/NFTSell.vue'
import { NFTOffSale } from '@/utils/nft'

const nfts: GenesisNFTItem[] = reactive([])
const isSkeleton = ref(true)
const pagination = reactive({ ...initPagination, pageSize: 12 })
const nft = reactive({ val: null as null | GenesisNFTItem })
const isShowNftBuy = ref(false)
const route = useRoute()
const isShowNftSale = ref(false)

const list = computed(() => {
  if (isSkeleton.value) {
    return Array.from({ length: pagination.pageSize }) as GenesisNFTItem[]
  } else {
    return nfts
  }
})

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, rject) => {
    const res = await GeUserSaleNFTs({
      ...pagination,
      metaId: route.params.metaId as string,
      chain: Chains.MVC,
    })
    if (res?.code === 0) {
      if (isCover) nfts.length = 0
      pagination.nothing = res.data.results.items.length <= 0
      for (let item of res.data.results.items) {
        nfts.push({
          ...item,
          nftSellState: 0,
          nftIsReady: true,
        })
      }

      resolve()
    }
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
  nextTick(() => {
    isShowNftBuy.value = true
  })
}

function getMore() {
  if (isSkeleton.value || pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

async function onOffsale(item: GenesisNFTItem) {
  const result = await NFTOffSale(item).catch(error => {
    ElMessage.error(error.message)
  })
  if (result) {
    onOperateSuccess(result)
  }
}

function onOperateSuccess(item: GenesisNFTItem) {
  const index = nfts.findIndex(
    _item =>
      _item.nftGenesis === item.nftGenesis &&
      _item.nftCodehash === item.nftCodehash &&
      _item.nftTokenIndex === item.nftTokenIndex
  )
  if (index > -1) {
    nfts[index] = item
  }
}

function remove() {
  const index = nfts.findIndex(
    item =>
      item.nftGenesis === nft.val!.nftGenesis &&
      item.nftCodehash === nft.val!.nftCodehash &&
      item.nftTokenIndex === nft.val!.nftTokenIndex
  )
  if (index !== -1) {
    nfts.splice(index, 1)
  }
}

function onSale(item: GenesisNFTItem) {
  nft.val = item
  nextTick(() => {
    isShowNftSale.value = true
  })
}

getDatas().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./NFT.scss"></style>
