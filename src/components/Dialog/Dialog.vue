<template>
  <ElDialog
    :model-value="modelValue"
    class="sm none-padding"
    :close-on-click-modal="false"
    :title="$t('NFT.Order Information')"
  >
    <div class="nft-buy">
      <NFTMsgVue :nft="nft" />

      <div class="nft-msg-list">
        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Creater') }}：</div>
          <div class="value flex flex-align-center">
            <UserAvatar :meta-id="nft.nftIssueMetaId" :image="nft.nftIssueAvatarImage" />{{
              nft.nftIssuer
            }}
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Create Time') }}：</div>
          <div class="value flex flex-align-center">
            {{ $filters.dateTimeFormat(nft.nftTimestamp) }}
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.NFT Details') }}：</div>
          <div class="value flex flex-align-center">
            <Icon name="down" />
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Payment Method') }}：</div>
          <div class="value flex flex-align-center">
            <UserAvatar :meta-id="nft.nftIssueMetaId" :image="nft.nftIssueAvatarImage" />{{
              nft.nftIssuer
            }}
          </div>
        </div>
      </div>

      <a class="operate main-border primary flex flex-align-center flex-pack-center">
        {{ $t('NFT.Buy Now') }}
      </a>
    </div>
  </ElDialog>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
