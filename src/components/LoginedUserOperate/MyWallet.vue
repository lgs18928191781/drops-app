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
    @close="emit('update:modelValue', false)"
  >
    <div class="user-wallet flex flex-v" v-if="userStore.user">
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
                :name="userStore.user!.name"
                :meta-name="userStore.user!.metaName"
                class="mr-1"
              />
              <div class="name">{{ $t('Wallet.My Wallet') }}</div>
              <Icon name="down" />
            </a>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  <div class="flex flex-align-center user-wallet-operate-item">
                    <img
                      class="icon icon-img"
                      :src="loginTypeLogo[userStore!.user!.loginType]"
                      v-if="userStore!.user!.loginType !== 'MetaID'"
                    />
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
          <div class="flex flex-align-center metaId">
            MetaID:<a @click="copy(userStore.user!.metaId)">
              {{userStore.user!.metaId.slice(0, 6)}}...{{userStore.user!.metaId.slice(-6)}}</a
            >
          </div>
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

        <!-- 餘额 -->
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
                  <div class="title flex1 flex flex-align-center">
                    {{ item.title }}
                    <Icon v-if="index === 0" name="question_circle" @click="isShowMeIntro = true" />
                  </div>
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
                  <div class="wallet-item" v-for="wallet in item.list" :key="wallet.name">
                    <div class="header flex flex-align-center">
                      <div class="flex1 flex flex-align-center flex-pack-start">
                        <div
                          :class="[
                            'flex flex-align-center flex-pack-center',
                            wallet?.tokenType ? 'ftIcon' : 'icon',
                          ]"
                          v-if="wallet.name !== 'ME'"
                        >
                          <img :src="wallet.icon" />
                        </div>
                        <div>
                          <div class="name">{{ wallet.name }}</div>
                          <span
                            class="address"
                            v-if="wallet.address()"
                            @click="copy(wallet.address())"
                            >{{
                              wallet.address().slice(0, 6) + '...' + wallet.address().slice(-3)
                            }}</span
                          >
                        </div>
                      </div>
                      <a
                        class="transfer main-border"
                        v-if="wallet.isCanTransfer"
                        @click="openTransferMenu(wallet)"
                        >{{ $t('Wallet.Transfer') }}</a
                      >
                      <div class="value">
                        <template v-if="wallet.loading">
                          <ElIcon class="is-loading">
                            <Loading />
                          </ElIcon>
                        </template>
                        <template v-else>
                          <!--!userStore.user?.evmAddress-->
                          <div
                            class="bindBtn"
                            v-if="!userStore.user?.evmAddress && wallet.showBindBtn"
                          >
                            <a @click="BindEvmAccount(wallet.name)" class="main-border primary">{{
                              i18n.t('Wallet.Link Wallet')
                            }}</a>
                          </div>

                          <div v-else-if="!wallet.showBindBtn">
                            <div class="value">{{ wallet.value }}</div>
                            <div class="usd">
                              {{ rootStore.currentPriceSymbol }} {{ wallet.price() }}
                            </div>
                          </div>
                          <div v-else-if="userStore.user?.evmAddress && wallet.showBindBtn">
                            <div class="value">{{ wallet.value }}</div>
                            <div class="usd">
                              {{ rootStore.currentPriceSymbol }} {{ wallet.price() }}
                            </div>
                          </div>
                        </template>
                      </div>
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
                      <div
                        class="check-warp flex flex-align-center flex-pack-center"
                        v-if="currentChain === item.value"
                      >
                        <Icon name="check" />
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
              <div class="nft-tab-wrap">
                <el-tabs v-model="nftTab" class="demo-tabs" @tab-click="triggleNftTab">
                  <el-tab-pane label="My NFT" :name="1"></el-tab-pane>
                  <el-tab-pane label="On Sale" :name="2"></el-tab-pane>
                </el-tabs>
                <el-icon :size="16" color="#303133" @click="refreshList"><Refresh /></el-icon>
              </div>
              <div class="nft-genesis-list" v-if="nftTab === 1">
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
                          codehash: nft.nftCodehash ? nft.nftCodehash : currentChain,
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

              <div class="nft-genesis-list" v-if="nftTab === 2">
                <div class="nft-genesis-item">
                  <div class="list">
                    <RouterLink
                      v-for="item in MyNftOnSaleList"
                      :to="{
                        name: 'nftDetail',
                        params: {
                          chain: currentChain,
                          genesis: item.nftGenesis,
                          codehash: item.nftCodehash ? item.nftCodehash : currentChain,
                          tokenIndex: item.nftTokenIndex,
                        },
                      }"
                      class="item"
                      @click.stop="toNFT(item)"
                    >
                      <NFTCoverVue :cover="[item.nftIcon]" />
                      <span class="saleNftName">{{ item.nftName }}</span>
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

    <!-- ME Intro -->
    <MEIntroVue v-model="isShowMeIntro" />

    <!-- Transfer -->
    <Transfer v-model="isShowTransfer" :ftInfo="currentFtInfo.val" />
  </ElDrawer>

  <!-- MetaMask -->
  <MetaMask ref="MetaMaskRef" id="metamask" @bindEvmAccount="startBinding" />
