<template>
  <div
    class="fixed left-0 right-0 top-0 flex items-center px-4 h-12 border-b-2 border-solid border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-700 z-30 lg:h-15 lg:absolute"
  >
    <div class="max-w-[60%] flex items-center">
      <Icon
        name="bars"
        class="w-6 h-6 text-dark-800 dark:text-gray-100 shrink-0 lg:hidden mr-1"
        @click="layout.isShowLeftNav = true"
      />

      <div class="flex shrink-0 items-center">
        <UserAvatar
          :image="activeChannel?.avatarImage"
          :meta-id="activeChannel?.id"
          class="w-8 h-8 shrink-0 select-none hidden lg:block mr-2"
          :disabled="true"
        />
        <div
          class="text-base leading-tight no-wrap grow whitespace-nowrap truncate text-dark-800 dark:text-white pr-2 max-w-[35vw] lg:max-w-[600PX]"
        >
          {{ activeChannel?.name }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between grow">
      <div class="flex items-center gap-x-2" v-if="activeChannel?.id">
        <div
          class="text-xs text-dark-300 dark:text-gray-400 bg-dark-100 dark:bg-gray-800 px-3 py-1 rounded hidden lg:block"
        >
          {{ shortenMetaId(activeChannel?.id) }}
        </div>

        <div
          class="main-border primary !rounded-full px-2 py-0.5 text-xs cursor-pointer"
          :class="[isFollowed ? 'faded' : 'primary']"
          @click="trySwitchFollow"
          v-if="gotFollowStatus"
        >
          <Icon
            v-if="isSwitchingFollow"
            name="arrow_path"
            class=" w-4 h-4 animate-spin px-3 box-content"
          ></Icon>
          <span v-else>{{
            isFollowed ? $t('Talk.Channel.followed') : $t('Talk.Channel.follow')
          }}</span>
        </div>
      </div>

      <!-- 占位 -->
      <div v-else class="w-1"></div>

      <div class="shrink-0 flex items-center">
        <LoginedUserOperate />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import LoginedUserOperate from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import { useTalkStore } from '@/stores/talk'
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { switchFollowUser } from '@/utils/talk'
import { GetUserAllInfo, GetUserFollow } from '@/api/aggregation'
import { showLoading, sleep } from '@/utils/util'

const talkStore = useTalkStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const activeChannel = computed(() => talkStore.activeChannel)

const shortenMetaId = (id: string) => {
  return id.substring(0, 6) + '...' + id.substring(id.length - 6)
}

const gotFollowStatus = ref(false)
const isFollowed = ref(false)
const isSwitchingFollow = ref(false)

watch(
  () => activeChannel.value?.id,
  async id => {
    if (!id) return

    gotFollowStatus.value = false
    isFollowed.value = false

    const res = await GetUserFollow(talkStore.selfMetaId)
    if (res.code === 0) {
      const followings: string[] = res.data?.followingList
      console.log({ followings, activeChannel: activeChannel.value?.id })
      isFollowed.value = followings?.includes(activeChannel.value?.id)

      gotFollowStatus.value = true
    }
  },
  { immediate: true }
)

const trySwitchFollow = async () => {
  if (isSwitchingFollow.value) return

  const process = async () => {
    if (!activeChannel.value?.id) return

    // 获取地址
    const res = await GetUserAllInfo(activeChannel.value.id)
    if (res.code !== 0) return
    const address = res.data?.address
    if (!address) return

    const params = {
      metaId: activeChannel.value.id,
      address,
      isFollowed: isFollowed.value,
    }
    await switchFollowUser(params, userStore.showWallet)

    // 等待1秒后重新获取关注状态
    await sleep(1000)
    const res2 = await GetUserFollow(talkStore.selfMetaId)
    if (res2.code === 0) {
      const followings: string[] = res2.data?.followingList
      isFollowed.value = followings?.includes(activeChannel.value?.id)
    }
  }

  await showLoading(process, isSwitchingFollow)
}

const doNothing = () => {}
</script>

<style lang=""></style>
