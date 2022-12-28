<template>
  <!-- wallet -->
  <ElDrawer
    :model-value="modelValue"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    :lock-scroll="true"
    custom-class="none-padding"
    :destroy-on-close="isDestroyShowWallet"
  >
    <div class="user-wallet flex flex-v">
      <div class="user flex flex-align-center">
        <div class="flex1">
          <ElDropdown trigger="click" @visible-change="value => (isShowUserWalletOperates = value)">
            <a
              class="flex flex-align-center user-info"
              :class="{ active: isShowUserWalletOperates }"
            >
              <UserAvatar
                :meta-id="userStore.user!.metaId"
                :image="userStore.user!.avatarImage"
                :disabled="true"
              />
              <div class="name">{{ $t('Wallet.My Wallet') }}</div>
              <Icon name="down" />
            </a>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  <div class="flex flex-align-center user-wallet-operate-item">
                    <img class="icon icon-img" :src="loginTypeLogo[userStore!.user!.loginType]" />
                    <span class="name">{{userStore!.user!.loginType}}</span>
                    <span class="check-warp flex flex-align-center flex-pack-center">
                      <Icon name="check" />
                    </span>
                  </div>
                </ElDropdownItem>
                <ElDropdownItem
                  v-for="(item, index) in userWalletOperates"
                  :key="index"
                  @click="item.fun()"
                >
                  <div class="flex flex-align-center user-wallet-operate-item">
                    <Icon :name="item.icon" />
                    <span class="name">{{ item.name }}</span>
                  </div>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
        <el-tooltip class="box-item" effect="dark" :content="i18n.t('copy')" placement="bottom">
          <a class="metaId" @click="copy(userStore.user!.metaId)"
            >{{userStore.user!.metaId.slice(0, 6)}}...{{userStore.user!.metaId.slice(-6)}}</a
          >
        </el-tooltip>

        <a
          class="close flex flex-align-center flex-pack-center"
          @click="emit('update:modelValue', false)"
        >
          <Icon name="x_mark" />
        </a>
      </div>

      <div class="cont-warp flex1 flex flex-v">
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
          <div class="balance">
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
                      <template v-else>
                        {{ rootStore.currentPriceSymbol }}{{ totalBalance }}
                        {{ rootStore.currentPrice }}
                      </template>
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
                  <a
                    class="add flex flex-align-center"
                    v-if="index === 0"
                    @click="isShowMERecharge = true"
                  >
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
                        <div class="value">{{ wallet.value }}</div>
                        <div class="usd">
                          {{ rootStore.currentPriceSymbol }} {{ wallet.price() }}
                        </div>
                      </template>
                    </div>
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
          <div
            class="content flex1"
            v-infinite-scroll="load"
            :infinite-scroll-immediate="false"
            :infinite-scroll-distance="100"
          >
            <ElSkeleton :loading="isSkeleton" animated>
              <div class="nft-genesis-list">
                <div class="nft-genesis-item" v-for="item in genesisList" :key="item.nftTimestamp">
                  <div class="top flex flex-align-center" @click="chooseSeries(item)">
                    <div class="name flex1">
                      {{ item.nftSeriesName ? item.nftSeriesName : item.nftIssuer }}
                    </div>
                    <div class="num flex flex-align-center">
                      <span class="count">{{ item.nftMyCount }}</span>
                      <Icon name="down" />
                    </div>
                  </div>
                  <div class="list">
                    <RouterLink
                      :to="{
                        name: 'nftDetail',
                        params: {
                          chain: currentChain,
                          genesis: nft.nftGenesis,
                          codehash: nft.nftCodehash ? nft.nftCodehash : 'goerli',
                          tokenIndex: nft.nftTokenIndex,
                        },
                      }"
                      class="item"
                      v-for="nft in item.nftDetailItemList"
                      :key="nft.nftIssueMetaTxId"
                      @click.stop="toNFT(nft)"
                    >
                      <NFTCoverVue :cover="[nft.nftIcon]" />
                    </RouterLink>
                  </div>
                </div>
                <IsNullVue v-if="genesisList.length <= 0" />
              </div>
              <LoadMoreVue :pagination="pagination" />
            </ElSkeleton>
          </div>
        </template>
      </div>
    </div>

    <!-- ME充值 -->
    <RechargeMeVue v-model="isShowMERecharge" />

    <!-- NFTlist -->
    <NFTLlistVue
      v-model="seriesNFTList.visible"
      :chain="chains.find(item => item.value === currentChain)?.value"
      :codehash="seriesNFTList.codehash"
      :genesis="seriesNFTList.genesis"
      :seriesName="seriesNFTList.seriesName"
      @link="emit('update:modelValue', false)"
    />
  </ElDrawer>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, reactive, ref, watch } from 'vue'
