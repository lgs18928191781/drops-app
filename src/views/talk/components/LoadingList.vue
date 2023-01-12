<template>
  <div class="overflow-x-hidden overflow-y-hidden py-4 space-y-4 px-4">
    <LoadingItem v-for="i in items" />
  </div>
</template>

<script setup lang="ts">
import LoadingItem from './LoadingItem.vue'
import { ref, Ref } from 'vue'

const props = defineProps({
  itemCount: {
    type: Number,
    default: 6,
  },
})

const items: Ref<number[]> = ref([])
for (let i = 1; i <= props.itemCount; i++) {
  items.value.push(i)
}
</script>

<style lang=""></style>
