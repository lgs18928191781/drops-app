<template>
  <ElButton @click="login">登陆</ElButton>
  <ElButton @click="userStore.logout()">退出登录</ElButton>
  <br />
  <br />
  <br />
  <div>
    <RouterLink to="/buzz">
      <ElButton>Buzz</ElButton>
    </RouterLink>
    <RouterLink to="/talk">
      <ElButton>talk</ElButton>
    </RouterLink>
  </div>
  <br />
  <br />
  <br />
  <div>用户：{{ userStore.user }}</div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useRootStore } from '@/stores/root'

const userStore = useUserStore()
const rootStore = useRootStore()

function login() {
  rootStore.$patch({ isShowLogin: true })
}
</script>

<style lang="scss" scoped></style>
