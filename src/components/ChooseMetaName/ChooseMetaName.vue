<template>
  <div class="h-full flex flex-col">
    <TabGroup>
      <TabList
        class="grid grid-cols-2 text-sm font-bold m-1 gap-x-0.5 bg-gray-100 dark:bg-gray-950 rounded-xl mb-4"
      >
        <Tab
          v-slot="{ selected }"
          v-for="tabName in Object.keys(nsTabs)"
          as="template"
          :key="tabName"
        >
          <button
            :class="[
              selected
                ? ' bg-primary border-2 border-solid border-black text-black'
                : 'border-2 border-transparent',
              'py-3 rounded-xl',
            ]"
          >
            {{ tabName }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="grow overflow-y-auto">
        <MetaNameList
          v-for="tabName in Object.keys(nsTabs)"
          :key="tabName"
          :ns="(tabName as nsType)"
          :use-case="props.useCase"
          @select="onSelect"
        />
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue'
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/vue'

import MetaNameList from './List.vue'

interface Props {
  useCase?: 'community' | 'profile'
  selected?: any
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['change'])

/** 标签 */
const nsTabs = {
  ENS: {
    key: 'ens',
  },
  MetaName: {
    key: 'metaname',
  },
}
type nsType = keyof typeof nsTabs
/** 标签 end */

const selected: any = ref(props.selected)
provide('selected', selected)
const onSelect = (metaName: MetaNameItem) => {
  selected.value = metaName

  emit('change', metaName)
}
</script>

<style lang="scss" src="./ChooseMetaName.scss"></style>
