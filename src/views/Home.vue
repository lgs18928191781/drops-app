<template>
  <div>
    用户信息：
    {{ userStore.user }}
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style lang="scss" scoped></style>
