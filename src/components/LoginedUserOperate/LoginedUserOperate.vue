<template>
  <template v-if="userStore.isAuthorized">
    <div class="user-warp flex flex-align-center">
      <UserAvatar :meta-id="userStore.user!.metaId" />
      <ElDropdown trigger="click" @visible-change="isShowUserMenu = !isShowUserMenu">
        <a class="more flex flex-align-center flex-pack-center" :class="{ active: isShowUserMenu }">
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
    </div>
  </template>
  <template v-else>
    <a
      class="main-border primary connect-wallet"
      @click="rootStore.$patch({ isShowLogin: true })"
      >{{ $t('Login.connectWallet') }}</a
    >
  </template>
</template>

<script setup lang="ts">
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { ElDropdown } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const rootStore = useRootStore()
const userStore = useUserStore()

const isShowUserMenu = ref(false)
const userOperates = [
  {
    name: i18n.t('UserOperate.createGropp'),
    icon: 'plus_circle',
    func: () => {},
  },
  {
    name: i18n.t('UserOperate.settings'),
    icon: 'setting',
    func: () => {},
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
  {
    name: i18n.t('UserOperate.logout'),
    icon: 'logout',
    func: () => {
      userStore.logout()
    },
  },
]
</script>

<style lang="scss" scoped src="./LoginedUserOperate.scss"></style>
