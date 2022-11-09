<template>
  <!-- 连接钱包 -->
  <ElDialog :model-value="rootStore.isShowLogin" :title="$t('Login.connectWallet')">
    <div class="login-warp flex">
      <div class="flex1 login-cover">
        <img src="@/assets/images/login_img.png" />
      </div>
      <div class="flex1">
        <!-- 选择钱包 -->
        <div class="connect-wallet flex flex-v" v-if="status === ConnectWalletStatus.Watting">
          <div class="connect-wallet-section flex1" v-for="(item, index) in wallets" :key="index">
            <div class="title">{{ item.title() }}</div>
            <div
              class="btn-list flex flex-v"
              v-for="(wallet, walletIndex) in item.list"
              :key="walletIndex"
            >
              <div class="main-border flex flex-align-center" @click="wallet.fun()">
                <img class="icon" :src="wallet.icon" />
                {{ wallet.name() }}
              </div>
            </div>
          </div>
        </div>

        <!-- 使用MetaId钱包 -->
        <MetaIdWalletVue
          v-model:type="type"
          v-else-if="status === ConnectWalletStatus.UseMetaId"
          @back="status = ConnectWalletStatus.Watting"
          @register="OnMetaIdRegister"
        />
      </div>
    </div>
  </ElDialog>

  <!-- MetaMask -->
  <MetaMask v-model="isShowMetaMak" id="metamask" @success="onThreePartLinkSuccess" />

  <!-- 登录注册 -->
  <!-- <LoginAndRegisterModalVue
    v-model="isShowLoginAndRegister"
    v-model:type="type"
    @success="onLoginAndRegisterSuccess"
  /> -->

  <!-- setBaseInfo -->
  <SetBaseInfoVue v-model="isShowSetBaseInfo" />

  <!-- send buzz -->
  <ElDialog v-model="isShowSendBuzz" :show-close="false" :close-on-click-modal="false">
    <div class="send-first-buzz" v-loading="isSendBuzzLoading">
      <div class="title">{{ $t('sendFirstBuzz1') }}</div>
      <div class="drsc">{{ $t('sendFirstBuzz2') }}</div>
      <div class="image">
        <img :src="FirstBuzzImg" />
      </div>
      <div class="input">
        <input type="text" v-model="buzz" :placeholder="$t('firstBuzzText')" />
        <div class="tips">
          {{ $t('sendFirstBuzz3') }}
        </div>
      </div>
      <div class="operate">
        <ElButton type="primary" @click="sendBuzz">{{ $t('Send') }}</ElButton>
      </div>
    </div>
  </ElDialog>

  <ElDialog v-model="isShowSendBuzzSuccess" class="reactive" :show-close="false">
    <div class="send-buzz-success">
      <img class="top-image" src="@/assets/images/buzz_success.png" />
      <div class="title">{{ $t('sendBuzzSuccessTitle') }}</div>
      <div class="cont">
        <div class="cont-warp">
          <div class="cont-item flex flex-align-center">
            <span class="key">TXID:</span>
            <span class="value"
              ><a @click="toMvcScan(buzzResult.txId)"
                >{{ buzzResult.txId.slice(0, 6) }}...{{ buzzResult.txId.slice(-6) }}</a
              ></span
            >
          </div>
          <div class="cont-item flex flex-align-center">
            <span class="key">{{ $t('Time') }}:</span>
            <span class="value">{{ $filters.dateTimeFormat(buzzResult.time) }}</span>
          </div>
        </div>
      </div>

      <div class="operate">
        <ElButton type="primary" size="large" @click="toBuzz">{{ $t('To Showbuzz') }}</ElButton>
      </div>
    </div>
  </ElDialog>

  <!-- 推荐关注 -->
  <RecommentFollowVue />

  <!-- 助记词备份 -->
  <BackupMnemonicVue />

  <!-- 绑定metaId -->
  <BindMetaIdVue
    :thirdPartyWalletSignAddress="thirdPartyWalletSignAddress"
    ref="BindMetaIdRef"
    v-model="isShowBindModal"
    @register="isShowSetBaseInfo = true"
  />
