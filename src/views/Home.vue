<template>
    <RouterLink to="/sign/in">
        <ElButton>登陆</ElButton>
    </RouterLink>
    <RouterLink to="/sign/up">
        <ElButton>注册</ElButton>
    </RouterLink>
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
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
</script>

<style lang="scss" scoped>

</style>
