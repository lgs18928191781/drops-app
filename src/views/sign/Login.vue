<template>
  <div class="register-page user-form container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :label-width="0"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item prop="phone" v-if="ruleForm.userType === 'phone'">
        <el-input
          v-model="ruleForm.phone"
          :readonly="true"
          type="number"
          placeholder="手机号码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="email" v-if="ruleForm.userType === 'email'">
        <el-input
          v-model="ruleForm.email"
          :readonly="true"
          type="text"
          placeholder="邮箱地址"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="ruleForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="messageCode">
        <div class="flex flex-align-center message-code-warp">
          <el-input
            v-model="ruleForm.messageCode"
            type="number"
            placeholder="验证码"
            class="flex1"
          ></el-input>
          <el-button size="large" type="primary" @click="sendCode" :disabled="timer > 0">{{
            timer > 0 ? `${timer}s` : '获取验证码'
          }}</el-button>
        </div>
      </el-form-item>
      <el-form-item class="flex">
        <el-button
          class="btn-submit"
          size="large"
          type="primary"
          :loading="loading"
          @click="submitForm(ruleFormRef)"
        >
          登录钱包</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm, ElMessageBox, ElMessage } from 'element-plus'

import { loginGetCode, loginCheck } from '@/api/index'
import {
  BaseUserInfoTypes,
  hdWalletFromAccount,
  encryptPassword,
  HdWallet,
  Network,
} from '@/utils/wallet/hd-wallet'
import { isApp, useRootStore } from '@/stores/root'
import { useI18n } from 'vue-i18n'
import { encode } from 'js-base64'
import { useUserStore } from '@/stores/user'

type FormInstance = InstanceType<typeof ElForm>

const userStore = useUserStore()
const rootStore = useRootStore()
const router = useRouter()
const timer = computed(() => {
  return rootStore.sendCodeTimer
})
const formSize = ref('')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  password: '',
  messageCode: '',
  ...rootStore.signBaseInfo,
})
const i18n = useI18n()

// const phoneNum = computed(() => {
//   return ruleForm.areaCode + ruleForm.phone
// })

const rules = reactive({
  phone: [
    {
      required: true,
      message: i18n.t('pleaseInputphomeNumber'),
      trigger: 'blur',
    },
    {
      pattern: /^\d{5,12}$/,
      trigger: 'change',
      message: i18n.t('phoneError'),
    },
  ],
  password: [
    {
      required: true,
      message: i18n.t('plaseInputPwd'),
      trigger: 'change',
    },
  ],
})

const loading = ref(false)

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      loading.value = true
      const phoneNum =
        ruleForm.areaCode !== '86' ? ruleForm.areaCode + ruleForm.phone : ruleForm.phone
      const params = {
        type: isApp ? 2 : 1,
        userType: rootStore.signBaseInfo.userType || 'phone',
        phone: phoneNum,
        email: ruleForm.email,
        code: ruleForm.messageCode,
        password: encryptPassword(ruleForm.password),
      }
      const loginRes = await loginCheck(params)
      if (loginRes.code === 0 || loginRes.code === 601) {
        const loginInfo = loginRes.data as BaseUserInfoTypes
        const account = {
          ...loginInfo,
          userType: params.userType,
          phone: phoneNum,
          email: params.email,
          pk2: loginInfo.pk2,
          name: loginInfo.name,
          password: ruleForm.password,
        }

        const walletInfo = await hdWalletFromAccount(account, import.meta.env.VITE_NET_WORK)
        const hdWallet = new HdWallet(walletInfo.mnemonic, walletInfo.wallet)
        let metaIdInfo
        try {
          metaIdInfo = await hdWallet.getMetaIdInfo(walletInfo.rootAddress)
          if (!metaIdInfo.metaId) {
            return ElMessageBox.alert('抱歉，此账号有问题，请到www.showmoney.app上修复', '提示', {
              showClose: false,
              confirmButtonText: '去修复',
            }).then(() => {
              location.href = 'https://www.showmoney.app/'
            })
          }
          userStore.updateUserInfo({
            ...account,
            metaId: metaIdInfo.metaId,
            infoTxId: metaIdInfo.infoTxId,
            protocolTxId: metaIdInfo.protocolTxId,
            userType: params.userType,
            phone: phoneNum,
            rootAddress: walletInfo.rootAddress,
          })

          window.localStorage.setItem('password', encode(ruleForm.password))
          router.replace(rootStore.redirectUri)
        } catch (error) {
          console.error(error)
          loading.value = false
          return ElMessage.error('初始化账号失败，请稍后再试...')
        }
      } else {
        loading.value = false
        ElMessage.error(loginRes.msg)
      }
      loading.value = false
    } else {
      return false
    }
  })
}

const sendCode = () => {
  if (rootStore.sendCodeTimer > 0) return
  const phoneNum = ruleForm.areaCode !== '86' ? ruleForm.areaCode + ruleForm.phone : ruleForm.phone
  const params = {
    userType: ruleForm.userType || 'phone',
    phone: (ruleForm.areaCode !== '86' ? '+' : '') + phoneNum,
    email: ruleForm.email,
  }
  loginGetCode(params).then(res => {
    if (res.code === 0) {
      rootStore.$patch({ sendCodeTimer: 60 })
      return ElMessage.success(i18n.t('checkCodeIsSend'))
    } else {
      return ElMessage.error(res.msg)
    }
  })
}
</script>

<style lang="scss" scoped src="./login.scss"></style>
