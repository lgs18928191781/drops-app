<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <div class="collection" id="collection">
      <!-- cover -->
      <Image class="cover" :src="$filters.strapiImage(collection.val!.banner.url)" />

      <div class="collection-content">
        <!-- collection-avatar -->
        <div class="collection-avatar">
          <img :src="$filters.strapiImage(collection.val!.icon.url)" />
        </div>

        <!-- collection-msg -->
        <div class="collection-msg flex">
          <div class="flex3">
            <div class="name flex flex-align-center">
              {{ collection.val!.name }} <Icon name="certed" />
            </div>
            <div class="creator flex flex-align-center">
              {{ $t('NFT.Creater') }}:
              <RouterLink
                :to="{ name: 'user', params: {metaId: collection.val!.creatorMetaId}}"
                >{{ collection.val!.creatorName }}</RouterLink
              >
              <Icon name="center_star" />
            </div>
            <div class="drsc">
              <template v-if="collection.val!.intro.length > 100">
                <span class="text"> {{ collection.val!.intro.slice(0, 100) }}...</span
                ><a @click="isShowContent = true">{{ $t('NFT.Discover More') }}</a>
              </template>
              <template v-else>{{ collection.val!.intro }}</template>
            </div>
          </div>
          <div class="flex1">
            <div class="statiscs-list">
              <div class="statiscs-item" v-for="(item, index) in statiscs" :key="index">
                <div class="flex flex-align-center flex-pack-end">
                  <div class="statiscs-item-warp">
                    <div class="value">{{ item.value() }}</div>
                    <div class="label">{{ item.name() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- tab -->
        <div class="tab flex flex-align-center">
          <a
            v-for="(item, index) in tabs"
            :key="index"
            :class="{ active: item.value === tabActive }"
            @click="tabActive = item.value"
            >{{ item.name() }}</a
          >
        </div>

        <!-- CollectionWorks -->
        <template v-if="tabActive === NFTCollectTab.CollectionWorks">
          <!-- screen -->
          <el-affix :offset="120">
            <div class="screen flex flex-align-center">
              <div class="flex1">
                <a class="main-border flex flex-align-center">
                  <Icon name="filter" /> {{ $t('NFT.Filter') }}
                </a>
              </div>
              <ElSelect v-model="sortIndex" @change="refreshDatas">
                <ElOption
                  v-for="(item, index) in sorts"
                  :key="index"
                  :label="item.name()"
                  :value="index"
                />
              </ElSelect>
              <div class="display flex flex-align-center">
                <a
                  @click="changeCell(item.value)"
                  v-for="item in cells"
                  :key="item.value"
                  :class="{ active: item.value === cell.val.value }"
                >
                  <Icon :name="item.icon" />
                </a>
              </div>
            </div>
          </el-affix>

          <div class="collection-nft-content flex">
            <div class="filter-warp">
              <ElCollapse accordion v-model="filterActiveName" class="filter-list">
                <ElCollapseItem class="filter-item">
                  <template #title>
                    <div class="filter-item-header flex flex-align-center flex1">
                      <div class="label flex1">{{ $t('NFT.FilterItem.Status') }}:</div>
                      <div class="sufix flex flex-align-center flex-pack-center">
                        <Icon name="down" />
                      </div>
                    </div>
                  </template>
                  <div class="fillter-item-content">
                    <div class="button-list">
                      <a
                        class="main-border"
                        v-for="(item, index) in sellTypes"
                        :key="index"
                        :class="{ primary: sellType === item.value }"
                        >{{ item.name() }}</a
                      >
                    </div>
                  </div>
                </ElCollapseItem>
                <ElCollapseItem class="filter-item">
                  <template #title>
                    <div class="filter-item-header flex flex-align-center flex1">
                      <div class="label flex1">{{ $t('NFT.FilterItem.Price') }}:</div>
                      <div class="sufix flex flex-align-center flex-pack-center">
                        <Icon name="down" />
                      </div>
                    </div>
                  </template>
                </ElCollapseItem>
              </ElCollapse>
            </div>
            <ElRow
              :gutter="22"
              class="nft-list flex1"
              v-infinite-scroll="getMore"
              :infinite-scroll-immediate="false"
              :infinite-scroll-distance="100"
            >
              <ElCol
                :xs="cell.val.xs"
                :sm="cell.val.sm"
                :md="cell.val.md"
                :lg="cell.val.lg"
                :xl="cell.val.xl"
                v-for="item in nfts"
                :key="item.nftGenesis + item.nftCodehash + item.nftTokenIndex"
              >
                <NFTItemVue :nft="item" @buy="buyNFT" />
              </ElCol>
            </ElRow>
          </div>

          <LoadMore :pagination="pagination" />
        </template>
        <!-- PriceTrend -->
        <template v-else></template>
      </div>
    </div>

    <ContentModal
      v-model="isShowContent"
      :title="collection.val!.name"
      :content="collection.val!.intro"
    />

    <!-- NFTBuy -->
    <NFTBuy :nft="nft.val!" v-model="isShowNftBuy" />
  </ElSkeleton>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTItemVue from '@/components/NFTItem/NFTItem.vue'
import { GetCollect } from '@/api/strapi'
import { useRoute } from 'vue-router'
import ContentModal from '@/components/ContentModal/ContentModal.vue'
import { GetCollectionNFTs } from '@/api/aggregation'
import { initPagination } from '@/config'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import NFTBuy from '@/components/NFTBuy/NFTBuy.vue'
import { CollectionOrderType, CollectionSortType, NFTSellType } from '@/enum'

const i18n = useI18n()
const route = useRoute()
enum NFTCollectTab {
  CollectionWorks = 0,
  PriceTrend = 1,
}
const scrrentWarpOffsetTop = ref(0)
const tabs = [
  {
    name: () => i18n.t('NFT.Collection works'),
    value: NFTCollectTab.CollectionWorks,
  },
  {
    name: () => i18n.t('NFT.Price Trend'),
    value: NFTCollectTab.PriceTrend,
  },
]
const tabActive = ref(NFTCollectTab.CollectionWorks)
const statiscs = reactive([
  {
    name: () => i18n.t('NFT.Initial Price'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Floor Price'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Highest Price'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Supply'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Owner'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Blockchain'),
    value: () => 'MVC',
  },
])
const collection: { val: null | Collect } = reactive({ val: null })
const isSkeleton = ref(true)
const isShowContent = ref(false)
const pagination = reactive({ ...initPagination, pageSize: 24 })
const nfts: GenesisNFTItem[] = reactive([])
const nft: { val: GenesisNFTItem | null } = reactive({ val: null })
const isShowNftBuy = ref(false)
const cells = [
  {
    value: 0,
    xs: 12,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4,
    icon: 'layout-grid-fill',
  },
  {
    value: 1,
    xs: 24,
    sm: 12,
    md: 8,
    lg: 8,
    xl: 6,
    icon: 'grid-fill',
  },
]
const cell = reactive({ val: cells[0] })
const sellType = ref(NFTSellType.All)
const sellTypes = [
  {
    name: () => i18n.t('NFT.SellType.All'),
    value: NFTSellType.All,
  },
  {
    name: () => i18n.t('NFT.SellType.Sale'),
    value: NFTSellType.SALE,
  },
  {
    name: () => i18n.t('NFT.SellType.New On Sale'),
    value: NFTSellType.NEWSALE,
  },
  {
    name: () => i18n.t('NFT.SellType.Off Sale'),
    value: NFTSellType.NONSALE,
  },
  {
    name: () => i18n.t('NFT.SellType.Auction'),
    value: NFTSellType.NONSALE,
  },
]
const filterActiveName = ref('')

const sorts = [
  {
    name: () => i18n.t('NFT.Sort.Default Ranking'),
    sortType: CollectionSortType.Default,
    orderType: CollectionOrderType.ASC,
  },
  {
    name: () => i18n.t('NFT.Sort.Price high to low'),
    sortType: CollectionSortType.Price,
    orderType: CollectionOrderType.DESC,
  },
  {
    name: () => i18n.t('NFT.Sort.Price low to high'),
    sortType: CollectionSortType.Price,
    orderType: CollectionOrderType.ASC,
  },
  {
    name: () => i18n.t('NFT.Sort.Number: X to 1'),
    sortType: CollectionSortType.TokenIndex,
    orderType: CollectionOrderType.DESC,
  },
  {
    name: () => i18n.t('NFT.Sort.Number: 1 to X'),
    sortType: CollectionSortType.TokenIndex,
    orderType: CollectionOrderType.ASC,
  },
]

const sortIndex = ref(0)

function getCollection() {
  return new Promise<void>(async resolve => {
    const res = await GetCollect(route.params.collectionId as string).catch(error => {
      ElMessage.error(error.message)
    })
    if (res) {
      collection.val = res
      resolve()
    }
  })
}

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const sort = sorts[sortIndex.value]
    const res = await GetCollectionNFTs({
      topicType: collection.val!.topicType,
      sortType: sort.sortType,
      orderType: sort.orderType,
      ...pagination,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      if (isCover) nfts.length = 0
      if (res.data.results.items.length === 0) pagination.nothing = true
      nfts.push(...res.data.results.items)
      resolve()
    }
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

function changeCell(cellValue: number) {
  if (cell.val.value === cellValue) return
  cell.val = cells.find(item => item.value === cellValue)!
}

function buyNFT(item: GenesisNFTItem) {
  nft.val = item
  isShowNftBuy.value = true
}

function refreshDatas() {
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas(true)
}

getCollection().then(() => {
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
})

onMounted(() => {
  console.log(document.getElementById('collection'))
  scrrentWarpOffsetTop.value = document.getElementById('collection')!.offsetTop
})
</script>

<style lang="scss" scoped src="./Collection.scss"></style>
