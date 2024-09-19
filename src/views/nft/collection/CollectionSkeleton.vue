<template>
  <div class="collection">
    <!-- cover -->
    <ElSkeletonItem :variant="'image'" class="cover" />

    <div class="collection-content">
      <!-- collection-avatar -->
      <div class="collection-avatar">
        <ElSkeletonItem :variant="'image'" />
      </div>

      <!-- collection-msg -->
      <div class="collection-msg flex">
        <div class="flex3">
          <div class="name flex flex-align-center">
            <ElSkeletonItem :variant="'text'" />
          </div>
          <div class="creator flex flex-align-center">
            <ElSkeletonItem :variant="'text'" />
          </div>
          <div class="drsc">
            <ElSkeletonItem :variant="'p'" />
            <ElSkeletonItem :variant="'p'" />
            <ElSkeletonItem :variant="'p'" />
          </div>
        </div>
        <div class="flex1">
          <div class="statiscs-list">
            <div
              class="statiscs-item"
              v-for="(item, index) in Array.from({ length: 6 })"
              :key="index"
            >
              <div class="flex flex-align-center flex-pack-end">
                <div class="statiscs-item-warp">
                  <div class="value"><ElSkeletonItem :variant="'text'" /></div>
                  <div class="label"><ElSkeletonItem :variant="'text'" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- tab -->
      <div class="tab flex flex-align-center">
        <ElSkeletonItem
          :variant="'text'"
          v-for="(item, index) in Array.from({ length: 2 })"
          :key="index"
        />
      </div>

      <div class="screen flex flex-align-center" id="screen">
        <div class="flex1">
          <ElSkeletonItem :variant="'button'" />
        </div>
        <ElSkeletonItem :variant="'button'" class="mr-3" />
        <ElSkeletonItem :variant="'button'" />
      </div>

      <div class="collection-nft-content flex">
        <ElRow :gutter="22" class="nft-list flex1">
          <ElCol
            :xs="cell.val.xs"
            :sm="cell.val.sm"
            :md="cell.val.md"
            :lg="cell.val.lg"
            :xl="cell.val.xl"
            v-for="(item, index) in Array.from({ length: 12 })"
            :key="index"
          >
            <NFTItemVue :nft="(item as any)" @buy="buyNFT" :loading="true" />
          </ElCol>
        </ElRow>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import NFTItemVue from '@/components/NFTItem/NFTItem.vue'

const cells = [
  {
    value: 0,
    xs: 12,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4,
    icon: 'layout-grid-fill',
  },
  {
    value: 1,
    xs: 24,
    sm: 12,
    md: 8,
    lg: 8,
    xl: 6,
    icon: 'grid-fill',
  },
]
const cell = reactive({ val: cells[0] })

function buyNFT(){
  
}

</script>

<style lang="scss" scoped src="./CollectionSkeleton.scss"></style>