</template>

<script setup lang="ts">
import IconMetaMask from '@/assets/images/login_logo_matamask.png'
import IconWallteConnect from '@/assets/images/login_logo_wallteconnect.png'
import IconAdd from '@/assets/images/wallte_icon_add.png'
import IconLine from '@/assets/images/wallte_icon_line.png'
import IconMVC from '@/assets/images/iocn_mvc.png'
import IconShowmoney from '@/assets/images/iocn_showmoney.png'
import MetaMask, { MetaMaskLoginRes } from '@/plugins/MetaMak.vue'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { SDK } from '@/utils/sdk'
import { HdWallet, hdWalletFromMnemonic, eciesDecryptData } from '@/utils/wallet/hd-wallet'
import LoginAndRegisterModalVue from '@/components/LoginAndRegisterModal/LoginAndRegisterModal.vue'
import FirstBuzzImg from '@/assets/images/first_buzz.svg?url'
import { toMvcScan } from '@/utils/util'
import MetaIdWalletVue, { MetaIdWalletRegisterBaseInfo } from './MetaIdWallet.vue'
import SetBaseInfoVue from './SetBaseInfo.vue'
import RecommentFollowVue from './RecommentFollow.vue'
import BackupMnemonicVue from './BackupMnemonic.vue'
import BindMetaIdVue from './BindMetaId.vue'

import { reactive, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BindStatus, NodeName } from '@/enum'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import { GetUserAllInfo } from '@/api/aggregation'
import { debug } from 'console'
import { LoginByHashData } from '@/api/core'
import { decode, encode } from 'js-base64'

const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const emit = defineEmits(['metamask'])

const isShowMetaMak = ref(false)
const isShowLoginAndRegister = ref(false)
const type: Ref<'login' | 'register'> = ref('login')
const isShowSendBuzz = ref(false)
const buzz = ref('')
const isSendBuzzLoading = ref(false)
const isShowSendBuzzSuccess = ref(false)
const buzzResult = reactive({
  time: '',
  txId: '',
})

const enum ConnectWalletStatus {
  Watting,
  WallteConnect,
  UseMetaId,
}

const status: Ref<ConnectWalletStatus> = ref(ConnectWalletStatus.Watting)

const BindMetaIdRef = ref()
const thirdPartyWalletSignAddress = ref('')
const isShowBindModal = ref(false)
const metaIdWalletRegisterBaseInfo: { val: null | MetaIdWalletRegisterBaseInfo } = reactive({
  val: null,
})

const wallets = [
  {
    title: () => {
      return i18n.t('Login.connectWallet')
    },
    list: [
      {
        name: () => {
          return 'MetaMask'
        },
        icon: IconMetaMask,
        fun: () => {
          rootStore.$patch({ isShowLogin: false })
          isShowMetaMak.value = true
        },
      },
      {
        name: () => {
          return 'WallteConnect'
        },
        icon: IconWallteConnect,
        fun: connectMetaLet,
      },
    ],
  },
  {
    title: () => {
      return i18n.t('Login.useMetaIdWallet')
    },
    list: [
      {
        name: () => {
          return i18n.t('Login.createWallet')
        },
        desc: () => {
          return i18n.t('Login.notAnyWallet')
        },
        icon: IconAdd,
        fun: () => {
          type.value = 'register'
          // rootStore.$patch({ isShowLogin: false })
          // isShowMetaMak.value = true
          status.value = ConnectWalletStatus.UseMetaId
        },
      },
      {
        name: () => {
          return i18n.t('Login.connectWallet')
        },
        desc: () => {
          return i18n.t('Login.havedAnyWallet')
        },
        icon: IconLine,
        fun: () => {
          type.value = 'login'
          // rootStore.$patch({ isShowLogin: false })
          // isShowLoginAndRegister.value = true
          status.value = ConnectWalletStatus.UseMetaId
        },
      },
    ],
  },
]

