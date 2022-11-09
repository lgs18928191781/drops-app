<template>
  <div class="overflow-x-hidden overflow-y-hidden py-4 space-y-4 px-4">
    <LoadingItem v-for="i in [1, 2, 3, 4, 5, 6]" />
  </div>
</template>

<script setup lang="ts">
import LoadingItem from './LoadingItem.vue'
</script>

<style lang=""></style>
