<template>
  <span class="user-name space-x-1">
    <MetaNameDisplay
      :name="metaName"
      :colorful="true"
      :text-class="textClass"
      v-if="metaName"
      :noTag="noTag"
    />
    <span :class="[textClass, 'truncate']" v-else>
      {{ name }}
    </span>
  </span>
</template>

<script setup lang="ts">
import MetaNameDisplay from '@/components/MetaName/Display.vue'

interface Props {
  name: string
  metaName?: string
  textClass?: string
  noTag?: boolean
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<!-- <style lang="scss" scoped src="./UserName.scss"></style> -->
