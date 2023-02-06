<template>
  <BaseModal
    v-model="layout[ShowControl.isShowRequireNativeModal]"
    :strict-close="true"
    :extra-close-event="goBack"
    :full-screen="true"
  >
    <template #title>
      {{ $t('Talk.Modals.join_pass_channel') }}
    </template>

    <template #body>
      <div class="h-full flex flex-col">
        <div
          class="mb-10 text-center text-base italic text-link dark:text-blue-400 -mt-7"
          v-if="talk.activeChannel"
        >
          {{ '# ' + talk.activeChannel.name }}
        </div>
        <div class="flex flex-col justify-between grow">
          <div class="flex flex-col items-center text-center mt-24 lg:mt-0">
            <p class="text-sm lg:text-base text-dark-400 dark:text-gray-200">
              {{ $t('Talk.Modals.you_dont_have_native') }}
            </p>
            <div class="mt-4.5 flex space-x-2 items-center">
              <img v-if="activeChain?.icon" :src="activeChain?.icon" class="w-14 h-14 rounded" />
              <div class="flex flex-col items-start">
                <h4 class="text-2xl text-amber-400 font-bold">
                  {{ activeChain?.coinName }}
                </h4>
              </div>
            </div>
            <div class="mt-2 flex flex-col items-start text-base text-dark-400 dark:text-gray-200">
              <p>
                {{ $t('Talk.Modals.require') }}
                {{ talk.consensualNative.amount / 10 ** (activeChain?.precision || 8) }}
                {{ activeChain?.unit }}
              </p>
              <p>
                {{ $t('Talk.Modals.you_have') }}
                {{ talk.consensualNative.balance / 10 ** (activeChain?.precision || 8) }}
                {{ activeChain?.unit }}
              </p>
            </div>
          </div>

          <div class="lg:mt-12">
            <button
              class="main-border w-full py-3 text-base outline-0 font-bold dark:bg-gray-600"
              @click="goBack"
            >
              {{ $t('Talk.Modals.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import chains from '@/utils/chains'
import { ShowControl } from '@/enum'
import { useTalkStore } from '@/stores/talk'
import { useLayoutStore } from '@/stores/layout'

import BaseModal from '../BaseModal.vue'

const talk = useTalkStore()
const layout = useLayoutStore()
const router = useRouter()

const activeChain = computed(() => {
  return chains?.find(chain => chain.key === talk.consensualNative?.chain)
})

const goBack = () => {
  // 清空consensualNative
  talk.consensualNative = null
  layout.isShowRequireNativeModal = false

  // 去 index
  talk.activeChannelId = 'index'
  const welcomePage = `/talk/channels/${talk.activeCommunityId}/welcome`
  router.push(welcomePage)
}
</script>
