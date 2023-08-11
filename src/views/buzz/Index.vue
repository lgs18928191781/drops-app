<template>
  <div ref="pulldownWarpRef"></div>
  <PublishBoxVue />
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
  ></BuzzListVue>
</template>

<script setup lang="ts">
import { GetBuzz, GetBuzzs, GetUserFollow } from '@/api/aggregation'
import { initPagination } from '@/config'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { inject, onActivated, onMounted, reactive, ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'
import { Mitt, MittEvent } from '@/utils/mitt'
import PublishBoxVue from './components/PublishBox.vue'
import { useRootStore } from '@/stores/root'
import { useI18n } from 'vue-i18n'
const pagination = reactive({ ...initPagination, timestamp: 0, page: undefined })
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()
const rootStore = useRootStore()
const myFollowNum = ref(0)
const pulldownWarpRef = ref()
const i18n = useI18n()
const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)
const pulldown: PullDownVal = inject('Pulldown')!

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetBuzzs({
      tag: route.name === 'buzzIndex' ? 'timeline' : 'recommendline',
      langId: localStorage.getItem('lang') === 'zh' ? 2 : 1,
      ...pagination,
      metaId: userStore.user?.metaId,
    })
    if (res.code === 0) {
      if (isCover) list.length = 0
      if (res.data.results.items.length) {
        res.data.results.items.forEach(buzz => {
          if (rootStore.myBlackList?.includes(buzz.metaId)) {
            //此内容用户被屏蔽
            buzz.content = `${i18n.t('buzz.blacktips')}`
            buzz.attachments = []
          }
          if (buzz.quoteItem && rootStore.myBlackList?.includes(buzz.quoteItem.metaId)) {
            buzz.quoteItem.content = `${i18n.t('buzz.blacktips')}`
            buzz.quoteItem.attachments = []
          }
        })
      }
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

function refreshDatas() {
  return new Promise<void>(async resolve => {
    isSkeleton.value = true
    pagination.timestamp = 0
    pagination.loading = false
    pagination.nothing = false
    await getUserFollow()
    await getDatas(true)
    isSkeleton.value = false
    resolve()
  })
}

function updateItem(buzz: BuzzItem) {
  const index = list.findIndex(item => item.txId === buzz.txId)
  if (index !== -1) {
    list[index] = buzz
  }
}

rootStore.$subscribe(
  async (mutation, state) => {
    if (mutation.type == 'patch function' && state.isRereshData) {
      await refreshDatas()
    }
  },
  { detached: true }
)

getUserFollow().then(() => {
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
})

onActivated(() => {
  pulldown.refreshSlot = pulldownWarpRef.value
  pulldown.onRefresh = () => {
    return new Promise<void>(async resolve => {
      await refreshDatas()
        .then(() => {
          resolve()
        })
        .catch(() => {
          resolve()
        })
    })
  }
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
