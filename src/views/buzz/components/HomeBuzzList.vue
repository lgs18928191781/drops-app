<template>
  <PublishBox />

  <BuzzListVue
    :list="list"
    :loading="isSkeleton"
    @get-more="getMore"
    :pagination="pagination"
    @update-item="updateItem"
    @add-item="val => list.unshift(val)"
    @remove-item="
      txId =>
        list.splice(
          list.findIndex(item => item.txId === txId),
          1
        )
    "
  />

  <RecommendContentVue />
</template>

<script setup lang="ts">
import { GetBuzz, GetBuzzs } from '@/api/aggregation'
import { initPagination } from '@/config'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './BuzzList.vue'
import { Mitt, MittEvent } from '@/utils/mitt'
import RecommendContentVue from './RecommendContent.vue'
import PublishBox from './PublishBox.vue'

// interface Props {}
// const props = withDefaults(defineProps<Props>(), {})

const pagination = reactive({ ...initPagination, timestamp: 0 })
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()

const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetBuzzs({
      tag: route.name === 'buzzIndex' ? 'timeline' : 'recommendline',
      ...pagination,
      metaId: userStore.user?.metaId,
    })
    if (res.code === 0) {
      if (isCover) list.length = 0
      list.push(...res.data.results.items)

      if (res.data.results.items.length === 0) {
        pagination.nothing = true
      } else {
        pagination.nothing = false
        pagination.timestamp = res.data.results.items[res.data.results.items.length - 1].timestamp
      }
    }
    resolve()
  })
}

Mitt.on(MittEvent.AddBuzz, async (params: { txId: string }) => {
  const res = await GetBuzz({
    txId: params.txId,
    metaId: userStore.user?.metaId,
  })
  if (res && res.code === 0) {
    list.unshift(res.data.results.items[0])
  }
})

const publishOperates = [
  {
    icon: 'buzzn_emoji',
    fun: () => {},
  },
  {
    icon: 'buzz_img',
    fun: () => {},
  },
  {
    icon: 'buzz_nft',
    fun: () => {},
  },
  {
    icon: 'buzz_hashtag',
    fun: () => {},
  },
]

// 监听登录状态，变化后重新拉取数据
watch(
  () => userStore.isAuthorized,
  () => {
    refreshDatas()
  }
)

function getMore() {
  if (isSkeleton.value || pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

async function refreshDatas() {
  isSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  await getDatas(true)
  isSkeleton.value = false
}

function updateItem(buzz: BuzzItem) {
  const index = list.findIndex(item => item.txId === buzz.txId)
  if (index !== -1) {
    list[index] = buzz
  }
}

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./HomeBuzzList.scss"></style>
