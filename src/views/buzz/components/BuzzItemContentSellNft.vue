<template>
  <CardVue class="nft-card" color="#5BA1FF">
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
        </template>
      </ElSkeleton>
    </div>
  </CardVue>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import CardVue from '@/components/Card/Card.vue'
import { reactive, ref } from 'vue'
import { GetSellNft } from '@/api/aggregation'
import { usePostTagStore } from '@/stores/buzz/tag'
import NFTCoverVue from '@/components/NFTCover/NFTCover.vue'
import { useRouter } from 'vue-router'

interface Props {
  buzz: BuzzItem
}
const nftSellItem: { val: SellNftItem | null } = reactive({ val: null })
const props = withDefaults(defineProps<Props>(), {})
const userStore = useUserStore()
const isSkeleton = ref(true)
const postTagStore = usePostTagStore()
const router = useRouter()

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
