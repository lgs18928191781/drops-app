<template>
  <div class="version-warp hidden lg:block">
    <VersionVue />
  </div>

  <div class="gas-warp mr-3">
    <div>
      <!-- 更多操作 -->
      <ElDropdown trigger="click">
        <a
          class="more flex flex-align-center flex-pack-center border text-white font-medium text-sm rounded-xl bg-[#FC6D5E] px-2 py-1.5 "
        >
          <LucideIcon name="Fuel" :size="20" class="text-white font-bold mr-1.5" strokeWidth="2" />
          <span class="mr-1">{{ feebStore.last.currentFeeb.title }}</span>
          <div>
            <span class="mr-1">{{ feebStore.last.currentFeeb.feeRate }}</span
            ><span>sat/vB</span>
          </div>
        </a>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="(item, index) in feebStore.last.feeRateList"
              :key="index"
              @click="trggleFeeb(item)"
            >
              <div class="flex flex-align-center user-operate-item">
                <LucideIcon :name="item.icon" :size="20" class=" mr-3" strokeWidth="2" />
                <span class="name  font-bold text-sm mr-3">{{ item.fullTitle ?? item.title }}</span>
                <div class="feeRate ">
                  <span class="mr-1 text-[#FC6D5E] text-base font-bold"> {{ item.feeRate }} </span
                  ><span>sat/vB</span>
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
        <el-tooltip
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
        </el-tooltip>
        <!-- 🔍 搜索 -->
        <a
          class="flex flex-align-center flex-pack-center user-warp-item"
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
      <el-popover placement="bottom" :width="'auto'" trigger="hover">
        <template #reference>
          <UserAvatar
            :image="connectStore.userInfo.avatarId || connectStore.last.user.avatarId"
            :meta-id="connectStore.userInfo!.metaid"
            :name="connectStore.userInfo!.name || connectStore.last.user.name"
            class="user-warp-item overflow-hidden"
            :meta-name="userStore.user!.metaName"
            :disabled="true"
          />
          
        </template>
        <img src="blob:http://localhost:5173/ab85144a-e3f3-4dd0-b3c2-3ba478e4b46e" alt="">
        <UserCardVue
          :name="connectStore.userInfo.name"
          :meta-id="connectStore.userInfo.metaid"
          :meta-name="userStore.user!.metaName"
          :model-value="true"
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
import { computed, ref } from 'vue'
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
import LucideIcon from '@/components/LucideIcon/index.vue'
import { type FeebPlan} from '@/api/btc-fee'
import { useConnectionStore } from '@/stores/connection'
const i18n = useI18n()
const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()
const isProduction = import.meta.env.MODE === 'mainnet'
const feebStore = useFeebStore()
const connectStore=useConnectionStore()


const isShowUserMenu = ref(false)
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

function toMintNft() {
  if (userStore.metaletLogin) {
    return ElMessage.error(`${i18n.t('nosupportmetaletissue')}`)
  }
  router.push('/nft/issue')
}

async function trggleFeeb(feeb:FeebPlan){
  if(feeb.title == feebStore.last.currentFeeb.title) return
  await feebStore.set(feeb.title)
}
</script>

<style lang="scss" scoped src="./LoginedUserOperate.scss"></style>
