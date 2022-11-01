<template>
  <svg aria-hidden="true" :class="iconClass">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'Icon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#fff',
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const iconClass = computed(() => {
      return props.customClass ? props.customClass + ' icon' : 'icon'
    })

    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId, iconClass }
  },
})
</script>
