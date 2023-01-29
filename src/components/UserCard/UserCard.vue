<template>
  <div class="user-card p-3">
    <div class="header flex flex-align-center pb-4.5">
      <div class="flex1 cont">
        <div class="name">{{ name }}</div>
        <div class="metaid">MetaID:{{ metaId ? metaId.slice(0, 6) : '--' }}</div>
      </div>
      <div class="h-full flex gap-x-2">
        <button class="main-border primary !rounded-full py-1 px-3 text-xs" @click="toUser">
          {{ $t('User.Home') }}
        </button>
        <button
          class="main-border primary !rounded-full py-1 px-3 text-xs"
          :class="[isMyFollowed ? 'faded' : '']"
          v-if="userStore.user?.metaId !== metaId"
          @click="follow"
        >
          <template v-if="loading">
            <ElIcon class="is-loading">
              <Loading />
            </ElIcon>
          </template>
          <template v-else>
            {{ isMyFollowed ? $t('Cancel Follow') : $t('Follow') }}
          </template>
        </button>
      </div>
    </div>

    <UserPersonaVue class="mt-4.5" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { checkUserLogin, followUser } from '@/utils/util'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserPersonaVue from '../UserPersona/UserPersona.vue'
import { Loading } from '@element-plus/icons-vue'
import { GetUserAllInfo, GetUserFollow } from '@/api/aggregation'
import { useI18n } from 'vue-i18n'
import { Mitt, MittEvent } from '@/utils/mitt'

const props = defineProps<{
  modelValue: boolean
  metaId: string
  name: string
}>()

const router = useRouter()
const userStore = useUserStore()
const isMyFollowed = ref(false)
const loading = ref(true)
const userInfo: { val: null | UserAllInfo } = reactive({ val: null })
const i18n = useI18n()

function toUser(e: Event) {
  router.push({
    name: 'user',
    params: {
      metaId: props.metaId,
    },
  })
}

async function toMessage() {
  await checkUserLogin()
  router.push({
    name: 'talkAtMe',
    params: {
      channelId: props.metaId,
    },
  })
}

function getUserInfo() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetUserAllInfo(props.metaId).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      userInfo.val = res.data
      resolve()
    }
  })
}

function checkUserIsFollowed() {
  return new Promise<void>(async resolve => {
    if (userStore.isAuthorized) {
      const res = await GetUserFollow(userStore.user!.metaId).catch(error => {
        ElMessage.error(error.message)
      })
      if (res?.code === 0) {
        if (res.data.followingList && res.data.followingList.includes(props.metaId)) {
          isMyFollowed.value = true
        }
      }
    } else {
      isMyFollowed.value = false
    }
    resolve()
  })
}

async function follow() {
  if (loading.value) return
  loading.value = true
  const res = await followUser({
    value: !isMyFollowed.value,
    name: userInfo.val!.name,
    metaId: userInfo.val!.metaId,
    address: userInfo.val!.address,
  })
  if (res) {
    isMyFollowed.value = !isMyFollowed.value
    const message = `${!isMyFollowed.value ? i18n.t('Cancel Follow') : i18n.t('Follow')} ${i18n.t(
      'Success'
    )}`
    ElMessage.success(message)
  } else {
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  async result => {
    if (result) {
      loading.value = true
      await Promise.all([checkUserIsFollowed(), getUserInfo()])
      loading.value = false
    }
  }
)
</script>

<style lang="scss" scoped src="./UserCard.scss"></style>
