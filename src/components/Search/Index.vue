<template>
  <TransitionRoot :show="layout.isShowSearchModal">
    <Dialog @close="tryClose" class="relative z-[60] text-dark-800 dark:text-gray-100">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="h-full overflow-y-hidden lg:h-auto lg:min-h-full p-4 lg:p-[12vh]">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-75"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-75"
          >
            <DialogPanel
              class="w-full max-w-[768PX] mx-auto rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all text-sm"
            >
              <div class="w-full relative">
                <input
                  type="text"
                  class="main-border field-input faded-switch still dark:!text-gray-100 !pr-14 placeholder:truncate"
                  :placeholder="$t('Talk.Search.placeholder')"
                  v-model="searchKeyword"
                />
                <div class="absolute inset-y-0 right-0 flex items-center">
                  <button class="p-[12PX] main-border primary" @click="search">
                    <Icon name="search" class="w-5 h-5 text-dark-800" />
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { ref } from 'vue'

import { useLayoutStore } from '@/stores/layout'

const layout = useLayoutStore()

const tryClose = () => {
  layout.isShowSearchModal = false
}

// 搜索
const searchKeyword = ref('')
const search = async () => {
  if (searchKeyword.value) {
    console.log('search', searchKeyword.value)
  }
}
</script>
