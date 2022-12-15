<template>
  <TransitionRoot :show="showControl">
    <Dialog @close="doNothing" class="relative z-50 dark:text-gray-100">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-dark-100 dark:bg-gray-900"></div>
      </TransitionChild>

      <div class="fixed inset-0 flex items-center justify-center">
        <TransitionChild
          as="template"
          enter="duration-200 ease-out"
          enter-from="opacity-50 scale-125"
          enter-to="opacity-100 scale-100"
          leave="duration-300 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-125"
        >
          <DialogPanel class="flex flex-col w-full h-full lg:w-210 py-7.5">
            <div class=" flex items-center justify-between px-7.5">
              <DialogTitle as="h3" class="text-xl text-center font-bold">
                <slot name="title"></slot>
              </DialogTitle>

              <button class="flex items-center justify-center outline-0">
                <Icon
                  name="x_mark"
                  class="w-4 h-4 text-dark-400 dark:text-gray-200 cursor-pointer rounded-full bg-gray-200 dark:bg-black p-2 box-content"
                  @click="closeModal"
                />
              </button>
            </div>

            <div
              class="mt-7.5 h-full lg:bg-white dark:lg:bg-gray-800 lg:rounded-3xl overflow-y-auto lg:shadow-lg lg:dark:shadow-blue-100/30"
            >
              <slot name="body"></slot>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps<{
  showControl: boolean
  extraCloseEvent?: any
}>()

const doNothing = () => {}

const emit = defineEmits(['update:showControl', 'update:showSecondControl'])

const closeModal = () => {
  emit('update:showControl', false)

  if (props.extraCloseEvent) {
    props.extraCloseEvent()
  }
}
</script>
