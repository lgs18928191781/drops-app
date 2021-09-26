<template>
  <div class="pagination">
    <div class="nothing" v-if="pagination.nothing">{{ $t('nomore') }}</div>
    <div class="nothing" v-else-if="pagination.loading">{{ $t('loading') }}</div>
    <div class="more-warp" v-else @click="getMore">
      <div class="tips">{{ $t('clickmore') }}</div>
      <div class="icon"><img src="@/assets/svg/home_icon_ins.svg" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['getMore']) // 定义事件
const props = defineProps<{
  pagination: Pagination
}>()

function getMore() {
  emit('getMore')
}
</script>
<style lang="scss" scoped src="./LoadMore.scss"></style>
