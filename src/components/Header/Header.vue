<template>
  <header class="flex flex-align-center">
      <div class="header-left flex1 flex flex-align-center">
        <a class="menu" @click="isShowDrawer = true"><img src="@/assets/images/menu.svg" alt="menu" /></a>
        <!-- 分割线 -->
        <span class="line"></span>
        <router-link to="/" class="logo flex flex-align-center">
          <img src="@/assets/images/logo_nos.svg" alt="NFTOnShow" />
        </router-link>
      </div>
      <nav class="flex flex-align-center flex-pack-center">
        <router-link to="/">{{ $t('marketplace') }}</router-link>
        <router-link to="/create">{{ $t('createnft') }}</router-link>
      </nav>
      <div class="operate flex flex-align-center">
        <!-- 登录按钮 -->
        <a v-if="!store.state.userInfo" class="btn" @click="auth" v-loading="store.state.userInfoLoading" element-loading-background="rgba(255, 255, 255, 0.7)">{{$t('signinandout')}}</a>
        
        <!-- 登录用户 -->
        <ElDropdown trigger="click" v-else>
          <div class="user-info flex flex-align-center">
            <img :src="$filters.avatar(store.state.userInfo?.showId)" :alt="store.state.userInfo?.name" />
            <div class="username">{{store.state.userInfo?.name}}</div> 
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toSelf">{{$t('mynft')}}</el-dropdown-item>
              <el-dropdown-item @click="toWallet">{{$t('mywallet')}}</el-dropdown-item>
              <el-dropdown-item @click="logout">{{$t('logout')}}</el-dropdown-item>
              <el-dropdown-item @click="toTariffDescription">{{$t('tariffDescription ')}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </ElDropdown>

        <!-- 分割线 -->
        <span class="line"></span>

        <!-- 语言 -->
        <a class="lang" @click="setLang">{{ $t(i18n.locale.value === 'en' ? 'zh' : 'en') }}</a>
        <!-- <ElDropdown trigger="click">
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="lang in i18n.availableLocales" :key="lang" :disabled="lang === i18n.locale.value" >{{ $t(lang) }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </ElDropdown> -->
      </div>
  </header>

  <!-- ElDrawer -->
  <el-drawer
  modal-class="menu-drawer"
  v-model="isShowDrawer"
  direction="ttb">
  <nav class="mobile-nav-modal flex flex-align-center flex-pack-center">
        <router-link  to="/" @click.stop="isShowDrawer = false">{{ $t('marketplace') }}</router-link>
        <router-link  to="/create" @click.stop="isShowDrawer = false">{{ $t('createnft') }}</router-link>
  </nav>
</el-drawer>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElLoading, ElDrawer, locale } from 'element-plus'
import { ref } from 'vue'
import { useStore, Mutation } from '@/store/index'
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from 'vue-router';

const i18n = useI18n();
const env = import.meta.env
const store = useStore()
const route = useRoute()
const router = useRouter()
const isShowDrawer = ref(false)

// 跳转授权
function auth() {
  if (store.state.userInfoLoading) return
  // 清楚缓存的信息，避免意外
  store.commit(Mutation.LOGOUT, undefined)
  const url = `${env.VITE_AuthUrl}/userLogin?response_type=code&client_id=${env.VITE_AppId}&redirect_uri=${env.VITE_Hosts}${env.VITE_RedirectPath}&scope=app&from=${env.VITE_Hosts}`
  window.location.href = url
}

// 退出登录
function logout() {
  store.commit(Mutation.LOGOUT, undefined)
  if (route.meta && route.meta.isAuth) {
    router.replace('/')
  }
}

// 设置语言
function setLang() {
  const lang  = i18n.locale.value === 'en' ? 'zh' : 'en'
  i18n.locale.value = lang
  window.localStorage.setItem('lang', lang)
}
function toSelf() {
  router.push('/self')
}
function toWallet() {
  window.open(import.meta.env.VITE_AuthUrl)
}

function toTariffDescription() {
  router.push('/tariffDescription')
}
</script>

<style lang="scss" scoped src="./Header.scss"></style>
