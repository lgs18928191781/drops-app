<template>
  <div class="main flex">
    <LeftNavigationVue />
    <div class="flex1 main-right">
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
  </div>

  <!-- ConnectWalletModalVue -->
  <ConnectWalletModalVue />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
import LeftNavigationVue from './components/LeftNavigation/LeftNavigation.vue'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'

const rootStore = useRootStore()
const userStore = useUserStore()

const routeKey = (route: any) => {
  if (route.params.communityId) return route.params.communityId

  return route.fullPath
}
</script>
<style lang="css" src="@/assets/styles/tailwind.css"></style>
<style lang="scss" scoped>
.main {
}

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
