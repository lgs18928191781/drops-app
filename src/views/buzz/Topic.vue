<template>
  <div class="topic-header flex flex-align-center">
    <div class="flex1 flex flex-align-center">
      <a class="back flex flex-align-center flex-pack-center" @click="$router.back()">
        <Icon name="down" />
      </a>
      <span class="tag flex flex-align-center flex-pack-center">
        <Icon name="buzz_hashtag" />
      </span>
      <span class="namt">{{ $route.params.topic }}</span>
    </div>
    <a class="flex flex-align-center operate" @click="isShowBuzzPublish = true">
      <Icon name="plus" />
      {{ $t('Buzz.topic.Create Community') }}
    </a>
  </div>

  <div ref="refreshBox"></div>

  <div class="buzz-list-warp">
    <BuzzListVue
      :list="list"
      :pagination="pagination"
      :loading="isSkeleton"
      @add-item="val => list.unshift(val)"
      @get-more="getMore"
      @update-item="updateItem"
    />
  </div>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { useLayoutStore } from '@/stores/layout'
import { inject, onActivated, onMounted, reactive, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'
import { GetTopicBuzzs } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'

const layout = useLayoutStore()
const route = useRoute()
const userStore = useUserStore()

const pagination = reactive({ ...initPagination })
const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)
const isShowBuzzPublish: Ref<boolean> = inject('isShowBuzzPublish')!
const topic: Ref<string> = inject('topic')!
const publiseSuccessCallBack: Ref<() => void> = inject('publiseSuccessCallBack')!
const pulldown: PullDownVal = inject('Pulldown')!
const refreshBox = ref()
publiseSuccessCallBack.value = () => {
  return
}

function getDatas(isCover = false) {
  return new Promise<void>(async resolve => {
    const res = await GetTopicBuzzs({
      tag: route.params.topic as string,
      langId: localStorage.getItem('lang') === 'zh' ? 2 : 1,
      metaId: userStore.user?.metaId,
      ...pagination,
    }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      if (isCover) list.length = 0
      if (res.data.results.items.length <= 0) pagination.nothing = true
      list.push(...res.data.results.items)
      resolve()
    }
  })
}

function getMore() {
  if (isSkeleton.value || pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
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

onMounted(() => {})

onActivated(() => {
  topic.value = route.params.topic as string
  pulldown.refreshSlot = refreshBox.value
  pulldown.onRefresh = () => {
    return new Promise<void>(async resolve => {
      pagination.page = 1
      await getDatas(true)
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

<style lang="scss" scoped src="./Topic.scss"></style>
