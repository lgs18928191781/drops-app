<template>
  <span class="user-name space-x-1">
    <span :class="{ 'meta-name': metaName }" class="truncate">{{
      metaName ? metaName : name
    }}</span>
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
