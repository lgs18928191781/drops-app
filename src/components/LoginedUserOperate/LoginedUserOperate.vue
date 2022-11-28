<template>
  <template v-if="userStore.isAuthorized">
    <div class="user-warp flex flex-align-center">
      <UserAvatar :meta-id="userStore.user!.metaId" class="user-warp-item" />

      <!-- 钱包 -->
      <a
        class="flex flex-align-center flex-pack-center user-warp-item"
        @click="isShowWallet = !isShowWallet"
      >
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
          <ElDropdown trigger="click" @visible-change="value => (isShowUserWalletOperates = value)">
            <a
              class="flex flex-align-center user-info"
              :class="{ active: isShowUserWalletOperates }"
            >
              <UserAvatar :meta-id="userStore.user!.metaId" :disabled="true" />
              <div class="name">My Wallet</div>
              <Icon name="down" />
            </a>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  <div class="flex flex-align-center user-wallet-operate-item">
                    <img class="icon icon-img" src="@/assets/images/login_logo_matamask.png" />
                    <span class="name">MetaMask</span>
                    <span class="check-warp flex flex-align-center flex-pack-center">
                      <Icon name="check" />
                    </span>
                  </div>

                  <div
                    class="flex flex-align-center user-wallet-operate-item"
                    @click="item.fun()"
                    v-for="(item, index) in userWalletOperates"
                    :key="index"
                  >
                    <Icon :name="item.icon" />
                    <span class="name">{{ item.name }}</span>
                  </div>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
        <a class="metaId" @click="copy(userStore.user!.metaId)"
          >{{userStore.user!.metaId.slice(0, 6)}}...{{userStore.user!.metaId.slice(-6)}}</a
        >
        <a class="close flex flex-align-center flex-pack-center" @click="isShowWallet = false">
          <Icon name="x_mark" />
        </a>
      </div>

      <div class="cont-warp">
        <!-- tab -->
        <div class="tab flex flex-align-center">
          <a
            class="flex1"
            v-for="(item, index) in tabs"
            :key="index"
            :class="{ active: item.value === tabActive }"
            @click="changeTab(item.value)"
            >{{ item.name }}</a
          >
        </div>

        <!-- 余额 -->
        <template v-if="tabActive === 0">
          <!-- total balance -->
          <div class="total-balance-warp">
            <CardVue color="#FC6D5E">
              <div class="total-balance flex flex-align-center flex-pack-center">
                <div>
                  <div class="label">{{ $t('Wallet.Total balance') }}</div>
                  <div class="value">
                    <template v-if="totalBalanceLoading">
                      <ElIcon class="is-loading">
                        <Loading />
                      </ElIcon>
                    </template>
                    <template v-else> ${{ totalBalance }} USD </template>
                  </div>
                </div>
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
              <div class="wallet-list">
                <div
                  class="wallet-item flex flex-align-center"
                  v-for="wallet in item.list"
                  :key="wallet.name"
                >
                  <div class="flex1 flex flex-align-center flex-pack-start">
                    <div class="icon flex flex-align-center flex-pack-center">
                      <img :src="wallet.icon" />
                    </div>
                    <div class="name">{{ wallet.name }}</div>
                  </div>
                  <div class="value">
                    <template v-if="wallet.loading">
                      <ElIcon class="is-loading">
                        <Loading />
                      </ElIcon>
                    </template>
                    <template v-else>
                      <div class="statosis">{{ wallet.statosis }}</div>
                      <div class="usd">$30.63</div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- nft -->
        <template v-else-if="tabActive === 1">
          <div class="chain flex flex-align-center">
            <div class="label flex1">{{ $t('Wallet.Blockchain') }}</div>
            <ElDropdown trigger="click" @visible-change="value => (isShowChains = value)">
              <a class="flex flex-align-center current-chain" :class="{ active: isShowChains }">
                <div class="icon-warp flex flex-align-center flex-pack-center">
                  <img :src="chains.find(item => item.value === currentChain)?.icon" />
                </div>
                <div class="name">{{ chains.find(item => item.value === currentChain)?.name }}</div>
                <Icon name="down" />
              </a>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem
                    v-for="(item, index) in chains"
                    :key="index"
                    @click="changeChain(item)"
                  >
                    <div
                      class="flex flex-align-center chain-item"
                      :class="{ active: currentChain === item.value }"
                    >
                      <div class="flex1 flex flex-align-center">
                        <div class="icon-warp flex flex-align-center flex-pack-center">
                          <img :src="item.icon" />
                        </div>
                        <span class="name">{{ item.name }}</span>
                      </div>
                      <div class="check-warp flex flex-align-center flex-pack-center">
                        <Icon name="check" v-if="currentChain === item.value" />
                      </div>
                    </div>
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </div>
          <div class="content">
            <ElSkeleton :loading="isSkeleton" animated>
              <div class="nft-genesis-list">
                <div class="nft-genesis-item" v-for="item in Array.from({ length: 6 })">
                  <div class="top flex flex-align-center">
                    <div class="name flex1">Moonbirds</div>
                    <div class="num flex flex-align-center">
                      <span class="count">2</span>
                      <Icon name="down" />
                    </div>
                  </div>
                  <div class="list">
                    <div class="item" v-for="nft in Array.from({ length: 3 })">
                      <NFTCoverVue :cover="[]" />
                    </div>
                  </div>
                </div>
              </div>
            </ElSkeleton>
          </div>
        </template>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { ElDropdown } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CardVue from '../Card/Card.vue'
