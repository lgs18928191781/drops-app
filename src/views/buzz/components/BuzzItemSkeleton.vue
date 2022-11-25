<template>
  <div class="buzz-item">
    <div class="buzz-item-warp">
      <div class="header">
        <div class="user-info">
          <div class="head">
            <ElSkeletonItem variant="circle" />
          </div>
          <div class="info">
            <div class="name">
              <ElSkeletonItem variant="text" />
            </div>
            <div class="desc">
              <ElSkeletonItem variant="text" />
            </div>
          </div>
        </div>
        <div class="operate">
          <ElSkeletonItem variant="button" />
        </div>
      </div>
      <div class="content">
        <ElSkeletonItem variant="p" />
        <ElSkeletonItem variant="p" />
        <ElSkeletonItem variant="p" />
        <ElSkeletonItem variant="p" />

        <!-- 标签 -->
        <div class="tags flex flex-align-center">
          <ElSkeletonItem variant="p" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped src="./BuzzItemSkeleton.scss"></style>
