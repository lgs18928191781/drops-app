<template>
  <PublishBoxVue />

  <BuzzListVue
    :list="list"
    :loading="isSkeleton"
    @get-more="getMore"
    :pagination="pagination"
    @update-item="updateItem"
    @remove-item="
      txId =>
        list.splice(
          list.findIndex(item => item.txId === txId),
          1
        )
    "
  ></BuzzListVue>
</template>

<script setup lang="ts">
import { GetBuzz, GetBuzzs, GetUserFollow } from '@/api/aggregation'
import { initPagination } from '@/config'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'
import { Mitt, MittEvent } from '@/utils/mitt'
import PublishBoxVue from './components/PublishBox.vue'

const pagination = reactive({ ...initPagination, timestamp: 0 })
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()

const myFollowNum = ref(0)

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

// 监听登录状态，变化后重新拉取数据
watch(
  () => userStore.isAuthorized,
  () => {
    if (userStore.isAuthorized) {
      refreshDatas()
    }
  }
)

Mitt.on(MittEvent.AddBuzz, async (buzz: BuzzItem) => {
  list.unshift(buzz)
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

function getMore() {
  if (isSkeleton.value || pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

function getUserFollow() {
  return new Promise<void>(async resolve => {
    const res = await GetUserFollow(userStore.user!.metaId).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      myFollowNum.value = res.data.followingList?.length || 0
      resolve()
    }
  })
}

async function refreshDatas() {
  isSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  await getUserFollow()
  await getDatas(true)
  isSkeleton.value = false
}

function updateItem(buzz: BuzzItem) {
  const index = list.findIndex(item => item.txId === buzz.txId)
  if (index !== -1) {
    list[index] = buzz
  }
}

getUserFollow().then(() => {
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
