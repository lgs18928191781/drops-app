<template>
  <TabPanel class="flex items-start justify-center h-full">
    <div class="w-full h-full flex items-center justify-center flex-col gap-y-8" v-if="!address">
      <img :src="CatImg" class="w-36 h-36" alt="" />
      <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
        {{ ns === 'ENS' ? $t('Talk.Modals.no_evm_address') : $t('Talk.Modals.no_mvc_address') }}
      </div>
    </div>
    <div
      v-else-if="isLoading"
      class="w-full h-full flex items-center justify-center flex-col gap-y-4"
    >
      <img :src="DogWalkingImg" class="w-48 h-48" alt="" />
      <div class="flex items-center space-x-2">
        <Icon name="loading" class="w-4 h-4 animate-spin text-dark-400 dark:!text-gray-200" />
        <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
          {{ $t('Talk.Modals.loading') }}
        </div>
      </div>
    </div>

    <div
      class="w-full h-full flex items-center justify-center flex-col gap-y-4"
      v-else-if="isError"
    >
      <img :src="ErrorImg" class="h-48 w-48 mx-auto" alt="" />
      <div class="flex gap-x-2">
        <div class="font-bold text-base">{{ $t('Talk.Errors.default') }}</div>
      </div>
    </div>

    <div
      class="w-full h-full flex items-center justify-center flex-col gap-y-8"
      v-else-if="data!.pages[0].data.length === 0"
    >
      <img :src="CatImg" class="w-36 h-36" alt="" />
      <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
        {{
          ns === 'ENS'
            ? $t('Talk.Modals.no_ens_available')
            : $t('Talk.Modals.no_meta_name_available')
        }}
      </div>
    </div>

    <div
      class="w-full h-full flex flex-col overflow-y-auto slim-scrollbar items-stretch justify-start lg:max-h-[480PX]"
      v-else
    >
      <template v-for="(group, index) in data!.pages" :key="index">
        <MetaNameItem
          v-for="metaName in validMetaNames(group)"
          :key="metaName.name + '_' + metaName.tokenIndex"
          :meta-name="metaName"
          @select="emit('select', metaName)"
        />
      </template>
      <button
        @click="() => fetchNextPage()"
        :disabled="!hasNextPage || isFetchingNextPage"
        class="text-sm text-dark-300 dark:text-gray-400"
      >
        <div v-if="isFetchingNextPage" class="py-2">...</div>
        <div v-else-if="hasNextPage" class="hover:underline py-2">{{ $t('clickmore') }}</div>
        <div v-else-if="data!.pages.length >= 2" class="py-2">{{ $t('Nothing_more_to_load') }}</div>
      </button>
    </div>
  </TabPanel>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { TabPanel } from '@headlessui/vue'
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'

import { fetchMetaNames } from '@/queries/meta-name'
import { useUserStore } from '@/stores/user'
import { initPagination } from '@/config'

import MetaNameItem from './Item.vue'

import CatImg from '@/assets/images/cat.svg?url'
import DogWalkingImg from '@/assets/images/dog_walking.svg?url'
import ErrorImg from '@/assets/images/server_down.svg?url'

const props = defineProps<{
  ns: 'MetaName' | 'ENS'
  useCase: 'community' | 'profile'
}>()
const emit = defineEmits(['select'])
const user = useUserStore()

const address = computed(() => {
  switch (props.ns) {
    case 'ENS':
      return user.user?.evmAddress
    default:
      return user.user?.address
  }
})

const validMetaNames = (group: any) => {
  if (props.ns === 'ENS') {
    return group.data.filter((item: any) => item.name !== '')
  }

  return group.data
}

const {
  isLoading,
  data,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['metaNames', { ns: props.ns, useCase: props.useCase }],
  queryFn: ({ pageParam = { flag: '' } }) =>
    fetchMetaNames(address.value!, props.ns, props.useCase, pageParam),
  getNextPageParam: lastPage => {
    // 不满一页，说明没有更多了
    if (lastPage.data.length < initPagination.pageSize) return undefined

    if (!lastPage.flag) return undefined

    return { flag: lastPage.flag }
  },
  enabled: !!address.value,
})
</script>
