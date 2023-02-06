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
        :key="metaName.name"
        class="flex space-x-1.5 items-center cursor-pointer hover:bg-dark-100 dark:hover:bg-gray-900 rounded py-3 px-4"
        @click="selectMetaName(metaName)"
      >
        <div class="flex1 flex flex-align-center">
          <div class="text-lg meta-name flex flex-align-center">
            {{ metaName.name }}
          </div>

          <MetaNameTag class="ml-2" />
        </div>
        <span
          class="check-warp flex flex-align-center flex-pack-center"
          v-if="metaName.name === name"
        >
          <Icon name="check" />
        </span>
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
import { reactive, Ref, ref, watchEffect } from 'vue'
import { showLoading } from '@/utils/util'
import { getMetaNames, getNewMetaNames } from '@/api/talk'
import { useTalkStore } from '@/stores/talk'
import { useCommunityFormStore } from '@/stores/forms'
import { useLayoutStore } from '@/stores/layout'
import MetaNameTag from '@/components/MetaName/Tag.vue'
import { GetUserMetaNames } from '@/api/aggregation'
import { initPagination } from '@/config'

interface Props {
  name?: string
  isShowAllMetaName?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['change'])
const talk = useTalkStore()
const layout = useLayoutStore()
const form = useCommunityFormStore()

const fetching = ref(false)
const metaNames: Ref<MetaNameItem[]> = ref([])
const pagination = reactive({ ...initPagination, flag: '' })

const fetchMetaNames = async () => {
  // const _ = await getMetaNames({ metaId: talk.selfMetaId, page: 1, pageSize: 20 })
  let res
  if (props.isShowAllMetaName) {
    res = await GetUserMetaNames({ address: talk.selfAddress, ...pagination })
  } else {
    res = await getNewMetaNames({ address: talk.selfAddress, ...pagination })
  }
  if (res.code === 0) {
    if (res.data.results.items.length) {
      metaNames.value.push(...res.data.results.items)
    } else {
      pagination.nothing = true
    }
    pagination.flag = res.data.nextFlag
  }
}

// watchEffect(async () => {
//   await showLoading(fetchMetaNames, fetching)
// })

const selectMetaName = (metaName: MetaNameItem) => {
  emit('change', metaName)
}

fetchMetaNames()
</script>

<style lang="scss" src="./ChooseMetaName.scss"></style>
