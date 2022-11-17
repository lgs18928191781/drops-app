<template>
  <div class="pagination" v-if="pagination?.nothing || pagination?.loading">
    <div class="nothing" v-if="pagination?.loading">{{ $t('Pagination.loading') }}...</div>
    <div class="nothing" v-else>{{ $t('Pagination.nothing') }}</div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['getMore']) // 定义事件
const props = defineProps<{
  pagination: Pagination
  showMoreButton?: boolean
}>()

function moreHistroy() {
  emit('getMore')
}
</script>
<style lang="scss" scoped src="./LoadMore.scss"></style>
