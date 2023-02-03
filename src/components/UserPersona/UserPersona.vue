<template>
  <div class="flex flex-col items-center user-persona" @click="comeSoon">
    <div class="w-4/5 mb-8 lg:mb-4.5 flex flex-col items-center">
      <!-- 1. 经验条 -->
      <div class="text-sm lg:text-xxs flex gap-x-3 lg:gap-x-1.5 mb-8 lg:mb-4.5 w-full">
        <div
          class="rounded-full px-4 lg:px-2.5 border-2 lg:border border-solid border-primary-border py-0.5 lg:py-px"
        >
          Lv 1
        </div>
        <div
          class="rounded-full border-2 lg:border border-solid border-primary-border grow text-center relative py-0.5 lg:py-px"
        >
          <div
            class="absolute top-0 left-0 bg-primary h-full z-10 rounded-full border-3 lg:border-2 border-gray-100 dark:border-gray-800 border-solid"
            v-if="xpBarWidth > 0"
            :style="{ width: `${xpBarWidth}%` }"
          ></div>
          <span class="z-20 relative">0/100</span>
        </div>
      </div>

      <!-- 2. 形象 -->
      <img class="w-48 h-64 lg:w-36 lg:h-48 object-cover" src="@/assets/images/bot.png" />
    </div>

    <!-- 3. 装备 -->
    <div
      class="flex justify-center items-center gap-x-2.5 text-sm lg:text-xs  font-bold lg:font-normal"
    >
      <div class="flex flex-col items-center">
        <Icon name="part" class="w-12 h-12  rounded text-dark-250 dark:text-gray-600" />
        <div class="mt-2 lg:mt-1">{{ $t('User.Backwall') }}</div>
      </div>

      <div class="flex flex-col items-center">
        <Icon name="part" class="w-12 h-12 rounded text-dark-250 dark:text-gray-600" />
        <div class="mt-2 lg:mt-1">{{ $t('User.Costume') }}</div>
      </div>

      <div class="flex flex-col items-center">
        <Icon name="part" class="w-12 h-12 rounded text-dark-250 dark:text-gray-600" />
        <div class="mt-2 lg:mt-1">{{ $t('User.Artifacts') }}</div>
      </div>

      <div class="flex flex-col items-center">
        <Icon name="part" class="w-12 h-12  rounded text-dark-250 dark:text-gray-600" />
        <div class="mt-2 lg:mt-1">{{ $t('User.Pet') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const xpBarWidth = computed(() => {
  const xp = 0
  const xpMax = 100
  return (xp / xpMax) * 100
})

const i18n = useI18n()
function comeSoon() {
  return ElMessage.info(i18n.t('Comming Soon'))
}
</script>

<style lang="scss" scoped src="./UserPersona.scss"></style>
