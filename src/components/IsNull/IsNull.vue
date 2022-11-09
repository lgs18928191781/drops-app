<template>
  <div class="is-null flex flex-align-center flex-pack-center">
    <div class="is-null-warp">
      <NullIcon />
      <div class="tips">{{ tips }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NullIcon from '@/assets/images/null.svg'
interface Props {
  tips?: string
}

const props = withDefaults(defineProps<Props>(), {
  tips: '暂无数据',
})
</script>

<style lang="scss" scoped src="./IsNull.scss"></style>
