<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <template #template>
      <CollectionSkeleton />
    </template>

    <template #default>
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
            <div class="flex1">
              <div class="name flex flex-align-center">
                {{ collection.val!.name }} <Icon name="certed" />
              </div>
              <div class="creator flex flex-align-center">
                {{ $t('NFT.Creater') }}:
                <RouterLink :to="{ name: 'user', params: {metaId: collection.val!.creatorMetaId}}"
                  ><UserName
                    :name="collection.val!.name"
                    :meta-name="collection.val!.creatorMetaName"
                /></RouterLink>
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
            <div class="">
              <div class="statiscs-list">
                <div class="statiscs-item" v-for="(item, index) in statiscs" :key="index">
                  <div class="flex flex-align-center flex-pack-center">
                    <div class="statiscs-item-warp">
                      <template v-if="item.value !== '0' && item.value !== ''">
                        <div class="value flex flex-align-center">
                          <span class="amount">{{ item.value }} </span>
                          <span class="unit">{{ item.unit }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="value">--</div>
                      </template>
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
              @click="changeTab(item.value)"
              >{{ item.name() }}</a
            >
          </div>

          <!-- CollectionWorks -->
          <template v-if="tabActive === NFTCollectTab.CollectionWorks">
            <!-- screen -->
            <ElAffix :offset="scrrentWarpOffsetTop">
              <div class="screen flex flex-align-center" id="screen">
                <div class="flex1">
                  <a
                    class="main-border flex flex-align-center"
                    @click="isShowFilterWarp = !isShowFilterWarp"
                  >
                    <Icon name="filter" />
                    <template v-if="isShowFilterWarp">{{ $t('NFT.Filter') }}</template>
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
            </ElAffix>

            <div class="collection-nft-content flex">
              <template v-if="isShowFilterWarp">
                <ElAffix :offset="filterWarpOffsetTop">
                  <CollectionFilterWarp
                    v-model:sell-type="sellType"
                    v-model:price-range="priceRange"
                    @change="refreshDatas"
                  />
                </ElAffix>
              </template>

              <ElRow
                :gutter="22"
                class="nft-list flex1"
                v-infinite-scroll="getMore"
                :infinite-scroll-immediate="false"
                :infinite-scroll-distance="100"
                v-if="isShowNFTList"
              >
                <ElCol
                  :xs="cell.val.xs"
                  :sm="cell.val.sm"
                  :md="cell.val.md"
                  :lg="cell.val.lg"
                  :xl="cell.val.xl"
                  v-for="(item, index) in list"
                  :key="
                    isListLoading ? index : item.nftGenesis + item.nftCodehash + item.nftTokenIndex
                  "
                >
                  <NFTItemVue
                    :nft="item"
                    @buy="buyNFT"
                    @offsale="onOffsale"
                    @sale="onSale"
                    :loading="isListLoading"
                  />
                </ElCol>

                <ElCol v-if="!isListLoading && nfts.length === 0">
                  <IsNull />
                </ElCol>
              </ElRow>
            </div>

            <LoadMore :pagination="pagination" v-if="!isListLoading && nfts.length > 0" />
          </template>
          <!-- PriceTrend -->
          <template v-else>
            <CollectionChart />
          </template>
        </div>
      </div>

      <ContentModal
        v-model="isShowContent"
        :title="collection.val!.name"
        :content="collection.val!.intro"
      />

      <!-- NFTBuy -->
      <NFTBuy :nft="nft.val!" v-model="isShowNftBuy" @success="onOperateSuccess" />
      <!-- NFTSlae -->
      <NFTSellVue :nft="nft.val!" v-model="isShowNftSale" @success="onOperateSuccess" />
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTItemVue from '@/components/NFTItem/NFTItem.vue'
import { GetCollect, GetCollectByTopicType } from '@/api/strapi'
import { useRoute } from 'vue-router'
import ContentModal from '@/components/ContentModal/ContentModal.vue'
import { GetCollectionNFTs } from '@/api/aggregation'
import { initPagination } from '@/config'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import NFTBuy from '@/components/NFTBuy/NFTBuy.vue'
import { CollectionOrderType, CollectionSortType, NFTSellType } from '@/enum'
import CollectionFilterWarp from '@/views/nft/components/CollectionFilterWarp.vue'
import CollectionSkeleton from '@/views/nft/collection/CollectionSkeleton.vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import { isMobile } from '@/stores/root'
import { satoshi, space } from '@/utils/filters'
import NFTSellVue from '@/components/NFTSell/NFTSell.vue'
import { NFTOffSale } from '@/utils/util'
import { GetGenesisStatistics } from '@/api/broad'
import CollectionChart from '../components/CollectionChart.vue'

const i18n = useI18n()
const route = useRoute()
enum NFTCollectTab {
  CollectionWorks = 0,
  PriceTrend = 1,
}
const scrrentWarpOffsetTop = ref(0)
const filterWarpOffsetTop = ref(0)
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
const tabActive = ref(NFTCollectTab.PriceTrend)
const statiscs = reactive([
  {
    name: () => i18n.t('NFT.Initial Price'),
    value: '--',
    unit: 'Space',
  },
  {
    name: () => i18n.t('NFT.Floor Price'),
    value: '--',
    unit: 'Space',
  },
  {
    name: () => i18n.t('NFT.Highest Price'),
    value: '--',
    unit: 'Space',
  },
  {
    name: () => i18n.t('NFT.Circulation'),
    value: '--',
    unit: '',
  },
  {
    name: () => i18n.t('NFT.Owner'),
    value: '--',
    unit: '',
  },
  {
    name: () => i18n.t('NFT.Blockchain'),
    value: 'MVC',
    unit: '',
  },
])
const collection: { val: null | Collect } = reactive({ val: null })
const isSkeleton = ref(true)
const isShowContent = ref(false)
const pagination = reactive({ ...initPagination, pageSize: 24 })
const nfts: GenesisNFTItem[] = reactive([])
const nft: { val: GenesisNFTItem | null } = reactive({ val: null })
const isShowNftBuy = ref(false)
const isShowNftSale = ref(false)
const cells = [
  {
    value: 1,
    xs: 24,
    sm: 12,
    md: 8,
    lg: 8,
    xl: 6,
    icon: 'layout-grid-fill',
  },
  {
    value: 0,
    xs: 12,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4,
    icon: 'grid-fill',
  },
]
const cell = reactive({ val: cells[0] })
const sellType = ref(NFTSellType.All)
const priceRange: [string, string] = reactive(['', ''])
const isShowFilterWarp = ref(isMobile ? false : true)
const isListLoading = ref(false)

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

const list = computed(() => {
  if (isListLoading.value) {
    return Array.from({ length: pagination.pageSize }) as GenesisNFTItem[]
  } else {
    return nfts
  }
})

const isShowNFTList = computed(() => {
  if (isMobile && isShowFilterWarp.value) {
    return false
  } else {
    return true
  }
})

function getCollection() {
  return new Promise<void>(async resolve => {
    const res = await GetCollectByTopicType(route.params.topicType as string).catch(error => {
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
      sellType: sellType.value,
      startPrice: priceRange[0] ? satoshi(priceRange[0]).toString() : '',
      endPrice: priceRange[1] ? satoshi(priceRange[1]).toString() : '',
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
  if (isSkeleton.value || pagination.loading || pagination.nothing || isListLoading.value) return
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
  isListLoading.value = true
  if (isMobile && isShowFilterWarp.value) {
    isShowFilterWarp.value = false
  }
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas(true).then(() => {
    isListLoading.value = false
  })
}

async function onOffsale(item: GenesisNFTItem) {
  const result = await NFTOffSale(item)
  if (result) {
    onOperateSuccess(result)
  }
}

function onSale(item: GenesisNFTItem) {
  nft.val = item
  isShowNftSale.value = true
}

function onOperateSuccess(item: GenesisNFTItem) {
  const index = nfts.findIndex(
    _item =>
      _item.nftGenesis === item.nftGenesis &&
      _item.nftCodehash === item.nftCodehash &&
      _item.nftTokenIndex === item.nftTokenIndex
  )
  if (index > -1) {
    nfts[index] = item
  }
}

function getGenesisStatistics() {
  return new Promise<void>(async resolve => {
    const res = await GetGenesisStatistics(route.params.topicType as string).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      statiscs[0].value = space(res.data.panicPrice).toString()
      statiscs[1].value = space(res.data.minPrice).toString()
      statiscs[2].value = space(res.data.maxPrice).toString()
      statiscs[3].value = res.data.totalSupply.toString()
      statiscs[4].value = res.data.totalHolder.toString()
      resolve()
    }
  })
}

function changeTab(value: NFTCollectTab) {
  if (tabActive.value === value) return
  tabActive.value = value
  // if (value === NFTCollectTab.PriceTrend) {
  //   return ElMessage.info(i18n.t('Comming Soon'))
  // }
}

getCollection().then(() => {
  getDatas(true).then(() => {
    isSkeleton.value = false
    nextTick(() => {
      scrrentWarpOffsetTop.value = document.getElementById('collection')!.offsetTop - 18
      filterWarpOffsetTop.value =
        document.getElementById('collection')!.offsetTop +
        document.getElementById('screen')!.clientHeight
    })
  })
})
getGenesisStatistics()
</script>

<style lang="scss" scoped src="./Collection.scss"></style>
