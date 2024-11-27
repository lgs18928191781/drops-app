<template>
  <header class="flex flex-align-center " v-if="!isHideHeader">
    <div class="flex1">
      <HeaderNavVue>

        <div class="nav-menu flex flex-align-center" v-if="!layout.isColspanHeader">
          <router-link
            :to="''"
            @click="toTarget(item)"
            class="nav-menu-item flex flex-align-center"
            v-for="(item, index) in navMenus"
            :key="index"
          >
         
            <span class="name" v-if="!item.disable">{{ item.name }}</span>
          </router-link>
        </div>



        <div  v-else>
          <el-dropdown trigger="click">
            <div class="flex items-center">
              <span class="font-bold text-[#fff] text-sm el-dropdown-link">
     {{ currentPage }}
      <el-icon  class="el-icon--right top-[3px]">
        <arrow-down  />
      </el-icon>
    </span>
            </div >
    <template #dropdown>
      <div class="drop-menu-colspan-wrap">
        <el-dropdown-menu >
        <router-link
            :to="''"
            @click="toTarget(item)"
            class=" nav-menu-colspan-item flex flex-align-center "
            v-for="(item, index) in navMenus"
            :key="index"
          >
          <el-dropdown-item  ><span class=" text-sm  text-[#fff]">
            {{ item.name }}
          </span></el-dropdown-item>
           
          </router-link>
       
      
      </el-dropdown-menu>
      </div>
    </template>
  </el-dropdown>
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
  <div class="buzz-warp  " ref="BuuzWarpRef" id="buzz-warp">
    <div class="buzz-container   " id="buzz-container" ref="BuzzContainerRef">
      <slot></slot>
    </div>

    
   
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
  <footer v-if="isShowFooter" class="flex items-center justify-center py-5 text-[#8A8A8A]">MetaID.market@2024 All Rights Reserved</footer>
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
  computed
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
import { useRouter,useRoute } from 'vue-router'
import { checkUserLogin } from '@/utils/util'
import { ArrowDown } from '@element-plus/icons-vue'
import { useConnectionStore, } from '@/stores/connection'
import { ElMessage } from 'element-plus'
interface Props {
  isHideHeader?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const router = useRouter()
const route=useRoute()

const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const i18n = useI18n()
const connectionStore=useConnectionStore()
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

type navType={
  name:string
  disable:boolean,
  path:string
}

const navMenus:navType[]=[
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

const isShowFooter=computed(()=>{
  
  if(route.fullPath.indexOf('/profile') > -1){
    return false
  }else{
    return true
  }
})


const currentPage=computed(()=>{
  

  switch (route.name) {
    case 'explore':
      return 'Explore';
      case 'nftsCollection':
      return 'Create';
      case 'genesisNfts':
      return 'Create';
      case 'nftCollectionIndex':
      return 'Collection';
      case 'list':
      return 'Convert';
  }
})

function toTarget(item:navType){

  if(item.path == '/convert'){
    router.push({
    name:'profile',
    params:{
      metaid:connectionStore.userInfo.metaid,
    address:connectionStore.userInfo.address,
    type:'convert'
  }})
  }else{
  
    if(item.path == '/create'){
      
      const whitelist=['bc1ppzdcjgkyk57kd39w8nwmv92strkmf2dvd876n0xxne9wcycvg06satvw0c',
  'bc1p2am8gpgps2453ny3nqygnf4t70yjrv5h32xk7xzjy8622dl6vtrsjuup5v','176C9RPWDggnvdVcWG3wrZEJcm1bHTcKM5',
  'bc1pm4yqy8xgyncxusj3sx365x7h08al6krk55nyz7ysavqcumshzq4skfk8du',
  '136Pnewh7HhZ61UZLrzwgSVY9BbxZoNhVQ','17LK4XoemSdVDtoZforjb9bf2RiDQzvYGq','1K1Heqm7qgisKhtsGsDq9TPhoV6JXw6BVu']
        if(!whitelist.includes(connectionStore.userInfo?.address)){
          return ElMessage.error(`During the beta testing period of Drops, only whitelisted users are allowed to create collections`)
        }
   
    }

    router.push(item.path)
 
}
}

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
