<template>
  <div class="nft-item">
    <NFTCover :cover="[nft.nftIcon]" />

    <div class="name">{{ nft.nftName }}</div>
    <div class="amount">
      <Amount :currency="ToCurrency.CNY" :price="nft.nftSpecialLegalCnyPrice" />
    </div>

    <div class="user-list">
      <div class="user-item flex flex-align-center">
        <UserAvatar :meta-id="''" :image="''" />
        <div class="flex1 flex flex-align-center info">
          <span class="user-name">ShowPayTeam ShowPayTeam</span>
          <span class="role">({{ $t('NFT.Creater') }})</span>
        </div>
      </div>
      <div class="user-item flex flex-align-center">
        <UserAvatar :meta-id="''" :image="''" />
        <div class="flex1 flex flex-align-center info">
          <span class="user-name">ShowPayTeam ShowPayTeam</span>
          <span class="role">({{ $t('NFT.Owner') }})</span>
        </div>
      </div>
    </div>

    <div class="main-border primary">
      {{ $t('NFT.Buy Now') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import NFTCover from '../NFTCover/NFTCover.vue'
import Amount from '../Amount/Amount.vue'
import { NFTSellState, ToCurrency } from '@/enum'
import { computed } from 'vue'

const props = defineProps<{
  nft: GenesisNFTItem
}>()

const isCanBuy = computed(() => {
  let result = false
  if (props.nft.nftSellState === NFTSellState.Sale) {
    if (props.nft.nftIsLegal) {
      result = true
    } else {
      if (props.nft.nftIsReady) {
        result = true
      }
    }
  }

  return result
})
</script>

<style lang="scss" scoped src="./NFTItem.scss"></style>
