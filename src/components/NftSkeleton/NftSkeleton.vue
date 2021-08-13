<template>
        <ElSkeleton :loading="loading" animated :count="count">
          <template v-slot:template="slotProps">
            <div class="nft-item">
              <div class="cover">
                <ElSkeletonItem class="cover-image flex flex-align-center flex-pack-center" variant="image" />
              </div>
              <div class="cont">
                <ElSkeletonItem variant="text" style="height: 24px;" />
                <div class="">
                    <div><el-skeleton-item variant="text" style="height: 17px; width: 24px;"  /></div>
                    <div><el-skeleton-item variant="text" style="height: 17px; width: 48px;"  /></div>
                </div>
                <div class="flex flex-align-center">
                    <ElSkeletonItem style="width: 20px; height: 20px; margin-right: 10px;" variant="circle " />
                    <div class="flex1"><ElSkeletonItem variant="text" style="width: 42px; height: 20px;" /></div>
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
    import NftItem from '@/components/Nft-item/Nft-item.vue'
    const props = defineProps<{
        loading: boolean,
        count: number,
        isSelf?: boolean
    }>()
</script>

<style lang="scss" scoped src="./NftSkeleton.scss"></style>