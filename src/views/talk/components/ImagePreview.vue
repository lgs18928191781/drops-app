<template>
  <div class="fixed inset-0 bg-black/80 h-screen w-screen z-[60]" @click="$emit('close')">
    <div class="relative h-full w-full flex items-center justify-center">
      <div class="text-white absolute right-[16PX] top-[16PX]" @click="$emit('close')">
        <Icon name="x_circle" class="w-10 h-10 text-dark-300" />
      </div>
      <div class="!w-[90%] !max-h-[80%] overflow-y-scroll pr-3 -mr-3 lg:!w-[480PX]" @click.stop="">
        <Image :src="src" customClass="w-full rounded-md" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps(['src'])
</script>

<style lang=""></style>
