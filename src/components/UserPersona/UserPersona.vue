<template>
  <div class="flex flex-align-center flex-pack-center user-persona">
    <img class="user-image" src="@/assets/images/bot.png" />

    <div class="level-msg flex flex-align-center flex-pack-center">
      <div class="level-msg-item">Lv&nbsp;0</div>
      <div class="level-msg-item">0/120</div>
    </div>

    <div class="part-list flex flex-align-center">
      <div class="part-item flex1">
        <div class="part-icon-warp">
          <Icon name="part" />
        </div>
        <div class="name">{{ $t('User.Backwall') }}</div>
      </div>
      <div class="part-item flex1">
        <div class="part-icon-warp">
          <Icon name="part" />
        </div>
        <div class="name">{{ $t('User.Costume') }}</div>
      </div>
      <div class="part-item flex1">
        <div class="part-icon-warp">
          <Icon name="part" />
        </div>
        <div class="name">{{ $t('User.Artifacts') }}</div>
      </div>
      <div class="part-item flex1">
        <div class="part-icon-warp">
          <Icon name="part" />
        </div>
        <div class="name">{{ $t('User.Pet') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
