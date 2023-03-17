<template>
  <div class="h-full flex flex-v">
    <div class="header">
      <a class="back flex flex-align-center" @click="$router.back()">
        <span class="icon-warp flex flex-align-center flex-pack-center">
          <Icon name="down" />
        </span>
        {{ $t('back') }}
      </a>
    </div>

    <div class="flex1 flex content-warp">
      <div class="content flex1">
        <div class="title">你是否赞成MetaCoin的分发机制改为体积占比+最低费率</div>

        <div class="msg"></div>
      </div>

      <div class="right"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped src="./Detail.scss"></style>
