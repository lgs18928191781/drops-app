<template>
  <div class="text" v-if="isBandNFTBuzz">{{ $t('buzz.blacktips') }}</div>
  <div v-else>
    <div class="text">{{ $t('NFT.Ueser Sell NFT Buzz Text') }}</div>
    <CardVue class="nft-card" :color="color">
      <div class="nft-warp" @click.stop="toNFT">
        <ElSkeleton :loading="isSkeleton" animated>
          <template #template>
            <div class="msg flex">
              <div class="cover-warp">
                <ElSkeletonItem variant="rect" />
              </div>
              <div class="cont flex1">
                <div class="name">
                  <ElSkeletonItem variant="p" />
                  <ElSkeletonItem variant="p" />
                </div>
                <div class="token-index">
                  <ElSkeletonItem variant="p" />
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <div class="msg flex">
              <div class="cover-warp">
                <NFTCoverVue :cover="[nftSellItem.val!.cover as string]" />
              </div>
              <div class="cont flex1">
                <div class="name">
                  {{nftSellItem.val!.name}}
                </div>
                <div class="token-index">#{{parseInt(nftSellItem.val!.tokenIndex) + 1}}</div>
              </div>
            </div>
            <div class="price flex flex-align-center flex-pack-center">
              {{ $filters.space(nftSellItem.val!.price) }} Space
              <!-- <AmountVue :price="$filters.space(nftSellItem.val!.price)" :currency="ToCurrency.MVC" /> -->
            </div>
          </template>
        </ElSkeleton>
      </div>
    </CardVue>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import CardVue from '@/components/Card/Card.vue'
import { computed, reactive, ref } from 'vue'
import { GetSellNft } from '@/api/aggregation'
import { usePostTagStore } from '@/stores/buzz/tag'
import NFTCoverVue from '@/components/NFTCover/NFTCover.vue'
import { useRouter } from 'vue-router'
import { useRootStore } from '@/stores/root'
import AmountVue from '@/components/Amount/Amount.vue'
import { ToCurrency } from '@/enum'

interface Props {
  buzz: BuzzItem
}

const props = withDefaults(defineProps<Props>(), {})
console.log('propspropsprops', props.buzz)
const nftSellItem: { val: SellNftItem | null } = reactive({ val: null })
const userStore = useUserStore()
const isSkeleton = ref(true)
const postTagStore = usePostTagStore()
const router = useRouter()
const rootStore = useRootStore()

const color = computed(() => {
  return postTagStore.list.find(item => item.id === props.buzz.postTagId)?.color
})

const isBandNFTBuzz = computed(() => {
  return (
    rootStore.myBlackList?.includes(props.buzz.metaId) ||
    rootStore.myBlackList?.includes(props.buzz?.rePost[0]?.metaId)
  )
})

function getSellNftInfo() {
  return new Promise<void>(async resolve => {
    const res = await GetSellNft(props.buzz.txId).catch(error => {
      ElMessage.error(error.message)
    })

    if (res?.code === 0) {
      nftSellItem.val = res.data
      resolve()
    }
  })
}

function toNFT() {
  router.push({
    name: 'nftDetail',
    params: {
      genesis: nftSellItem.val!.genesis,
      codehash: nftSellItem.val!.codehash ? nftSellItem.val!.codehash : nftSellItem.val?.chain,
      tokenIndex: nftSellItem.val!.tokenIndex,
      chain: nftSellItem.val!.chain,
    },
  })
}

getSellNftInfo().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./BuzzItemContentSellNft.scss"></style>
