<template>
     <div>
      <!-- 登录按钮 -->
      <a
        v-if="!store.state.userInfo"
        class="btn"
        @click="auth(SdkType.Metaidjs)"
        v-loading="store.state.userInfoLoading"
        element-loading-background="rgba(255, 255, 255, 0.7)"
        >{{ $t('signinandout') }}
        </a
      >
      <!-- 登录用户 -->
      <!-- 语言 -->
    </div>
  <!-- ElDrawer -->
  
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { useStore, Mutation, Action } from '@/store/index'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { SdkType } from 'sdk/src/emums'

const i18n = useI18n()
const env = import.meta.env
const store = useStore()
const route = useRoute()
const router = useRouter()
const isShowDrawer = ref(false)
onMounted(()=>{
 
})
// 跳转授权
function auth(appType: SdkType) {
  if (store.state.userInfoLoading) return
  store.state.sdk?.changeSdkType(appType)
  console.log('sdk?.login', store.state.sdk!.login)
   console.log("SdkType",store.state.sdk)
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

<style lang="scss" scoped></style>
