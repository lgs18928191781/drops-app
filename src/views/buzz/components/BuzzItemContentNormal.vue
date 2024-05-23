<template>
  <!-- text -->
  <div class="content-item">
    <BuzzItemText :buzz="buzz" />
  </div>

  <!-- Attachment -->
  <div
    class="content-item"
    v-if="displayItemData && displayItemData.attachments && displayItemData.attachments.length > 0"
  >
    <Attachment
      :attachments="displayItemData.attachments"
      :playFile="playFile"
      @play="params => emit('play', params)"
    />
  </div>

  <!-- 引用buzz -->
  <!-- <div class="content-item" v-if="isHasQuote">
    <QuoteVue :buzz="buzz.quoteItem" @play="val => emit('play', val)" :playFile="playFile" />
  </div> -->
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import Attachment from './Attachment.vue'
import QuoteVue from './Quote.vue'
import BuzzItemText from './BuzzItemText.vue'

interface Props {
  buzz: BuzzItem
  playFile?: string
  isQuote?: boolean
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<{
  (e: 'play', txId: any): void
  (e: 'translate', txId: any, callback?: (result: boolean) => void): void
}>()
console.log(props.buzz)
const displayItemData = computed(() => {
  // if (!props.buzz) {
  //   return null
  // }
  // switch (props.buzz.protocol) {
  //   case 'SimpleRePost': {
  //     if (props.buzz.displayType === 'quickRePost') {
  //       return props.buzz.quoteItem
  //     } else {
  //       return props.buzz
  //     }
  //   }
  //   default: {
  //     return props.buzz
  //   }
  // }
  return props.buzz
})

const isHasQuote = computed(() => {
  let result = false
  if (props.buzz.quoteItem && !props.isQuote) {
    if (props.buzz.protocol === 'SimpleRePost') {
      if (props.buzz.displayType !== 'quickRePost') {
        result = true
      }
    } else {
      result = true
    }
  }
  return result
})

function translate() {
  console.log('translate')
}
</script>

<style lang="scss" scoped src="./BuzzItemContentNormal.scss"></style>
