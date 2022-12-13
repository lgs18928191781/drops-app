<template>
  <div
    class="forward"
    @click.stop="$router.push({ name: 'buzzDetail', params: { txId: buzz.txId } })"
  >
    <BuzzItemVue :data="buzz" :isQuote="true" />
  </div>
</template>

<script setup lang="ts">
import Attachment from './Attachment.vue'
import BuzzItemVue from './BuzzItem.vue'

interface Props {
  buzz: BuzzItem
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped src="./Quote.scss"></style>
