<template>
  <div
    class="text-xs font-medium leading-none px-1 py-0.5 text-white bg-gradient-to-r from-[#F700FB] to-[#FFC051] rounded-sm shrink-0"
  >
    {{ '.' + props.type }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: 'meta',
  },
})
</script>
