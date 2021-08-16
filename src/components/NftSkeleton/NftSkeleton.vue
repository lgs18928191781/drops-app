<template>
        <ElSkeleton :loading="loading" animated :count="count">
          
          <template v-slot:template="slotProps">
            <template v-if="slotProps.key === 1 && props.isReCommend">
              <!-- @ts-ignore -->
              <NftItem
                :isRecommendCard="true"
                :item="{
                  name: 'recommend',
                  amount: 0,
                  foundryName: '',
                  classify: '',
                  tokenId: '',
                  coverUrl: '',
                  metaId: '',
                }"
              />
            </template>
            <template v-else>
              <div class="nft-item">
                <div class="cover">
                  <ElSkeletonItem class="cover-image flex flex-align-center flex-pack-center" variant="image" />
                </div>
                <div class="cont">
                  <div><ElSkeletonItem class="title" variant="text" style="width: 75%;  background: #F2F4F7;" /></div>
                  <div class="center"><ElSkeletonItem variant="text" style="width: 40%;" /></div>
                  <div class="bottom"><ElSkeletonItem variant="text" style="width: 27%;" /></div>
                </div>
              </div>
            </template>
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
        isReCommend?: boolean
    }>()
</script>

<style lang="scss" scoped src="./NftSkeleton.scss"></style>