<template>
  <BaseModal v-model="layout[ShowControl.isShowCommunityInfoModal]">
    <template #body>
      <div
        class="max-w-full text-sm divide-y divide-dark-100 dark:divide-gray-700 h-full flex flex-col overflow-y-auto"
      >
        <!-- 基础信息 -->
        <div class="w-full flex flex-col items-center pb-7.5">
          <Image
            :src="(talk.activeCommunity?.icon as string)"
            :custom-class="'!w-22.5 !h-22.5 rounded-4xl'"
          />

          <h4
            class="mt-3 text-lg font-bold max-w-[60%] truncate"
            :title="talk.activeCommunity?.name"
          >
            {{ talk.activeCommunity?.name }}
          </h4>

          <MetaNameDisplay
            :name="talk.activeCommunity?.metaName"
            :colorful="true"
            :text-class="'!text-sm'"
          />
        </div>

        <!-- 描述 -->
        <div class="w-full py-4.5" v-if="talk.activeCommunity?.description">
          <div class="text-dark-400 dark:text-gray-200 max-h-[256PX] overflow-y-auto">
            {{ talk.activeCommunity?.description }}
          </div>
        </div>

        <!-- 拥有者 -->
        <div class="w-full py-4.5 flex items-center justify-between" v-if="!isError">
          <div class="font-bold">
            {{ $t('Talk.Modals.owner') }}
          </div>

          <div class="flex items-center space-x-2">
            <LoadingItemSmall class="h-10" v-if="isLoading"></LoadingItemSmall>
            <div class="flex gap-x-2" v-else>
              <UserAvatar
                :image="owner!.avatarImage"
                :meta-id="owner!.metaId"
                class="w-9 h-9 shrink-0 select-none"
                :disabled="true"
              />
              <div class="">
                <h4 class="text-sm font-bold truncate max-w-[120PX]" :title="owner!.name">
                  <UserName
                    :name="owner!.name"
                    :meta-name="owner!.metaName"
                    :no-tag="true"
                  />
                </h4>
                <div class="text-xxs text-dark-300 dark:text-gray-400">
                  {{ `MetaID: ${owner!.metaId.slice(0, 6)}` }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作区：分享、离开 -->
        <div class="w-full pt-7.5 flex flex-col items-center justify-end gap-y-5 grow px-1">
          <button
            class="main-border w-full py-4 primary flex items-center justify-center font-bold text-base"
            @click="popShareModal"
          >
            <Icon name="share_arrow" class="w-5 h-5 mr-1.5" />
            <span>{{ $t('Talk.Modals.share') }}</span>
          </button>

          <button class="text-red-500 hover:underline" @click="tryLeaveCommunity">
            {{ $t('Talk.Modals.leave') }}
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'

import { ShowControl } from '@/enum'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { getCommunityOwner } from '@/queries/community-owner'
import { leaveCommunity } from '@/utils/talk'

import BaseModal from '../BaseModal.vue'
import MetaNameTag from '@/components/MetaName/Tag.vue'
import MetaNameDisplay from '@/components/MetaName/Display.vue'
import LoadingItemSmall from '../../LoadingItemSmall.vue'

const talk = useTalkStore()
const layout = useLayoutStore()
const user = useUserStore()

// 使用社区的唯一metaNameNft信息查询拥有者
const queryParams = {
  communityId: talk.activeCommunity?.id as string,
  metaName: talk.activeCommunity?.metaNameNft as string,
}
const { isLoading, isError, data: owner } = useQuery({
  queryKey: ['community-owner', queryParams],
  queryFn: () => getCommunityOwner(queryParams),
  enabled: !!talk.activeCommunity?.id,
})

// 分享
function popShareModal() {
  talk.inviteLink = `${location.origin}/talk/channels/${talk.activeCommunitySymbol}/index`
  talk.invitingChannel = {
    community: talk.activeCommunity,
    channel: null,
  }

  layout[ShowControl.isShowCommunityInfoModal] = false
  layout[ShowControl.isShowInviteModal] = true
}

// 离开
async function tryLeaveCommunity() {
  layout.isShowLoading = true
  await leaveCommunity(talk.activeCommunityId, user.showWallet)
  layout.isShowLoading = false

  // 完成后跳转回buzz页面
  window.location.href = '/buzz/index'
}
</script>
