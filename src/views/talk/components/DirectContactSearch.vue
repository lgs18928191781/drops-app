<template>
  <div class="bg-inherit p-2.5 pr-3.5">
    <div class="flex items-center space-x-3 max-w-full">
      <div class="bg-white grow p-2 rounded-full relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon name="search" class="w-3.5 h-3.5 text-dark-250" />
        </span>
        <input
          type="text"
          class="text-dark-800 text-sm leading-tight font-normal placeholder-dark-250 outline-0 m-0 w-full pl-6"
          :placeholder="$t('Talk.Channel.search')"
        />
      </div>

      <div class="">
        <Icon name="user_bars" class="w-6 h-6 p-0.5 cursor-pointer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
