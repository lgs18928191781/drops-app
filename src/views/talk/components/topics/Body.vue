<template>
  <div class="warp">
    <BuzzWarp :is-hide-header="true">
      <div class="buzz-list-warp">
        <BuzzListVue
          :list="list"
          :pagination="pagination"
          :loading="isSkeleton"
          @get-more="getMore"
          @update-item="updateItem"
        />
      </div>
    </BuzzWarp>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import BuzzWarp from '@/views/buzz/components/BuzzWarp.vue'
import BuzzListVue from '@/views/buzz/components/BuzzList.vue'
import { useTalkStore } from '@/stores/talk'
import { initPagination } from '@/config'
import { useLayoutStore } from '@/stores/layout'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { GetTopicBuzzs } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'

const talk = useTalkStore()
talk.activeChannelId = 'topics'

const layout = useLayoutStore()
const route = useRoute()
const userStore = useUserStore()

const pagination = reactive({ ...initPagination })
const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)

function publishTopic() {
  layout.publish({ topic: route.params.topic as string })
}

function getDatas(isCover = false) {
  return new Promise<void>(async resolve => {
    const res = await GetTopicBuzzs({
      tag: talk.activeCommunity!.name,
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

watch(
  () => talk.activeCommunity,
  result => {
    if (result) {
      getDatas(true).then(() => {
        isSkeleton.value = false
      })
    }
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss" src="./Body.scss"></style>
