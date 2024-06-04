<template>
  <RouterView
    v-if="
      $route.path === '/' ||
        $route.path.indexOf('/metaname') !== -1 ||
        $route.path.indexOf('/home') !== -1
    "
  />
  <div class="flex main" v-else>
    <LeftNavigationVue v-if="!blackRoute.includes(route.name)" />
    <PullDownVue class="flex1">
      <template #default>
        <div class="flex1 main-right" ref="MainRightRef">
          <RouterView v-slot="{ Component, route }">
            <KeepAlive>
              <component
                :is="Component"
                :key="route.fullPath"
                v-if="route.meta && route.meta.keepAlive"
              />
            </KeepAlive>
            <component
              :is="Component"
              :key="routeKey(route)"
              v-if="!route.meta || (route.meta && !route.meta.keepAlive)"
            />
          </RouterView>
        </div>
      </template>
    </PullDownVue>
  </div>
  <DragonBall />
  <SearchModal />
  <ConnectWalletModalVue />
  <!-- <UserCardFloater /> -->
  <PWA />

  <!-- 图片预览 -->
  <ImagePreviewVue />
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, nextTick, watch, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'

import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
import LeftNavigationVue from './components/LeftNavigation/LeftNavigation.vue'
import DragonBall from './views/talk/components/DragonBall.vue'
import SearchModal from './components/Search/Index.vue'
import PWA from './components/PWA/PWA.vue'
import UserCardFloater from './components/UserCard/Floater.vue'
import PullDownVue from './layout/PullDown/PullDown.vue'
import ImagePreviewVue from '@/components/ImagePreview/ImagePreview.vue'

const rootStore = useRootStore()
const userStore = useUserStore()
const route = useRoute()
const blackRoute = reactive(['home'])
const router = useRouter()
const routeKey = (route: any) => {
  if (route.params.communityId) return route.params.communityId
  return route.fullPath
}

// if (!localStorage.getItem('showDiffLang')) {
//   localStorage.setItem('showDiffLang', String(1))
// }

onMounted(() => {
  setTimeout(async () => {
    if (userStore.metaletLogin) {
      const res = await window.metaidwallet.getAddress()
      if (res?.status == 'not-connected' || userStore.user?.address !== res) {
        ElMessage.error('We detected changes to your account. Please log in again.')
        await userStore.logout(route)
        window.location.reload()
      }

      window.metaidwallet.on(
        'accountsChanged',
        async (res: { mvcAddress: string; btcAddress: string }) => {
          if (res.mvcAddress !== userStore.user?.address) {
            ElMessage.error('We detected changes to your account. Please log in again.')
            await userStore.logout(route)
            window.location.reload()
          }
        }
      )
    }
  }, 500)
})
</script>
<style lang="css" src="@/assets/styles/tailwind.css"></style>
<style lang="scss" scoped>
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney'), url('@/assets/fonts/whitneybook.otf') format('opentype');
  font-weight: 400;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Medium'), url('@/assets/fonts/whitneymedium.otf') format('opentype');
  font-weight: 500;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Bold'), url('@/assets/fonts/whitneybold.otf') format('opentype');
  font-weight: 700;
}
</style>
