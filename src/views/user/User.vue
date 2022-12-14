<template>
  <BuzzWarpVue>
    <div class="top-warp">
      <div class="nav flex flex-align-center">
        <div class="flex1">
          <a class="back flex flex-align-center flex-pack-center" @click="$router.back()">
            <Icon name="down"></Icon>
          </a>
        </div>
        <a class="edit flex flex-align-center flex-pack-center" v-if="isSelf">
          <Icon name="edit" />
        </a>
      </div>

      <ElSkeleton :loading="isSkeleton" animated>
        <template #template>
          <div class="cover">
            <ElSkeletonItem variant="image" />
          </div>

          <div class="user">
            <div class="user-top flex flex-align-end">
              <div class="flex1">
                <div class="avatar-warp flex flex-align-center flex-pack-center">
                  <ElSkeletonItem variant="circle" />
                  <!-- <UserAvatar :meta-id="''" :image="''" :disabled="true" /> -->
                </div>
              </div>
              <div class="opreate flex-self-end">
                <ElSkeletonItem variant="button" />
                <ElSkeletonItem variant="button" />
              </div>
            </div>
            <div class="name"><ElSkeletonItem variant="text" /></div>
            <div class="metaid flex flex-align-center">
              <ElSkeletonItem variant="text" />
            </div>
            <div class="follow-list flex flex-align-center">
              <ElSkeletonItem variant="text" />
            </div>
          </div>

          <div class="tab flex flex-align-center">
            <ElSkeletonItem variant="button" v-for="(tab, index) in tabs" :key="index" />
          </div>
        </template>
        <template #default>
          <div class="cover">
            <Image :src="userInfo.val!.coverUrl" v-if="userInfo.val!.coverUrl" />
          </div>

          <div class="user">
            <div class="user-top flex flex-align-end">
              <div class="flex1">
                <div class="avatar-warp flex flex-align-center flex-pack-center">
                  <UserAvatar
                    :meta-id="userInfo.val!.metaId"
                    :image="userInfo.val!.avatarImage"
                    :disabled="true"
                  />
                </div>
              </div>
              <div class="opreate flex-self-end">
                <a class="main-border faded" v-if="isSelf">{{ $t('Message') }}</a>
                <a class="main-border primary">{{ $t('Follow') }}</a>
              </div>
            </div>
            <div class="name">{{userInfo.val!.name}}</div>
            <div class="metaid flex flex-align-center">
              <span class="id" @click="copy(userInfo.val!.metaId)"
                >MetaID: {{userInfo.val!.metaId.slice(0, 6)}}</span
              >
              <span class="tag">TX</span>
            </div>
            <div class="follow-list flex flex-align-center">
              <span class="follow-item">
                <span class="count">15</span>
                {{ $t('Following') }}
              </span>
              <span class="follow-item">
                <span class="count">15</span>
                {{ $t('Followers') }}
              </span>
            </div>
          </div>

          <div class="tab flex flex-align-center">
            <RouterLink :to="tab.params" v-for="(tab, index) in tabs" :key="index">
              {{ tab.name }}
            </RouterLink>
          </div>
        </template>
      </ElSkeleton>
    </div>

    <RouterView />
  </BuzzWarpVue>
</template>

<script setup lang="ts">
import BuzzWarpVue from '../buzz/components/BuzzWarp.vue'
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import { GetUserAllInfo, GetUserFollow } from '@/api/aggregation'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { copy } from '@/utils/util'

const i18n = useI18n()
const route = useRoute()
const userInfo: { val: null | UserAllInfo } = reactive({ val: null })
const isSkeleton = ref(true)
const userStore = useUserStore()
const userFollow: {
  following: string[]
  follers: string[]
} = reactive({
  following: [],
  follers: [],
})

const tabs = [
  {
    name: 'Buzz',
    params: {
      name: 'userBuzz',
      params: {
        metaId: route.params.metaId as string,
      },
    },
  },
  {
    name: i18n.t('Already on NFT'),
    params: {
      name: 'userNFT',
      params: {
        metaId: route.params.metaId as string,
      },
    },
  },
]

const isSelf = computed(() => {
  let result = false
  if (userStore.isAuthorized && userInfo.val && userStore.user!.metaId === userInfo.val!.metaId)
    result = true
  return result
})

function getUserInfo() {
  return new Promise<void>(async resolve => {
    const res = await GetUserAllInfo(route.params.metaId as string).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      userInfo.val = res.data
      resolve()
    }
  })
}

function getUserFoller() {
  return new Promise<void>(async resolve => {
    const res = await GetUserFollow(route.params.metaId as string).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      userFollow.following = res.data.followingList
      userFollow.follers = res.data.followedList
      resolve()
    }
  })
}

Promise.all([getUserInfo(), getUserFoller()]).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./User.scss"></style>
