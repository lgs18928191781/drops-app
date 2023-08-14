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
import { useRootStore } from '@/stores/root'
import { debounce } from '@/utils/util'
import { useI18n } from 'vue-i18n'

// interface Props {}
// const props = withDefaults(defineProps<Props>(), {})

const pagination = reactive({ ...initPagination, timestamp: 0 })
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()
const rootStore = useRootStore()
const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)
const i18n = useI18n()
function getDatas(isCover = false) {
  console.log('rootStore.myBlackList', rootStore.myBlackList)
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetBuzzs({
      tag: route.name === 'buzzIndex' ? 'timeline' : 'recommendline',
      langId: localStorage.getItem('lang') === 'zh' ? 2 : 1, //rootStore.showDiffLang == 1 ? '' :
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
          if (buzz.quoteItem && rootStore.myBlackList?.includes(buzz.metaId)) {
            buzz.quoteItem.content = `${i18n.t('buzz.blacktipsRepost')}`
            buzz.quoteItem.attachments = []
          }
          if (buzz.quoteItem && rootStore.myBlackList?.includes(buzz.quoteItem.metaId)) {
            buzz.quoteItem.content = `${i18n.t('buzz.blacktips')}`
            buzz.quoteItem.attachments = []
          }
        })
      }
      list.push(...res.data.results.items)

      if (res.data.results.items.length === 0 || pagination.page >= 3) {
        pagination.nothing = true
      } else {
        pagination.nothing = false
        pagination.timestamp = res.data.results.items[res.data.results.items.length - 1].timestamp
      }
    }
    resolve()
  })
}

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
  return new Promise<void>(async resolve => {
    isSkeleton.value = true
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
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

defineExpose({
  refreshDatas,
})
getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./HomeBuzzList.scss"></style>
