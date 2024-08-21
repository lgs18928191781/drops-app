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
  <!-- <PWA /> -->

  <!-- 图片预览 -->
  <ImagePreviewVue />
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  onMounted,
  nextTick,
  watch,
  provide,
  onUnmounted,
  onBeforeUnmount,
  watchEffect,
} from 'vue'
import { useRoute } from 'vue-router'

import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'

import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
import LeftNavigationVue from './components/LeftNavigation/LeftNavigation.vue'
import DragonBall from './views/talk/components/DragonBall.vue'
import SearchModal from './components/Search/Index.vue'
//import PWA from './components/PWA/PWA.vue'
import UserCardFloater from './components/UserCard/Floater.vue'
import PullDownVue from './layout/PullDown/PullDown.vue'
import ImagePreviewVue from '@/components/ImagePreview/ImagePreview.vue'
import { useBtcJsStore } from '@/stores/btcjs'
import * as secp256k1 from 'tiny-secp256k1'
import { useConnectionStore, ConnectChain } from '@/stores/connection'
import { useFeebStore } from '@/stores/feeb'
import { useFollowStore } from './stores/follow'
import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
import * as bitcoin from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
const rootStore = useRootStore()
const userStore = useUserStore()
const metaidEntity = useMetaIDEntity()
const btcJsStore = useBtcJsStore()
const feeStore = useFeebStore()
const route = useRoute()
const blackRoute = reactive(['home'])
const connectorStore = useConnectionStore()
const feebInterval = ref()
const followStore = useFollowStore()

const routeKey = (route: any) => {
  if (route.params.communityId) return route.params.communityId
  return route.fullPath
}

// if (!localStorage.getItem('showDiffLang')) {
//   localStorage.setItem('showDiffLang', String(1))
// }

function initBitcoin() {
  btcJsStore.set(bitcoin)

  // initialize related btc modules
  const ECPair = ECPairFactory(secp256k1)
  btcJsStore.setECPair(ECPair)
}

onMounted(async () => {
  console.log('VITE_TEST_TEXT',import.meta.env.VITE_TEST_TEXT)
  console.log('VITE_TEST_TEXT',import.meta.env.VITE_METALET_API)
  // initialize btcjs
  // const btcjs = window.bitcoinjs
  // btcJsStore.set(btcjs)

  // initialize related btc modules

  // const ECPair = window.ecpair.ECPairFactory(secp256k1)
  // btcJsStore.setECPair(ECPair)

  // window.metaidwallet.on('accountsChanged', handleAcccountsChanged)

  setTimeout(async () => {
    initBitcoin()
    await connectorStore.sync()
    console.log(connectorStore.last._isConnected)
    if (connectorStore.last._isConnected) {
      await followStore.get()
      console.log(window.metaidwallet)
      // await metaidEntity.payCommentEntity({
      //   body: {
      //     content: `评论了一下下`,
      //     commentTo: `c36feccf58b1a83c4df8a0b1517b74cf147509c1e25f4796ec493b1579a263f5i0`,
      //     replyTo: '', //对某条评论进行回复的pinid,一级评论则留空
      //     pay: '', //暂时留空
      //     payTo: '', //暂时留空
      //   },
      // })
      // await metaidEntity.simpleRepostEntity({
      //   body: {
      //     rePostComment: 'let me repost this buzz',
      //     rePostTx: `c36feccf58b1a83c4df8a0b1517b74cf147509c1e25f4796ec493b1579a263f5i0`,
      //     rePostProtocol: 'simplebuzz',
      //   },
      // })
    }

    feeStore.set(feeStore.last.currentFeeb.title).then()
    if (connectorStore.currentChain && connectorStore.currentChain !== ConnectChain.mvc) {
      feebInterval.value = setInterval(() => {
        feeStore.update().then()
      }, 60 * 1000)
    }
  }, 500)
})

onUnmounted(() => {
  clearInterval(feebInterval.value)
})

onBeforeUnmount(() => {
  window.metaidwallet?.removeListener('accountsChanged', handleAcccountsChanged)
})

function handleAcccountsChanged() {
  ElMessage.warning('Metalet account changed,Please reconnect...')
  userStore.logout(route)
  connectorStore.disconnect()
  // console.log(connectorStore.last._isConnected)
}

watchEffect(() => {
  if (connectorStore.last._isConnected) {
    window.metaidwallet.on('accountsChanged', handleAcccountsChanged)
  } else {
    window.metaidwallet?.removeListener('accountsChanged', handleAcccountsChanged)
  }
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
