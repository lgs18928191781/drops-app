<template>
  <BaseModal
    v-model="layout[ShowControl.isShowNoMetaNameModal]"
    :strict-close="true"
    :extra-close-event="goBack"
    :full-screen="true"
  >
    <template #title>
      {{ $t('Talk.Modals.no_meta_name_title') }}
    </template>

    <template #body>
      <div class="h-full flex flex-col">
        <div class="flex flex-col justify-between grow">
          <div class="flex flex-col items-center text-center mt-24 lg:mt-0">
            <img class="my-12 lg:my-8 w-36 h-36" :src="VoidImg" alt="void" />
            <p class="text-sm lg:text-base text-dark-400 dark:text-gray-200">
              {{ $t('Talk.Modals.no_meta_name') }}
            </p>
          </div>
          <div class="lg:mt-12 flex gap-x-4">
            <button
              class="main-border primary w-full py-3 text-base outline-0 font-bold dark:bg-gray-700 uppercase"
              @click="goSetting"
            >
              {{ $t('Talk.Modals.go_equip') }}
            </button>

            <button
              class="main-border w-full py-3 text-base outline-0 font-bold dark:bg-gray-700"
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
import { ShowControl } from '@/enum'
import BaseModal from '../BaseModal.vue'
import { useTalkStore } from '@/stores/talk'
import { useLayoutStore } from '@/stores/layout'
import { useRouter } from 'vue-router'

import VoidImg from '@/assets/images/void.svg?url'
import { useCommunityUpdateFormStore } from '@/stores/forms'

const layout = useLayoutStore()
const router = useRouter()
const talk = useTalkStore()

const goBack = () => {
  // 去 buzz
  router.push('/buzz')
}

const goSetting = () => {
  // 关掉当前modal，打开设置modal
  layout[ShowControl.isShowNoMetaNameModal] = false

  // 初始化表单
  const form = useCommunityUpdateFormStore()
  form.original = talk.activeCommunity
  form.name = talk.activeCommunity?.name || ''
  form.description = talk.activeCommunity?.description || ''
  layout.isShowCommunitySettingsModal = true
}
</script>
