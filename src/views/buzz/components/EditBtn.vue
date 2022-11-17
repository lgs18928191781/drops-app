<template>
  <div class="btn" @click="handleClick">
    <i></i>
  </div>
</template>
<script setup lang="ts">
import { checkSdkStatus } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

async function handleClick() {
  await checkSdkStatus(route.fullPath)
  router.push({
    path: '/app/buzz/edit',
  })
}
</script>
<style scoped lang="scss">
.btn {
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 52px;
  height: 52px;
  background: #02a7ff;
  box-shadow: 0px 5px 10px 0px rgba(2, 167, 255, 0.3);
  border-radius: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  i {
    display: block;
    width: 24px;
    height: 24px;
    background: url('@/assets/images/app/buzz/icon_send.svg') 0 no-repeat;
    box-sizing: 24px 24px;
    //margin: 1px 0 0 1px;
  }
  &:active,
  &:hover {
    opacity: 0.8;
  }
}
</style>
