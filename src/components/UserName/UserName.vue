<template>
  <span class="user-name space-x-1">
    <MetaNameDisplay
      :name="metaName"
      :colorful="true"
      :text-class="textClass"
      v-if="metaName"
      :noTag="noTag"
    />
    <span :class="[textClass, 'truncate']" :title="name" v-else>
      {{ name ? name : 'metaid-user-' + subMetaId }}
    </span>
  </span>
</template>

<script setup lang="ts">
import MetaNameDisplay from '@/components/MetaName/Display.vue'
import { computed } from 'vue'
interface Props {
  name: string
  metaName?: string
  textClass?: string
  noTag?: boolean
  metaId: string
}
const props = withDefaults(defineProps<Props>(), {})
const subMetaId = computed(() => {
  return props.metaId.substr(0, 4)
})
</script>

<!-- <style lang="scss" scoped src="./UserName.scss"></style> -->
