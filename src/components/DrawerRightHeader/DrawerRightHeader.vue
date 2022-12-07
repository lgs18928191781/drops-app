<template>
  <header class="flex flex-align-center">
    <a class="back" v-if="!isHideback" @click="emit('back')">
      <Icon name="down" />
    </a>
    <span class="title">{{ title }}</span>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  isHideback?: boolean
}>()

const emit = defineEmits(['back'])
</script>

<style lang="scss" scoped src="./DrawerRightHeader.scss"></style>
