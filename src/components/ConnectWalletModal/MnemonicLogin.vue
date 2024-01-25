<template>
  <div
    class="metaid-wallet flex flex-v"
    v-loading="loading"
    :element-loading-svg="LoadingTEXT"
    :element-loading-text="$t('Loading')"
  >
    <div class="back">
      <a class="flex flex-align-center" @click="emit('back')">
        <Icon name="down" />{{ $t('back') }}</a
      >
    </div>

    <div class="title">
      {{ $t('Login.Mnemonic') }}
    </div>

    <div class="flex1 flex flex-v  flex-pack-center">
      <ElForm :model="form" :rules="rules" ref="FormRef">
        <!-- 助记词 -->
        <ElFormItem prop="Mnemonic">
          <ElInput
            v-model="form.Mnemonic"
            :placeholder="$t('Enter Mnemonic')"
            :disabled="loading"
          />
        </ElFormItem>
        <div class="Mnemonic-wrap">
          <div class="Mnemonic-container" v-if="form.Mnemonic">
            <div class="Mnemonic-item" v-for="(item, index) in MnemonicText" :key="index">
              <span class="num">{{ index + 1 }}.</span>
              <ElInput :model-value="item" class="Mnemonic-item-cell" />
            </div>
          </div>
        </div>
        <!-- 路径 -->
        <ElFormItem prop="path">
          <ElInput
            v-model="form.path"
            :placeholder="$t('Enter Dervice path')"
            :disabled="loading"
          />
          <span class="path">Path：{{ `m/44'/${form.path}'/0'` }}</span>
        </ElFormItem>
        <div class="pathTip">
          <span class="pathTip-title">{{ $t('pathTip1') }}</span>
          <span class="tip">{{ $t('pathTip2') }}</span>
          <span class="tip"
            >{{ $t('pathTip3') }}
            <span>m/44'/10001'/0'</span>
          </span>
        </div>
      </ElForm>
    </div>

    <div class="login-btn">
      <a class="main-border" @click="submitForm">
        <Icon name="right" />
      </a>
    </div>
  </div>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// @ts-ignore
import {
  BaseUserInfoTypes,
  encryptMnemonic,
  encryptPassword,
  HdWallet,
  hdWalletFromAccount,
  hdWalletFromMnemonic,
  signature,
} from '@/utils/wallet/hd-wallet'

import { useUserStore } from '@/stores/user'
import { useRootStore } from '@/stores/root'

import { ElMessage, ElMessageBox } from 'element-plus'
import { GetRandomWord, MnemoicLogin, SetUserInfo } from '@/api/core'
import { SDK } from '@/utils/sdk'
import { LoadingTEXT } from '@/utils/LoadingSVGText'

interface Props {
  type: 'register' | 'login'
  loading: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:modelValue', 'update:type', 'success', 'back', 'update:loading'])
const i18n = useI18n()
const userStore = useUserStore()
const rootStore = useRootStore()
const FormRef = ref()
const form = reactive({
  Mnemonic: ``,
  path: '10001',
})

const MnemonicText = computed(() => {
  return form.Mnemonic.split(' ')
})

const rules = reactive({
  Mnemonic: [
    {
      required: true,
      message: () => i18n.t('Enter Mnemonic'),
      trigger: 'blur',
    },
  ],
  path: [
    {
      required: true,
      message: () => i18n.t('Enter Dervice path'),
      trigger: 'blur',
    },
  ],
})

function submitForm() {
  FormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emit('update:loading', true)
      try {
        // 登录
        const word = await GetRandomWord()
        if (word.code == 0) {
          const hdWalletMnemonic = await hdWalletFromMnemonic(
            form.Mnemonic,
            'new',
            import.meta.env.VITE_NET_WORK,
            form.path
          )
          const sign = signature(
            word.data.word,
            hdWalletMnemonic
              .deriveChild(0)
              .deriveChild(0)
              .privateKey.toString()
          )
          const loginRes = await MnemoicLogin({
            xpub: hdWalletMnemonic.xpubkey.toString(),
            sign,
            word: word.data.word,
            type: 1,
            path:+form.path
            
          })
          
          if (loginRes.code == 0) {
            const loginInfo = (loginRes.data as unknown) as BaseUserInfoTypes
            const account = {
              ...loginInfo,
              userType: loginInfo.register,
              phone: loginInfo.phone,
              email: loginInfo.email,
              pk2: loginInfo.pk2,
              name: loginInfo.name,
            }
            // @ts-ignore

            const hdWallet = new HdWallet(hdWalletMnemonic)

            let metaIdInfo = await hdWallet.getMetaIdInfo(hdWallet.rootAddress)
            
            if (!metaIdInfo.metaId || !metaIdInfo.infoTxId || !metaIdInfo.protocolTxId) {
              // @ts-ignore
              let userInfo = {
                ...account,
                role: 'BASIC',
                path: parseInt(import.meta.env.VITE_WALLET_PATH),
              }

              metaIdInfo = await hdWallet.initMetaIdNode(userInfo)

              await SetUserInfo({
                ...userInfo,
                // @ts-ignore
                metaid: metaIdInfo.metaId,
                // @ts-ignore
                accessKey: userInfo.token,
              })
            }
            // if (!metaIdInfo.metaId) {
            //   return ElMessageBox.alert(
            //     `${i18n.t('FixAccountTips1')} ${import.meta.env.VITE_SHOW_MONEY_APP} ${i18n.t(
            //       'FixAccountTips2'
            //     )}`,
            //     i18n.t('niceWarning'),
            //     {
            //       showClose: false,
            //       confirmButtonText: `${i18n.t('FixAccountTips3')}`,
            //     }
            //   ).then(() => {
            //     location.href = `${import.meta.env.VITE_SHOW_MONEY_APP}`
            //   })
            // }
            // @ts-ignore
            //这里的参数account跟metaidInfo位置不能改变，否则新数据会被覆盖
            userStore.updateUserInfo({
              ...metaIdInfo,
              ...account,
              metaId: metaIdInfo.metaId, // account 有时拿回来的metaId为空
              name: metaIdInfo.name!, // account 有时拿回来的name 是旧 name
              password: form.Mnemonic,
              address: hdWallet.rootAddress,
              loginType: 'MetaID',
            })
            userStore.$patch({ wallet: new SDK(import.meta.env.VITE_NET_WORK) })
            userStore.showWallet.initWalletFromMnemonic()
            FormRef.value.resetFields()
            rootStore.updateLoginFromMnemonic(true)
            emit('update:loading', false)
            emit('update:modelValue', false)
            emit('success', props.type)
          } else {
            emit('update:loading', false)
            ElMessage.error(loginRes.msg)
          }
        }
      } catch (error) {
        emit('update:loading', false)
        return ElMessage.error((error as any).message)
      }
    }
  })
}
</script>

<style lang="scss" scoped src="./MnemonicLogin.scss"></style>
<style>
.vue-country-intl-popover {
  z-index: 9999;
}
</style>