import SettingsModalVue from '@/components/Settings/SettingsModal.vue'
import { useLayoutStore } from '@/stores/layout'
import { copy } from '@/utils/util'
import ETH from '@/assets/images/eth.png'
import MVC from '@/assets/images/iocn_mvc.png'
import { GetMyMEBalance } from '@/api/v3'
import { Loading } from '@element-plus/icons-vue'
import Decimal from 'decimal.js-light'
import NFTCoverVue from '@/components/NFTCover/NFTCover.vue'

const i18n = useI18n()
const rootStore = useRootStore()
const userStore = useUserStore()
const layout = useLayoutStore()

const tabs = [
  { name: i18n.t('Wallet.Balance'), value: 0 },
  { name: 'NFT', value: 1 },
]

const tabActive = ref(0)

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

const isShowChains = ref(false)
const chains = reactive([
  { name: 'MVC', icon: MVC, value: 'mvc' },
  { name: 'ETH', icon: ETH, value: 'eth' },
])
const currentChain = ref('mvc')

const isSkeleton = ref(false)

const wallets = reactive([
  {
    title: i18n.t('Wallet.Action Points'),
    list: [{ icon: '', name: 'ME', statosis: 0, rate: 0, loading: true }],
  },
  {
    title: i18n.t('Wallet.Balance Details'),
    list: [
      { icon: ETH, name: 'ETH', statosis: 0, rate: 0, loading: true },
      { icon: MVC, name: 'SPACE', statosis: 0, rate: 0, loading: true },
    ],
  },
])
const isShowUserWalletOperates = ref(false)
const userWalletOperates = [
  {
    name: i18n.t('Wallet.Refresh funds'),
    icon: 'refresh',
    fun: () => {
      if (tabActive.value === 0) {
        for (let list of wallets) {
          for (let item of list.list) {
            item.loading = true
          }
        }
        getAllBalace()
      }
    },
  },
  {
    name: i18n.t('logout'),
    icon: 'logout',
    fun: () => {
      userStore.logout().then(() => {
        isShowWallet.value = false
      })
    },
  },
]

const totalBalance = computed(() => {
  let value = 0
  for (let list of wallets) {
    for (let item of list.list) {
      value += item.rate
        ? new Decimal(new Decimal(item.statosis).div(item.rate).toFixed(2)).toNumber()
        : 0
    }
  }
  return value
})
const totalBalanceLoading = computed(() => {
  let value = false
  for (let i = 0; i < wallets.length; i++) {
    for (let n = 0; n < wallets[i].list.length; n++) {
      if (wallets[i].list[n].loading) {
        value = true
        break
      }
    }
    if (value) {
      break
    }
  }
  return value
})

function changeTab(value: number) {
  if (tabActive.value === value) return
  tabActive.value = value
}

function changeChain(item: { name: string; value: string }) {
  if (currentChain.value === item.value) return
  currentChain.value = item.value
}

function getMEBalance() {
  return new Promise<void>(async resolve => {
    const userMeRes = await GetMyMEBalance({ address: userStore.user?.address! }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (userMeRes?.code === 0) {
      wallets[0].list[0].statosis = userMeRes.data.count / 100
      wallets[0].list[0].loading = false
      resolve()
    }
  })
}

function getSpaceBalance() {
  return new Promise<void>(async resolve => {
    // 获取余额
    const res = await userStore
      .showWallet!.wallet!.provider.getXpubBalance(
        userStore.showWallet!.wallet!.wallet.xpubkey.toString()
      )
      .catch(error => {
        ElMessage.error(error.message)
        resolve()
      })
    if (typeof res === 'number') {
      wallets[1].list[1].statosis = res
      wallets[1].list[1].loading = false
      resolve()
    }
  })
}

function getETHBalance() {
  return new Promise<void>(async resolve => {
    // 获取余额
    const res = await userStore
      .showWallet!.wallet!.provider.getXpubBalance(
        userStore.showWallet!.wallet!.wallet.xpubkey.toString()
      )
      .catch(error => {
        ElMessage.error(error.message)
        resolve()
      })
    if (typeof res === 'number') {
      wallets[1].list[0].statosis = res
      wallets[1].list[0].loading = false
      resolve()
    }
  })
}

function getAllBalace() {
  return Promise.all([getMEBalance(), getSpaceBalance(), getETHBalance()])
}

watch(
  () => isShowWallet.value,
  () => {
    if (isShowWallet.value) {
      getAllBalace()
    }
  }
)
</script>

<style lang="scss" scoped src="./LoginedUserOperate.scss"></style>
