<template>
  <BaseModal v-model="layout[ShowControl.isShowCommunityInfoModal]">
    <template #body>
      <div class="max-w-full text-sm divide-y divide-dark-100 dark:divide-gray-700">
        <!-- 基础信息 -->
        <div class="w-full flex flex-col items-center pb-7.5">
          <Image
            :src="(talk.activeCommunity?.icon as string)"
            :custom-class="'!w-22.5 !h-22.5 rounded-4xl'"
          />

          <h4 class="mt-3 text-lg font-bold">
            {{ talk.activeCommunity?.name }}
          </h4>

          <div class="flex items-center justify-start space-x-1 mt-1">
            <span class="meta-name truncate">{{ talk.activeCommunitySymbolInfo.name }}</span>

            <MetaNameTag :type="talk.activeCommunitySymbolInfo.suffix" />
          </div>
        </div>

        <!-- 描述 -->
        <div class="w-full py-4.5" v-if="talk.activeCommunity?.description">
          <div class="text-dark-400 dark:text-gray-200">
            {{ talk.activeCommunity?.description }}
          </div>
        </div>

        <!-- 拥有者 -->
        <div class="w-full py-4.5 flex items-center justify-between" v-if="!isError">
          <div class="font-bold">
            Owner
          </div>

          <div class="flex items-center space-x-2">
            <LoadingItemSmall class="h-10" v-if="isLoading"></LoadingItemSmall>
            <div class="flex gap-x-2" v-else>
              <UserAvatar
                :image="owner!.avatarImage"
                :meta-id="owner!.metaId"
                class="w-10 h-10 lg:w-13.5 lg:h-13.5 shrink-0 select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { useQuery, useQueryClient } from '@tanstack/vue-query'

import { ShowControl } from '@/enum'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { getCommunityOwnerByMetaNameNft } from '@/queries/community-owner'

import BaseModal from '../BaseModal.vue'
import MetaNameTag from '@/components/MetaName/Tag.vue'
import LoadingItemSmall from '../../LoadingItemSmall.vue'

const talk = useTalkStore()
const layout = useLayoutStore()

// 使用社区的唯一metaNameNft信息查询拥有者
const client = useQueryClient()
client.clear()
const { isLoading, isError, data: owner } = useQuery({
  queryKey: ['communityOwner', talk.activeCommunity?.metaNameNft as string],
  queryFn: ({ queryKey }) => getCommunityOwnerByMetaNameNft(queryKey[1]),
  enabled: !!talk.activeCommunity?.id,
})
</script>
