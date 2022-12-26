<template>
  <div class="banner">
    <ElSkeletonItem :variant="'image'" />
  </div>

  <!-- Hot Series -->
  <div class="nft-home-module">
    <div class="title">
      <ElSkeletonItem :variant="'text'" />
    </div>
    <div class="cont">
      <div class="hot-collection flex flex-align-center">
        <ElSkeletonItem
          class="flex1"
          :variant="'rect'"
          v-for="(item, index) in Array.from({ length: 4 })"
          :key="index"
        />
      </div>
    </div>
  </div>

  <!-- Latest Series -->
  <div class="nft-home-module">
    <div class="title"><ElSkeletonItem :variant="'text'" /></div>
    <div class="cont">
      <div class="latest-collection flex flex-align-center">
        <ElSkeletonItem
          class="flex1"
          :variant="'rect'"
          v-for="(item, index) in Array.from({ length: 3 })"
          :key="index"
        />
      </div>
    </div>
  </div>

  <!-- NFT Leaderboard -->
  <div class="nft-home-module">
    <div class="title"><ElSkeletonItem :variant="'text'" /></div>
    <div class="cont">
      <div class="leader-board">
        <ElSkeletonItem :variant="'rect'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped src="./IndexSkeleton.scss"></style>
