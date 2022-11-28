<template>
  <div class="card">
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-shadow" :style="{ background: color }"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  color?: string
}
const i18n = useI18n()

const props = withDefaults(defineProps<Props>(), {
  color: '#37FDAB',
})
</script>

<style lang="scss" scoped src="./Card.scss"></style>
