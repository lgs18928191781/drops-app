<template>
  <div
    :key="metaName.name"
    class="flex justify-between items-center cursor-pointer hover:bg-dark-100 dark:hover:bg-gray-900 rounded py-3 px-4 h-16"
    :class="[isSelected && 'bg-dark-100 dark:bg-gray-900']"
    @click="$emit('select', metaName)"
  >
    <MetaNameDisplay :name="metaName.name" :text-class="'!text-lg !font-medium'" />

    <!-- 选择标识 -->
    <Icon
      name="check"
      class="bg-primary rounded-full w-5 h-5 p-1 box-content text-black"
      v-if="isSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed } from 'vue'

import MetaNameDisplay from '@/components/MetaName/Display.vue'

const props = defineProps(['metaName'])
defineEmits(['select'])

const selected: any = inject('selected', ref({}))

const isSelected = computed(() => {
  if (!selected.value) return false

  return (
    props.metaName.name === selected.value.name &&
    props.metaName.tokenIndex === selected.value.tokenIndex
  )
})
</script>
