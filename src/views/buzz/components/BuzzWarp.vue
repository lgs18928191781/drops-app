<template>
  <header class="flex flex-align-center" v-if="!isHideHeader">
    <div class="flex1">
      <HeaderNavVue>

        <div class="nav-menu flex flex-align-center">
          <router-link
            :to="item.path"
            class="nav-menu-item flex flex-align-center"
            v-for="(item, index) in navMenus"
            :key="index"
          >
         
            <span class="name" v-if="!item.disable">{{ item.name }}</span>
          </router-link>
        </div>
        
      </HeaderNavVue>
      <!-- <PhoneMenuBtnVue>
        <div class="buzz-menu flex flex-align-center">
          <router-link
            :to="item.path"
            class="buzz-menu-item flex flex-align-center"
            v-for="(item, index) in navMenus"
            :key="index"
          >
         
            <span class="name">{{ item.name }}</span>
          </router-link>
        </div>
      </PhoneMenuBtnVue> -->
    </div>
    <LoginedUserOperateVue />
  </header>
  <div class="buzz-warp z-10 " ref="BuuzWarpRef" id="buzz-warp">
    <div class="buzz-container  " id="buzz-container" ref="BuzzContainerRef">
      <slot></slot>
    </div>
   <footer class="flex z-0 fixed  bottom-0 items-center justify-center py-5 text-[#8A8A8A]">MetaID.market@2024 All Rights Reserved</footer>
    <!--   -->
    <!-- <div class="fast-btn" ref="FastBtnRef">
      <a class="top" @click="scrollTop">
        <Icon name="buzz_icon_top" />
      </a>
      <a class="main-border primary" @click="toPublish">
        <Icon name="buzz_icon_post" />
      </a>
    </div> -->
    <!--   -->
  </div>

  <!-- publish -->
  <!-- <PublishVue
    v-model="isShowBuzzPublish"
    :topic="publishTopic"
    v-model:repost-tx-id="publishRepostTxId"
    @success="onPublishSuccess"
  /> -->
</template>

<script setup lang="ts">
import {
  KeepAlive,
  onBeforeUnmount,
  onMounted,
  ref,
  Transition,
  watch,
  provide,
  onUnmounted,
  reactive,
} from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
import CollapseItem from '@/components/Collapse/collapse-item.vue'
import sideLeftBottom from '@/components/Side/side-left-bottom.vue'
// const isDark = useDark()
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import LoginedUserOperateVue from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import { useI18n } from 'vue-i18n'
import { useLayoutStore } from '@/stores/layout'
import PublishVue from '@/views/buzz/components/Publish.vue'
import PhoneMenuBtnVue from '@/components/PhoneMenuBtn/PhoneMenuBtn.vue'
import HeaderNavVue from  '@/components/HeaderNavWrap/HeaderNavWrap.vue'
import { useRouter } from 'vue-router'
import { checkUserLogin } from '@/utils/util'

interface Props {
  isHideHeader?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const router = useRouter()
const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const i18n = useI18n()
const isShowBuzzPublish = ref(false)
const publishTopic = ref('')
const publishRepostTxId = ref('')
const publiseSuccessCallBack = ref(() => {
  // router.push({
  //   name: 'buzz',
  // })

  router.push('/buzz/tag/1')
})

const menus = [
  {
    name:'New Buzz', //i18n.t('Buzz.Timeline'),
    icon: 'feed',
    path:'/buzz/tag/1' //'/buzz/index',
  },
  // {
  //   name: i18n.t('Buzz.Recommend'),
  //   icon: 'star',
  //   path: '/buzz/recommend',
  // },
]

const navMenus=[
{
    name:'Explore', //i18n.t('Buzz.Timeline'),
    disable:false,
    path:'/home',
  },
  {
    name:'Collection',
    disable:false,
    path:'/nft/collection/index' //'/buzz/index',
  },
  {
    name:'Create', //i18n.t('Buzz.Timeline'),
    disable:false,
    path:'/create' //'/buzz/index',
  },
  // {
  //   name:'Profile', //i18n.t('Buzz.Timeline'),
  //     disable:true,
  //   path:'/create' //'/buzz/index',
  // },
  {
    name:'Convert', //i18n.t('Buzz.Timeline'),
      disable:false,
    path:'/convert' //'/buzz/index',
  },
]

const BuzzContainerRef = ref()
const FastBtnRef = ref()
const BuuzWarpRef = ref()
let resizeObserver: ResizeObserver

function setPosition() {
  if (window.innerWidth > 1368) {
    FastBtnRef.value.style.left =
      BuzzContainerRef.value.getBoundingClientRect().left +
      BuzzContainerRef.value.clientWidth +
      12 +
      'px'
    FastBtnRef.value.style.marginRight = 0
  } else {
    FastBtnRef.value.style.right = '5%'
    FastBtnRef.value.style.marginRight = 0
  }
}

function scrollTop() {
  window.document.documentElement.scrollTop = 0
}

async function toPublish() {
  await checkUserLogin()
  isShowBuzzPublish.value = true
}

onMounted(() => {
  // setPosition()

  // resizeObserver = new ResizeObserver(entries => {
  //   setPosition()
  // })

  // //监听对应的dom
  // resizeObserver.observe(document.getElementById('buzz-warp')!)
})

function onPublishSuccess() {
  publiseSuccessCallBack.value()
}

onBeforeUnmount(() => {
  //resizeObserver.unobserve(document.getElementById('buzz-warp')!)
})

provide('isShowBuzzPublish', isShowBuzzPublish)
provide('topic', publishTopic)
provide('repostTxId', publishRepostTxId)
provide('publiseSuccessCallBack', publiseSuccessCallBack)
defineExpose({
  publishTopic: publishTopic,
  publiseSuccessCallBack: publiseSuccessCallBack,
})
</script>

<style lang="scss" scoped src="./BuzzWarp.scss"></style>
