<template>
  <div class="register-page user-form container">
    <div class="title flex flex-align-center"><LogoIcon /> 欢迎注册若喜</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :label-width="0"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item prop="phone" v-if="ruleForm.userType === 'phone'">
        <el-input v-model="ruleForm.phone" type="number" placeholder="手机号码">
          <!-- <template #prepend>{{ ruleForm.areaCode }}</template> -->
        </el-input>
      </el-form-item>
      <el-form-item prop="email" v-if="ruleForm.userType === 'email'">
        <el-input v-model="ruleForm.email" type="text" placeholder="邮箱地址"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <div class="flex1 flex flex-align-center">
          <el-input
            class="flex1"
            v-model="ruleForm.password"
            :type="isShowPwd ? 'text' : 'password'"
            placeholder="密码"
          ></el-input>
          <ViewIcon class="view-icon" v-if="isShowPwd" @click="isShowPwd = !isShowPwd" />
          <UnViewIcon class="view-icon" v-else @click="isShowPwd = !isShowPwd" />
        </div>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <div class="flex1 flex flex-align-center">
          <el-input
            v-model="ruleForm.confirmPassword"
            :type="isShowConfirmPwd ? 'text' : 'password'"
            placeholder="确认密码"
            class="flex1"
          ></el-input>
          <ViewIcon
            class="view-icon"
            v-if="isShowConfirmPwd"
            @click="isShowConfirmPwd = !isShowConfirmPwd"
          />
          <UnViewIcon class="view-icon" v-else @click="isShowConfirmPwd = !isShowConfirmPwd" />
        </div>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" type="text" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="messageCode">
        <div class="flex flex-align-center message-code-warp flex1">
          <el-input
            v-model="ruleForm.messageCode"
            type="text"
            maxlength="6"
            placeholder="验证码"
            class="flex1"
          ></el-input>
          <el-button type="text" size="large" @click="sendCode" :disabled="timer > 0" link>{{
            timer > 0 ? `${timer}s` : '获取验证码'
          }}</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="imageCode">
        <div class="flex flex-align-center message-code-warp flex1">
          <el-input
            v-model="ruleForm.imageCode"
            type="number"
            placeholder="请输入图片中的数字"
            class="flex1"
          ></el-input>
          <div
            class="image-code flex flex-align-center flex-pack-center"
            slot="append"
            @click="getImageCodeData"
          >
            <img v-if="imageCodeData !== ''" :src="imageCodeData" />
          </div>
        </div>
      </el-form-item>
      <el-form-item class="flex">
        <el-button
          class="btn-submit"
          size="large"
          type="primary"
          :loading="loading"
          @click="submitForm(ruleFormRef)"
          >注册</el-button
        >
      </el-form-item>
      <!-- <div class="intro">
        {{ 注册即代表同意 }}<a>《用户协议》</a
        >和<a>《隐私政策》</a>
      </div> -->
    </el-form>

    <el-dialog :show-close="false" v-model="loading">
      <div class="suscc-warp">
        <!-- <SuccessIcon /> -->
        <div class="icon-wrap">
          <Icon icon="bi:hourglass-split" width="80" />
        </div>
        <div class="tips">
          {{ loadingText }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  getImageCode,
  registerGetCode,
  registerCheck,
  setUserPassword,
  setUserInfo,
  setUserWalletInfo,
  // registerXpub,
  commitActivity,
} from '@/api/index'
import { BaseUserInfoTypes, hdWalletFromAccount, encryptMnemonic, encryptPassword, HdWallet } from '@/utils/wallet/hd-wallet'
import { useI18n } from 'vue-i18n'
import { encode } from 'js-base64'
import LogoIcon from '@/assets/images/logo.svg'
import ViewIcon from '@/assets/images/view.svg'
import UnViewIcon from '@/assets/images/unview.svg'
import { CommitActivity } from '@/api/broad'
import { InviteActivityTag } from '@/enum'
import { alertCatchError } from '@/utils/util'
import { useUserStore } from '@/stores/user'
import { useRootStore } from '@/stores/root'

type FormInstance = InstanceType<typeof ElForm>

