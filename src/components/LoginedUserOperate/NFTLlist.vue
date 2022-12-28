<template>
  <!-- wallet -->
  <ElDrawer
    :model-value="modelValue"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    custom-class="none-padding"
    @close="emit('close')"
  >
    <div class="nft-list-warp flex flex-v">
      <header class="flex flex-align-center">
        <Icon name="down" @click="emit('update:modelValue', false)" />
        <div class="title">{{ seriesName }}</div>
      </header>

      <div
        class="nft-list flex1"
        v-infinite-scroll="load"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
      >
        <ElSkeleton :loading="isSkeleton" animated>
          <RouterLink
            :to="{
              name: 'nftDetail',
              params: {
                chain: chain,
                genesis: nft.nftGenesis,
                codehash: codehash || chain,
                tokenIndex: nft.nftTokenIndex,
              },
            }"
            class="nft-item"
            v-for="nft in nfts"
            :key="nft.nftIssueMetaTxId"
            @click.stop="toNFT(nft)"
          >
            <NFTCover :cover="[nft.nftIcon]" />
          </RouterLink>
        </ElSkeleton>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { GetGenesisNFTs } from '@/api/aggregation'
import { initPagination } from '@/config'
import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
  codehash: string
  chain: string
  genesis?: string
  seriesName: string
}>()

const route = useRoute()
const pagination = reactive({ ...initPagination })
const userStore = useUserStore()
const nfts: GenesisNFTItem[] = reactive([])
const isSkeleton = ref(true)

const emit = defineEmits(['update:modelValue', 'close', 'link'])

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetGenesisNFTs({
      ...pagination,
      chain: props.chain,
      address: props.chain === 'mvc' ? userStore.user!.address : userStore.user!.evmAddress!,
      codehash: props.codehash,
      genesis: props.genesis,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      if (isCover) nfts.length = 0
      nfts.push(...res.data.results.items)
      resolve()
    }
  })
}

function load() {
  if (isSkeleton.value || pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

function toNFT(nft: GenesisNFTItem) {
  emit('link')
  router.push({
    name: 'nftDetail',
    params: {
      chain: nft.nftChain,
      genesis: nft.nftGenesis,
      codehash: nft.nftCodehash ? nft.nftCodehash : nft.nftChain,
      tokenIndex: nft.nftTokenIndex,
    },
  })
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      isSkeleton.value = true
      pagination.page = 1
      pagination.loading = false
      pagination.nothing = false
      getDatas(true).then(() => {
        isSkeleton.value = false
      })
    }
  }
)
</script>

<style lang="scss" scoped src="./NFTLlist.scss"></style>
