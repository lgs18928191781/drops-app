<template>
  <header class="flex flex-align-center">
      <div class="flex1">
        <a class="logo flex flex-align-center">
          <span>NFT</span>onShow
        </a>
      </div>
      <nav class="flex flex-align-center flex-pack-center">
        <router-link to="/">{{ $t('marketplace') }}</router-link>
        <router-link to="/create">{{ $t('createnft') }}</router-link>
      </nav>
      <div class="operate flex flex-align-center">
        <!-- 登录按钮 -->
        <a v-if="!store.state.userInfo" class="btn" @click="auth" v-loading="store.state.userInfoLoading" element-loading-background="rgba(255, 255, 255, 0.7)">登录/注册</a>
        
        <!-- 登录用户 -->
        <ElDropdown trigger="click" v-else>
          <div class="user-info flex flex-align-center">
            <img :src="$filters.avatar(store.state.userInfo?.showId)" :alt="store.state.userInfo?.name" />
            <div class="username">{{store.state.userInfo?.name}}</div> 
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toSelf">我的NFT</el-dropdown-item>
              <el-dropdown-item @click="toWallet">我的钱包</el-dropdown-item>
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
import { router } from '@/router';

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
function toSelf() {
  router.push('/self')
}
function toWallet() {
  window.location.href = import.meta.env.VITE_AuthUrl
}
</script>

<style lang="scss" scoped src="./Header.scss"></style>
