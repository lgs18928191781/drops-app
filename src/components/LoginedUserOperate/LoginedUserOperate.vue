<template>
  <div class="version-warp">
    <VersionVue />
  </div>
  <a
    v-if="!userStore.isAuthorized && !isProduction"
    @click="toMetaName"
    class="outsideMore flex flex-align-center flex-pack-center user-warp-item"
  >
    <img class="metanameLogo" :src="MetaNameLogo" alt="" />
  </a>
  <template v-if="userStore.isAuthorized">
    <div class="user-warp flex flex-align-center">
      <UserAvatar
        :image="userStore.user!.avatarImage"
        :meta-id="userStore.user!.metaId"
        :name="userStore.user!.name"
        class="user-warp-item overflow-hidden"
      />

      <a
        @click="toMetaName"
        class="outsideMore flex flex-align-center flex-pack-center user-warp-item"
        v-if="!isProduction"
      >
        <img class="metanameLogo" :src="MetaNameLogo" alt="" />
      </a>
      <!-- 钱包 -->
      <a
        class="flex flex-align-center flex-pack-center user-warp-item"
        @click="layout.$patch({ isShowWallet: true })"
      >
        <Icon name="wallet_fill" />
      </a>
      <!-- 搜索 -->
      <a
        class="flex flex-align-center flex-pack-center user-warp-item"
        @click="layout.$patch({ isShowSearchModal: true })"
      >
        <Icon name="search" />
      </a>
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
        <ElDropdownItem v-for="(item, index) in userOperates" :key="index" @click="item.func()">
          <div class="flex flex-align-center user-operate-item">
            <Icon :name="item.icon" />
            <span class="name">{{ item.name }}</span>
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
import { useRootStore } from '@/stores/root'
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
const i18n = useI18n()
const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()
const isProduction = import.meta.env.MODE === 'mainnet'

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
    result.unshift({
      name: i18n.t('UserOperate.createGropp'),
      icon: 'plus_circle',
      func: () => {
        layout.$patch({
          isShowCreateCommunityModal: true,
        })
      },
    })
    result.push({
      name: i18n.t('UserOperate.logout'),
      icon: 'logout',
      func: () => {
        userStore.logout(route)
      },
    })
  }

  return result
})

const toMetaName = () => {
  const routerUrl = router.resolve({
    path: '/metaname',
  })
  window.open(routerUrl.href, '_blank')
}
</script>

<style lang="scss" scoped src="./LoginedUserOperate.scss"></style>
