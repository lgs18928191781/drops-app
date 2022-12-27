<template>
  <template v-if="userStore.isAuthorized">
    <div class="user-warp flex flex-align-center">
      <UserAvatar
        :image="userStore.user!.avatarImage"
        :meta-id="userStore.user!.metaId"
        class="user-warp-item"
        :disabled="true"
      />

      <!-- 钱包 -->
      <a
        class="flex flex-align-center flex-pack-center user-warp-item"
        @click="layout.$patch({ isShowWallet: true })"
      >
        <Icon name="wallet_fill" />
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

const i18n = useI18n()
const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()

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
      icon: 'plus_circle',
      func: () => {},
    },
    {
      name: i18n.t('UserOperate.help'),
      icon: 'question_circle',
      func: () => {},
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
</script>

<style lang="scss" scoped src="./LoginedUserOperate.scss"></style>
