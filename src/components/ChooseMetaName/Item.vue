<template>
  <div
    :key="metaName.name"
    class="flex justify-between items-center cursor-pointer hover:bg-dark-100 dark:hover:bg-gray-900 rounded py-3 px-4 h-16"
    :class="[metaName.name === selected?.name && 'bg-dark-100 dark:bg-gray-900']"
    @click="$emit('select', metaName)"
  >
    <MetaNameDisplay :meta-name="metaName" />

    <!-- 选择标识 -->
    <Icon
      name="check"
      class="bg-primary rounded-full w-5 h-5 p-1 box-content text-black"
      v-if="metaName.name === selected?.name"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'

import MetaNameDisplay from '@/components/MetaName/Display.vue'

const props = defineProps(['metaName'])
const emit = defineEmits(['select'])

const selected: any = inject('selected', ref({}))
</script>
