<template>
  <div class="h-full overflow-y-scroll py-4 overflow-x-hidden space-y-8 px-4">
    <LoadingListItem v-for="i in [1, 2, 3, 4, 5, 6]" />
  </div>
</template>

<script setup lang="ts">
import LoadingListItem from './LoadingListItem.vue';
</script>

<style lang="">
  
</style>