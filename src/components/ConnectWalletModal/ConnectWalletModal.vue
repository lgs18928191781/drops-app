<template>
  <!-- 连接钱包 -->
  <ElDialog :model-value="rootStore.isShowLogin" center :title="$t('connectWallet')">
    <div class="login-warp">
      <div class="btn-list flex flex-v">
        <ElButton
          type="default"
          v-for="(item, index) in wallets"
          size="large"
          :key="index"
          @click="item.fun!()"
        >
          <div class="flex flex-align-center btn-item">
            <img :src="item.icon" />
            <span class="name">{{ item.name }}</span>
          </div>
        </ElButton>
      </div>
      <div class="no-wallet">
        <a @click="register">{{ $t('nowWallet') }}</a>
      </div>
      <div class="terms">
        <div>{{ $t('terms1') }}</div>
        <div>
          <a>{{ $t('terms2') }}</a
          >{{ $t('terms3') }}<a>{{ $t('terms4') }}</a>
        </div>
      </div>
    </div>
  </ElDialog>

  <!-- MetaMask -->
  <MetaMask
    v-model="isShowMetaMak"
    :hd-wallet-from-mnemonic="hdWalletFromMnemonic"
    id="metamask"
    @success="metaMaskLoginSuccess"
  ></MetaMask>

  <!-- 登录注册 -->
  <LoginAndRegisterModalVue
    v-model="isShowLoginAndRegister"
    v-model:type="type"
    @success="onLoginAndRegisterSuccess"
  />

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
</template>

<script setup lang="ts">
import IconMetaMask from '@/assets/images/icon_metamask.png'
import IconMVC from '@/assets/images/iocn_mvc.png'
import IconShowmoney from '@/assets/images/iocn_showmoney.png'
import MetaMask, { MetaMaskLoginRes } from '@/plugins/MetaMak.vue'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { SDK } from '@/utils/sdk'
import { HdWallet, hdWalletFromMnemonic } from '@/utils/wallet/hd-wallet'
import LoginAndRegisterModalVue from '@/components/LoginAndRegisterModal/LoginAndRegisterModal.vue'
import FirstBuzzImg from '@/assets/images/first_buzz.svg?url'
import { toMvcScan } from '@/utils/util'

import { reactive, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NodeName } from '@/enum'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import { GetUserAllInfo } from '@/api/aggregation'

const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const emit = defineEmits(['metamask'])

const isShowMetaMak = ref(false)
const isShowLoginAndRegister = ref(false)
const type: Ref<'login' | 'register'> = ref('login')
const isShowSendBuzz = ref(true)
const buzz = ref('')
const isSendBuzzLoading = ref(false)
const isShowSendBuzzSuccess = ref(false)
const buzzResult = reactive({
  time: '',
  txId: '',
})

const wallets = [
  {
    name: 'MetaMask',
    icon: IconMetaMask,
    fun: () => {
      rootStore.$patch({ isShowLogin: false })
      isShowMetaMak.value = true
    },
  },
  { name: 'Metalet', icon: IconMVC },
  {
    name: 'ShowMoney',
    icon: IconShowmoney,
    fun: () => {
      type.value = 'login'
      rootStore.$patch({ isShowLogin: false })
      isShowLoginAndRegister.value = true
    },
  },
]

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
</script>

<style lang="scss" scoped src="./ConnectWalletModal.scss"></style>
