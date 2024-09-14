<template>
  <ElSkeleton :loading="loading" animated>
    <template #template>
      <NFTItemSkeleton />
    </template>
    <template #default>
      <div class="nft-item" @click="toNFT">
        <NFTCover :cover="[nft.item_cover]" />

        <div class="name" :class="{ simple: isSimple }">
          {{ nft.nft_name }}
        </div>

        <div class="amount" :class="{ simple: isSimple }">
          <template v-if="isSale"> {{ $filters.space(realSalePrice) }} BTC </template>
          <template v-else>--</template>
        </div>

        <div class="user-list" v-if="!isSimple">
          <div class="user-item flex flex-align-center">
            <UserAvatar
              :meta-id="nft.creator_info.metaid"
              :image="nft.creator_info.avatarId"
              :name="nft.creator_info.name"
              :disabled="true"
              :meta-name="''"
            />
            <div class="flex1 flex flex-align-center info">
              <span class="user-name-warp"
                ><UserName
                  :name="nft.creator_info.name"
                  :meta-name="''"
                  :noTag="true"
              /></span>
              <span class="role">({{ $t('NFT.Creater') }})</span>
            </div>
          </div>
          <div class="user-item flex flex-align-center">
            <UserAvatar
              :meta-id="nft.owner_info?.metaid"
              :image="nft.owner_info?.avatarId"
              :name="nft.owner_info?.name"
              :disabled="true"
              :meta-name="''"
            />
            <div class="flex1 flex flex-align-center info">
              <span class="user-name-warp"
                ><UserName
                  :name="nft.owner_info?.name"
                  :meta-name="''"
                  :noTag="true"
              /></span>
              <span class="role">({{ $t('NFT.Owner') }})</span>
            </div>
          </div>
        </div>

        <div class="main-border " 
        :class="[nft.is_ready ? 'primary'  :  'fade']"
        @click.stop="btnFun">
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
import { IsMyNFT, IsSale,IsReady } from '@/utils/nft'
import { useI18n } from 'vue-i18n'
import { checkUserLogin,calcNftRealSalePrice } from '@/utils/util'

import Decimal from 'decimal.js-light'
const props = defineProps<{
  nft: NftOrderType
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

const isReady=computed(()=>{
  return IsReady(props.nft)
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
      
      if(!isReady.value){
        return i18n.t('NFT.in_mempool')
      }
      return i18n.t('NFT.Buy Now')
    } else {
      return i18n.t('NFT.Discover More')
    }
  }
})

const realSalePrice=computed(()=>{
  const {total}=calcNftRealSalePrice(props.nft.sale_price,props.nft.royalty_rate)
 return total

})

async function btnFun() {
 if (isMyNFT.value) {
    if (isSale.value) {
      emit('offsale', props.nft)
    } else {
      emit('sale', props.nft)
    }
  } else {
    if (isSale.value) {
      await checkUserLogin()
      if(!isReady.value){
        return
      }
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
      collectionpinid:props.nft.collection_pinid,
      nftpinid:props.nft.item_pinid,
    
    },
  })
}
</script>

<style lang="scss" scoped src="./NFTItem.scss"></style>
