<template>
  <div class="add-image-warp  " v-if="!onlyFileName">
    <div class="add-image  main-border gray flex flex-align-center flex-pack-center">
      <div class="image-warp" v-if="attachment">
        <img :src="attachment.url" />
        <div class="remove" @click="emit('update:attachment', undefined)">
          <div class="remove-bg"></div>
          <div class="name">{{ $t('NFT.Remove') }}</div>
        </div>
      </div>

      <div class="add-content" v-else>
        <input type="file" accept="image/*" @change="onChangeFile" ref="inputFileRef" />
        <Icon class="add" name="plus_2" />
        <!-- <div class="tips">{{ $t('NFT.Choose Image') }}</div> -->
      </div>
    </div>
  </div>

  <div v-else class="main-border h-14  gray cursor-pointer flex flex-align-center flex-pack-center">
    <div class="file-wrap ">
      <input type="file" accept="image/*" @change="onChangeFile" ref="inputFileRef" />
      <span class="text-[#303133] font-medium">{{
        attachment?.fileName ?? $t('Nfts.lanuch_upload')
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { FileToAttachmentItem } from '@/utils/util'
import { ref } from 'vue'

interface Props {
  attachment: AttachmentItem | undefined | null
  onlyFileName: boolean
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
