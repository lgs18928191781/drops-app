<template>
  <div class="add-image-warp">
    <div class="add-image flex flex-align-center flex-pack-center">
      <div class="image-warp" v-if="attachment">
        <img :src="attachment.url" />
        <div class="remove">
          <div class="remove-bg"></div>
          <div class="name">{{ $t('NFT.Remove') }}</div>
        </div>
      </div>
      <div class="add-content" v-else>
        <input type="file" accept="image/*" @change="onChangeFile" ref="inputFileRef" />
        <Icon class="add" name="plus_2" />
        <div class="tips">{{ $t('NFT.Choose Image') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { FileToAttachmentItem } from '@/utils/util'
import { ref } from 'vue'

interface Props {
  attachment: AttachmentItem | undefined | null
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:attachment'])

const inputFileRef = ref()

async function onChangeFile(e: any) {
  const files: File[] = [...e.target.files]
  inputFileRef.value.value = ''
  const result = await FileToAttachmentItem(files[0])
  emit('update:attachment', result)
}
</script>

<style lang="scss" scoped src="./AddImageWarp.scss"></style>
