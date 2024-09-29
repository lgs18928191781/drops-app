<template>
  <div class="p-4.5 bg-[#1A1B18] rounded-xl relative">
    <div class="header flex flex-col  ">
      <div class="flex1 flex flex-row cont mr-2">

            <UserAvatar
            :image="connectionStore.userInfo.avatarId || connectionStore.last.user.avatarId"
            :meta-id="connectionStore.userInfo!.metaid"
            :name="connectionStore.userInfo!.name || connectionStore.last.user.name"
            class="user-warp-item overflow-hidden mr-3"
            :meta-name="''"
            :disabled="true"
          />
        <div class="flex flex-col text-[#fff]">
          <div class="text-base "><UserName    :name="connectionStore.userInfo!.name || connectionStore.last.user.name" :meta-name="''" /></div>
          <div class="text-xs text-dark-300">MetaID: {{ connectionStore.userInfo!.metaid ? connectionStore.userInfo!.metaid.slice(0, 6) : '--' }}</div>
        </div>
      </div>
      <div class="h-full flex gap-x-2">
        <!-- <button class="main-border primary !rounded-full py-1 px-3 text-xs" @click="toUser">
          {{ i18n.t('User.Home') }}
        </button> -->
        <!-- <button class="main-border primary !rounded-full py-1 px-3 text-xs" @click="toChat">
          {{ i18n.t('User.Chat') }}
        </button> -->
        <!-- <button
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
            {{ isMyFollowed ? i18n.t('Cancel Follow') : i18n.t('Follow') }}
          </template>
        </button> -->
      </div>
      <div class="flex cursor-pointer mt-10 flex-row items-center justify-between hover:opacity-80">
        <span class="text-base">Profile</span>
        <el-icon color="#A9A8AC" :size="12"><ArrowRightBold /></el-icon>
      </div>
      <div @click="logout" class="flex cursor-pointer text-base mt-7 items-center justify-center hover:opacity-80">
        <span class="disconnet">Disconnect</span>
      </div>
    </div>

    <!-- <UserPersonaVue class="mt-4.5" :i18n="propsI18n" /> -->

    <div class="close flex flex-align-center flex-pack-center" @click.stop="$emit('hide')">
      <Icon name="x_mark" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { checkUserLogin, followUser } from '@/utils/util'
import { reactive, ref, watch } from 'vue'
import UserPersonaVue from '../UserPersona/UserPersona.vue'
import { Loading } from '@element-plus/icons-vue'
import { GetUserAllInfo, GetUserFollow } from '@/api/aggregation'
import { useI18n } from 'vue-i18n'
import { Mitt, MittEvent } from '@/utils/mitt'
import { router } from '@/router'
import {useConnectionStore} from '@/stores/connection'
import { ArrowRightBold } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps<{
  modelValue: boolean
  metaId: string
  name: string
  metaName?: string
  i18n?: any
}>()

const userStore = useUserStore()
const isMyFollowed = ref(false)
const loading = ref(true)
const userInfo: { val: null | UserAllInfo } = reactive({ val: null })
const propsI18n = props.i18n
const i18n = props.i18n ? props.i18n.global : useI18n()
const emit = defineEmits(['hide'])
const connectionStore=useConnectionStore()

const route = useRoute()
function toUser(e: Event) {
  console.log(props.metaId)
  // router.push({
  //   name: 'user',
  //   params: {
  //     metaId: props.metaId,
  //   },
  // })
  // emit('hide')
  window.open(`${import.meta.env.VITE_METAID_URL}/${props.metaId}`, '_blank')
}

function logout(){
  setTimeout(() => {
        userStore.logout(route)
      }, 500)
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
    const message = `${
      !isMyFollowed.value ? i18n.i18n.t('Cancel Follow') : i18n.i18n.t('Follow')
    } ${i18n.i18n.t('Success')}`
    ElMessage.success(message)
  } else {
    loading.value = false
  }
}

function toChat() {
  console.log(props.metaId)
  router.push(`/talk/channels/@me/${props.metaId}`)
}

watch(
  () => props.modelValue,
  async result => {
    if (result) {
      loading.value = true
      await Promise.all([checkUserIsFollowed(), getUserInfo()])
      loading.value = false
    }
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.relative {
  .close {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: var(--color-primary);
    box-shadow: 3px 3px 0 rgba(var(--color-primaryRgb), 0.5);
    position: absolute;
    margin-left: -35px;
    left: 50%;
    bottom: 0;
    margin-bottom: 60px;
    display: none;

    .icon {
      width: 40px;
      height: 40px;
      color: var(--themeBtnTextColor);
      :deep(use) {
        fill: var(--themeBtnTextColor);
        stroke: var(--themeBtnTextColor);
        stroke-width: 2px;
      }
    }
  }
}

.user-warp-item {
    width: 46px ;
    height: 46px;
    border-radius: 50%;
}
.disconnet{
  background: linear-gradient(100deg, #825AFC 0%, #EB4C93 99%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-fill-color: transparent;
}

@media screen and (max-width: 750px) {
  .relative {
    .close {
      display: flex;
    }
  }
}
</style>
