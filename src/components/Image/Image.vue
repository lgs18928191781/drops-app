<template>
  <div class="image" :class="customClass">
    <ElSkeleton :loading="isSkeleton" animated>
      <template #template>
        <ElSkeletonItem variant="image" />
      </template>
      <template #default>
        <!-- <img ref="imgRef" :data-src="url" :class="imageClass" @error="fail" loading="lazy" /> -->
        <img ref="imgRef" :src="url" :class="imageClass" @error="fail" loading="lazy" />
      </template>
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DefaultAvatar from '@/assets/images/default_avatar.png'
import DefaultMetafile from '@/assets/images/default_metafile.svg?url'
// import 'lazysizes'
import { DB } from '@/utils/db'

const Default = {
  metafile: DefaultMetafile,
  metaId: DefaultAvatar,
}

interface Props {
  src: string
  customClass?: string
  width?: number
  type?: 'metafile' | 'metaId'
}
const props = withDefaults(defineProps<Props>(), {
  width: 235,
  type: 'metafile',
})

const imgRef = ref()

const imageClass = computed(() => {
  return props.customClass ? props.customClass + ' lazyload' : 'lazyload'
})

const isSkeleton = ref(true)
const url = ref('')

watch(
  () => props.src,
  () => {
    getImageUrl()
  },
  { immediate: true }
)

async function getImageUrl() {
  isSkeleton.value = true
  let src = props.src
  DB.getMetaFile(src, props.width, 'metafile').then(res => {
    url.value = res
    isSkeleton.value = false
  })
}

function fail(event: any) {
  const img = event.srcElement
  img.src = props.type === 'metafile' ? Default.metafile : Default.metaId
  img.onerror = null // 防止闪图
}

defineExpose({
  imgRef,
})
</script>

<style lang="scss" scoped src="./Image.scss"></style>
