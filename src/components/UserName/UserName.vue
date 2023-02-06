<template>
  <span class="user-name">
    <span :class="{ 'meta-name': metaName }">{{ metaName ? metaName : name }}</span>
    <Icon name="tag_nft" v-if="metaName" />
  </span>
</template>

<script setup lang="ts">
interface Props {
  name: string
  metaName?: string
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped src="./UserName.scss"></style>
