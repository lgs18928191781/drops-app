<template>
  <!-- text -->
  <div class="content-item" v-if="displayItemData?.content">
    <BuzzItemText
      :buzz="buzz"
      :isQuote="isQuote"
      @translate="(txId: any, callback: any) => emit('translate', txId, callback)"
    />
  </div>

  <div class="content-item">
    <CardVue
      :color="postTagStore.list.find(item => item.tag === buzz.postTag)?.color"
      @click.stop="toCommity"
    >
      <div class="chat">
        <div class="comminty flex flex-align-center">
          <Image :src="''" v-if="''" />
          <div class="cont flex1"></div>
        </div>
      </div>
    </CardVue>
  </div>
</template>

<script setup lang="ts">
import { usePostTagStore } from '@/stores/buzz/tag'
import { computed } from 'vue'
import BuzzItemText from './BuzzItemText.vue'

interface Props {
  buzz: BuzzItem
  isQuote?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'translate', txId: any, callback?: (result: boolean) => void): void
}>()

const postTagStore = usePostTagStore()
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

function toCommity() {}
</script>

<style lang="scss" scoped src="./BuzzItemContentShreChatMessage.scss"></style>
