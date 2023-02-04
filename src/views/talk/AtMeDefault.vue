<template>
  <div class="relative fullscreen lg:flex text-base bg-dark-100 dark:bg-gray-900">
    <div class="w-full h-full flex flex-col items-center justify-center">
      <img :src="PlayfulCatImg" class="w-64 h-48 lg:w-80 lg:h-60" alt="" />
      <p class="text-base tracking-wide">{{ $t('Talk.Channel.no_contacts_yet') }}</p>
      <button class="mt-4 text-sm underline outline-0 text-link" @click="goBuzz">
        {{ $t('Talk.Channel.back_to_buzz') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PlayfulCatImg from '@/assets/images/playful_cat.svg?url'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBuzz = () => {
  router.push({ name: 'buzz' })
}
</script>
