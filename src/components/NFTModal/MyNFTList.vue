<template>
  <header class="flex flex-align-center">
    <a class="back flex flex-align-center flex-pack-center" @click="back">
      <Icon name="down" />
    </a>
    <div class="flex1 title">{{ title }}</div>

    <a class="close flex flex-align-center flex-pack-center" @click="onClose">
      <Icon name="x_mark " />
    </a>
  </header>

  <div class="tab" v-if="!isShowNFTList">
    <a
      v-for="item in tabs"
      :key="item.value"
      :class="{ active: item.value === tabActive }"
      @click="changeTab(item.value)"
      >{{ item.name }}</a
    >
  </div>

  <div class="content">
    <div class="genesis-list" v-infinite-scroll="load" :infinite-scroll-immediate="false">
      <!-- NFT 列表 -->
      <template v-if="isShowNFTList">
        <ElSkeleton :loading="isNFTSkeleton" animated>
          <template #default>
            <div
              class="genesis-nft-item"
              v-for="item in nfts"
              :key="item.nftIssueMetaTxId"
              @click="chooseNFT(item)"
            >
              <NFTCover :cover="[item.nftIcon]" />
              <div class="name">{{ item.nftName }}</div>
            </div>

            <IsNullVue v-if="nfts.length <= 0" />
            <LoadMoreVue :pagination="nftPagination" v-if="nfts.length > 0" />
          </template>
        </ElSkeleton>
      </template>
      <!-- Genesis 列表 -->
      <template v-else>
        <ElSkeleton :loading="isSkeleton" animated>
          <template #default>
            <div
              class="genesis-item"
              v-for="item in genesisList"
              :key="item.nftGenesis + item.nftCodehash"
            >
              <div class="top flex flex-align-center" v-if="item.nftSeriesName">
                <div class="name flex1">
                  {{ item.nftSeriesName }}
                </div>
                <a class="main-border primary" @click="chooseGenesis(item)">
                  <Icon name="right" />
                </a>
              </div>
              <div class="author flex flex-align-center">
                <div class="msg flex1 flex flex-align-center">
                  <UserAvatar :meta-id="item.nftIssueMetaId" :disabled="true" />
                  {{ item.nftIssuer }}
                </div>
                <div class=" ">{{ $t('Number') }}: {{ item.nftMyCount }}</div>
              </div>
              <div class="nft-list">
                <div
                  class="nft-item"
                  v-for="nft in item.nftDetailItemList"
                  :key="nft.nftIssueMetaTxId"
                  :title="nft.nftName"
                  @click="chooseNFT(nft)"
                >
                  <NFTCoverVue :cover="[nft.nftIcon]" />
                </div>
              </div>
            </div>

            <IsNullVue v-if="genesisList.length <= 0" />
            <LoadMoreVue :pagination="pagination" v-if="genesisList.length > 0" />
          </template>
        </ElSkeleton>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetGenesisNFTs, GetNFTs } from '@/api/aggregation'
import { initPagination } from '@/config'
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { computed, reactive, ref, watch } from 'vue'
import NFTCoverVue from '@/components/NFTCover/NFTCover.vue'
import IsNullVue from '@/components/IsNull/IsNull.vue'
import LoadMoreVue from '@/components/LoadMore/LoadMore.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'change', nftItem: BaseNFT): void
  (e: 'update:modelValue', value: boolean): void
}>()
const userStore = useUserStore()
const pagination = reactive({ ...initPagination })
const nftPagination = reactive({ ...initPagination })
const currentGenesis: { val: null | UserNFTItem } = reactive({ val: null })
const genesisList: UserNFTItem[] = reactive([])
const nfts: GenesisNFTItem[] = reactive([])
const tabs = reactive([
  { name: 'MVC NFT', value: 'mvc' },
  { name: 'ETH NFT', value: import.meta.env.VITE_ETH_CHAIN },
  // { name: 'NFT On Sale', value: '2' },
])
const tabActive = ref('mvc')
const isSkeleton = ref(true)
const isNFTSkeleton = ref(true)
const isShowNFTList = ref(false)

const title = computed(() => {
  return isShowNFTList.value ? currentGenesis.val!.nftSeriesName : 'Show My NFT'
})

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetNFTs({
      address: tabActive.value === 'mvc' ? userStore.user!.address : userStore.user!.ethAddress!,
      chain: tabActive.value,
      ...pagination,
    })
    if (res.code === 0) {
      if (isCover) genesisList.length = 0
      if (res.data.results.items.length === 0) pagination.nothing = true
      genesisList.push(...res.data.results.items)
      resolve()
    }
  })
}

function getGenesisNTFs(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetGenesisNFTs({
      address: tabActive.value === 'mvc' ? userStore.user!.address : userStore.user!.ethAddress!,
      chain: tabActive.value,
      codehash: currentGenesis.val!.nftCodehash,
      genesis: currentGenesis.val!.nftGenesis,
      ...nftPagination,
    })
    if (res.code === 0) {
      if (isCover) nfts.length = 0
      if (res.data.results.items.length === 0) nftPagination.nothing = true
      nfts.push(...res.data.results.items)
      resolve()
    }
  })
}

function changeTab(value: string) {
  if (tabActive.value === value) return
  tabActive.value = value
  isSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
}

function load() {
  if (isShowNFTList.value) {
    if (isNFTSkeleton.value || nftPagination.loading || nftPagination.nothing) return
    nftPagination.loading = true
    nftPagination.page++
    getGenesisNTFs().then(() => {
      nftPagination.loading = false
    })
  } else {
    if (isSkeleton.value || pagination.loading || pagination.nothing) return
    pagination.loading = true
    pagination.page++
    getDatas().then(() => {
      pagination.loading = false
    })
  }
}

function chooseGenesis(item: UserNFTItem) {
  currentGenesis.val = item
  isNFTSkeleton.value = true
  isShowNFTList.value = true
  nftPagination.page = 1
  nftPagination.loading = false
  nftPagination.nothing = false
  getGenesisNTFs(true).then(() => {
    isNFTSkeleton.value = false
  })
}

function back() {
  if (isShowNFTList.value) {
    isShowNFTList.value = false
  } else {
    onClose()
  }
}

function chooseNFT(item: GenesisNFTItem) {
  emit('change', {
    cover: item.nftIcon,
    genesis: item.nftGenesis,
    codehash: item.nftCodehash,
    tokenIndex: item.nftTokenIndex,
    chain: item.nftChain,
  })
  onClose()
}

function onClose() {
  emit('update:modelValue', false)
  isShowNFTList.value = false
  isNFTSkeleton.value = true
  pagination.loading = false
  pagination.nothing = false
  pagination.page = 1
  emit('close')
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      getDatas(true).then(() => {
        isSkeleton.value = false
      })
    }
  }
)
</script>

<style lang="scss" scoped src="./MyNFTList.scss"></style>
