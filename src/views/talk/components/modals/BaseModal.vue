<template>
  <TransitionRoot :show="layoutStore[showControl]">
    <Dialog @close="layoutStore[showControl] = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-transparent lg:bg-black/30"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex h-full lg:h-auto lg:min-h-full items-center justify-center text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="flex w-full h-full max-w-md items-center justify-center lg:w-auto">
              <div
                class="w-full max-w-sm h-full rounded bg-white lg:min-w-[456PX] lg:w-auto lg:h-auto lg:rounded-3xl relative lg:shadow-lg p-8"
              >
                <button
                  class="absolute top-[32PX] right-[32PX] h-6 w-6 flex items-center justify-center outline-0"
                >
                  <Icon
                    name="x_circle"
                    class="w-6 h-6 text-dark-400 cursor-pointer"
                    @click="layoutStore[showControl] = false"
                  />
                </button>

                <DialogTitle as="h3" class="text-2xl text-center font-bold capitalize">
                  <slot name="title"></slot>
                </DialogTitle>

                <div class="mt-7.5">
                  <slot name="body"></slot>
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
import { useLayoutStore } from '@/stores/layout'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ShowControl } from '@/enum'

const layoutStore = useLayoutStore()

const props = defineProps<{
  showControl: ShowControl
}>()
</script>
