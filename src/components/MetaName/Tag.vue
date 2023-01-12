<template>
  <!-- <div class="relative w-9.5 h-4 shrink-0">
    <Icon name="tag_nft" class="w-full h-full z-20 absolute" />
    <div
      class="absolute inset-0 bg-gradient-to-r from-[#F700FB] to-[#FFC051] rounded-3xl blur opacity-100 -translate-x-0.5 -translate-y-0.5 z-10"
    ></div>
  </div> -->

  <div
    class="text-xs font-medium leading-none p-1 text-white bg-gradient-to-r from-[#F700FB] to-[#FFC051] rounded-sm shrink-0"
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
