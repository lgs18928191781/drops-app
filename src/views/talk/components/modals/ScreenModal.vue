<template>
  <div class="fixed inset-0 fullscreen w-screen z-50 bg-white">
    <div class="p-4 w-full flex justify-between items-center">
      <div class="text-xl font-medium">{{ props.name }}</div>
      <Icon name="x_mark" class="w-6 h-6 text-dark-400" @click="$emit('closeModal')" />
    </div>

    <p class="px-4 text-base">{{ props.description }}</p>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps(['name', 'description'])
</script>
<style lang=""></style>
