<template>
  <div class="nft-item">
    <NFTCover :cover="['']" :isSkeleton="true" />

    <div class="name"><ElSkeletonItem :variant="'text'" /></div>
    <div class="amount"><ElSkeletonItem :variant="'text'" /></div>

    <div class="user-list">
      <div class="user-item flex flex-align-center">
        <ElSkeletonItem :variant="'p'" />
      </div>
      <div class="user-item flex flex-align-center">
        <ElSkeletonItem :variant="'p'" />
      </div>
    </div>

    <ElSkeletonItem :variant="'button'" />
  </div>
</template>

<script setup lang="ts">
import NFTCover from '../NFTCover/NFTCover.vue'
</script>

<style lang="scss" scoped src="./NFTItemSkeleton.scss"></style>
