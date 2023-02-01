<template>
  <Listbox :modelValue="selectedChainRef" @update:modelValue="selectChain">
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full px-2 py-1 text-center focus:outline-none rounded-xl text-sm border border-solid border-dark-200 dark:border-gray-600 dark:text-gray-100 flex items-center space-x-1"
        v-slot="{ open }"
      >
        <div class="w-7.5 h-7.5 shrink-0 flex items-center justify-center">
          <img :src="selectedChainRef.icon" class="h-full" />
        </div>
        <span class="block truncate w-12 text-left capitalize">{{ selectedChainRef.name }}</span>
        <Icon
          name="chevron_right"
          :class="[
            open && 'rotate-90',
            'w-4 h-4 text-dark-400 dark:text-gray-200 transition duration-200',
          ]"
        />
      </ListboxButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0 -translate-y-1/2"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <ListboxOptions
          class="absolute mt-2 max-h-60 overflow-auto rounded-xl bg-white dark:bg-gray-700 py-2 text-base shadow-md focus:outline-none z-50 border border-solid border-dark-100 dark:border-gray-600 dark:shadow-blue-100/20"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="chain in chains"
            :key="chain.name"
            :value="chain"
            as="template"
          >
            <li
              :class="[
                'relative select-none py-2 p-7.5 text-dark-800 dark:text-gray-100 cursor-pointer flex items-center justify-between min-w-fit group w-45',
              ]"
            >
              <div class="flex items-center space-x-1">
                <div class="w-7.5 h-7.5 shrink-0 flex items-center justify-center">
                  <img :src="chain.icon" class="h-full" />
                </div>

                <span class="shrink-0 group-hover:underline">
                  {{ chain.name }}
                </span>
              </div>

              <Icon
                name="check_bold"
                v-if="selected"
                class="w-3 h-3 inline bg-primary rounded-md p-1 box-content"
              />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ref } from 'vue'

const props = defineProps<{
  chains: {
    id: number
    name: string
    icon: string
    value: string
  }[]
  selectedChain: {
    id: number
    name: string
    icon: string
    value: string
  }
}>()
const emit = defineEmits(['update:selectedChain'])

const selectedChainRef = ref(props.selectedChain)

function selectChain(value: any) {
  selectedChainRef.value = value
  emit('update:selectedChain', value)
}
</script>
