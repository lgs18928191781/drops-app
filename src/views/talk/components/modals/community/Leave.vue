<template>
  <BaseModal
    v-model="layout[ShowControl.isShowLeaveCommunityModal]"
    :full-screen="true"
    class="z-[999]"
  >
    <template #title>
      {{ $t('Talk.Modals.leave_club') }}
    </template>

    <template #body>
      <div class="h-full flex flex-col">
        <div class="flex flex-col justify-between grow">
          <div class="flex flex-col items-center text-center mt-24 lg:mt-0">
            <img class="my-12 lg:my-8 w-36 h-36" :src="LeaveImg" alt="void" />
            <p class="text-sm lg:text-base text-dark-400 dark:text-gray-200">
              {{ $t('Talk.Modals.leave_tip') }}
            </p>
          </div>
          <div class="flex gap-x-4 lg:mt-12">
            <button
              class="main-border primary w-full py-3 text-base outline-0 font-bold dark:bg-gray-700 uppercase"
              @click="tryLeave"
            >
              {{ $t('Talk.Modals.leave_confirm') }}
            </button>

            <button
              class="main-border w-full py-3 text-base outline-0 font-bold dark:bg-gray-700"
              @click="goBack"
            >
              {{ $t('Talk.Modals.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { ShowControl } from '@/enum'
import { leaveCommunity } from '@/utils/talk'
import { useUserStore } from '@/stores/user'

import BaseModal from '../BaseModal.vue'
import LeaveImg from '@/assets/images/leave.svg?url'

const layout = useLayoutStore()
const talk = useTalkStore()
const user = useUserStore()

const goBack = () => {
  layout[ShowControl.isShowLeaveCommunityModal] = false
}

const tryLeave = async () => {
  layout.isShowLoading = true
  await leaveCommunity(talk.activeCommunityId, user.showWallet)
  layout.isShowLoading = false

  // 完成后跳转回buzz页面
  layout.isShowLeaveCommunityModal = false
  layout.isShowNoMetaNameModal = false
  window.location.href = '/buzz/index'
}
</script>
