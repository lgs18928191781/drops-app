<template>
  <ElSkeleton :loading="loading" animated>
    <template #template>
      <NFTItemSkeleton />
    </template>
    <template #default>
      <div class="nft-item" @click="toNFT">
        <NFTCover :cover="[nft.nftIcon]" />

        <div class="name" :class="{ simple: isSimple }">{{ nft.nftName }}</div>

        <div class="token-index">#{{ parseInt(nft.nftTokenIndex) + 1 }}</div>
        <div class="amount" :class="{ simple: isSimple }">
          <template v-if="isSale"> {{ $filters.space(nft.nftPrice) }} Space </template>
          <template v-else>--</template>
        </div>

        <div class="user-list" v-if="!isSimple">
          <div class="user-item flex flex-align-center">
            <UserAvatar
              :meta-id="nft.nftIssueMetaId"
              :image="nft.nftIssueAvatarImage"
              :name="nft.nftIssuer"
            />
            <div class="flex1 flex flex-align-center info">
              <span class="user-name-warp"
                ><UserName
                  :name="nft.nftIssuer"
                  :meta-name="nft.nftIssueUserInfo?.metaName"
                  :noTag="true"
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
              <span class="user-name-warp"
                ><UserName
                  :name="nft.nftOwnerName"
                  :meta-name="nft.nftOwnerUserInfo?.metaName"
                  :noTag="true"
              /></span>
              <span class="role">({{ $t('NFT.Owner') }})</span>
            </div>
          </div>
        </div>

        <div class="main-border primary" @click.stop="btnFun">
          {{ btnText }}
        </div>
      </div>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import NFTCover from '../NFTCover/NFTCover.vue'
import Amount from '../Amount/Amount.vue'
import { Chains, NFTSellState, ToCurrency } from '@/enum'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import NFTItemSkeleton from './NFTItemSkeleton.vue'
import { useUserStore } from '@/stores/user'
import { IsMyNFT, IsSale } from '@/utils/nft'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  nft: GenesisNFTItem
  loading?: boolean
  isSimple?: boolean
}>()

const emit = defineEmits(['buy', 'offsale', 'sale'])
const router = useRouter()
const userStore = useUserStore()
const i18n = useI18n()

const isMyNFT = computed(() => {
  return IsMyNFT(props.nft)
})

const isSale = computed(() => {
  return IsSale(props.nft)
})

const btnText = computed(() => {
  if (isMyNFT.value) {
    if (isSale.value) {
      return i18n.t('NFT.Off Sale')
    } else {
      return i18n.t('NFT.Sale')
    }
  } else {
    if (isSale.value) {
      return i18n.t('NFT.Buy Now')
    } else {
      return i18n.t('NFT.Discover More')
    }
  }
})

function btnFun() {
  if (isMyNFT.value) {
    if (isSale.value) {
      emit('offsale', props.nft)
    } else {
      emit('sale', props.nft)
    }
  } else {
    if (isSale.value) {
      emit('buy', props.nft)
    } else {
      toNFT()
    }
  }
}

function toNFT() {
  router.push({
    name: 'nftDetail',
    params: {
      chain: props.nft.nftChain,
      genesis: props.nft.nftGenesis,
      tokenIndex: props.nft.nftTokenIndex,
      codehash: props.nft.nftCodehash ? props.nft.nftCodehash : props.nft.nftChain,
    },
  })
}
</script>

<style lang="scss" scoped src="./NFTItem.scss"></style>
