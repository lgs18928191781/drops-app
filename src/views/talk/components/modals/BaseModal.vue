<template>
  <TransitionRoot :show="modelValue">
    <Dialog @close="tryClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex h-full overflow-y-hidden lg:h-auto lg:min-h-full items-center justify-center"
        >
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
              class="flex w-full h-full lg:max-w-screen-sm lg:items-stretch justify-center lg:w-auto relative lg:static lg:h-auto"
              :style="mobileSize"
            >
              <div
                class="w-full lg:max-w-screen-sm h-full bg-white lg:min-w-[456PX] lg:w-auto lg:h-auto lg:rounded-3xl relative lg:shadow-lg p-8 flex flex-col"
                :class="[mobileSize ? 'rounded' : '']"
              >
                <button
                  class="absolute top-[24PX] right-[24PX] h-6 w-6 flex items-center justify-center outline-0"
                  v-if="!noClose"
                >
                  <Icon
                    name="x_circle"
                    class="w-6 h-6 text-dark-400 cursor-pointer"
                    @click="closeModal"
                  />
                </button>

                <DialogTitle as="h3" class="text-2xl text-center font-bold w-full mt-8 lg:mt-0">
                  <slot name="title"></slot>
                </DialogTitle>

                <div class="mt-7.5 h-full">
                  <slot name="body"></slot>
                </div>
              </div>

              <TransitionRoot :show="showSecondControl" as="template">
                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-75"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-75"
                >
                  <div
                    class="w-full lg:max-w-screen-sm  bg-white lg:min-w-[456PX] lg:w-auto rounded lg:rounded-3xl lg:shadow-lg lg:ml-4 absolute inset-0 z-[65] lg:static lg:self-stretch"
                  >
                    <div class="w-full h-full relative p-8 flex flex-col">
                      <button
                        class="absolute top-[24PX] right-[24PX] flex items-center justify-center outline-0"
                      >
                        <Icon
                          name="chevron_left"
                          class="w-6 h-6 text-dark-400 cursor-pointer rounded-full bg-gray-200 p-1 box-content"
                          @click="closeSecondModal"
                        />
                      </button>

                      <DialogTitle
                        as="h3"
                        class="text-2xl text-left font-bold capitalize w-full mt-8 lg:mt-0"
                      >
                        <slot name="secondTitle"></slot>
                      </DialogTitle>

                      <div class="mt-7.5 h-full">
                        <slot name="secondBody"></slot>
                      </div>
                    </div>
                  </div>
                </TransitionChild>
              </TransitionRoot>
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
import { computed } from 'vue'

const layout = useLayoutStore()

const props = defineProps<{
  modelValue: boolean
  showSecondControl?: boolean
  strictClose?: boolean
  extraCloseEvent?: any
  mobileSize?: number
  noClose?: boolean
}>()

const tryClose = () => {
  if (props.strictClose || props.noClose) {
    return
  }

  closeModal()
}

const emit = defineEmits(['update:modelValue', 'update:showSecondControl'])

const mobileSize = computed(() => {
  if (props.mobileSize) {
    return {
      height: `${props.mobileSize}vh`,
      width: `${props.mobileSize}vw`,
      'border-radius': '4PX',
    }
  }
})

const closeModal = () => {
  emit('update:modelValue', false)
  if (props.showSecondControl) {
    emit('update:showSecondControl', false)
  }

  if (props.extraCloseEvent) {
    props.extraCloseEvent()
  }
}

const closeSecondModal = () => {
  if (props.showSecondControl) {
    emit('update:showSecondControl', false)
  }
}
</script>
