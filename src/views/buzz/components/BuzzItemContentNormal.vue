<template>
  <!-- text -->
  <div
    class="text content-item"
    v-html="
      displayItemData
        ? displayItemData.content
            .replace(/\\n/g, '\n')
            .replace(
              /#.*?[\s\n\r#]{1}|#.*?$/g,
              val =>
                `<a href='/buzz/topic/${val
                  .replace('#', '')
                  .replace(/(^\s*)|(\s*$)/g, '')}' style='color:#fc6d5e' >${val}</a>&nbsp;`
            )
        : ''
    "
  ></div>

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
  <div class="content-item" v-if="buzz.quoteItem && buzz.displayType !== 'quickRePost'">
    <QuoteVue :buzz="buzz.quoteItem" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Attachment from './Attachment.vue'
import QuoteVue from './Quote.vue'

interface Props {
  buzz: BuzzItem
  playFile?: string
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<{
  (e: 'play', txId: any): void
}>()

const displayItemData = computed(() => {
  if (!props.buzz) {
    return null
  }
  switch (props.buzz.displayType) {
    case 'quickRePost': {
      return props.buzz.quoteItem || null
    }
    default: {
      return props.buzz
    }
  }
})
</script>

<style lang="scss" scoped src="./BuzzItemContentNormal.scss"></style>
