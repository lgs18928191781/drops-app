<template>
  <div class="flex flex-align-center">
    <UseDark v-slot="{ isDark, toggleDark }">
      <button @click="toggleDark()">Is Dark: {{ isDark }}</button>
    </UseDark>

    <RouterLink :to="{ name: 'preLogin' }">登录</RouterLink>
    <RouterLink :to="{ name: 'register' }">注册</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { UseDark } from '@vueuse/components'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
const i18n = useI18n()
const env = import.meta.env
const route = useRoute()
const router = useRouter()
const isShowDrawer = ref(false)

// 设置语言
function setLang() {
  const lang = i18n.locale.value === 'en' ? 'zh' : 'en'
  i18n.locale.value = lang
  window.localStorage.setItem('lang', lang)
}
</script>

<style lang="scss" scoped></style>
