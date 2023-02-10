<template>
  <div class="flex items-center gap-x-1.5">
    <div
      :class="[textClass, 'font-medium leading-loose text-lg max-w-[160PX] truncate']"
      :title="nameWithoutSuffix"
    >
      {{ nameWithoutSuffix }}
    </div>

    <MetaNameTag :ns="ns" class="text-sm !rounded" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import MetaNameTag from '@/components/MetaName/Tag.vue'

const props = defineProps(['metaName', 'textClass'])

const ns = computed(() => {
  const suffix = props.metaName.name.split('.')[1]
  if (suffix === 'eth') {
    return 'ENS'
  }

  return 'MetaName'
})

// 解析metaName，如果是ens，则截取后缀（.meta的数据不带后缀不用截取）
const nameWithoutSuffix = computed(() => {
  return props.metaName.name.split('.')[0]
})
</script>
