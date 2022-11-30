<template>
  <div class="metaid-wallet flex flex-v" v-loading="loading">
    <div class="back">
      <a class="flex flex-align-center" @click="emit('back')">
        <Icon name="down" />{{ $t('back') }}</a
      >
    </div>
    <div class="title">
      {{
        type === 'login'
          ? $t('Login.connectMetaIdWallet')
          : registerType === RegisterType.Check
          ? $t('Login.registerMetaIdWallet')
          : $t('Login.registerSetPassword')
      }}
    </div>

    <div class="flex1 flex flex-v  flex-pack-center">
      <!-- 切换 手机/邮箱 -->
      <div class="change flex flex-pack-end">
        <a
          class="flex flex-align-center"
          @click="changeUserType"
          v-if="registerType !== RegisterType.SetPassword"
          ><Icon name="exchange" />{{
            form.userType === 'email'
              ? $t('Login.changePhoneNumber')
              : $t('Login.changeEmailAddress')
          }}</a
        >
      </div>

      <div class="account" v-if="registerType === RegisterType.SetPassword">
        {{ $t('Login.account') }}：{{
          form.userType === SignUserType.Phone ? form.phone : form.email
        }}
      </div>

      <ElForm :model="form" :rules="rules" ref="FormRef">
        <!--  手机 -->
        <ElFormItem
          prop="phone"
          v-if="form.userType === SignUserType.Phone && registerType !== RegisterType.SetPassword"
        >
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
        <ElFormItem
          prop="email"
          v-if="form.userType === SignUserType.Email && registerType !== RegisterType.SetPassword"
        >
          <ElInput
            v-model="form.email"
            type="text"
            :placeholder="$t('Enter Email Address')"
            :disabled="loading"
          />
        </ElFormItem>

        <!-- 用户名 -->
        <!-- <ElFormItem prop="name" v-if="type === 'register'">
        <ElInput
          v-model="form.name"
          type="text"
          :placeholder="$t('Enter Your NickName')"
          :disabled="loading"
        />
      </ElFormItem> -->

        <!-- 密码 -->
        <ElFormItem
          prop="password"
          v-if="
            type === 'login' || (type === 'register' && registerType === RegisterType.SetPassword)
          "
        >
          <ElInput
            v-model="form.password"
            type="password"
            show-password
            :placeholder="$t('Enter Your Password')"
            :disabled="loading"
          />
        </ElFormItem>

        <!-- 密码 -->
        <ElFormItem
          prop="confirmPassword"
          v-if="type === 'register' && registerType === RegisterType.SetPassword"
        >
          <ElInput
            v-model="form.confirmPassword"
            type="password"
            show-password
            :placeholder="$t('Confirm Password')"
            :disabled="loading"
          />
        </ElFormItem>

        <!-- 验证码 -->
        <ElFormItem prop="code" v-if="registerType !== RegisterType.SetPassword">
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
              >
                {{ sendCodeTimer === 0 ? $t('Send Code') : sendCodeTimer + 's' }}</ElButton
              >
            </template>
          </ElInput>
        </ElFormItem>

        <!-- 密码提示 -->
        <!-- <ElFormItem prop="remark" v-if="type === 'register'">
        <ElInput
          v-model="form.remark"
          type="text"
          :placeholder="$t('Enter Password Remark')"
          :disabled="loading"
        />
      </ElFormItem> -->

        <!-- 图片验证码 -->
        <!-- <ElFormItem prop="imageCode" v-if="type === 'register'">
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
            >
              <img v-if="imageCodeData !== ''" :src="imageCodeData" />
            </div>
          </template>
        </ElInput>
      </ElFormItem> -->
      </ElForm>
    </div>

    <div class="policy flex flex-align-center">
      <div class="flex1 flex flex-align-center">
        <template v-if="registerType !== RegisterType.SetPassword">
          <span
            class="check-warp flex flex-align-center flex-pack-center"
            @click="form.isAgreePolicy = !form.isAgreePolicy"
            ><Icon name="check" v-if="form.isAgreePolicy"
          /></span>
          <span class="text flex1 flex flex-align-center">
            {{ $t('Login.policy') }}<a>{{ $t('Login.policy1') }}</a
            >{{ $t('Login.policy2') }}<a>{{ $t('Login.policy3') }}</a>
          </span>
        </template>
      </div>
      <a class="main-border" :class="{ faded: isPolicyBtnFaded }" @click="submitForm">
        <Icon name="right" />
      </a>
    </div>
  </div>
</template>
<script lang="ts">
export interface MetaIdWalletRegisterBaseInfo {
  userType: 'phone' | 'email'
  phone: string
  email: string
  code: string
  promotion: string
  password: string
}
</script>
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
  GetMetaIdByLoginName,
  LoginCheck,
  LoginGetCode,
  RegisterCheck,
  RegisterGetCode,
  SetUserInfo,
  SetUserPassword,
  SetUserWalletInfo,
} from '@/api/core'
import { SDK } from '@/utils/sdk'