</template>

<script setup lang="ts">
import MetaMask from '@/plugins/MetaMak.vue'
import { useUserStore } from '@/stores/user'
import { computed, reactive, ref, watch, toRaw } from 'vue'
import MetaMaskLogo from '@/assets/images/login_logo_matamask.png'
import MetaIdLogo from '@/assets/images/iocn_showmoney.png'
import { useI18n } from 'vue-i18n'
import { Refresh } from '@element-plus/icons-vue'
import {
  copy,
  getUserBsvBalance,
  mappingChainName,
  currentConnectChain,
  openLoading,
  getBalance,
} from '@/utils/util'
import { GetBalance, GetNFTs, GetBindMetaidAddressList, GetFTs,GetMyNftOnSale } from '@/api/aggregation'
import { setHashData, LoginByEthAddress } from '@/api/core'
import ETH from '@/assets/images/eth.png'
import MVC from '@/assets/images/icon_mvc.png'
import ME from '@/assets/images/me_logo.png'
import BSV from '@/assets/images/bsv.png'
import Polygon from '@/assets/svg/polygon.svg?url'
import { initPagination, chains, ethBindingData } from '@/config'
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
import ContentModalVue from '../ContentModal/ContentModal.vue'
import { currentSupportChain } from '@/config'
import MEIntroVue from '../MEIntro/MEIntro.vue'
import Transfer from './Transfer.vue'
import { Chains, CurrentSupportChain, NodeName } from '@/enum'
import { decryptMnemonic, encryptMnemonic, HdWallet } from '@/utils/wallet/hd-wallet'
import { decode, encode } from 'js-base64'
import { MD5 } from 'crypto-js'
import { MetaMaskLoginUserInfo } from '@/plugins/utils/api'
import { ErrorDescription } from '@ethersproject/abi/lib/interface'
import { metafile } from '@/utils/filters'
import type { TabsPaneContext } from 'element-plus'
import { debounce } from '@/utils/util'
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
const MetaMaskRef = ref()
const nftTab= ref(1)
const loginTypeLogo = {
  MetaMask: MetaMaskLogo,
  MetaId: MetaIdLogo,
}



