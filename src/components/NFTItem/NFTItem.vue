<template>
  <div class="nft-item">
    <NFTCover :cover="['']" />

    <div class="name">MetaBot NFT Avatar</div>
    <div class="amount">0.86 Space</div>

    <div class="user-list">
      <div class="user-item flex flex-align-center">
        <UserAvatar :meta-id="''" :image="''" />
        <div class="flex1 flex flex-align-center info">
          <span class="user-name">ShowPayTeam ShowPayTeam</span>
          <span class="role">({{ $t('NFT.Creater') }})</span>
        </div>
      </div>
      <div class="user-item flex flex-align-center">
        <UserAvatar :meta-id="''" :image="''" />
        <div class="flex1 flex flex-align-center info">
          <span class="user-name">ShowPayTeam ShowPayTeam</span>
          <span class="role">({{ $t('NFT.Owner') }})</span>
        </div>
      </div>
    </div>

    <div class="main-border primary">
      {{ $t('NFT.Buy Now') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import NFTCover from '../NFTCover/NFTCover.vue'
</script>

<style lang="scss" scoped src="./NFTItem.scss"></style>
