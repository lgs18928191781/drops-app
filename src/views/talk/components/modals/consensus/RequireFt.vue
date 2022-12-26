<template>
  <BaseModal
    v-model="layout[ShowControl.isShowRequireFtModal]"
    :strict-close="true"
    :extra-close-event="goBack"
    :full-screen="true"
  >
    <template #title>
      {{ $t('Talk.Modals.consensus_required') }}
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
              {{ $t('Talk.Modals.you_dont_have_ft') }}
            </p>
            <!-- <div class="mt-4.5 flex space-x-4 items-center">
              <Image :src="talk.consensualFt?.icon" customClass="!w-14 !h-14 rounded" />
              <div class="flex flex-col items-start">
                <h4 class="text-2xl text-dark-800 dark:text-white font-bold">
                  {{ talk.consensualFt?.name }}
                </h4>
                <p class="text-sm text-amber-400 uppercase font-medium">
                  {{ talk.consensualFt.chain }}
                </p>
              </div>
            </div> -->
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
import { ShowControl } from '@/enum'
import BaseModal from '../BaseModal.vue'
import { useTalkStore } from '@/stores/talk'
import { useLayoutStore } from '@/stores/layout'
import { useRouter } from 'vue-router'

const talk = useTalkStore()
const layout = useLayoutStore()
const router = useRouter()

const goBack = () => {
  // 清空consensualFt
  talk.consensualFt = null
  layout.isShowRequireFtModal = false

  // 去 the-void
  const theVoid = `/talk/channels/${talk.activeCommunityId}/the-void`
  router.push(theVoid)
}
</script>
