<template>
  <div
    :class="[colors, 'text-xs font-medium leading-none px-1 py-0.5 text-white rounded-sm shrink-0']"
  >
    {{ '.' + suffix }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  ns: {
    type: String,
    default: 'MetaName',
  },
})

const suffix = computed(() => {
  switch (props.ns) {
    case 'ENS':
      return 'eth'
    default:
      return 'metaid'
  }
})

const colors = computed(() => {
  switch (props.ns) {
    case 'ENS':
      return 'bg-gradient-to-br from-[#4F40F5] to-[#7EDFFA]'
    default:
      return 'bg-gradient-to-r from-[#F700FB] to-[#FFC051]'
  }
})
</script>
