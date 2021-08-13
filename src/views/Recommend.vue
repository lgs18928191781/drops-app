<template>
  <div class="recommend container">
    <div class="recommend-header flex">
      <img @click="back" src="@/assets/images/bannet_icon_ins.svg" class="back-icon" />
      <div class="flex1 cont">
        <div class="title">
          {{$t('recommentprod')}}
        </div>
        <div class="drsc">{{ $t('recommenttext') }}</div>
      </div>
    </div>
    <div class="recomment-list nft-list">
      <NftSkeleton
        :loading="isShowSkeleton"
        :count="pagination.pageSize"
        class="section-cont nft-list"
      >
        <template #default>
          <template v-for="nft in nfts" :key="nft.tokenId">
            <NftItem :item="nft" />
          </template>
        </template>
      </NftSkeleton>
    </div>
    <LoadMore
      :pagination="pagination"
      @getMore="getMore"
      v-if="nfts.length > 0 && !isShowSkeleton"
    />
    <IsNull v-else />
  </div>
</template>

<script lang="ts" setup>
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '../components/IsNull/IsNull.vue'
import { reactive, ref } from 'vue'
import { pagination as _pagination } from '@/config'
import { GetProductList, NftApiCode } from '@/api'
import { useRouter } from 'vue-router'
import _Backtop from 'element-plus/lib/el-backtop'

const router = useRouter()
const nfts = reactive<NftItem[]>([])
const isShowSkeleton = ref(true)
const pagination = reactive({
  ..._pagination,
})

function getRecommendNftList(isCover: boolean = false) {
  return new Promise<void>(async (resolve) => {
    const res = await GetProductList(pagination)
    if (res.code === NftApiCode.success) {
        if (isCover) {
            nfts.length = 0
        }
        nfts.push(...res.data)
        const totalPages = Math.ceil(res.count / pagination.pageSize)
        if (pagination.page >= totalPages) pagination.nothing = true
        isShowSkeleton.value = false
    }
    resolve()
  })
}
getRecommendNftList()

function getMore() {
  pagination.loading = true
  pagination.page++
  getRecommendNftList().then(() => {
    pagination.loading = false
  })
}

function back() {
  router.back()
}


</script>

<style lang="scss" scoped src="./Recommend.scss"></style>
