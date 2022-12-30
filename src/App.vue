<template>
  <div @click="metaname">MetaName点我</div>
  <div class="main flex">
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
  <ConnectWalletModalVue />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
import LeftNavigationVue from './components/LeftNavigation/LeftNavigation.vue'
import DragonBall from './views/talk/components/DragonBall.vue'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
const rootStore = useRootStore()
const userStore = useUserStore()
const route = useRoute()
const blackRoute = reactive(['home'])
const routeKey = (route: any) => {
  if (route.params.communityId) return route.params.communityId

  return route.fullPath
}

async function metaname() {
  try {
    const res = await userStore.showWallet.MetaNameBeforeReq({
      name: `🥕`,
      op: 1,
    })
    console.log('resss', res)
    debugger
    if (res.code == 0) {
      const { data } = res
      const result = await userStore.showWallet.sendMetaNameTransation({
        op_code: data.op,
        metaid: userStore.user!.metaId,
        address: userStore.user!.address,
        years: 1,
        reqswapargs: data,
      })
      console.log('result', result)
      debugger
    } else {
      throw new Error(`${res.msg}`)
    }
  } catch (error) {
    throw new Error(`${(error as any).toString()}`)
  }
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

// *::-webkit-scrollbar {
//   width: 8px;
// }

// *::-webkit-scrollbar-track {
//   background: #edeff2;
// }

// .dark *::-webkit-scrollbar-track {
//   background: #111827;
// }

// *::-webkit-scrollbar-thumb {
//   background-color: #bfc2cc;
//   border-radius: 20px;
// }

// .dark *::-webkit-scrollbar-thumb {
//   background-color: #374151;
// }
</style>