// setbaseinfo
const isShowSetBaseInfo = ref(true)

async function metaMaskLoginSuccess(res: MetaMaskLoginRes) {
  const response = await GetUserAllInfo(res.userInfo.metaId).catch(error => {
    ElMessage.error(error.message)
  })
  if (response?.code === 0) {
    await userStore.updateUserInfo({
      ...response.data,
      ...res.userInfo,
      password: res.password,
      userType: 'email',
    })
    userStore.$patch({ wallet: new SDK() })
    userStore.showWallet.initWallet()
    if (res.type === 'register') {
      isShowSendBuzz.value = true
    }
  }
}

function register() {
  rootStore.$patch({ isShowLogin: false })
  type.value = 'register'
  isShowLoginAndRegister.value = true
}

async function sendBuzz() {
  isSendBuzzLoading.value = true
  const res = await userStore.showWallet
    .createBrfcChildNode({
      nodeName: NodeName.SimpleMicroblog,
      data: JSON.stringify({
        content: buzz.value || i18n.t('firstBuzzText'),
        contentType: 'text/plain',
        quoteTx: '',
        attachments: [],
        mention: [],
      }),
    })
    .catch(error => {
      ElMessage.error(error.message)
      isSendBuzzLoading.value = false
    })
  if (res) {
    buzzResult.time = new Date()
    buzzResult.txId = res.txId
    isShowSendBuzz.value = false
    isShowSendBuzzSuccess.value = true
  }
}

function toBuzz() {
  isShowSendBuzzSuccess.value = false
  router.push({ name: 'buzz' })
}

function onLoginAndRegisterSuccess(type: 'register' | 'login') {
  if (type === 'register') {
    isShowSendBuzz.value = true
  }
}

async function connectMetaLet() {
  return ElMessage.info(i18n.t('Comming Soon'))
  if (typeof (window as any).Metalet === 'undefined') {
    return ElMessage.error(i18n.t('Not install MetaLet Wallet'))
  }
  // const result = await (window as any).metalet.getAccount()
  // console.log(result)
  // const metaId = result.userMetaIdInfo.metaId
  // const res = await GetUserAllInfo(metaId)
  // const hDPrivateKey = new mvc.HDPrivateKey(result.xprv)
  // const phone = eciesDecryptData(
  //   res.data.phone,
  //   hDPrivateKey.deriveChild(0).deriveChild(4).privateKey
  // )
}

async function onThreePartLinkSuccess(params: { signAddressHash: string }) {
  //检查hash是否已绑定
  const getMnemonicRes = await LoginByHashData({
    hashData: params.signAddressHash,
  }).catch(error => {
    if (error.code === -1) {
      // 还没绑定
      thirdPartyWalletSignAddress.value = params.signAddressHash
      BindMetaIdRef.value.status = BindStatus.ChooseType
      isShowMetaMak.value = false
      isShowBindModal.value = true
    } else {
      throw new Error(error.message)
    }
  })
  if (getMnemonicRes?.code === 0 && getMnemonicRes.data) {
    // 有密码直接登录， 没有密码就要用户输入
    const password = localStorage.getItem(encode('password'))
    if (password) {
      const res = await BindMetaIdRef.value.loginByMnemonic(getMnemonicRes.data, decode(password))
      if (res) {
        await BindMetaIdRef.value.loginSuccess(res)
      }
    } else {
      thirdPartyWalletSignAddress.value = params.signAddressHash
      debugger
      BindMetaIdRef.value.status = BindStatus.InputPassword
      isShowMetaMak.value = false
      isShowBindModal.value = true
    }
  }
}

function OnMetaIdRegister(params: MetaIdWalletRegisterBaseInfo) {
  metaIdWalletRegisterBaseInfo.val = params
}
</script>

<style lang="scss" scoped src="./ConnectWalletModal.scss"></style>
