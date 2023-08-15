<template>
  <div class="metaid-wallet">
    <div class="back" @click="emit('back')">
      <a> <Icon name="down" />{{ $t('back') }}</a>
    </div>
    <div class="title">{{ $t('Login.connectMetaIdWallet') }}</div>
    <div class="change">
      <a><Icon name="exchange" />{{ $t('Login.changePhoneNumber') }}</a>
    </div>

    <ElForm :model="form" :rules="rules" ref="FormRef">
      <!--  手机 -->
      <ElFormItem prop="phone" v-if="form.userType === SignUserType.Phone">
        <ElInput
          v-model="form.phone"
          type="number"
          :placeholder="$t('Enter Phone Number')"
          :disabled="loading"
        >
          <template #prefix>
            <Vue3CountryIntl
              v-model="form.area"
              schema="popover"
              :searchInputPlaceholder="'Search your country name or code'"
              v-model:visible="isShowCountry"
              :listZIndex="99"
              @onChange="res => (form.countryCode = res.iso2)"
              style="width: 100%;"
            >
              <div
                class="country-select flex flex-align-center"
                @click="loading ? '' : (isShowCountry = true)"
              >
                <span :class="'iti-flag ' + form.countryCode"> </span>
                <span>+{{ form.area }}</span>
              </div>
            </Vue3CountryIntl>
          </template>
        </ElInput>
      </ElFormItem>

      <!-- 邮箱 -->
      <ElFormItem prop="email" v-else>
        <ElInput
          v-model="form.email"
          type="text"
          :placeholder="$t('Enter Email Address')"
          :disabled="loading"
        />
      </ElFormItem>

      <!-- 用户名 -->
      <ElFormItem prop="password" v-if="type === 'register'">
        <ElInput
          v-model="form.name"
          type="text"
          :placeholder="$t('Enter Your NickName')"
          :disabled="loading"
        />
      </ElFormItem>

      <!-- 密码 -->
      <ElFormItem prop="password">
        <ElInput
          v-model="form.password"
          type="password"
          show-password
          :placeholder="$t('Enter Your Password')"
          :disabled="loading"
        />
      </ElFormItem>

      <!-- 密码 -->
      <ElFormItem prop="confirmPassword" v-if="type === 'register'">
        <ElInput
          v-model="form.confirmPassword"
          type="password"
          show-password
          :placeholder="$t('Confirm Password')"
          :disabled="loading"
        />
      </ElFormItem>

      <!-- 验证码 -->
      <ElFormItem prop="code">
        <ElInput
          v-model="form.code"
          type="number"
          :placeholder="$t('Enter Auth Code')"
          @input="form.code = form.code.slice(0, 6)"
          :disabled="loading"
        >
          <template #suffix>
            <ElButton
              size="sm"
              :disabled="sendCodeBtnDisabled"
              class="none-box-shadow"
              @click="sendCode"
              v-loading="isSendCodeLoading"
              :element-loading-svg="LoadingTEXT"
              :element-loading-text="$t('Loading')"
            >
              {{ sendCodeTimer === 0 ? $t('Send Code') : sendCodeTimer + 's' }}</ElButton
            >
          </template>
        </ElInput>
      </ElFormItem>

      <!-- 密码提示 -->
      <ElFormItem prop="remark" v-if="type === 'register'">
        <ElInput
          v-model="form.remark"
          type="text"
          :placeholder="$t('Enter Password Remark')"
          :disabled="loading"
        />
      </ElFormItem>

      <!-- 图片验证码 -->
      <ElFormItem prop="imageCode" v-if="type === 'register'">
        <ElInput
          v-model="form.imageCode"
          type="number"
          :placeholder="$t('Enter Pic Code')"
          @input="form.code = form.code.slice(0, 6)"
          :disabled="loading"
        >
          <template #suffix>
            <div
              class="image-code flex flex-align-center flex-pack-center"
              slot="append"
              @click="loading ? '' : getImageCodeData()"
              v-loading="isGetImageCodeLoading"
              :element-loading-svg="LoadingTEXT"
              :element-loading-text="$t('Loading')"
            >
              <img v-if="imageCodeData !== ''" :src="imageCodeData" />
            </div>
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// @ts-ignore
import Vue3CountryIntl from 'vue3-country-intl'
import 'vue3-country-intl/lib/vue3-country-intl.css'
import 'vue3-country-intl/lib/vue3-country-flag.css'
import 'vue3-country-intl/lib/flags-9980096a.png'
import { InviteActivityTag, SignUserType } from '@/enum'
import { isApp } from '@/stores/root'
import {
  BaseUserInfoTypes,
  encryptMnemonic,
  encryptPassword,
  HdWallet,
  hdWalletFromAccount,
} from '@/utils/wallet/hd-wallet'
import { useUserStore } from '@/stores/user'
import { encode } from 'js-base64'
import { result } from 'lodash'
import { CommitActivity } from '@/api/broad'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  GetImageCode,
  LoginCheck,
  LoginGetCode,
  RegisterCheck,
  RegisterGetCode,
  SetUserInfo,
  SetUserPassword,
  SetUserWalletInfo,
} from '@/api/core'
import { SDK } from '@/utils/sdk'
import { LoadingTEXT } from '@/utils/LoadingSVGText'

