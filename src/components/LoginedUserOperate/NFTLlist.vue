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
                collectionpinid:collectionPinid,
                nftpinid:nft.id
              },
            }"
            class="nft-item"
            v-for="nft in nfts"
            :key="nft.id"
            @click.stop="toNFT(nft,collectionPinid)"
          >
          <!-- <div class="rounded-lg w-full h-full ">
            <img class="w-full h-full object-contain" :src="formatDataUrl(nft.id)" alt="">
          </div> -->
          
            <NFTCover :cover="[formatDataUrl(nft.id)]" />
          </RouterLink>
        </ElSkeleton>

        <LoadMore :pagination="pagination" v-if="!isSkeleton && nfts.length > 0" />
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
import LoadMore from '../LoadMore/LoadMore.vue'
import {GetMyNFTs} from '@/api/mrc721-api'
import { ElMessage } from 'element-plus'
import {useConnectionStore} from '@/stores/connection'
import { formatDataUrltoBase64 ,formatDataUrl} from '@/utils/util'
const props = defineProps<{
  modelValue: boolean
  collectionPinid:string
  seriesName: string
}>()

const route = useRoute()
const pagination = reactive({ ...initPagination, pageSize: 27, flag: '' })
const userStore = useUserStore()
const nfts: Mrc721PinItemType[] = reactive([])
const isSkeleton = ref(true)
const connectionStore=useConnectionStore()
const emit = defineEmits(['update:modelValue', 'close', 'link'])

function getDatas(isCover = false) {
  if (isCover) {
    pagination.page = 0
  }
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetMyNFTs({
      page:String(pagination.page),
      size:String(pagination.pageSize),
      metaid:connectionStore.last.user.metaid,
      collectionPinid:props.collectionPinid
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 200) {
      if (isCover) nfts.length = 0
      if (res.data.length === 0) {
        pagination.nothing = true
      } else {
        //pagination.flag = res.data.cursor ? res.data.cursor : ''
        nfts.push(...res.data[0].itemList)
      }
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

function toNFT(nft: Mrc721PinItemType,collectionPinid:string) {
  emit('link')
  router.push({
    name: 'nftDetail',
    params: {
      nftpinid:nft.id,
      collectionpinid:collectionPinid
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
