<template>
  <CardVue>
    <div class="simple-publish-share"></div>
  </CardVue>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import CardVue from '@/components/Card/Card.vue'

interface Props {
  buzz: BuzzItem
}
const props = withDefaults(defineProps<Props>(), {})

const userStore = useUserStore()
</script>

<style lang="scss" scoped></style>