interface Props {
  modelValue: boolean
  type: 'register' | 'login'
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:modelValue', 'update:type', 'success', 'back'])
const i18n = useI18n()
const userStore = useUserStore()

const tabs = [
  {
    name: () => {
      return i18n.t('phone')
    },
    key: 'phone',
  },
  {
    name: () => {
      return i18n.t('Email')
    },
    key: 'email',
  },
]
const FormRef = ref()
const form = reactive({
  userType: 'phone',
  password: '',
  area: '86',
  countryCode: 'cn',
  phone: '',
  email: '',
  name: '',
  code: '',
  imageCode: '',
  confirmPassword: '',
  remark: '',
})

const rules = reactive({
  phone: [
    {
      required: () => form.userType === 'phone',
      message: () => i18n.t('Enter Mobile Number'),
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: () => form.userType === 'email',
      message: () => i18n.t('Enter Email Address'),
      trigger: 'blur',
    },
    {
      pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: () => i18n.t('Email Address Error'),
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: () => i18n.t('Enter User Name'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error(i18n.t('Enter Your Password')))
        } else {
          if (form.confirmPassword !== '') {
            FormRef.value.validateField('confirmPassword')
          }
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error(i18n.t('Confirm Password')))
        } else if (value !== form.password) {
          callback(new Error(i18n.t('Password Not Match')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: () => i18n.t('Enter Auth Code'),
      trigger: 'blur',
    },
  ],
  remark: [
    {
      required: true,
      message: () => i18n.t('Enter Password Remark'),
      trigger: 'blur',
    },
  ],
  imageCode: [
    {
      required: true,
      message: () => i18n.t('Enter Pic Code'),
      trigger: 'blur',
    },
  ],
})

const loading = ref(false)
const isShowCountry = ref(false)
const characteristic = ref('')
const imageCodeData = ref('')
const isGetImageCodeLoading = ref(false)
const isSendCodeLoading = ref(false)

const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const sendCodeTimer = ref(0)
const sendCodeBtnDisabled = computed(() => {
  let result = true
  if (sendCodeTimer.value === 0) {
    if (form.userType === SignUserType.Phone && form.phone !== '') {
      result = false
    } else if (form.userType === SignUserType.Email && emailReg.test(form.email)) {
      result = false
    }
  }
  return result
})

watch(
  () => props.type,
  () => {
    if (props.type === 'register') {
      getImageCodeData()
    }
  }
)

const getImageCodeData = () => {
  if (isGetImageCodeLoading.value) return
  isGetImageCodeLoading.value = true
  GetImageCode({ characteristic: characteristic.value })
    .then((res: any) => {
      isGetImageCodeLoading.value = false
      characteristic.value = res.characteristic
      imageCodeData.value = 'data:image/jpeg;base64,' + res.imageCode
    })
    .catch(error => {
      isGetImageCodeLoading.value = false
      ElMessage.error(error.message)
    })
}

function changeType() {
  if (loading.value) return
  emit('update:type', props.type === 'login' ? 'register' : 'login')
}

async function sendCode() {
  if (sendCodeTimer.value > 0) return
  isSendCodeLoading.value = true
  try {
    const phoneNum = form.area !== '86' ? form.area + form.phone : form.phone
    const params = {
      userType: form.userType || 'phone',
      phone: (form.area !== '86' ? '+' : '') + phoneNum,
      email: form.email,
      platform: 1,
    }
    let res: any
    if (props.type === 'login') {
      res = await LoginGetCode(params)
    } else {
      res = await RegisterGetCode(params)
    }
    if (res.code === 0) {
      sendCodeTimer.value = 60
      isSendCodeLoading.value = false
      const interval = setInterval(() => {
        if (sendCodeTimer.value > 0) {
          sendCodeTimer.value = sendCodeTimer.value - 1
        } else {
          clearInterval(interval)
        }
      }, 1000)
      return ElMessage.success(i18n.t('Auth Code Send Success'))
    }
  } catch (error) {
    isSendCodeLoading.value = false
    ElMessage.error((error as any).message)
  }
}

function submitForm() {
  FormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const phoneNum = form.area !== '86' ? form.area + form.phone : form.phone
        if (props.type === 'login') {
          //  登录
          const params = {
            type: isApp ? 2 : 1,
            userType: form.userType || 'phone',
            phone: phoneNum,
            email: form.email,
            code: form.code,
            password: encryptPassword(form.password),
          }
          const loginRes = await LoginCheck(params)
          if (loginRes.code === 0 || loginRes.code === 601) {
            const loginInfo = loginRes.data as BaseUserInfoTypes
            const account = {
              ...loginInfo,
              userType: params.userType,
              phone: phoneNum,
              email: params.email,
              pk2: loginInfo.pk2,
              name: loginInfo.name,
              password: form.password,
            }
            // @ts-ignore
            const walletInfo = await hdWalletFromAccount(account, import.meta.env.VITE_NET_WORK)
            const hdWallet = new HdWallet(walletInfo.wallet)
            let metaIdInfo = await hdWallet.getMetaIdInfo(walletInfo.rootAddress)
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
            userStore.updateUserInfo({
              ...account,
              metaId: metaIdInfo.metaId,
              infoTxId: metaIdInfo.infoTxId,
              protocolTxId: metaIdInfo.protocolTxId,
              userType: params.userType,
              phone: phoneNum,
              rootAddress: walletInfo.rootAddress,
              password: form.password,
            })
            userStore.$patch({ wallet: new SDK(import.meta.env.VITE_NET_WORK) })
            userStore.showWallet.initWallet()
            FormRef.value.resetFields()
            loading.value = false
            emit('update:modelValue', false)
            emit('success', props.type)
          } else {
            loading.value = false
            ElMessage.error(loginRes.msg)
          }
        } else {
          // 注册
          const params = {
            type: 2, // 注册时必须加上图片验证码验证， 1 是给App用的的，App没有图片验证码
            userType: form.userType || 'phone',
            phone: phoneNum,
            email: form.email,
            code: form.code,
            name: form.name,
            promotion: '',
            imageCode: form.imageCode,
            characteristic: characteristic.value,
          }
          const loginName = params.userType === 'phone' ? phoneNum : params.email
          const registerRes = await RegisterCheck(params)
          // console.log(registerRes)
          if (registerRes.code === 0) {
            let userInfo = registerRes.result as BaseUserInfoTypes
            const walletInfo = await hdWalletFromAccount(
              {
                ...userInfo,
                userType: params.userType,
                phone: phoneNum,
                email: params.email,
                pk2: userInfo.pk2,
                name: params.name,
                password: form.password,
              },
              import.meta.env.VITE_NET_WORK
            )

            const userInfoParams = {
              userType: params.userType,
              phone: phoneNum,
              email: params.email,
              remark: form.remark,
              address: walletInfo.rootAddress,
            }
            const setWalletRes = await SetUserWalletInfo({
              ...userInfoParams,
              type: 2,
              xpub: walletInfo.wallet.xpubkey,
              pubkey: walletInfo.wallet.publicKey.toString(),
              headers: {
                accessKey: userInfo.token || '',
                timestamp: Date.now(),
                userName: loginName,
              },
              path: parseInt(import.meta.env.VITE_WALLET_PATH),
            })
            if (setWalletRes.code !== 0) {
              throw new Error('保存钱包信息失败 -1')
            }
            const ePassword = encryptPassword(form.password)
            const eMnemonic = encryptMnemonic(walletInfo.mnemonic, form.password)
            const setPasswordRes = await SetUserPassword(
              {
                ...userInfoParams,
                password: ePassword,
                affirmPassword: ePassword,
                enCryptedMnemonic: eMnemonic,
              },
              userInfo.token || '',
              loginName
            )
            if (setPasswordRes.code !== 0) {
              throw new Error('保存钱包信息失败 -2')
            }

            const account = {
              ...userInfo,
              userType: params.userType,
              phone: phoneNum,
              email: params.email,
              password: form.password,
            }
            const activityId = window.localStorage.getItem('activityId')
            const referrerId = window.localStorage.getItem('referrerId')
            if (activityId && referrerId) {
              account.referrerId = referrerId
            }

            const hdWallet = new HdWallet(walletInfo.wallet)
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
              // @ts-ignore
              rootAddress: walletInfo.rootAddress,
              address: walletInfo.rootAddress,
            }
            userInfo.userType = userInfo.userType ? userInfo.userType : userInfo?.registerType
            await SetUserInfo({
              // @ts-ignore
              userType: params.userType,
              metaid: metaIdInfo.metaId,
              // @ts-ignore
              accessKey: userInfo.token,
              phone: userInfo.phone,
              email: userInfo.email,
            })
            // @ts-ignore
            await userStore.updateUserInfo({
              ...userInfo,
              password: form.password,
            })
            userStore.$patch({ wallet: new SDK(import.meta.env.VITE_NET_WORK) })
            userStore.showWallet.initWallet()
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
              // @ts-ignore
              if (result.code !== 0) {
                Error(result.data)
              }
              localStorage.removeItem('activityId')
              localStorage.removeItem('referrerId')
            }
            FormRef.value.resetFields()
            loading.value = false
            emit('update:modelValue', false)
            emit('success', props.type)
          }
        }
      } catch (error) {
        loading.value = false
        ElMessage.error((error as any).message)
      }
    }
  })
}
</script>

<style lang="scss" scoped src="./LoginAndRegisterModal.scss"></style>
<style>
.vue-country-intl-popover {
  z-index: 9999;
}
</style>
