<template>
  <div class="header-wrapper flex flex-align-center ">
    <div class="header-contanier flex flex-align-center">
      <div class="header-left flex flex-align-center">
        <div class="logo flex flex-align-center">
          <img class="logo_img" :src="Logo" alt="" />
          <span>{{ $t('logo_title') }}</span>
        </div>
        <div class="search">
          <el-icon :size="18">
            <Search />
          </el-icon>
        </div>
      </div>
      <div class="header-right flex flex-align-center">
        <!-- <UseDark v-slot="{ isDark, toggleDark }">
          <button @click="toggleDark()">Is Dark: {{ isDark }}</button>
        </UseDark> -->
        <div class="lang" @click="setLang">
          <span>{{ currentLang }}</span>
          <el-icon>
            <CaretBottom />
          </el-icon>
        </div>

        <el-button class="login-btn"> {{ $t('connectWallet') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UseDark } from '@vueuse/components'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Logo from '@/assets/images/logo@2x.png'
import { CaretBottom, Search } from '@element-plus/icons-vue'
const i18n = useI18n()
const env = import.meta.env
const route = useRoute()
const router = useRouter()
const isShowDrawer = ref(false)
const currentLang = ref('CN')
// 设置语言
function setLang() {
  const lang = i18n.locale.value === 'en' ? 'zh' : 'en'
  i18n.locale.value = lang
  currentLang.value = i18n.locale.value === 'en' ? 'EN' : 'CN'
  window.localStorage.setItem('lang', lang)
}

function toggleDark() { }
</script>

<style lang="scss" src="./Header.scss">

</style>