const i18n = useI18n()
const router = useRouter()
const formSize = ref('')
const ruleFormRef = ref<FormInstance>()
const characteristic = ref('')
const imageCodeData = ref('')
const timer = ref(0)
const loading = ref(false)
const loadingText = ref(i18n.t('operating'))
const isStartCount = ref(false)
const isSuccess = ref(false)
const isShowPwd = ref(false)
const isShowConfirmPwd = ref(false)
const userStore = useUserStore()
const rootStore = useRootStore()


const ruleForm = reactive({
  password: '',
  confirmPassword: '',
  username: '',
  remark: '暂无设置密码提示',
  messageCode: '',
  imageCode: '',
  ...rootStore.signBaseInfo,
})

const rules = reactive({
  phone: [
    {
      pattern: /^\d{5,12}$/,
      trigger: 'change',
      message: i18n.t('phoneError'),
    },
  ],
  email: [
    {
      pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      trigger: 'change',
      message: i18n.t('emailError'),
    },
  ],
  password: [
    {
      required: true,
      message: i18n.t('plaseInputPwd'),
      trigger: 'change',
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: i18n.t('plaseInputConfirmPwd'),
      trigger: 'change',
    },
    {
      asyncValidator: (rule: any, value: any) => {
        return new Promise<void>((resolve, reject) => {
          if (value === ruleForm.password) {
            resolve()
          } else {
            reject(new Error(i18n.t('twoPwdNotMatch'))) // reject with error message
          }
        })
      },
    },
  ],
  username: [
    {
      required: true,
      message: i18n.t('pleaseInputUsername'),
      trigger: 'change',
    },
  ],
  messageCode: [
    {
      required: true,
      message: i18n.t('plaseInputCheckCode'),
      trigger: 'change',
    },
  ],
  imageCode: [
    {
      required: true,
      message: i18n.t('pleaseInputImageCode'),
      trigger: 'change',
    },
  ]
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      try {
        loading.value = true
        const phoneNum = ruleForm.areaCode !== '86' ? ruleForm.areaCode + ruleForm.phone : ruleForm.phone
        const params = {
          type: 2, // 注册时必须加上图片验证码验证， 1 是给App用的的，App没有图片验证码
          userType: ruleForm.userType || 'phone',
          phone: phoneNum,
          email: ruleForm.email,
          code: ruleForm.messageCode,
          name: ruleForm.username,
          promotion: '',
          imageCode: ruleForm.imageCode,
          characteristic: characteristic.value,
        }
        const loginName = params.userType === 'phone' ? phoneNum : params.email
        const registerRes = await registerCheck(params)
        // console.log(registerRes)
        if (registerRes.code === 0) {
          let userInfo = registerRes.result as BaseUserInfoTypes
          // console.log(userInfo)
          const walletInfo = await createHDWallet({
            ...userInfo,
            userType: params.userType,
            phone: phoneNum,
            email: params.email,
            pk2: userInfo.pk2,
            name: params.name,
            password: ruleForm.password,
          })
          // console.log(walletInfo)
          const userInfoParams = {
            userType: params.userType,
            phone: phoneNum,
            email: params.email,
            remark: ruleForm.remark,
            address: walletInfo.rootAddress,
          }
          const setWalletRes = await setUserWalletInfo({
            ...userInfoParams,
            type: 2,
            xpub: walletInfo.wallet.xpubkey,
            pubkey: walletInfo.wallet.publicKey.toString(),
            headers: {
              accessKey: userInfo.token || '',
              timestamp: Date.now(),
              userName: loginName,
            },
          })
          console.log(setWalletRes)
          if (setWalletRes.code !== 0) {
            throw new Error('保存钱包信息失败 -1')
          }
          const ePassword = encryptPassword(ruleForm.password)
          const eMnemonic = encryptMnemonic(walletInfo.mnemonic, ruleForm.password)
          const setPasswordRes = await setUserPassword({
            ...userInfoParams,
            password: ePassword,
            affirmPassword: ePassword,
            enCryptedMnemonic: eMnemonic,
          }, userInfo.token || '', loginName)
          if (setPasswordRes.code !== 0) {
            throw new Error('保存钱包信息失败 -2')
          }

          const account = {
            ...userInfo,
            userType: params.userType,
            phone: phoneNum,
            email: params.email,
            password: ruleForm.password,
          }
          const activityId = window.localStorage.getItem('activityId')
          const referrerId = window.localStorage.getItem('referrerId')
          if (activityId && referrerId) {
            account.referrerId = referrerId
          }

          const hdWallet = new HdWallet(walletInfo.mnemonic, walletInfo.wallet)
          const metaIdInfo = await hdWallet.initMetaIdNode(account)
          if (!metaIdInfo) {
            throw new Error('Create MetaID Error')
          }
          userInfo = {
            ...userInfo,
            ...metaIdInfo,
            phone: phoneNum,
            email: params.email,
            userType: params.userType,
            enCryptedMnemonic: eMnemonic,
            rootAddress: walletInfo.rootAddress,
            address: walletInfo.rootAddress
          }
          await setUserInfo({
            userType: params.userType,
            metaid: metaIdInfo.metaId,
            accessKey: userInfo.token,
            phone: userInfo.phone,
            email: userInfo.email,
          })
          await userStore.updateUserInfo(userInfo)

          window.localStorage.setItem('password', encode(ruleForm.password))
          // 处理活动邀请信息
          if (activityId && referrerId) {
            const result = await CommitActivity({
              actionIndex: 5,
              activityId: parseInt(activityId),
              // @ts-ignore
              address: userInfo!.address!,
              // @ts-ignore
              metaId: userInfo!.metaId!,
              // @ts-ignore
              publicKey: userInfo.pubKey,
              refererMetaId: referrerId,
              tag: InviteActivityTag.Rigisted,
            })
            if (result.code !== 0) {
              Error(result.data)
            }
            localStorage.removeItem('activityId')
            localStorage.removeItem('referrerId')
            isSuccess.value = true
            router.replace({
              name: 'activityGuide',
              params: {
                activityId: activityId,
              }
            })
          } else {
            isSuccess.value = true
            router.replace(rootStore.redirectUri)
          }
        } else {
          throw new Error(registerRes.msg)
        }
        loading.value = false
      } catch (error) {
        loading.value = false
        alertCatchError(error)
      }
    }
  })
}