const FtList: ftListType[] = reactive([
  {
    icon: '',
    name: '',
    value: 0,
    showBindBtn: false,
    address: () => '',
    isCanTransfer: true,
    price: () => '--',
    loading: true,
    tokenType: 'FT',
    codehash: '',
    genesis: '',
    decimalNum: 0,
    ftSymbol: '',
    ftName: '',
  },
])

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
        getFts(true)
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
const currentChain = ref(Chains.MVC)
const genesisList: UserNFTItem[] = reactive([])
const userFtList: FungibleToken[] = reactive([])
const pagination = reactive({ ...initPagination })
const onSalePagenation = reactive({
  flag:""
})
const isShowMERecharge = ref(false)
const isShowTransfer = ref(false)
const MyNftOnSaleList:GenesisNFTItem[]=reactive([])
const wallets = reactive([
  {
    title: i18n.t('Wallet.Action Points'),
    list: [
      {
        icon: '',
        name: 'ME',
        value: 0,
        showBindBtn: false,
        address: () => '',
        isCanTransfer: false,
        price: function() {
          const rate = rootStore.exchangeRate.find(item => item.symbol === 'ME')
          if (rate) {
            // @ts-ignore
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
        name: import.meta.env.VITE_ETH_CHAIN.toUpperCase(),
        value: 0,
        showBindBtn: true,
        address: () => userStore.user?.evmAddress || '',
        isCanTransfer: false,
        price: function() {
          const rate = rootStore.exchangeRate.find(
            item => item.symbol === import.meta.env.VITE_ETH_CHAIN
          )
          if (rate) {
            // @ts-ignore
            return new Decimal(this.value).mul(rate!.price[rootStore.currentPrice]).toFixed(2)
          }
          return '--'
        },
        loading: true,
      },
      {
        icon: Polygon,
        name: import.meta.env.VITE_POLYGON_CHAIN.toUpperCase(),
        value: 0,
        showBindBtn: true,
        address: () => userStore.user?.evmAddress || '',
        isCanTransfer: false,
        price: function() {
          const rate = rootStore.exchangeRate.find(
            item => item.symbol === import.meta.env.VITE_POLYGON_CHAIN
          )
          if (rate) {
            // @ts-ignore
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
        showBindBtn: false,
        address: () => userStore.user?.address || '',
        isCanTransfer: true,
        price: function() {
          const rate = rootStore.exchangeRate.find(item => item.symbol === Chains.MVC)
          if (rate) {
            // @ts-ignore
            return new Decimal(this.value).mul(rate!.price[rootStore.currentPrice]).toFixed(2)
          }
          return '--'
        },
        loading: true,
      },
      // {
      //   icon: BSV,
      //   name: 'BSV',
      //   value: 0,
      //   showBindBtn: false,
      //   address: () => userStore.user?.address || '',
      //   isCanTransfer: false,
      //   price: function() {
      //     const rate = rootStore.exchangeRate.find(item => item.symbol === Chains.BSV)
      //     if (rate) {
      //       // @ts-ignore
      //       return new Decimal(this.value).mul(rate!.price[rootStore.currentPrice]).toFixed(2)
      //     }
      //     return '--'
      //   },
      //   loading: true,
      // },
    ],
  },
  {
    title: i18n.t('Wallet.MvcFt'),
    list: FtList,
  },
])
const isShowChains = ref(false)
const seriesNFTList = reactive({
  visible: false,
  codehash: '',
  genesis: '',
  seriesName: '',
})
const currentFtInfo: { val: ftListType | null } = reactive({
  val: null,
})
const isShowMeIntro = ref(false)

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

function MyNftOnSale(flag = "") {
  return new Promise<void>((resolve, reject) => {
    GetMyNftOnSale({
      chain:currentChain.value,
      address:userStore.user?.address!,
      pageSize:`${pagination.pageSize}`,
      flag
    }).then((res) => {
      if (res.code == 0) {
        onSalePagenation.flag=res.data.flag!
        MyNftOnSaleList.push(...res.data.results.items)
        resolve()
     }
    })
  })
}

const triggleNftTab = async(tab: TabsPaneContext, event: Event) => {
  if (nftTab.value == tab.props.name) return
  nftTab.value=tab.props.name as number
  if (nftTab.value == 1) {
    if (genesisList.length) return
    getNFTs(true)
  } else if (nftTab.value == 2) {
    if (MyNftOnSaleList.length) return
    MyNftOnSale()
  }
}


function refreshList() {
  if (nftTab.value == 1) {
    genesisList.length=0
    pagination.page = 1
    debounce(getNFTs(true),2000)
  } else if (nftTab.value == 2) {
    MyNftOnSaleList.length = 0
    debounce(MyNftOnSale(),2000)
  }
}

function openTransferMenu(ftInfo: ftListType) {
  isShowTransfer.value = true
  if (ftInfo?.codehash && ftInfo?.genesis) {
    currentFtInfo.val = ftInfo
  } else {
    currentFtInfo.val = null
  }
}

//创建 eht 绑定的brfc 节点
function createETHBindingBrfcNode(MetaidRes: BindMetaIdRes) {
  const { wallet, userInfo } = MetaidRes
  const hdWallet = toRaw(wallet)
  return new Promise<void>(async (resolve, reject) => {
    try {
      // 1. 先获取utxo
      let utxos = await hdWallet.provider.getUtxos(hdWallet.wallet.xpubkey.toString())
      if (!utxos.length) {
        const initUtxo = await hdWallet.provider
          .getInitAmount({
            address: hdWallet.rootAddress,
            xpub: hdWallet.wallet.xpubkey.toString(),
            token: userInfo.token || '',
            userName: userInfo.userType === 'phone' ? userInfo.phone : userInfo.email,
          })
          .catch(error => {
            console.log(error)
          })
        if (initUtxo) {
          utxos = [initUtxo]
        }
      }

      if (utxos.length) {
        // 2. 把钱打到protocols节点
        // 先把钱打回到 protocolAddress
        const transfer = await hdWallet.makeTx({
          utxos: utxos,
          // opReturn: [],
          change: hdWallet.rootAddress,
          payTo: [
            {
              amount: 2000,
              address: hdWallet
                ?.getPathPrivateKey(hdWallet.keyPathMap.Info.keyPath)
                .publicKey.toAddress(hdWallet.network)
                .toString(),
            },
          ],
        })
        if (transfer) {
          const utxo = await hdWallet.utxoFromTx({
            tx: transfer,
            addressInfo: {
              addressType: 0,
              addressIndex: 1,
            },
            outPutIndex: 0,
          })
          if (utxo) {
            utxos = [utxo]
          }
          // 创建 eht 绑定的brfc 节点

          // const res = await GetUserInfo(userInfo.metaId)
          let ethBindingData: Partial<ethBindingData> = {}
          const bingdMetaidTypes = await GetBindMetaidAddressList(userInfo.metaId)

          if (currentConnectChain(userInfo.chainId) == CurrentSupportChain.Eth) {
            ethBindingData.eth = userInfo.evmAddress
          } else if (currentConnectChain(userInfo.chainId) == CurrentSupportChain.Polygon) {
            ethBindingData.polygon = userInfo.evmAddress
          }
          if (bingdMetaidTypes.code == 0 && bingdMetaidTypes.data.thirdPartyAddresses) {
            ethBindingData = {
              ...ethBindingData,
              ...JSON.parse(bingdMetaidTypes.data.thirdPartyAddresses),
            }
          }
          console.log('ethBindingData', ethBindingData)
          const newBfrcNode = await hdWallet.provider.getNewBrfcNodeBaseInfo(
            hdWallet.wallet.xpubkey.toString(),
            userInfo.infoTxId
          )
          const ethBindBrfc = await hdWallet.createNode({
            nodeName: NodeName.ETHBinding,
            parentTxId: userInfo.infoTxId,
            data: JSON.stringify(ethBindingData),
            utxos: utxos,
            change: hdWallet.rootAddress,
          })

          if (ethBindBrfc) {
            await hdWallet.provider.broadcast(transfer.toString())
            await hdWallet.provider.broadcast(ethBindBrfc.hex!)
            resolve()
          }
        }
      } else {
        reject(new Error(i18n.t('spaceEnghout')))
      }
    } catch (error) {
      reject(error)
    }
  })
}

function sendHash(userInfo: MetaMaskLoginUserInfo, evmEnMnemonic: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await setHashData({
        address: userInfo?.ethAddress || userInfo.evmAddress,
        accessKey: userInfo.token,
        userName:
          userInfo.register == 'email' || userInfo.registerType == 'email'
            ? userInfo.email
            : userInfo.phone,
        timestamp: +new Date(),
        metaId: userInfo.metaId,
        evmEnMnemonic: evmEnMnemonic,
        chainId: userInfo?.chainId,
      })
      // @ts-ignore

      if (res.code == 0) {
        // @ts-ignore
        resolve(res.msg)
      }
    } catch (error) {
      reject(error)
    }
  })
}

async function startBinding(params: { signAddressHash: string; address: string; chainId: string }) {
  try {
    const isBinded = await LoginByEthAddress({
      evmAddress: params.address,
      chainId: params.chainId,
    })
    if (isBinded.code == 0 && isBinded.data) {
      return ElMessage.error(`${i18n.t('wallethasBinding')}`)
    }
  } catch (error) {
    if ((error as any).code == -1) {
      let loading
      loading = openLoading({
        text: i18n.t('binding_now'),
      })
      const originShowmoneyPassword = decode(localStorage.getItem(encode('password'))!)
      const mnemonic = userStore!.user!.enCryptedMnemonic
      const decodeMnemonic = decryptMnemonic(mnemonic, originShowmoneyPassword)
      const encodeMnemonic = encryptMnemonic(decodeMnemonic, MD5(params.signAddressHash).toString())
      userStore.updateUserInfo({
        ...userStore.user!,
        evmAddress: params.address,
        chainId: params.chainId,
      })
      await createETHBindingBrfcNode({
        userInfo: userStore.user,
        wallet: userStore.wallet?.wallet,
        password: originShowmoneyPassword,
      })
      await sendHash(userStore.user!, encodeMnemonic)
      loading.close()
      ElMessage.success(`${i18n.t('bindingSuccess')}`)
    }
  }
}

function BindEvmAccount(chain: string) {
  rootStore.updateShowLoginBindEvmAccount({
    isUpdatePlan: false,
    loginedButBind: true,
    bindEvmChain: mappingChainName(chain)!,
  })
  MetaMaskRef.value.startConnect()
}

function changeTab(value: number) {
  if (tabActive.value === value) return
  tabActive.value = value
  if (tabActive.value === 1 && isSkeleton.value) {
    getNFTs(true).then(() => {
      isSkeleton.value = false
    })
  }
}

function getFts(isCover = false) {
  return new Promise<void>(async resolve => {
    if (
      currentChain.value !== Chains.MVC &&
      currentChain.value !== Chains.BSV &&
      !userStore.user!.address
    ) {
      FtList.length = 0
      userFtList.length = 0
      resolve()
    } else {
      const res = await GetFTs({
        address: userStore.user!.address!,
        chain: Chains.MVC,
        page: 1,
        pageSize: 30,
      })
      if (res.code === 0) {
        if (isCover) FtList.length = 0
        if (res.data.results.items.length === 0) pagination.nothing = true
        res.data.results.items.map(ft => {
          FtList.push({
            icon: metafile(ft.icon),
            name: ft.name,
            value: +ft.balance,
            showBindBtn: false,
            address: () => userStore.user?.address || '',
            isCanTransfer: true,
            price: function() {
              return '--'
            },
            loading: false,
            tokenType: 'FT',
            codehash: ft.codehash,
            genesis: ft.genesis,
            decimalNum: ft.decimalNum,
            ftSymbol: ft.symbol,
            ftName: ft.name,
          })
        })
        resolve()
      }
    }
  })
}

function getNFTs(isCover = false) {
  return new Promise<void>(async resolve => {
    if (
      currentChain.value !== Chains.MVC &&
      currentChain.value !== Chains.BSV &&
      (!userStore.user!.evmAddress || !userStore.user?.ethAddress)
    ) {
      genesisList.length = 0
      resolve()
    } else {
      const res = await GetNFTs({
        address:
          currentChain.value === Chains.MVC || currentChain.value === Chains.BSV
            ? userStore.user!.address!
            : userStore.user!.evmAddress! || userStore.user?.ethAddress,
        chain: currentChain.value,
        ...pagination,
      })
      if (res.code === 0) {
        if (isCover) genesisList.length = 0
        if (res.data.results.items.length === 0) pagination.nothing = true
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
  return Promise.all([
    getMEBalance(),
    getSpaceBalance(),
    getETHBalance(),
    getPolygonBalance(),
    //getBsvBalance(),
  ])
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
    // 获取餘额
    const res = await userStore
      .showWallet!.wallet!.provider.getXpubBalance(
        userStore.showWallet!.wallet!.wallet.xpubkey.toString()
      )
      .catch(error => {
        ElMessage.error(error.message)
        resolve()
      })
    if (typeof res === 'number') {
      const item = wallets[1].list.find(item => item.name === 'SPACE')
      if (item) {
        item.value = new Decimal(new Decimal(res).div(Math.pow(10, 8)).toFixed(8)).toNumber()
        item.loading = false
      }
      resolve()
    }
  })
}

function getETHBalance() {
  return new Promise<void>(async resolve => {
    // 获取餘额
    const item = wallets[1].list.find(
      item => item.name === import.meta.env.VITE_ETH_CHAIN.toUpperCase()
    )
    if (item) {
      const res = await getBalance({
        chain: Chains.ETH,
      })
      item.value = new Decimal(new Decimal(res).div(Math.pow(10, 18)).toFixed(4)).toNumber()
      item.loading = false
      resolve()
    }
  })
}

function getPolygonBalance() {
  return new Promise<void>(async resolve => {
    // 获取餘额
    const item = wallets[1].list.find(
      item => item.name === import.meta.env.VITE_POLYGON_CHAIN.toUpperCase()
    )
    if (item) {
      const res = await getBalance({
        chain: Chains.POLYGON,
      })
      item.value = new Decimal(new Decimal(res).div(Math.pow(10, 18)).toFixed(8)).toNumber()
      item.loading = false
      resolve()
    }
  })
}

function getBsvBalance() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await getBalance({ chain: Chains.BSV })
    if (typeof res === 'number') {
      wallets[1].list[3].value = new Decimal(
        new Decimal(res).div(Math.pow(10, 8)).toFixed(8)
      ).toNumber()
      wallets[1].list[3].loading = false
      resolve()
    }
  })
}

function load() {
  if (isSkeleton.value || tabActive.value !== 1 || pagination.loading || pagination.nothing) return
  pagination.loading = true
  if (nftTab.value == 1) {
    pagination.page++
    getNFTs().then(() => {
    pagination.loading = false
    })
  }else if (nftTab.value == 2) {
    MyNftOnSale(onSalePagenation.flag)
  }
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
      getFts(true)
    }
  }
)
</script>

<style lang="scss" scoped src="./MyWallet.scss"></style>
