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
        <a>{{ $t('nowWallet') }}</a>
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
  <LoginAndRegisterModalVue v-model="isShowLoginAndRegister" v-model:type="type" />
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

import { Ref, ref } from 'vue'

const rootStore = useRootStore()
const userStore = useUserStore()
const emit = defineEmits(['metamask'])

const isShowMetaMak = ref(false)
const isShowLoginAndRegister = ref(false)
const type: Ref<'login' | 'register'> = ref('login')

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
  { name: 'ShowMoney', icon: IconShowmoney },
]

async function metaMaskLoginSuccess(res: MetaMaskLoginRes) {
  await userStore.updateUserInfo({
    ...res.userInfo,
    password: res.password,
    userType: 'email',
  })
  userStore.$patch({ wallet: new SDK() })
}
</script>

<style lang="scss" scoped src="./ConnectWalletModal.scss"></style>
