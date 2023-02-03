<template>
  <div class="relative h-screen lg:flex text-base">
    <CommunityInfo />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <ChannelHeader />

      <div class="pt-12 h-screen lg:relative w-full bg-dark-200 dark:bg-gray-900 lg:pt-15">
        <router-view :key="($route.params.channelId as string)"></router-view>
      </div>

      <Transition name="slide">
        <ChannelMemberList v-show="layout.isShowMemberList" />
      </Transition>
    </div>

    <!-- modals -->
    <PasswordModal v-if="layout.isShowPasswordModal" />
    <RequireNftModal v-if="layout.isShowRequireNftModal" />
    <RequireFtModal v-if="layout.isShowRequireFtModal" />
    <InviteModal v-if="layout.isShowInviteModal" />
    <CommunityCardModal v-if="layout.isShowCommunityCardModal" />
    <AcceptInviteModal v-if="layout.isShowAcceptInviteModal" />
    <LoadingCover v-if="layout.isShowLoading" />
    <RedPacketOpenModal v-if="layout.isShowRedPacketOpenModal" />
    <RedPacketCreateModal v-if="layout.isShowRedPacketModal" />
    <RedPacketResultModal v-if="layout.isShowRedPacketResultModal" />
    <ShareToBuzzModal v-if="layout.isShowShareToBuzzModal" />
    <ShareSuccessModal v-if="layout.isShowShareSuccessModal" />
    <CommunitySettingsModal v-if="layout.isShowCommunitySettingsModal" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useTalkStore } from '@/stores/talk'
import { useLayoutStore } from '@/stores/layout'
import { isMetaName, resolveMetaName } from '@/utils/meta-name'

import ChannelHeader from './components/ChannelHeader.vue'
import CommunityInfo from './components/CommunityInfo.vue'
import ChannelMemberList from './components/ChannelMemberList.vue'
import PasswordModal from './components/modals/consensus/Password.vue'
import CommunitySettingsModal from './components/modals/community/settings/Index.vue'
import RequireNftModal from './components/modals/consensus/RequireNft.vue'
import RequireFtModal from './components/modals/consensus/RequireFt.vue'
import RedPacketOpenModal from './components/modals/red-packet/Open.vue'
import RedPacketResultModal from './components/modals/red-packet/Result.vue'
import RedPacketCreateModal from './components/modals/red-packet/Create.vue'
import AcceptInviteModal from './components/modals/invite/Accept.vue'
import InviteModal from './components/modals/invite/Invite.vue'
import CommunityCardModal from './components/modals/invite/CommunityCard.vue'
import ShareToBuzzModal from './components/modals/invite/ShareToBuzz.vue'
import ShareSuccessModal from './components/modals/invite/ShareSuccess.vue'
import LoadingCover from './components/modals/LoadingCover.vue'
import { useUserStore } from '@/stores/user'

const talk = useTalkStore()
const user = useUserStore()
const route = useRoute()
const layout = useLayoutStore()

// 初始化频道
function init(communityId: string) {
  // 如果是游客，则返回游客模式
  if (!user.isAuthorized) {
    return initGuestMode(communityId)
  }

  talk.checkMembership(communityId).then(async (isMember: boolean) => {
    if (!isMember) {
      await talk.invite(communityId)
      return
    }

    talk.initCommunity(communityId)
  })
}

// 初始化游客模式
async function initGuestMode(communityId: string) {
  console.log('guest')
  // 1. 将当前社区推入社区列表
  await talk.addTempCommunity(communityId)

  // 2. 弹出邀请框
  await talk.invite(communityId)
  return

  // 2. 弹出注册框

  // 4. 接受邀请逻辑
}

const { communityId } = route.params as { communityId: string }

// 解析 communityId 为 metaName 的情况
async function resolve(communityId: string) {
  if (isMetaName(communityId)) {
    const resolveRes = await resolveMetaName(communityId)
    init(resolveRes.communityId)
  } else {
    init(communityId)
  }
}
resolve(communityId)

watch(
  () => talk.communityStatus,
  async (status: string) => {
    if (status === 'invited') {
      return resolve(communityId)
    }
  },
  { immediate: true }
)

watch(
  [() => talk.communityStatus, () => user.isAuthorized],
  ([status, isAuthorized]) => {
    if (status === 'auth processing' && isAuthorized) {
      talk.communityStatus = 'authed'
      return resolve(communityId)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  talk.saveReadPointers()
  talk.closeReadPointerTimer()
})
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 0px;
}
</style>
