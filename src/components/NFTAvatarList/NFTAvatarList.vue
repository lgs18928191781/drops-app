<template>
  <div
    class="nft-list flex1"
    v-infinite-scroll="getMore"
    :infinite-scroll-immediate="false"
    v-loading="isNFTLoading"
  >
    <template v-if="!isNFTLoading">
      <template v-if="list.length > 0">
        <div class="nft-item" v-for="item in list" @click="chooseItem(item)">
          <Image :src="item.image" />
          <div
            class="checked"
            v-if="
              currentNFT.token_address === item.token_address &&
                currentNFT.token_id === item.token_id
            "
          >
            <div class="checked-icon-warp flex flex-align-center flex-pack-center">
              <Icon name="check" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <IsNullVue />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { GetNFTs } from '@/api/metaid-base'
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'

const userStore = useUserStore()
const isNFTLoading = ref(true)
const pagintion = reactive({
  limit: 12,
  cursor: '',
  chain: import.meta.env.VITE_ETH_CHAIN,
})
const list: {
  image: string
  description: string
  attributes: string
  token_id: string
  token_address: string
}[] = reactive([])

function getMore() {
  if (!pagintion.cursor) return
  isNFTLoading.value = true
  getNfts().then(() => {
    isNFTLoading.value = false
  })
}

const currentNFT = reactive({
  token_address: '',
  token_id: '',
})

function getNfts(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetNFTs({
      address: userStore.user!.evmAddress!,
      chain: pagintion.chain,
      limit: pagintion.limit,
      cursor: pagintion.cursor,
    })
    if (res) {
      if (isCover) list.length = 0
      pagintion.cursor = res.cursor
      res.result.forEach(item => {
        const metadata = JSON.parse(item.metadata)
        list.push({
          ...metadata,
          token_address: item.token_address,
          token_id: item.token_id,
        })
      })
      resolve()
    }
  })
}

function chooseItem(item: {
  image: string
  description: string
  attributes: string
  token_id: string
  token_address: string
}) {
  if (item.token_address === currentNFT.token_address && item.token_id === currentNFT.token_id) {
    currentNFT.token_address = ''
    currentNFT.token_id = ''
  } else {
    currentNFT.token_address = item.token_address
    currentNFT.token_id = item.token_id
  }
}
</script>

<style lang="scss" scoped></style>
