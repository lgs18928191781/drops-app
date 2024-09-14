<template>
  <!-- <div class="version-warp hidden lg:block">
    <VersionVue />
  </div> -->

     <!--Dummy--->
     <!-- <div v-if="connectStore.last.user.address" class="flex items-center mr-6 dummy p-1 bg-[#fc6d5e] text-[#fff]  text-sm  rounded-lg font-medium">
            <CircleFadingPlus
              
                :size="18"
                color="#fff"
                class=" mr-1"
              ></CircleFadingPlus>
            <span class="mr-1 ">Dummy :</span>
            <span class="new-tag">{{ dummyAmount }}</span>
          </div> -->

  <div class="net-warp mr-3" v-show="connectStore.currentChain !== ''">
    <ElDropdown class="network-style" trigger="click">
      <span class="el-dropdown-link flex items-center text-sm font-medium">
        <img
          src="@/assets/images/logo_chain_btc.png"
          alt=""
          class="show-coin w-6 h-6 mr-1.5"
          v-if="connectStore.currentChain == 'btc'"
        />
        <img
          src="@/assets/images/logo_chain_mvc.png"
          alt=""
          class="show-coin w-6 h-6 mr-1.5"
          v-else
        />
        <!-- {{ store.currentShowWallet }} -->
        {{ connectStore.currentChain == 'btc' ? 'Bitcoin' : 'MicrovisionChain' }}
        <img src="@/assets/images/list_icon.png" alt="" class="w-3 h-3 ml-1.5" />
      </span>

      <template #dropdown>
        <div class="tab-wallet box-border p-6 ">
          <div
            class="wallet-type flex mb-2 last:mb-0 justify-between items-center text-sm font-medium cursor-pointer"
            v-for="(item, index) in chainType"
            :key="index"
            @click="selectChain(item.key)"
          >
            <div class="left-content flex items-center mr-6">
              <img :src="getChainImageUrl(item.icon)" alt="" class="chain-icon w-6 h-6 mr-1.5" />
              <div class="text">{{ item.name }}</div>
            </div>
            <img
              src="@/assets/images/btn_check.png"
              alt=""
              class="right-content w-5 h-5"
              :class="connectStore.currentChain === item.key ? 'opacity-100' : 'opacity-0'"
            />
          </div>
        </div>
      </template>
    </ElDropdown>
  </div>

  <div class="gas-warp mr-3 hidden md:block" v-show="connectStore.currentChain == 'btc'">
    <div>
      <!-- 更多操作 -->
      <ElDropdown trigger="click">
        <a
          class="more flex flex-align-center flex-pack-center text-[#303133] font-medium text-sm px-2 py-1.5 "
        >
          <img src="@/assets/images/icon_gas.png" alt="" class="w-[18px] h-[18px] mr-1.5" />
          <!-- <LucideIcon name="Fuel" :size="20" class="text-white font-bold mr-1.5" strokeWidth="2" /> -->
          <span class="mr-1">{{ feebStore.last.currentFeeb.title }}:</span>
          <div>
            <span class="mr-1">{{ feebStore.getCurrentFeeb}}</span
            ><span>sat/vB</span>
          </div>
          <img src="@/assets/images/list_icon.png" alt="" class="w-3 h-3 ml-1.5" />
        </a>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="(item, index) in feebStore.last.feeRateList"
              :key="index"
              @click="trggleFeeb(item)"
            >
              <div class="flex flex-align-center user-operate-item justify-between">
                <!-- <LucideIcon :name="item.icon" :size="20" class=" mr-3" strokeWidth="2" /> -->
                <div class="flex items-center">
                  <img :src="getFeeImageUrl(item.title)" alt="" class="w-[18px] h-[18px] mr-1.5" />
                  <span class="name font-medium text-sm mr-3">{{
                    item.fullTitle ?? item.title
                  }}</span>
                </div>
                <div class="feeRate flex items-center">
                  <span class="mr-1 text-sm font-medium"> {{ item.feeRate }} </span
                  >
                
                  <span>sat/vB</span>
                  <img
                    src="@/assets/images/btn_check.png"
                    alt=""
                    class="w-5 h-5 ml-3"
                    :class="
                      feebStore.last.currentFeeb.title == item.title ? 'opacity-100' : 'opacity-0'
                    "
                  />
                </div>
              </div>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>
  </div>

  <!-- <a
    @click="toMetaName"
    class="outsideMore flex flex-align-center flex-pack-center user-warp-item"
    v-if="!userStore.isAuthorized"
  >
    <img class="metanameLogo" :src="MetaNameLogo" alt="" />
  </a> -->
  <template v-if="userStore.isAuthorized">
    <div class="user-warp flex flex-align-center">
      <template v-if="!isMobile">
        <!-- MetaName -->
        <!-- <a
          @click="toMetaName"
          class="outsideMore flex flex-align-center flex-pack-center user-warp-item"
        >
          <img class="metanameLogo" :src="MetaNameLogo" alt="" />
        </a> -->

       

        <!-- MintCollect -->
        <!-- <el-tooltip
          class="box-item"
          effect="dark"
          content="Mint Collection"
          placement="bottom"
          v-if="isNftPage"
        >
          <a
            @click="toMintNft"
            class="outsideMore flex flex-align-center flex-pack-center user-warp-item"
          >
            <span class="new-tag">New</span>
            <img class="MintLogo" :src="MintLogo" alt="" />
          </a>
        </el-tooltip> -->

      

        <!-- 🔍 搜索 -->
        <!-- <a
          class="flex flex-align-center flex-pack-center user-warp-item"
          @click="layout.$patch({ isShowSearchModal: true })"
          v-if="userStore.isAuthorized"
        > -->
        <a
          class="hidden"
          @click="layout.$patch({ isShowSearchModal: true })"
          v-if="userStore.isAuthorized"
        >
          <Icon name="search" />
        </a>
      </template>

      <!-- 💰 钱包 -->
      <a
        class="flex flex-align-center flex-pack-center user-warp-item"
        @click="layout.$patch({ isShowWallet: true })"
      >
        <Icon name="wallet_fill" />
      </a>

      <!-- 👤 头像 -->
      <el-popover placement="bottom" :width="'auto'" trigger="hover" ref="popover">
        <template #reference>
          <UserAvatar
            :image="connectStore.userInfo.avatarId || connectStore.last.user.avatarId"
            :meta-id="connectStore.userInfo!.metaid"
            :name="connectStore.userInfo!.name || connectStore.last.user.name"
            class="user-warp-item overflow-hidden"
            :meta-name="''"
            :disabled="true"
          />
        </template>
        <UserCardVue
          :name="connectStore.userInfo.name"
          :meta-id="connectStore.userInfo.metaid"
          :meta-name="''"
          :model-value="true"
          @hide="hidePopover"
        />
        <!-- <UserPersonaVue /> -->
      </el-popover>
    </div>
  </template>
  <template v-else>
    <a
      class="main-border primary connect-wallet"
      @click="rootStore.$patch({ isShowLogin: true })"
      >{{ $t('Login.connectWallet') }}</a
    >
  </template>

  <!-- 更多操作 -->
  <ElDropdown trigger="click" @visible-change="val => (isShowUserMenu = val)">
    <a
      class="more flex flex-align-center flex-pack-center user-warp-item"
      :class="{ active: isShowUserMenu }"
    >
      <Icon :name="isShowUserMenu ? 'x_mark' : 'more'" />
    </a>
    <template #dropdown>
      <ElDropdownMenu>
        <template v-if="isMobile">
          <ElDropdownItem @click="layout.$patch({ isShowSearchModal: true })">
            <div class="flex flex-align-center user-operate-item">
              <Icon name="search" />
              <span class="name">{{ $t('UserOperate.search') }}</span>
            </div>
          </ElDropdownItem>
        </template>

        <ElDropdownItem v-for="(item, index) in userOperates" :key="index" @click="item.func()">
          <div class="flex flex-align-center user-operate-item">
            <Icon :name="item.icon" />
            <span class="name">{{ item.name }}</span>
            <span class="isnew" v-if="item.isNew">New</span>
          </div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <SetUserInfoVue
    v-if="isShowSetUserInfo"
    @success="onSetBaseInfoSuccessType"
    @closeSetInfoModal="closeSetInfoModal"
  />

  <Teleport to="body">
    <SettingsModalVue v-model="layout.isShowSettingsModal" />
  </Teleport>

  <!-- wallet -->
  <MyWalletVue v-model="layout.isShowWallet" />