import MetaMaskLogo from '@/assets/images/login_logo_matamask.png'
import MetaIdLogo from '@/assets/images/iocn_showmoney.png'
import { useI18n } from 'vue-i18n'
import { copy } from '@/utils/util'
import { GetBalance, GetNFTs } from '@/api/aggregation'
import ETH from '@/assets/images/eth.png'
import MVC from '@/assets/images/iocn_mvc.png'
import ME from '@/assets/images/me_logo.png'
import { initPagination } from '@/config'
import { useRootStore } from '@/stores/root'
import Decimal from 'decimal.js-light'
import { GetMyMEBalance } from '@/api/v3'
import { useRoute, useRouter } from 'vue-router'
import CardVue from '../Card/Card.vue'
import NFTCoverVue from '@/components/NFTCover/NFTCover.vue'
import RechargeMeVue from './RechargeMe.vue'
import NFTLlistVue from './NFTLlist.vue'
import LoadMoreVue from '../LoadMore/LoadMore.vue'
import IsNullVue from '../IsNull/IsNull.vue'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const isDestroyShowWallet = ref(false)
const isShowUserWalletOperates = ref(false)
const userStore = useUserStore()
const rootStore = useRootStore()
const route = useRoute()
const router = useRouter()
const i18n = useI18n()

const loginTypeLogo = {
  MetaMask: MetaMaskLogo,
  MetaId: MetaIdLogo,
}

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
      } else {
        isSkeleton.value = true
        pagination.page = 1
        pagination.loading = false
        pagination.nothing = false
        getNFTs(true).then(() => {
          isSkeleton.value = false
        })
      }
    },
  },
  {
    name: i18n.t('logout'),
    icon: 'logout',
    fun: () => {
      isDestroyShowWallet.value = true
      emit('update:modelValue', false)
      // 确保销毁了 wallet 页面才推出， 不然会报错
      setTimeout(() => {
        userStore.logout(route)
      }, 500)
    },
  },
]

const tabActive = ref(0)
const tabs = [
  { name: i18n.t('Wallet.Balance'), value: 0 },
  { name: 'NFT', value: 1 },
]
const isSkeleton = ref(true)
const currentChain = ref('mvc')
const genesisList: UserNFTItem[] = reactive([])
const chains = reactive([
  { name: 'MVC', icon: MVC, value: 'mvc' },
  { name: 'ETH', icon: ETH, value: import.meta.env.VITE_ETH_CHAIN },
])
const pagination = reactive({ ...initPagination })
const isShowMERecharge = ref(false)
const wallets = reactive([
  {
    title: i18n.t('Wallet.Action Points'),
    list: [
      {
        icon: ME,
        name: 'ME',
        value: 0,
        price: function() {
          const rate = rootStore.exchangeRate.find(item => item.symbol === 'ME')
          if (rate) {
            return new Decimal(this.value).mul(rate!.price[rootStore.currentPrice]).toFixed(2)
          }
          return '--'
        },
        loading: true,
      },
    ],
  },
  {
    title: i18n.t('Wallet.Balance Details'),
    list: [
      {
        icon: ETH,
        name: import.meta.env.VITE_ETH_CHAIN,
        value: 0,
        price: function() {
          const rate = rootStore.exchangeRate.find(
            item => item.symbol === import.meta.env.VITE_ETH_CHAIN
          )
          if (rate) {
            return new Decimal(this.value).mul(rate!.price[rootStore.currentPrice]).toFixed(2)
          }
          return '--'
        },
        loading: true,
      },
      {
        icon: MVC,
        name: 'SPACE',
        value: 0,
        price: function() {
          const rate = rootStore.exchangeRate.find(item => item.symbol === 'mvc')
          if (rate) {
            return new Decimal(this.value).mul(rate!.price[rootStore.currentPrice]).toFixed(2)
          }
          return '--'
        },
        loading: true,
      },
    ],
  },
])
const isShowChains = ref(false)
const seriesNFTList = reactive({
  visible: false,
  codehash: '',
  genesis: '',
  seriesName: '',
})

