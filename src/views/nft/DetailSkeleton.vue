<template>
  <div class="nft-detail">
    <div class="nft-msg flex">
      <div class="cover-warp">
        <NFTCover :cover="[]" :isSkeleton="true" />
      </div>
      <div class="flex1 flex flex-v">
        <div class="flex1">
          <div class="top flex flex-align-center">
            <div class="flex1">
              <div class="collection-name flex flex-align-center">
                <ElSkeletonItem :variant="'text'" />
              </div>
            </div>
            <div class="operate-list flex flex-align-center">
              <ElSkeletonItem :variant="'text'" />
            </div>
          </div>
          <div class="name"><ElSkeletonItem :variant="'text'" /></div>

          <div class="owner flex flex-align-center">
            <ElSkeletonItem :variant="'image'" class="avatar" />
            <div class="flex1">
              <div class="owner-msg-item">
                <ElSkeletonItem :variant="'text'" />
              </div>
              <div class="owner-msg-item">
                <ElSkeletonItem :variant="'text'" />
              </div>
            </div>
          </div>

          <div class="current-price">
            <div class="title"><ElSkeletonItem :variant="'text'" /></div>
            <div class="price flex flex-align-end">
              <span class="space"><ElSkeletonItem :variant="'text'"/></span>
              <span class="curreny"><ElSkeletonItem :variant="'text'"/></span>
            </div>
          </div>
        </div>

        <div class="nft-operate flex flex-align-center">
          <ElSkeletonItem :variant="'button'" class="flex1" />
        </div>
      </div>
    </div>

    <div class="nft-other-msg flex">
      <div class="description-warp">
        <div class="nft-other-msg-section" ref="DescriptionWarpRef">
          <div class="nft-other-msg-item">
            <div class="title"><ElSkeletonItem :variant="'text'" /></div>
            <div class="content">
              <div class="description-list">
                <div class="description-item flex">
                  <span class="label"><ElSkeletonItem :variant="'text'"/></span>
                  <span class="value flex1"><ElSkeletonItem :variant="'text'"/></span>
                </div>
                <div class="description-item flex">
                  <span class="label"><ElSkeletonItem :variant="'text'"/></span>
                  <span class="value flex1"><ElSkeletonItem :variant="'text'"/></span>
                </div>
                <div class="description-item flex">
                  <span class="label"><ElSkeletonItem :variant="'text'"/></span>
                  <span class="value flex1 drsc"><ElSkeletonItem :variant="'text'"/></span>
                </div>
              </div>
            </div>
          </div>

          <div class="nft-other-msg-item">
            <div class="title hover flex flex-align-center">
              <div class="flex1"><ElSkeletonItem :variant="'text'" /></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex1">
        <div class="nft-other-msg-section flex flex-v" :style="{ height: recordWarpHeight + 'px' }">
          <div class="nft-other-msg-item flex1 flex flex-v">
            <div class="title"><ElSkeletonItem :variant="'text'" /></div>
            <div class="content flex1 flex flex-v">
              <NFTDetailRecord genesis="" codehash="" token-index="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import NFTCover from '@/components/NFTCover/NFTCover.vue'
import { onMounted, ref } from 'vue'
import NFTDetailRecord from './components/NFTDetailRecord.vue'

const DescriptionWarpRef = ref()
const recordWarpHeight = ref(0)

onMounted(() => {
  recordWarpHeight.value = DescriptionWarpRef.value.offsetHeight
})
</script>
<style lang="scss" scoped src="./DetailSkeleton.scss"></style>