</template>

<script setup lang="ts">
import { useRootStore, isMobile } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { ElDropdown } from 'element-plus'
import { computed, ref,onMounted,onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SettingsModalVue from '@/components/Settings/SettingsModal.vue'
import { useLayoutStore } from '@/stores/layout'
import { useRoute } from 'vue-router'
import MyWalletVue from './MyWallet.vue'
import VersionVue from '../Version/Version.vue'
import UserPersonaVue from '../UserPersona/UserPersona.vue'
import UserCardVue from '../UserCard/UserCard.vue'
import { router } from '@/router'
import MetaNameLogo from '@/assets/svg/meta_name.svg?url'
import MintLogo from '@/assets/svg/mint.svg?url'
import { useFeebStore } from '@/stores/feeb'

import { type FeebPlan} from '@/api/btc-fee'
import SetUserInfoVue from '../ConnectWalletModal/SetUserInfo.vue'
import { useConnectionStore, ConnectChain,type BaseUserInfo } from '@/stores/connection'
import { useNetworkStore } from '@/stores/network'
import { setUser } from '@sentry/vue'
import {DUMMY_UTXO_INPUT_LEGACY} from '@/data/constants'
 import { CircleFadingPlus } from 'lucide-vue-next'
const i18n = useI18n()
const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()
const networkStore = useNetworkStore()
const isProduction = import.meta.env.MODE === 'mainnet'
const feebStore = useFeebStore()
const connectStore=useConnectionStore()
const isShowSetUserInfo = ref(false)
const popover = ref(null);
// const dummyAmount=ref(0)
// const dummyInterval=ref()
const isShowUserMenu = ref(false)
const chainType = ref([
  { name: 'Bitcoin', icon: 'logo_chain_btc',key:'btc' },
  { name: 'MicrovisionChain', icon: 'logo_chain_mvc',key:'mvc' },
])
const userOperates = computed(() => {
  const result = [
    {
      name: i18n.t('UserOperate.settings'),
      icon: 'setting',
      func: () => {
        layout.isShowSettingsModal = true
      },
    },
    {
      name: i18n.t('UserOperate.aboutShow'),
      icon: 'show',
      func: () => {
        window.open('https://show3.gitbook.io/show3.0/v/english/', '_blank')
      },
    },
    {
      name: i18n.t('UserOperate.About MetaSo'),
      icon: 'meta_so',
      func: () => {
        window.open('https://www.metaso.network/', '_blank')
      },
    },
    // {
    //   name: 'Mint Collection',
    //   icon: 'mint',
    //   func: toMintNft,
    //   isNew: true,
    // },
    // {
    //   name: 'MetaName',
    //   icon: 'meta_name',
    //   func: toMetaName,
    // },
    {
      name: i18n.t('UserOperate.help'),
      icon: 'question_circle',
      func: () => {
        router.push(
          `/talk/channels/74462f14a033849bf6067de63ad3d6c54edfa48ec1f2759e8ed8c6165b3f58b2/0dcdbc9d4eba293f8adce8a9b5d82370b66b80f0d53e2ed85a695fcda832c957`
        )
      },
    },
  ]
  if (userStore.isAuthorized) {
    result.push({
      name: i18n.t('UserOperate.logout'),
      icon: 'logout',
      func: () => {
        userStore.logout(route)
        connectStore.disconnect()
      },
    })
  }

  return result
})
console.log('route', route)
const isNftPage = computed(() => {
  return route.path.indexOf('/nft') > -1
})

const toMetaName = () => {
  const routerUrl = router.resolve({
    path: '/metaname',
  })
  window.open(routerUrl.href, '_blank')
}
const getChainImageUrl = (name: string, type: string = 'png') => {
  return new URL(`/src/assets/images/${name}.${type}`, import.meta.url).href
}
const getFeeImageUrl = (name: string, type: string = 'png') => {
  
  return new URL(`/src/assets/images/icon_${name}.${type}`, import.meta.url).href
}

function toMintNft() {
  if (userStore.metaletLogin) {
    return ElMessage.error(`${i18n.t('nosupportmetaletissue')}`)
  }
  router.push('/nft/issue')
}

async function selectChain(chain){
  if(chain !== connectStore.currentChain){
    connectStore.disconnect()
    //userStore.logout(route)
    connectStore.changeChain(chain)
    if(chain == ConnectChain.btc){
      feebStore.update()
    try {
      const btcConnector = await connectStore.connect(ConnectChain.btc)
      console.log(btcConnector)
      userStore.updateUserInfo({
        address: btcConnector.address,
        loginType: 'MetaID',
      })
      const currentUserInfo = await btcConnector.getUser({ network: btcConnector.network })
      console.log(currentUserInfo)
      const currentUserName = currentUserInfo.name
      if (!currentUserName) {
        isShowSetUserInfo.value = true
      } else {
        pushToBuzz(currentUserInfo)
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }

    }else{
      try {
        const mvcConnector = await connectStore.connect(ConnectChain.mvc)
        console.log(mvcConnector)
        userStore.updateUserInfo({
          address: mvcConnector.address,
          loginType: 'MetaID',
        })
        const currentUserInfo = await mvcConnector.getUser({ network: mvcConnector.network })
        const currentUserName = currentUserInfo.name
        if (!currentUserName) {
          isShowSetUserInfo.value = true
        } else {
          pushToBuzz(currentUserInfo)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
  }
}
function hidePopover(){
  popover.value.hide();
}


function closeSetInfoModal() {
  isShowSetUserInfo.value = false
  connectStore.disconnect()
  userStore.logout(route)
}


async function trggleFeeb(feeb:FeebPlan){
  if(feeb.title == feebStore.last.currentFeeb.title) return
  if(feeb.title  == 'Custom'){
    await feebStore.set(feeb.title,1000)
  }else{
    await feebStore.set(feeb.title)
  }
 
}
async function onSetBaseInfoSuccessType(params: {
  name: string
  nft: NFTAvatarItem
  bio: string
  avatarId: string
}) {
  const userInfo = {
    name: params.name,
    bio: params.bio,
    avatar: params.nft,
  }

  console.log(connectStore.currentChain)
  try {
    const setUserInfoRes = await connectStore.last.createUserInfo({
      userData:userInfo,
      options: {
        network: networkStore.network,
        feeRate: feebStore.getCurrentFeeb,
        service: {
          address: import.meta.env.VITE_BTC_SERVICE_ADDRESS,
          satoshis: import.meta.env.VITE_BTC_SERVICE_FEEB,
        },
      },
    })

    console.log(setUserInfoRes)
    if (setUserInfoRes.nameRes) {
      // isShowSetBaseInfo.value = false
      connectStore.updateUser({
        name: params.name,
        bio: params.bio,
        avatarId: params.avatarId,
      })
      isShowSetUserInfo.value = false
      connectStore.setUserNameAndAvatar({ name: params.name,
        avatarId:params.avatarId })
      ElMessage.success('Successful')
    }
    getUserInfo()
  } catch (error) {
    console.log(error)
    const errorMessage = TypeError(error).message
    const toastMessage = errorMessage?.includes('Cannot read properties of undefined')
      ? 'User Canceled'
      : errorMessage
    ElMessage.error(toastMessage)
    isShowSetBaseInfo.value = false
  }
}
async function getUserInfo() {
  const needInfo = {
    network: connectStore.last.network || networkStore.network,
    currentAddress: connectStore.userInfo.address,
  }
  const currentUserInfo = await connectStore.last.getUser({ ...needInfo })
  console.log(currentUserInfo)
  pushToBuzz(currentUserInfo as BaseUserInfo)
}
async function pushToBuzz(data:BaseUserInfo) {
  userStore.updateMetaletLoginState(true)
  console.log(userStore.isAuthorized)
  console.log('pushToBuzz', connectStore)

  setUser({
    id: data.metaid,
    email: '',
    username: data!.name,
  })

  connectStore.updateUser(data)
  userStore.updateUserInfo({
    ...data,
    metaId: data.metaid , // account 有时拿回来的metaId为空
    name: data.name! || connectStore.last.user.name, // account 有时拿回来的name 是旧 name
    address: data.address,
    loginType: 'MetaID',
  })
  router.push('/buzz/tag/1')
}

// function getDummyAmount(){
//   window.metaidwallet.btc.getUtxos({
//     useUnconfirmed:true
//   }).then((result)=>{
//     const filtered = result.filter((utxo) => {
//       return !utxo.inscriptions && utxo.satoshis == DUMMY_UTXO_INPUT_LEGACY
//     })
    
//     dummyAmount.value =filtered.length
//   })
// }

// onMounted(()=>{
//   if(connectStore.last.user.address){
//     dummyInterval.value=setInterval(() => {
//     getDummyAmount()
//   }, 60 * 1000);
//   getDummyAmount()
//   }
// })

// onUnmounted(()=>{
//   clearInterval(dummyInterval.value)
// })


</script>

<style lang="scss" scoped src="./LoginedUserOperate.scss"></style>
