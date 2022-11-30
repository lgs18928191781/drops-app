<template>
  <template v-if="userStore.isAuthorized">
    <div class="user-warp flex flex-align-center">
      <UserAvatar :meta-id="userStore.user!.metaId" class="user-warp-item" />

      <!-- 钱包 -->
      <a class="more flex flex-align-center flex-pack-center user-warp-item">
        <Icon name="wallet_fill" />
      </a>

      <!-- 更多操作 -->
      <ElDropdown trigger="click" @visible-change="isShowUserMenu = !isShowUserMenu">
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
        <SettingsModalVue
          v-if="layout.isShowSettingsModal"
          @close-modal="layout.isShowSettingsModal = false"
        />
      </Teleport>
    </div>
  </template>
  <template v-else>
    <a
      class="main-border primary connect-wallet"
      @click="rootStore.$patch({ isShowLogin: true })"
      >{{ $t('Login.connectWallet') }}</a
    >
  </template>

  <!-- wallet -->
  <ElDrawer v-model="isShowWallet" :show-close="false" :with-header="false" :size="'360px'">
    <div class="user-wallet">
      <div class="user flex flex-align-center">
        <div class="flex1">
          <a class="flex flex-alig n-center">
            <UserAvatar :meta-id="userStore.user!.metaId" />
            <div class="name">My Wallet</div>
            <Icon name="down" />
          </a>
        </div>
        <a class="metaId"
          >{{userStore.user!.metaId.slice(0, 6)}}...{{userStore.user!.metaId.slice(-6)}}</a
        >
        <a class="close">
          <Icon name="x_mark" />
        </a>
      </div>

      <div class="cont-warp">
        <!-- tab -->
        <div class="tab">
          <a></a>
        </div>

        <!-- total balance -->
        <div class="total-balance-warp">
          <CardVue>
            <div class="total-balance">
              <div class="label">{{ $t('Wallet.Total balance') }}</div>
              <div class="value">$50.21 USD</div>
            </div>
          </CardVue>
        </div>

        <!-- wallets -->
        <div class="wallets">
          <div class="wallet-section" v-for="(item, index) in wallets" :key="index">
            <div class="top flex flex-align-center">
              <div class="title flex1">{{ item.title }}</div>
              <a class="add flex flex-align-center" v-if="index === 0">
                {{ $t('Wallet.Add Funds') }}
                <Icon name="down" />
              </a>
            </div>
            <div
              class="wallet-item flex flex-align-center"
              v-for="wallet in item.list"
              :key="wallet.name"
            >
              <div class="flex1">
                <div class="icon">
                  <img src="" />
                </div>
                <div class="name">{{ wallet.name }}</div>
              </div>
              <div class="value">
                <div class="statosis">82</div>
                <div class="usd">$30.63</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { ElDropdown } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CardVue from '../Card/Card.vue'
import SettingsModalVue from '@/components/Settings/SettingsModal.vue'
import { useLayoutStore } from '@/stores/layout'

const i18n = useI18n()
const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()

const tabs = [
  { name: i18n.t('Wallet.Balance'), value: 0 },
  { name: 'NFT', value: 1 },
]

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
  {
    name: i18n.t('UserOperate.logout'),
    icon: 'logout',
    func: () => {
      userStore.logout()
    },
  },
]
const isShowWallet = ref(false)

const wallets = reactive([
  {
    title: i18n.t('Wallet.Action Points'),
    list: [{ icon: '', name: 'ME', statosis: 0, rate: 0 }],
  },
  {
    title: i18n.t('Wallet.Balance Details'),
    list: [
      { icon: '', name: 'ETH', statosis: 0, rate: 0 },
      { icon: '', name: 'SPACE', statosis: 0, rate: 0 },
    ],
  },
])
</script>

<style lang="scss" scoped src="./LoginedUserOperate.scss"></style>
