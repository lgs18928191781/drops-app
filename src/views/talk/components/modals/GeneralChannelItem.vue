<template>
  <div class="w-full flex flex-col py-4.5">
    <div class="w-full flex justify-between items-center gap-x-2">
      <div class="flex flex-col gap-y-1.5">
        <div class="flex items-center justify-start gap-x-1.5">
          <h4 class="text-lg font-medium">{{ $t(channel.nameKey) }}</h4>
          <label
            class="text-dark-300 dark:text-gray-400 bg-dark-100 dark:bg-gray-900 rounded py-0.5 px-1.5 text-xs"
          >
            {{ lvlLabel }}
          </label>
        </div>
        <p class="text-dark-300 dark:text-gray-400">
          {{ $t(channel.descriptionKey) }}
        </p>
      </div>

      <!-- add button -->
      <button
        :class="addBtnClass"
        :disabled="addStatus !== AddStatus.canAdd"
        @click="tryAddChannel"
      >
        {{ $t('Talk.General.add_channel') }}
      </button>
    </div>

    <div class="w-full text-red-500 mt-2" v-if="isError">{{ errorMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { sleep } from '@/utils/util'
import { useLayoutStore } from '@/stores/layout'
import { createDao as addGeneralChannel } from '@/queries/general-channel'

interface Channel {
  name: string
  nameKey: string
  lvl: number
  descriptionKey: string
}

enum AddStatus {
  added = 'added',
  canAdd = 'canAdd',
  cannotAdd = 'cannotAdd',
}

const props = defineProps<{ channel: Channel }>()

const currentLvl = 1

const lvlLabel = computed(() => {
  return `Lvl ${props.channel.lvl}`
})

/** 加入状态相关 */
const hasAdded = computed(() => {
  return false
})

const canAdd = computed(() => {
  return currentLvl >= props.channel.lvl
})

const addStatus = computed(() => {
  if (hasAdded.value) {
    return AddStatus.added
  }
  if (canAdd.value) {
    return AddStatus.canAdd
  }

  return AddStatus.cannotAdd
})

const addBtnClass = computed(() => {
  const common = 'text-lg rounded-md py-1.5 px-3 font-medium shrink-0'
  let conditional = ''
  switch (addStatus.value) {
    case AddStatus.added:
      conditional = 'bg-dark-100 text-dark-300 dark:bg-gray-600 dark:text-gray-400'
      break
    case AddStatus.canAdd:
      conditional = 'bg-primary text-dark-800'
      break
    case AddStatus.cannotAdd:
      conditional = 'bg-dark-100 text-dark-300 dark:bg-gray-600 dark:text-gray-400'
      break
    default:
      conditional = ''
  }
  return `${common} ${conditional}`
})
/** 加入状态相关 - end */

/** 加入频道 */
const layout = useLayoutStore()
const isError = ref(false)
const errorMsg = ref('')

const { mutate } = useMutation({
  mutationFn: addGeneralChannel,

  onError: async (error: Error) => {
    layout.isShowLoading = false
    isError.value = true
    errorMsg.value = error.message
    await sleep(3000)
    isError.value = false
  },
  onSettled: () => (layout.isShowLoading = false),
})

const tryAddChannel = () => {
  // if (addStatus.value !== AddStatus.canAdd) {
  //   return
  // }

  // layout.isShowLoading = true

  // mutate()

  // 弹出对应的创建modal
  enum Modals {
    isShowCreateDaoModal = 'isShowCreateDaoModal',
  }
  layout.isShowCreateGeneralChannelModal = false
  const modalKey = `isShowCreate${props.channel.name}Modal` as Modals
  layout[modalKey] = true
}
</script>
