<template>
        <ElSkeleton :loading="loading" animated :count="count">
          <template #template>
            <div class="nft-item">
              <div class="cover">
                <ElSkeletonItem class="cover-image flex flex-align-center flex-pack-center" variant="image" />
              </div>
              <div class="cont">
                <el-skeleton-item variant="text" class="name" />
                <div class="price">
                    <el-skeleton-item variant="text" class="label" />
                    <el-skeleton-item variant="text" class="aount" />
                </div>
                <div class="author flex flex-align-center">
                    <ElSkeletonItem class="" variant="image" />
                    <el-skeleton-item variant="text" class="username" />
                </div>
                <div class="operate" v-if="props.isSelf">
                    <el-skeleton-item variant="button" class="btn btn-min btn-plain" />
                </div>
              </div>
            </div>
          </template>
          <slot></slot>
        </ElSkeleton>
</template>
<script lang="ts" setup>
    import { ElSkeleton, ElSkeletonItem } from 'element-plus'
    import { computed, defineProps } from 'vue'

    const props = defineProps<{
        loading: boolean,
        count: number,
        isSelf?: boolean
    }>()
</script>

<style lang="scss" scoped src="./NftSkeleton.scss"></style>