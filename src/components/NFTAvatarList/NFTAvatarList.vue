<template>
  <div class="nft-avatar-list-warp flex flex-v">
    <div class="tab">
      <a
        v-for="item in chains"
        :key="item.value"
        :class="{ active: item.value === pagintion.chain, faded: item.disabled() }"
        @click="changeTab(item)"
        class=" main-border flex flex-align-center"
      >
        <img :src="item.icon" />
        <span class="name">{{ item.name }} </span>
      </a>
    </div>
    <div
      class="nft-list flex1"
      v-infinite-scroll="getMore"
      :infinite-scroll-immediate="false"
      :infinite-scroll-distance="100"
      v-loading="isSkeleton"
      :element-loading-svg="LoadingTEXT"
      :element-loading-text="$t('Loading')"
    >
      <ElSkeleton :loading="isSkeleton" animated>
        <template #default>
          <div class="nft-item" v-for="item in list" @click="chooseItem(item)">
            <Image :src="item.icon" />
            <div class="checked" v-if="activeTx === item.avatarImage">
              <div class="checked-icon-warp flex flex-align-center flex-pack-center">
                <Icon name="check" />
              </div>
            </div>
          </div>
          <LoadMoreVue :pagination="pagintion" v-if="list.length > 0" />
          <IsNullVue v-else />
        </template>
      </ElSkeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetNFTAvatars } from '@/api/aggregation'
import { GetNFTs } from '@/api/metaid-base'
import { initPagination, chains } from '@/config'
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import IsNullVue from '@/components/IsNull/IsNull.vue'
import LoadMoreVue from '@/components/LoadMore/LoadMore.vue'
import { LoadingTEXT } from '@/utils/LoadingSVGText'

interface Props {
  activeTx: string
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['change'])
const userStore = useUserStore()
const isSkeleton = ref(true)

const pagintion = reactive({
  ...initPagination,
  chain: 'mvc',
  flag: '',
})

const list: NFTAvatarItem[] = reactive([])

function getMore() {
  if (isSkeleton.value || pagintion.nothing || pagintion.loading) return
  pagintion.loading = true
  pagintion.page++
  getDatas().then(() => {
    isSkeleton.value = false
  })
}

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetNFTAvatars({
      address:
        pagintion.chain === 'mvc'
          ? userStore.user!.address
          : userStore.user!.evmAddress! || userStore.user?.ethAddress,
      ...pagintion,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      if (isCover) list.length = 0
      if (res.data.results.items.length > 0) {
        pagintion.flag = res.data.results.items[res.data.results.items.length - 1].txId
      } else {
        pagintion.nothing = false
      }
      list.push(...res.data.results.items)
      resolve()
    }
  })
}

function chooseItem(item: NFTAvatarItem) {
  if (props.activeTx === item.avatarImage) return
  emit('change', item)
}

function changeTab(item: { name: string; value: string; disabled: () => boolean }) {
  if (pagintion.chain === item.value || item.disabled()) return
  pagintion.chain = item.value
  isSkeleton.value = true
  pagintion.page = 1
  pagintion.loading = false
  pagintion.nothing = false
  pagintion.flag = ''
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
}

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./NFTAvatarList.scss"></style>
