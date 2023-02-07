<template>
  <TransitionRoot
    class="fixed inset-0 bg-white dark:bg-gray-950 z-[999] flex items-center justify-center flex-col gap-y-4 text-base"
    :show="layout.isShowCheckingPass"
    enter="duration-200 ease-out"
    enter-from="opacity-50 scale-110"
    enter-to="opacity-100 scale-100"
    leave="duration-300 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <img :src="LocationSearchImg" alt="" class="h-48 w-48 -mt-12" />
    <div class="flex gap-x-2 items-center">
      <Icon name="ticket" class="w-5 h-5 animate-bounce" />
      <div class="font-bold">{{ $t('Talk.Modals.checking') }}</div>
    </div>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { TransitionRoot } from '@headlessui/vue'

import LocationSearchImg from '@/assets/images/location_search.svg?url'
import { useLayoutStore } from '@/stores/layout'

const layout = useLayoutStore()
</script>
