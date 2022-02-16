<template>
  <header>
    <div class="header-left flex1 flex flex-align-center">
      <a class="menu" @click="isShowDrawer = true">
        <MenuIcon />
      </a>
      <!-- 分割线 -->
      <span class="line"></span>
      <router-link to="/" class="logo flex flex-align-center">
        <img :src="LogoNosIcon" alt="" />
        <!-- <LogoNosIcon /> -->
      </router-link>
    </div>
    <!-- <nav class="flex flex-align-center flex-pack-center">
      <router-link to="/">{{ $t('marketplace') }}</router-link>
      <router-link to="/create">{{ $t('createnft') }}</router-link>
    
    </nav> -->
    <div class="operate flex flex-align-center">
      <div class="item">
        <HotImg />
        <span>参与预售</span>
      </div>
      <div class="item"><span>兑换码NFT</span></div>
      <div class="item"><span>合成</span></div>
      <!-- 语言 -->
      <div class="item" @click="setLang">{{ $t(i18n.locale.value === 'en' ? 'zh' : 'en') }}</div>

      <!-- 登录按钮 -->
      <a
        class="loginBtn"
        v-if="!store.state.userInfo"
        @click="auth(SdkType.Metaidjs)"
        v-loading="store.state.userInfoLoading"
        element-loading-background="rgba(255, 255, 255, 0.7)"
        >{{ $t('login') }}</a
      >

      <!-- 打点登陆按钮 -->
      <!-- <a
        v-if="!store.state.userInfo"
        class="btn"
        @click="auth(SdkType.Dotwallet)"
        v-loading="store.state.userInfoLoading"
        element-loading-background="rgba(255, 255, 255, 0.7)"
        >DotWallet {{ $t('signinandout') }}</a
      > -->

      <!-- 登录用户 -->
      <ElDropdown trigger="click" v-else>
        <div class="user-info flex flex-align-center">
          <img
            :src="$filters.avatar(store.state.userInfo?.showId)"
            :alt="store.state.userInfo?.name"
          />
          <div class="username">{{ store.state.userInfo?.name }}</div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="store.state.sdk?.toWallet()">
              {{ $t('mywallet') }}
            </el-dropdown-item>
            <el-dropdown-item @click="logout">{{ $t('logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </ElDropdown>

      <!-- 分割线 -->

      <!-- <ElDropdown trigger="click">
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="lang in i18n.availableLocales" :key="lang" :disabled="lang === i18n.locale.value" >{{ $t(lang) }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
      </ElDropdown>-->
    </div>
  </header>

  <!-- ElDrawer -->
  <el-drawer modal-class="menu-drawer" v-model="isShowDrawer" direction="ttb">
    <nav class="mobile-nav-modal">
      <router-link to="/" @click.stop="isShowDrawer = false">{{ $t('marketplace') }}</router-link>
      <router-link to="/create" @click.stop="isShowDrawer = false">
        {{ $t('createnft') }}
      </router-link>
      <!-- <router-link to="/metaBot" @click.stop="isShowDrawer = false">
        MetaBot <img src="@/assets/images/nav_icon_hot.svg" alt="MetaBot"
      /></router-link>-->
    </nav>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElDrawer } from 'element-plus'
import { ref } from 'vue'
import { useStore, Mutation, Action } from '@/store/index'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { SdkType } from 'sdk/src/emums'
import MenuIcon from '@/assets/images/menu.svg'
import LogoNosIcon from '@/assets/images/ntflogo.png'
import HotImg from '@/assets/images/hot.svg'
const i18n = useI18n()
const env = import.meta.env
const store = useStore()
const route = useRoute()
const router = useRouter()
const isShowDrawer = ref(false)

// 跳转授权
function auth(appType: SdkType) {
  if (store.state.userInfoLoading) return
  store.state.sdk?.changeSdkType(appType)
  console.log('sdk?.login', store.state.sdk!.login)
  debugger
  store.state.sdk?.login()
}

// 退出登录
function logout() {
  store.dispatch(Action.LogOut)
  // 退出登录时sdk已清空为null， 需重新new sdk
  if (route.meta && route.meta.isAuth) {
    router.replace('/')
  }
}

// 设置语言
function setLang() {
  const lang = i18n.locale.value === 'en' ? 'zh' : 'en'
  i18n.locale.value = lang
  window.localStorage.setItem('lang', lang)
}
</script>

<style lang="scss" scoped src="./Header.scss"></style>
