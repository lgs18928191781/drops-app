<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <template #template>
      <div class="cover">
        <ElSkeletonItem variant="image" />
      </div>
    </template>
    <template #default>
      <div class="cover">
        <span class="remint" v-if="isRemint">{{ $t('isReminted') }}</span>
        <div class="cube" v-if="emptyCover.length > 1">
          <img :src="$filters.metafile(emptyCover[0])" ref="imgRef" @click.stop="change" />
        </div>

        <Image :src="emptyCover[0]" v-else />

        <!-- <ElImage
          v-else
          fit="contain"
          :lazy="true"
          :src="$filters.metafile(cover[0])"
          :preview-src-list="
            isShowPrew
              ? [
                  needGizp
                    ? $filters.metafile(cover[0].split('?')[0], -1)
                    : $filters.metafile(cover[0], -1),
                ]
              : []
          "
        /> -->
      </div>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { metafile } from '@/utils/filters'
import { computed, ref } from 'vue'
import './ct_effect'
import './ct_effect_cube'
interface Props {
  cover: string[]
  secondCover?: string
  isLazy?: boolean
  isShowPrew?: boolean
  isRemint?: boolean
  isSkeleton?: boolean
  isBlindBox?: ConstrainBoolean
  isShowSaleOut?: boolean
  needGizp?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isLazy: true,
  isShowPrew: false,
  isSkeleton: false,
  isBlindBox: false,
  isShowSaleOut: true,
  needGizp: false,
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
      target: metafile(emptyCover.value[currentImaIndex.value]), // 替换的新图片
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
</script>

<style lang="scss" scoped src="./Cover.scss"></style>
