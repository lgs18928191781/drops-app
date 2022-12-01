<template>
  <div class="pay-confirm">
    <div class="nft flex">
      <div class="cover">
        <Cover :cover="[]" :is-skeleton="true"></Cover>
      </div>
      <div class="flex1">
        <div class="name"><ElSkeletonItem variant="text" /></div>
        <div class="user-list">
          <div class="user-item flex flex-align-center">
            <ElSkeletonItem variant="circle" />
            <ElSkeletonItem variant="text" />
          </div>
          <div class="user-item flex flex-align-center">
            <ElSkeletonItem variant="circle" />
            <ElSkeletonItem variant="text" />
          </div>
        </div>
      </div>
    </div>

    <div class="price-list">
      <div class="price-item flex flex-align-center">
        <div class="name flex1"><ElSkeletonItem variant="text" /></div>
        <div class="amount"><ElSkeletonItem variant="text" /></div>
      </div>
      <div class="price-item flex flex-align-center">
        <div class="name flex1"><ElSkeletonItem variant="text" /></div>
        <div class="amount"><ElSkeletonItem variant="text" /></div>
      </div>
      <div class="price-item flex flex-align-center">
        <div class="name flex1"><ElSkeletonItem variant="text" /></div>
        <div class="amount"><ElSkeletonItem variant="text" /></div>
      </div>
    </div>

    <div class="total-price flex flex-align-center">
      <div class="name flex1"><ElSkeletonItem variant="text" /></div>
      <div class="amount"><ElSkeletonItem variant="text" /></div>
    </div>

    <div class="operate flex">
      <ElSkeletonItem class="flex1" variant="button" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Cover from '../NFT/Cover.vue'
</script>

<style lang="scss" scoped src="./PayConfirmSkeleton.scss"></style>
