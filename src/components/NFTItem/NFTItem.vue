<template>
  <ElSkeleton :loading="loading" animated>
    <template #template>
      <NFTItemSkeleton />
    </template>
    <template #default>
      <div class="nft-item" @click="toNFT">
        <NFTCover :cover="[nft.nftIcon]" />

        <div class="name">{{ nft.nftName }}</div>
        <div class="amount">
          <template v-if="isCanBuy"> {{ $filters.space(nft.nftPrice) }} Space </template>
          <template v-else>--</template>
        </div>

        <div class="user-list">
          <div class="user-item flex flex-align-center">
            <UserAvatar
              :meta-id="nft.nftIssueMetaId"
              :image="nft.nftIssueAvatarImage"
              :name="nft.nftIssuer"
            />
            <div class="flex1 flex flex-align-center info">
              <span class="user-name"
                ><UserName :name="nft.nftIssuer" :meta-name="nft.nftIssueUserInfo.metaName"
              /></span>
              <span class="role">({{ $t('NFT.Creater') }})</span>
            </div>
          </div>
          <div class="user-item flex flex-align-center">
            <UserAvatar
              :meta-id="nft.nftOwnerMetaId"
              :image="nft.nftOwnerAvatarImage"
              :name="nft.nftOwnerName"
            />
            <div class="flex1 flex flex-align-center info">
              <span class="user-name"
                ><UserName :name="nft.nftOwnerName" :meta-name="nft.nftOwnerUserInfo.metaName"
              /></span>
              <span class="role">({{ $t('NFT.Owner') }})</span>
            </div>
          </div>
        </div>

        <div class="main-border primary" @click.stop="btnFun">
          {{ isCanBuy ? $t('NFT.Buy Now') : $t('NFT.Discover More') }}
        </div>
      </div>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import NFTCover from '../NFTCover/NFTCover.vue'
import Amount from '../Amount/Amount.vue'
import { NFTSellState, ToCurrency } from '@/enum'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import NFTItemSkeleton from './NFTItemSkeleton.vue'

const props = defineProps<{
  nft: GenesisNFTItem
  loading?: boolean
}>()

const emit = defineEmits(['buy'])
const router = useRouter()
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

function btnFun() {
  if (isCanBuy.value) {
    emit('buy', props.nft)
  } else {
    toNFT()
  }
}

function toNFT() {
  router.push({
    name: 'nftDetail',
    params: {
      chain: 'mvc',
      genesis: props.nft.nftGenesis,
      tokenIndex: props.nft.nftTokenIndex,
      codehash: props.nft.nftCodehash ? props.nft.nftCodehash : props.nft.nftChain,
    },
  })
}
</script>

<style lang="scss" scoped src="./NFTItem.scss"></style>
