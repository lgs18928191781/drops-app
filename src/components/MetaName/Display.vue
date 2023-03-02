<template>
  <div class="flex items-center gap-x-1">
    <div
      :class="[textClass, colorful && colors, 'font-medium  max-w-[140PX] truncate']"
      :title="nameWithoutSuffix"
    >
      {{ nameWithoutSuffix }}
    </div>

    <MetaNameTag v-if="!noTag" :ns="ns" class="!rounded" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import MetaNameTag from '@/components/MetaName/Tag.vue'

const props = defineProps(['name', 'textClass', 'colorful', 'noTag'])

const ns = computed(() => {
  const suffix = props.name.split('.')[1]
  if (suffix === 'eth') {
    return 'ENS'
  }

  return 'MetaName'
})

// 解析metaName，如果是ens，则截取后缀（.meta的数据不带后缀不用截取）
const nameWithoutSuffix = computed(() => {
  return props.name.split('.')[0]
})

const colors = computed(() => {
  switch (ns.value) {
    case 'ENS':
      return 'meta-name ens'
    default:
      return 'meta-name'
  }
})
</script>