const totalBalance = computed(() => {
  let value = 0
  for (let list of wallets) {
    for (let item of list.list) {
      const result = item.price()
      if (result !== '--') {
        value += new Decimal(result).toNumber()
      }
    }
  }
  return value.toFixed(2)
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
  if (tabActive.value === 1 && isSkeleton.value) {
    getNFTs(true).then(() => {
      isSkeleton.value = false
    })
  }
}

function getNFTs(isCover = false) {
  return new Promise<void>(async resolve => {
    if (currentChain.value !== 'mvc' && !userStore.user!.evmAddress) {
      genesisList.length = 0
      resolve()
    } else {
      const res = await GetNFTs({
        address:
          chains.find(item => item.value === currentChain.value)!.value === 'mvc'
            ? userStore.user!.address!
            : userStore.user!.evmAddress!,
        chain:
          chains.find(item => item.value === currentChain.value)!.value !== 'mvc'
            ? chains.find(item => item.value === currentChain.value)!.value
            : '',
        ...pagination,
      })
      if (res.code === 0) {
        if (isCover) genesisList.length = 0
        genesisList.push(...res.data.results.items)
        resolve()
      }
    }
  })
}

function changeChain(item: { name: string; value: string }) {
  if (currentChain.value === item.value) return
  currentChain.value = item.value

  isSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getNFTs(true).then(() => {
    isSkeleton.value = false
  })
}

function chooseSeries(item: UserNFTItem) {
  seriesNFTList.codehash = item.nftCodehash
  seriesNFTList.genesis = item.nftGenesis
  seriesNFTList.seriesName = item.nftSeriesName
  seriesNFTList.visible = true
}

function getAllBalace() {
  return Promise.all([getMEBalance(), getSpaceBalance(), getETHBalance()])
}

function getMEBalance() {
  return new Promise<void>(async resolve => {
    const userMeRes = await GetMyMEBalance({ address: userStore.user?.address! }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (userMeRes?.code === 0) {
      wallets[0].list[0].value = userMeRes.data.count / 100
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
      wallets[1].list[1].value = new Decimal(
        new Decimal(res).div(Math.pow(10, 8)).toFixed(8)
      ).toNumber()
      wallets[1].list[1].loading = false
      resolve()
    }
  })
}

function getETHBalance() {
  return new Promise<void>(async resolve => {
    // 获取余额
    if (userStore.user!.evmAddress) {
      const res = await GetBalance({
        chain: import.meta.env.VITE_ETH_CHAIN,
        address: userStore.user!.evmAddress!,
      }).catch(error => {
        ElMessage.error(error.message)
        resolve()
      })
      if (res?.code === 0) {
        wallets[1].list[0].value = new Decimal(
          new Decimal(res.data.balance).div(Math.pow(10, 18)).toFixed(4)
        ).toNumber()
        wallets[1].list[0].loading = false
        resolve()
      }
    } else {
      wallets[1].list[0].value = 0
      wallets[1].list[0].loading = false
      resolve()
    }
  })
}

function load() {
  if (isSkeleton.value || tabActive.value !== 1 || pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getNFTs().then(() => {
    pagination.loading = false
  })
}

function toNFT(nft: GenesisNFTItem) {
  emit('update:modelValue', false)
  router.push({
    name: 'nftDetail',
    params: {
      chain: currentChain.value,
      genesis: nft.nftGenesis,
      codehash: nft.nftCodehash ? nft.nftCodehash : currentChain.value,
      tokenIndex: nft.nftTokenIndex,
    },
  })
}

router.beforeEach(() => {
  emit('update:modelValue', false)
})

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      getAllBalace()
    }
  }
)
</script>

<style lang="scss" scoped src="./MyWallet.scss"></style>
