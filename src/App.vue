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
  <DragonBall />
  <SearchModal />
  <ConnectWalletModalVue />
  <!-- <UserCardFloater /> -->
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'

import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
import LeftNavigationVue from './components/LeftNavigation/LeftNavigation.vue'
import DragonBall from './views/talk/components/DragonBall.vue'
import SearchModal from './components/Search/Index.vue'
import UserCardFloater from './components/UserCard/Floater.vue'

const rootStore = useRootStore()
const userStore = useUserStore()
const route = useRoute()
const blackRoute = reactive(['home'])

// const tpUrl = computed(() => {
//   const params = JSON.stringify({
//     callbackUrl: route.fullPath,
//     action: 'login',
//     actionId: '1648522106711',
//     blockchains: [
//       {
//         chainId: 1,
//         network: 'ethereum',
//       },
//     ],
//     dappIcon: '',
//     dappName: 'show3',
//     protocol: 'TokenPocket',
//     version: '1.0',
//   })
//   console.log('params', params)
//   // debugger
//   return `tpoutside://pull.activity?param=${encodeURIComponent(params)}`
// })

// const signUrl = computed(() => {
//   const params = JSON.stringify({
//     hash: false,
//     message: `hello world`,
//     memo: 'demo',
//     callbackUrl: `http://192.168.168.142:5173`,
//     action: 'sign',
//     actionId: 'web-db4c5466-1a03-438c-90c9-2172e8becea5',
//     blockchains: [
//       {
//         chainId: 1,
//         network: 'ethereum',
//       },
//     ],
//     dappIcon: '',
//     dappName: 'show3',
//     protocol: 'TokenPocket',
//     version: '1.0',
//   })
//   console.log('params', params)
//   return `tpoutside://pull.activity?param=${encodeURIComponent(params)}`
// })

const routeKey = (route: any) => {
  if (route.params.communityId) return route.params.communityId

  return route.fullPath
}
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
