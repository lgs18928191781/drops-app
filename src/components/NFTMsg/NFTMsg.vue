<template>
  <div class="nft-msg flex">
    <div class="cover-warp">
      <NFTCoverVue :cover="[nft.nftIcon]" />
    </div>
    <div class="flex1">
      <div class="name">{{ nft.nftName }}</div>
      <div class="cont flex flex-align-center">
        <div class="flex1">
          <div class="token-index">#{{ parseInt(nft.nftTokenIndex) + 1 }}</div>
        </div>
        <div class="price" v-if="nft.nftPrice">
          <AmountVue
            :price="nft.nftIsLegal ? nft.nftLegalPrice : nft.nftPrice"
            :currency="nft.nftIsLegal ? 'CNY' : 'SPACE'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NFTCoverVue from '@/components/NFTCover/NFTCover.vue'
import { useRootStore } from '@/stores/root'
import AmountVue from '../Amount/Amount.vue'

const rootStore = useRootStore()
const props = defineProps<{
  nft: GenesisNFTItem
}>()
</script>

<style lang="scss" scoped src="./NFTMsg.scss"></style>
