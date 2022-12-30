<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <template #template>
      <div class="nft-cover" :class="{ 'none-radius': !isRadius }">
        <ElSkeletonItem variant="image" />
      </div>
    </template>
    <template #default>
      <div class="nft-cover" :class="{ 'none-radius': !isRadius }" @click="preview">
        <span class="remint" v-if="isRemint">已合成</span>
        <!-- 附件类型 -->
        <template v-if="attachment && isShowAttachmentIcon">
          <img
            class="attachment-icon"
            :src="attachmentIcon[attachmentType]"
            @click="showAttachment"
            v-if="!isApp || (isApp && attachmentType !== 'glb')"
          />
        </template>
        <!-- 双面的封面 -->
        <div class="cube" v-if="emptyCover.length > 1">
          <img :src="$filters.metafile(emptyCover[0], width)" ref="imgRef" @click.stop="change" />
        </div>
        <!-- 正常封面 -->
        <Image class="cover-image" v-else :src="emptyCover[0]" :width="width" />
        <!-- <a :href="emptyCover[0]"><img :src="emptyCover[0]" class="image"/></a> -->
        <!-- <ElImage
          v-else
          fit="contain"
          :lazy="true"
          :src="$filters.metafile(cover[0], size)"
          :preview-src-list="isShowPrew ? [$filters.metafile(cover[0], -1)] : []"
        /> -->
      </div>
    </template>
  </ElSkeleton>
</template>
<script setup lang="ts">
import { metafile } from '@/utils/filters'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import './ct_effect'
import './ct_effect_cube'
import ThreeDIcon from '@/assets/images/tab_icon_3d.svg?url'
import GIFIcon from '@/assets/images/tab_icon_gif.svg?url'
import { trim } from '@/utils/util'
import { isApp } from '@/stores/root'

const attachmentIcon: { [key: string]: string } = {
  gif: GIFIcon,
  glb: ThreeDIcon,
}

interface Props {
  cover: string[]
  isLazy?: boolean
  isShowPrew?: boolean
  isShowAttachmentIcon?: boolean
  isRemint?: boolean
  isSkeleton?: boolean
  isRadius?: boolean
  attachment?: string // 附件
  isShowAttachment?: boolean // 是否显示附件
  width?: number
}
const props = withDefaults(defineProps<Props>(), {
  isLazy: true,
  isShowPrew: false,
  isSkeleton: false,
  isShowAttachmentIcon: true,
  isRadius: true,
  width: 235,
})

const emit = defineEmits(['showAttachment', 'showPreview'])

const attachmentType = computed(() => {
  let type = ''
  if (props.attachment) {
    type = props.attachment.split('.')[props.attachment.split('.').length - 1]
    type = trim(type)
  }
  return type
})

const imgRef = ref()
const currentImaIndex = ref(0)
const isChangeing = ref(false)

function change() {
  if (isChangeing.value) return
  isChangeing.value = false
  currentImaIndex.value = currentImaIndex.value ? 0 : 1
  imgRef.value
    .execEffect({
      animate: 'cube', // 动画类型
      target: metafile(emptyCover.value[currentImaIndex.value], props.width), // 替换的新图片
    })
    .then(() => {
      isChangeing.value = false
    })
}

const emptyCover = computed(() => {
  return props.cover.filter(item => {
    if (item) return item
  })
})

function showAttachment(event: Event) {
  if (props.isShowAttachment) {
    emit('showAttachment')
    event.stopPropagation()
  }
}

function preview() {
  if (props.isShowPrew) {
    emit('showPreview')
  }
}
</script>

<style lang="scss" scoped src="./NFTCover.scss"></style>
