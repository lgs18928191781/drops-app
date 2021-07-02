<template>
  <header class="flex flex-align-center">
      <a class="logo flex flex-align-center">
        <img src="@/assets/images/logo_shownft.svg" />
        Show<span>NFT</span>
      </a>
      <nav class="flex1">
        <router-link to="/">{{ $t('marketplace') }}</router-link>
        <router-link to="/create">{{ $t('createnft') }}</router-link>
      </nav>
      <div class="operate flex flex-align-center">
        <!-- 登录按钮 -->
        <a v-if="!store.state.userInfo" class="btn" @click="auth" v-loading="store.state.userInfoLoading" element-loading-background="rgba(255, 255, 255, 0.7)">登录/注册</a>
        
        <!-- 登录用户 -->
        <ElDropdown trigger="click" v-else>
          <div class="user-info flex flex-align-center">
            <img :src="store.state.userInfo?.headUrl" :alt="store.state.userInfo?.name" />
            {{ store.state.userInfo?.name}}
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>中文</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </ElDropdown>

        <!-- 分割线 -->
        <span class="line"></span>

        <!-- 语言 -->
        <ElDropdown trigger="click">
          <a class="lang">{{ $t(i18n.locale.value) }}</a>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="lang in i18n.availableLocales" :key="lang" :disabled="lang === i18n.locale.value" @click="setLang(lang)">{{ $t(lang) }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </ElDropdown>
      </div>
  </header>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElLoading } from 'element-plus'
import { computed, defineProps } from 'vue'
import { useStore, Mutation } from '@/store/index'
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const env = import.meta.env
const store = useStore()
const appVersion = store.state.version // not reactive!
const count = computed(() => store.state.count)
const props = defineProps<{
  // msg: string
}>()

// 跳转授权
function auth() {
  if (store.state.userInfoLoading) return
  const url = `${env.VITE_AuthUrl}/userLogin?response_type=code&client_id=${env.VITE_AppId}&redirect_uri=${env.VITE_Hosts}${env.VITE_RedirectPath}&scope=app&from=${env.VITE_Hosts}`
  window.location.href = url
}

// 退出登录
function logout() {
  store.commit(Mutation.LOGOUT, undefined)
}

// 设置语言
function setLang(lang: string) {
  i18n.locale.value = lang
}
</script>

<style lang="scss" scoped src="./Header.scss"></style>
