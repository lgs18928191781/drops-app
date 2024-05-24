<template>
  <div
    class="text"
    :class="{ quote: isQuote }"
    v-html="displayItemData ? $filters.buzzTextContent(displayItemData.content) : ''"
  ></div>
  <div class="translate" v-if="!isQuote">
    <template v-if="isTranslateing">
      <ElIcon class="is-loading">
        <Loading />
      </ElIcon>
    </template>
    <template v-else>
      <span @click.stop="translate">{{
        isTranslated ? $t('Buzz.repost.Show original text') : $t('Buzz.repost.Translate')
      }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

interface Props {
  buzz: BuzzItem
  isQuote?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'translate', txId: any, callback?: (result: boolean) => void): void
}>()
const isTranslateing = ref(false)
const isTranslated = ref(false)
const displayItemData = computed(() => {
  if (!props.buzz) {
    return null
  }
  switch (props.buzz.protocol) {
    case 'SimpleRePost': {
      if (props.buzz.displayType === 'quickRePost') {
        return props.buzz.quoteItem
      } else {
        return props.buzz
      }
    }
    default: {
      return props.buzz
    }
  }
})

function translate() {
  isTranslateing.value = true
  emit('translate', props.buzz.txId, (value: boolean) => {
    isTranslateing.value = false
    isTranslated.value = value
  })
}
</script>

<style lang="scss" scoped src="./BuzzItemText.scss"></style>
