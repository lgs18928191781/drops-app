<template>
  <div
    class="publish flex "
    v-if="userStore.isAuthorized"
    @click="layoutStore.$patch({ isShowPublishBuzz: true })"
  >
    <UserAvatar :meta-id="userStore.user!.metaId" />
    <div class="cont flex1">
      <div class="input">
        <ElInput type="text" :placeholder="$t('Buzz.publish.placeholder')" />
      </div>
      <div class="operate flex flex-pack-end">
        <a v-for="(item, index) in publishOperates" :key="index" @click="item.fun()">
          <Icon :name="item.icon" />
        </a>
      </div>
    </div>
  </div>

  <template v-if="!isSkeleton && myFollowNum === 0">
    <CommunityVue />
    <FollowVue />
    <GuideVue />
  </template>

  <BuzzListVue
    v-model:list="list"
    :loading="isSkeleton"
    @get-more="getMore"
    :pagination="pagination"
  >
    <template #recommendCommunity>
      <CommunityVue v-if="myFollowNum > 0 && myFollowNum < 10" />
    </template>
    <template #recommendFollow>
      <FollowVue v-if="myFollowNum > 0 && myFollowNum < 10" />
    </template>
    <template #recommendGuide>
      <GuideVue v-if="myFollowNum > 0 && myFollowNum < 10" />
    </template>
  </BuzzListVue>
</template>

<script setup lang="ts">
import { GetBuzzs, GetUserFollow } from '@/api/aggregation'
import { initPagination } from '@/config'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'
import { Mitt, MittEvent } from '@/utils/mitt'
import { getOneBuzz } from '@/api/buzz'
import CommunityVue from './components/recommend/Community.vue'
import FollowVue from './components/recommend/Follow.vue'
import GuideVue from './components/recommend/Guide.vue'

// interface Props {}
// const props = withDefaults(defineProps<Props>(), {})

const pagination = reactive({ ...initPagination, timestamp: 0 })
const userStore = useUserStore()
const layoutStore = useLayoutStore()
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

      if (res.data.results.items.length === 0) pagination.nothing = true
      else pagination.nothing = false
    }
    resolve()
  })
}

Mitt.on(MittEvent.AddBuzz, async (params: { txId: string }) => {
  const res = await getOneBuzz({
    txId: params.txId,
  })
  if (res && res.code === 0) {
    list.unshift(res.data.results.items[0])
  }
})

watch(
  () => route.path,
  () => {
    isSkeleton.value = true
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    getDatas(true).then(() => {
      isSkeleton.value = false
    })
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

getUserFollow().then(() => {
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
})
</script>

<style lang="scss" scoped src="./components/HomeBuzzList.scss"></style>
