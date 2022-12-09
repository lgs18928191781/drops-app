<template>
  <div class="h-full overflow-y-auto">
    <div v-if="fetching" class="w-full h-full flex items-center justify-center flex-col gap-y-4">
      <img :src="DogWalking" class="w-48 h-48" alt="" />
      <div class="flex items-center space-x-2">
        <Icon name="loading" class="w-4 h-4 animate-spin text-dark-400 dark:!text-gray-200" />
        <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
          {{ $t('Talk.Modals.loading') }}
        </div>
      </div>
    </div>

    <div class="flex flex-col overflow-y-auto slim-scrollbar" v-else-if="metaNames.length > 0">
      <div
        v-for="metaName in metaNames"
        class="flex space-x-3 items-center cursor-pointer hover:bg-dark-100 dark:hover:bg-gray-900 rounded py-3 px-4"
        @click="selectMetaName(metaName)"
      >
        <div
          class="text-lg bg-clip-text text-transparent bg-gradient-to-tr from-[#F700FB] to-[#FFC051] font-bold tracking-wider"
        >
          {{ metaName.metaName }}
        </div>
        <div
          class="p-1.5 bg-gradient-to-tr from-[#F700FB] to-[#FFC051] rounded-sm leading-none text-center flex items-center justify-center"
        >
          <Icon name="N" class="w-2 h-2" />
        </div>
      </div>
    </div>

    <div class="w-full h-full flex items-center justify-center flex-col gap-y-8" v-else>
      <img :src="Cat" class="w-36 h-36" alt="" />
      <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
        {{ $t('Talk.Modals.no_meta_name_available') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Cat from '@/assets/images/cat.svg?url'
import DogWalking from '@/assets/images/dog_walking.svg?url'
import { Ref, ref, watchEffect } from 'vue'
import { showLoading } from '@/utils/util'
import { getMetaNames } from '@/api/talk'
import { useTalkStore } from '@/stores/talk'
import { useCommunityFormStore } from '@/stores/forms'
import { useLayoutStore } from '@/stores/layout'
const talk = useTalkStore()
const layout = useLayoutStore()
const form = useCommunityFormStore()

const fetching = ref(false)
const metaNames: Ref<any[]> = ref([])

const fetchMetaNames = async () => {
  const _ = await getMetaNames({ metaId: talk.selfMetaId, page: 1, pageSize: 20 })
  metaNames.value = _
}

watchEffect(async () => {
  await showLoading(fetchMetaNames, fetching)
})

const selectMetaName = (metaName: any) => {
  form.metaName = metaName
  layout.isShowChooseMetaNameModal = false
}
</script>