interface Props {
  type: 'register' | 'login'
  loading: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits([
  'update:modelValue',
  'update:type',
  'success',
  'back',
  'register',
  'update:loading',
])
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
  isAgreePolicy: false,
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

const isShowCountry = ref(false)
const characteristic = ref('')
const imageCodeData = ref('')
const isGetImageCodeLoading = ref(false)
const isSendCodeLoading = ref(false)
const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const sendCodeTimer = ref(0)
const registerInfo: { val: any } = reactive({ val: null })

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

const enum RegisterType {
  Check,
  SetPassword,
}

const registerType = ref(RegisterType.Check)
defineExpose({
  registerType,
})
watch(
  () => props.type,
  () => {
    if (props.type === 'register') {
      getImageCodeData()
    }
  }
)

const isPolicyBtnFaded = computed(() => {
  let result = true
  if (props.type === 'login') {
    if (
      ((form.userType === 'phone' && form.phone !== '') ||
        (form.userType === 'email' && emailReg.test(form.email))) &&
      form.code !== '' &&
      form.password !== '' &&
      form.isAgreePolicy
    ) {
      result = false
    }
  } else {
    if (registerType.value === RegisterType.Check) {
      if (
        ((form.userType === 'phone' && form.phone !== '') ||
          (form.userType === 'email' && emailReg.test(form.email))) &&
        form.code !== '' &&
        form.isAgreePolicy
      ) {
        result = false
      }
    } else if (registerType.value === RegisterType.SetPassword) {
      if (
        form.password !== '' &&
        form.confirmPassword !== '' &&
        form.password === form.confirmPassword
      ) {
        result = false
      }
    }
  }
  return result
})

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
  if (props.loading) return
  emit('update:type', props.type === 'login' ? 'register' : 'login')
}

function changeUserType() {
  if (props.loading) return
  form.userType = form.userType === 'phone' ? 'email' : 'phone'
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
      if (form.isAgreePolicy) {
        emit('update:loading', true)
        try {
          const phoneNum = form.area !== '86' ? form.area + form.phone : form.phone
          // 登陆
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
              const metaIdInfo = await hdWallet.getMetaIdInfo(walletInfo.rootAddress)

              if (!metaIdInfo.metaId) {
                return ElMessageBox.alert(
                  '抱歉，此账号有问题，请到www.showmoney.app上修复',
                  '提示',
                  {
                    showClose: false,
                    confirmButtonText: '去修复',
                  }
                ).then(() => {
                  location.href = `${import.meta.env.VITE_FIXACCOUTURL}`
                })
              }
              // @ts-ignore
              //这里的参数account跟metaidInfo位置不能改变，否则新数据会被覆盖
              userStore.updateUserInfo({
                ...account,
                ...metaIdInfo,
                password: form.password,
                address: hdWallet.rootAddress,
              })
              userStore.$patch({ wallet: new SDK(import.meta.env.VITE_NET_WORK) })
              userStore.showWallet.initWallet()
              FormRef.value.resetFields()
              emit('update:loading', false)
              emit('update:modelValue', false)
              emit('success', props.type)
            } else {
              emit('update:loading', false)
              ElMessage.error(loginRes.msg)
            }
          } else {
            // 注册
            if (registerType.value === RegisterType.Check) {
              // 检查账号是否已注册
              const res = await GetMetaIdByLoginName({
                // @ts-ignore
                userType: form.userType,
                phone: form.userType === 'phone' ? phoneNum : undefined,
                email: form.userType === 'email' ? form.email : undefined,
              }).catch(error => {
                if (error.code === 500) {
                  registerType.value = RegisterType.SetPassword
                } else {
                  throw new Error(error.message)
                }
              })
              if (res?.code === 0) {
                throw new Error(i18n.t('Login.MetaIdWallet.accountAlreadyRegistered'))
              }
              // const registerRes = await RegisterCheck({
              //   type: 1, // 注册时必须加上图片验证码验证， 1 是给App用的的，App没有图片验证码
              //   userType: form.userType || 'phone',
              //   phone: phoneNum,
              //   email: form.email,
              //   code: form.code,
              //   name: form.name,
              //   promotion: '',
              //   imageCode: '',
              //   characteristic: '',
              // })
              // if (registerRes.code === 0) {
              //   registerInfo.val = registerRes.result as BaseUserInfoTypes
              //   registerType.value = RegisterType.SetPassword
              // }

              emit('update:loading', false)
            } else if (registerType.value === RegisterType.SetPassword) {
              emit('register', {
                userType: form.userType || 'phone',
                phone: phoneNum,
                email: form.email,
                code: form.code,
                promotion: '',
                password: form.password,
              } as MetaIdWalletRegisterBaseInfo)

              FormRef.value.resetFields()
              emit('update:loading', false)
              return
              // 注册
              const params = {
                type: 1, // 注册时必须加上图片验证码验证， 1 是给App用的的，App没有图片验证码
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
          }
        } catch (error) {
          emit('update:loading', false)
          return ElMessage.error((error as any).message)
        }
      } else {
        return ElMessage.error(
          i18n.t('Login.pleaseAggrePolicy') +
            i18n.t('Login.policy') +
            i18n.t('Login.policy1') +
            i18n.t('Login.policy2') +
            i18n.t('Login.policy3')
        )
      }
    }
  })
}
</script>

<style lang="scss" scoped src="./MetaIdWallet.scss"></style>
<style>
.vue-country-intl-popover {
  z-index: 9999;
}
</style>