const createHDWallet = async(account: BaseUserInfoTypes) => {
  try {
    const walletObj = await hdWalletFromAccount(account)
    console.log(walletObj)
    return walletObj
  } catch (error: any) {
    console.error(error)
    throw new Error('生成钱包失败' + error.message)
  }
}

const getImageCodeData = () => {
  getImageCode({ characteristic: characteristic.value }).then((res: any) => {
    characteristic.value = res.characteristic
    imageCodeData.value = 'data:image/jpeg;base64,' + res.imageCode
  }).catch((error) => {
    console.error(error)
    ElMessage.error(error.message)
  })
}

const countDown = () => {
  const countDown = setInterval(() => {
    if (timer.value <= 0) {
      clearInterval(countDown)
    }
    timer.value -= 1
  }, 1000)
}

const sendCode = () => {
  if (timer.value > 0) return
  isStartCount.value = true
  const params = {
    platform: 1,
    userType: ruleForm.userType || 'phone',
    phone: ruleForm.areaCode !== '86' ? '+' + ruleForm.areaCode + ruleForm.phone : ruleForm.phone,
    email: ruleForm.email,
  }
  registerGetCode(params).then(res => {
    if (res.code === 0) {
      timer.value = 60
      countDown()
      return ElMessage.success(i18n.t('checkCodeIsSend'))
    } else {
      return ElMessage.error(res.msg)
    }
  })
}

onMounted(async() => {
  getImageCodeData()
  // const account: BaseUserInfoTypes = {
  //   userType: 'phone',
  //   phone: '13512345673',
  //   email: '',
  //   name: 'newTest',
  //   pk2: '0b5500e5035cc06c4d70b2d5a8964dec534b2356850686c306b9d1daced6fdba',
  //   tag: 'new',
  //   token: '8a7cc530-bd4d-4196-894b-5d3f27129f1a',
  //   password: '123456',
  // }
  // const hdWallet = await HdWallet.createFromAccount(account)
  // hdWallet.initMetaIdNode(account)
  // console.log(hdWallet)
})
</script>

<style lang="scss" src="./register.scss"></style>
