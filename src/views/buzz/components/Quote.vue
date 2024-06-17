<template>
  <div
    class="forward"
    @click.stop="$router.push({ name: 'buzzDetail', params: { txId: buzz.txId } })"
  >
    <BuzzItemVue
      :data="buzz"
      :isQuote="true"
      @play="val => emit('play', val)"
      :playFile="playFile"
    />
  </div>
</template>

<script setup lang="ts">
import { useAttrs, watch } from 'vue'
import Attachment from './Attachment.vue'
import BuzzItemVue from './BuzzItem.vue'

const emit = defineEmits(['play'])
interface Props {
  buzz: BuzzItem
  playFile?: string
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped src="./Quote.scss"></style>
