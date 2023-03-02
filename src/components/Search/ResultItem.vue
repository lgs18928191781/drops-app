<template>
  <div
    class="flex p-4 hover:bg-primary/30 dark:hover:bg-gray-700 rounded-lg items-center justify-between -mx-4"
  >
    <!-- 左侧 -->
    <div class="flex gap-x-3 items-center">
      <UserAvatar
        :image="result.avatarImage"
        :meta-id="result.metaId"
        :name="result.name"
        :meta-name="result.metaName"
        class="w-12 h-12 shrink-0 select-none"
        :disabled="true"
      />
      <div class="flex flex-col gap-y-0.5 items-start">
        <UserName
          :name="result.name"
          :meta-name="result.metaName"
          :class="'max-w-[80PX] lg:max-w-[144PX] truncate text-base font-bold'"
          :no-tag="true"
        />
        <div class="text-dark-300 dark:text-gray-400 text-xs">MetaID: {{ highlightedMetaId }}</div>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="flex gap-x-1.5 lg:gap-x-2">
      <button class="main-border the-button bg-white dark:bg-gray-700" @click="toUserHomepage">
        {{ $t('Talk.Search.home') }}
      </button>

      <button
        :class="[isFollowed ? 'faded' : 'primary', 'main-border the-button']"
        @click="switchFollow"
        :disabled="isLoading || isSwitchingFollow"
        v-if="!isMe"
      >
        <Icon
          v-if="isLoading || isSwitchingFollow"
          name="arrow_path"
          class="animate-spin w-4 h-4 mx-auto"
        />
        <span v-else>{{
          isFollowed ? $t('Talk.Channel.followed') : $t('Talk.Channel.follow')
        }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'

import { useLayoutStore } from '@/stores/layout'
import { showLoading, sleep } from '@/utils/util'
import { GetUserAllInfo, GetUserFollow } from '@/api/aggregation'
import { switchFollowUser } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import { getFollowings } from '@/queries/follow'

const router = useRouter()
const layout = useLayoutStore()
const user = useUserStore()

type SearchResult = {
  metaId: string
  name: string
  avatarImage: string
  metaName: string
  address: string
}

const props = defineProps<{
  result: SearchResult
  lastKeyword: string
}>()
const emit = defineEmits(['switching-follow'])
const selfMetaId = user!.user!.metaId
const metaId = props.result.metaId

const shortenedMetaId = computed(() => {
  return `${metaId.slice(0, 6)}`
})

const isMe = computed(() => {
  return metaId === selfMetaId
})

// 高亮化metaId中被搜索到的部分
const highlightedMetaId = computed(() => {
  const lastKeyword = props.lastKeyword

  const index = metaId.indexOf(lastKeyword)

  if (index === -1) {
    return shortenedMetaId
  }

  const matchedSixChars = metaId.slice(index, index + 6)

  return matchedSixChars
})

// 按钮点击事件
const toUserHomepage = () => {
  layout.isShowSearchModal = false

  router.push(`/user/${metaId}`)
}

// 关注相关
const isFollowed = ref(false)
const isSwitchingFollow = ref(false)

// 获取关注状态
const { isLoading, isError, data: followings } = useQuery(
  ['followings', selfMetaId],
  () => getFollowings(selfMetaId),
  {
    enabled: !!user.user,
    onSuccess: async () => {
      await nextTick()
      isFollowed.value = followings.value!.includes(metaId)
    },
  }
)

const switchFollow = async () => {
  if (isSwitchingFollow.value) return

  // 事件通知父组件，不允许关闭
  emit('switching-follow', true)

  const process = async () => {
    // 获取地址
    const res = await GetUserAllInfo(metaId)
    if (res.code !== 0) return
    const address = res.data?.address
    if (!address) return

    const params = {
      metaId: metaId,
      address,
      isFollowed: isFollowed.value,
    }
    await switchFollowUser(params, user.showWallet)

    // 等待1秒后重新获取关注状态
    await sleep(1000)
    const res2 = await GetUserFollow(selfMetaId)
    if (res2.code === 0) {
      const followings: string[] = res2.data?.followingList
      isFollowed.value = followings?.includes(metaId)
    }
  }

  await showLoading(process, isSwitchingFollow)

  // 事件通知父组件，允许关闭
  emit('switching-follow', false)
}
</script>

<style lang="css" scoped>
.the-button {
  @apply py-1.5 px-3 rounded-full w-18 font-medium text-xs lg:text-sm lg:w-24;
}
</style>
