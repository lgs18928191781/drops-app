<template>
  <!-- banner -->
  <!-- <div class="banner container">
    <a><img src="@/assets/images/banner.png" alt="" /></a>
  </div> -->

  <div class="home">
    <!-- 推荐作品 -->
    <div class="section container recommend-section">
      <NftSkeleton
        :loading="isShowRecommendSkeleton"
        :count="8"
        :isReCommend="true"
        class="section-cont nft-list"
      >
        <template #default>
          <div class="section-cont nft-list">
            <!-- @ts-ignore -->
            <NftItem
              :isRecommendCard="true"
              :item="{
                name: 'recommend',
                amount: 0,
                foundryName: '',
                classify: [],
                tokenId: '',
                coverUrl: '',
                metaId: '',
                genesis: '',
                tokenIndex: '',
                codehash: '',
              }"
            />
            <template v-for="item in recommendNfts">
              <NftItem :item="item" />
            </template>
          </div>
        </template>
      </NftSkeleton>
    </div>

    <!-- 所有类别 -->
    <div class="section container">
      <div class="section-header flex flex-align-center">
        <div class="title flex1">{{ $t('allmenu') }}</div>
      </div>
      <div class="section-screen flex flex-align-center">
        <div class="tags flex1 flex flex-align-center flex-wrap-wrap">
          <a :class="{ active: classify === 'all' }" @click="changeClassify('all')">{{
            $t('all')
          }}</a>
          <a
            :class="{ active: classify === item.classify }"
            v-for="item in classifyList"
            :key="item.classify"
            @click="changeClassify(item.classify)"
          >
            {{ $t(item.classify) }}
          </a>
        </div>
        <div class="search-warp flex flex-align-center">
          <input
            class="flex1"
            v-model="keyword"
            :placeholder="$t('search')"
            @keyup.enter="search"
            type="text"
          />
          <img src="@/assets/images/icon_search.svg" @click="search" />
        </div>
      </div>
      <NftSkeleton
        :loading="isShowNftListSkeleton"
        :count="pagination.pageSize"
        class="section-cont nft-list"
      >
        <template #default>
          <div class="section-cont nft-list">
            <template v-for="item in Nfts">
              <NftItem :item="item" />
            </template>
          </div>
        </template>
      </NftSkeleton>
    </div>

    <LoadMore
      :pagination="pagination"
      @getMore="getMore"
      v-if="Nfts.length > 0 && !isShowNftListSkeleton"
    />
    <IsNull v-else />
  </div>
</template>
<script setup lang="ts">
import {
  GetAllOnSellNftList,
  GetClassies,
  GetNftOnShowListByClassify,
  GetNftOnShowListBySearch,
  GetProductClassifyList,
  GetProductList,
  GetRecommendOnSellNftList,
  NftApiCode,
  Search,
} from '@/api'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '../components/IsNull/IsNull.vue'
import { classifyList } from '@/config'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const store = useStore()
let recommendNfts = reactive<NftItem[]>([])
let Nfts = reactive<NftItem[]>([])
const pagination = reactive({
  ...store.state.pagination,
})
const keyword = ref('')
const classify = ref('all')
let apiType = 'GetAllOnSellNftList'

// 骨架屏
const isShowRecommendSkeleton = ref(true)
const isShowNftListSkeleton = ref(true)

async function getNftList(isCover: boolean = false) {
  const apiName = {
    GetAllOnSellNftList: GetAllOnSellNftList,
    GetNftOnShowListByClassify: GetNftOnShowListByClassify,
    GetNftOnShowListBySearch: GetNftOnShowListBySearch,
  }
  // @ts-ignore
  const res = await apiName[apiType]({
    PageSize: pagination.pageSize.toString(),
    Page: pagination.page.toString(),
    classify: apiType === 'GetNftOnShowListByClassify' ? classify.value : undefined,
    SearchWord: apiType === 'GetNftOnShowListBySearch' ? keyword.value : undefined,
  })
  if (res.code === NftApiCode.success) {
    if (isCover) Nfts.length = 0
    if (res.data.results.items.length > 0) {
      res.data.results.items.map((item: GetNftIssueyTxIdResItem) => {
        const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : null
        Nfts.push({
          name: item.nftName ? item.nftName : '--',
          amount: item.nftPrice,
          foundryName: item.nftIssuer,
          classify:
            data && data.classifyList && data.classifyList !== ''
              ? JSON.parse(data.classifyList)
              : [],
          head: '',
          tokenId: item.nftGenesis + item.nftTokenIndex,
          coverUrl: item.nftIcon,
          putAway: item.nftIsReady,
          metaId: item.nftIssueMetaId,
          productName: item.nftName,
          deadlineTime: 0,
          genesis: item.nftGenesis,
          tokenIndex: item.nftTokenIndex,
          codehash: item.nftCodehash,
        })
      })
    } else {
      pagination.nothing = true
    }
    isShowNftListSkeleton.value = false
  }
}

// 获取推荐列表
function getRecommendNftList() {
  return new Promise<void>(async (resolve) => {
    const res = await GetRecommendOnSellNftList({
      Page: '1',
      PageSize: '7',
    })
    if (res.code === 0) {
      if (res.data.results.items.length > 0) {
        res.data.results.items.map((item) => {
          const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : null
          recommendNfts.push({
            name: item.nftName ? item.nftName : '--',
            amount: item.nftPrice,
            foundryName: item.nftIssuer,
            classify:
              data && data.classifyList && data.classifyList !== ''
                ? JSON.parse(data.classifyList)
                : [],
            head: '',
            tokenId: item.nftGenesis + item.nftTokenIndex,
            coverUrl: item.nftIcon,
            putAway: item.nftIsReady,
            metaId: item.nftIssueMetaId,
            productName: item.nftName,
            deadlineTime: 0,
            genesis: item.nftGenesis,
            tokenIndex: item.nftTokenIndex,
            codehash: item.nftCodehash,
          })
        })
      }
      isShowRecommendSkeleton.value = false
    }
    resolve()
  })
}

//  加载更多
function getMore() {
  pagination.loading = true
  pagination.page++
  getNftList().then(() => {
    pagination.loading = false
  })
}

// 更改分类
function changeClassify(classifyName: string) {
  if (classify.value === classifyName) return
  isShowNftListSkeleton.value = true
  classify.value = classifyName
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  if (classifyName === 'all') {
    apiType = 'GetAllOnSellNftList'
  } else {
    apiType = 'GetNftOnShowListByClassify'
  }
  getNftList(true)
  keyword.value = ''
}

// 搜索
async function search() {
  isShowNftListSkeleton.value = true
  pagination.loading = false
  pagination.nothing = false
  pagination.page = 1
  if (keyword.value === '') {
    classify.value = 'all'
    apiType = 'GetAllOnSellNftList'
  } else {
    classify.value = ''
    apiType = 'GetNftOnShowListBySearch'
  }
  getNftList(true)
}

getRecommendNftList()
getNftList()
</script>
<style lang="scss" scoped src="./Home.scss"></style>
