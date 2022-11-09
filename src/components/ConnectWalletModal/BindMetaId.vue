<template>
  <ElDialog :model-value="modelValue" class="none-header sm">
    <div class="bind-metaid" v-loading="loading">
      <!-- 选择绑定类型 -->
      <div class="choose" v-if="status === BindStatus.ChooseType">
        <div class="title">{{ $t('Login.bindMetaId.title1') }}</div>
        <div class="cont">
          <div class="sub-title">{{ $t('Login.bindMetaId.title2') }}</div>
          <div class="list">
            <div
              class="main-border flex flex-align-center"
              v-for="(item, index) in operates"
              :key="index"
              @click="status = item.value"
            >
              <div class="icon-warp flex flex-align-center flex-pack-center">
                <icon :name="item.icon" />
              </div>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 绑定成功 -->
      <div class="choose" v-else-if="status === BindStatus.BindSuccess">
        <div class="title">{{ $t('Login.bindMetaId.bindSuccessTitle') }}</div>
        <div class="cont">
          <div class="userInfo">
            <UserAvatar :metaId="userStore.user!.metaId" :type="userStore.user!.avatarType" />
            <div class="username">{{ userStore.user?.name }}</div>
            <div class="metaid">
              MetaID：{{userStore.user!.metaId.slice(0, 7)}}...{{userStore.user!.metaId.slice(-7)}}
            </div>

            <div class="operate flex flex-pack-end">
              <a class="main-border primary">
                <Icon name="right" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入密码 -->
      <div class="bind-haved-metaid" v-else-if="status === BindStatus.InputPassword">
        <div class="title">{{ $t('Login.bindMetaId.inputPasswordTitle') }}</div>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="0" class="dialog-form">
          <!-- 密码 -->
          <el-form-item prop="pass">
            <el-input
              :placeholder="$t('Enter ShowMoney Password')"
              type="password"
              v-model="form.pass"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>
        </el-form>

        <div class="operate flex flex-align-center flex-pack-end">
          <div class="main-border primary" :class="{ faded: isBtnDisabled }" @click="submitForm">
            <Icon name="right" />
          </div>
        </div>
      </div>

      <!-- 绑定 MetaID信息 -->
      <div class="bind-haved-metaid" v-else>
        <div class="title">{{ $t('Login.bindMetaId.bindHavedMetaId') }}</div>
        <div class="intro">{{ $t('Login.bindMetaId.bindHavedMetaIdIntro') }}</div>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="0" class="dialog-form">
          <!-- 用户名 -->
          <!-- <el-form-item prop="name" v-if="status === BindStatus.BindRegisterMetaId">
            <el-input :placeholder="$t('nickeNamePlac')" v-model="form.name"></el-input>
          </el-form-item> -->

          <!-- MetaId -->
          <el-form-item prop="account" v-if="status === BindStatus.BindHavedMetaId">
            <el-input :placeholder="$t('Enter MetaID For Bind')" v-model="form.account"></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="pass">
            <el-input
              :placeholder="$t('Enter ShowMoney Password')"
              type="password"
              v-model="form.pass"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>

          <!--确认密码 -->
          <el-form-item prop="checkPass" v-if="status === BindStatus.BindRegisterMetaId">
            <el-input
              :placeholder="$t('ConfirmPassword')"
              type="password"
              v-model="form.checkPass"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>
        </el-form>

        <div class="operate flex flex-align-center">
          <div class="flex1">
            <a @click="back">{{ $t('back') }}</a>
          </div>
          <div class="main-border primary" :class="{ faded: isBtnDisabled }" @click="submitForm">
            <Icon name="right" />
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { BindMetaIdRes, BindUserInfo } from '@/@types/common'
import { GetUserInfo } from '@/api/aggregation'
import {
  GetRandomWord,
  LoginByHashData,
  loginByMetaidOrAddress,
  LoginByNewUser,
  MnemoicLogin,
  setHashData,
} from '@/api/core'
import { BindStatus } from '@/enum'
import { useUserStore } from '@/stores/user'
import { AllNodeName, SDK } from '@/utils/sdk'
import {
  createMnemonic,
  decryptMnemonic,
  encryptMnemonic,
  HdWallet,
  hdWalletFromMnemonic,
  Network,
  signature,
} from '@/utils/wallet/hd-wallet'
import { encode } from 'js-base64'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
  thirdPartyWallet: {
    signAddressHash: string
    address: string
  }
}
const props = withDefaults(defineProps<Props>(), {})
const i18n = useI18n()
const userStore = useUserStore()

const emit = defineEmits(['update:modelValue', 'register'])

const status = ref(BindStatus.ChooseType)

const loading = ref(false)
const operates = reactive([
  {
    name: i18n.t('Login.bindMetaId.createMetaId'),
    icon: 'wallet_add',
    value: BindStatus.BindRegisterMetaId,
  },
  {
    name: i18n.t('Login.bindMetaId.bindHavedMetaId'),
    icon: 'wallet',
    value: BindStatus.BindHavedMetaId,
  },
])

const isBtnDisabled = computed(() => {
  let result = true
  if (status.value === BindStatus.BindHavedMetaId) {
    if (form.account !== '' && form.pass !== '') {
      result = false
    }
  } else if (status.value === BindStatus.BindRegisterMetaId) {
    if (form.pass !== '' && form.checkPass !== '' && form.pass === form.checkPass) {
      result = false
    }
  } else if (status.value === BindStatus.InputPassword) {
    if (form.pass !== '') result = false
  }
  return result
})

const form = reactive({
  name: '',
  pass: '123456',
  checkPass: '',
  account: '',
  MetaidOrAdress: '49856d813daa21dcffc6aafa94bc4630c93de9ebd209e723e64266ce55fba64b',
})
const rules = {
  name: [
    // {
    //   required: true,
    //   message: '请输入用户名',
    //   trigger: 'blur',
    // },
    // {
    //   min: 1,
    //   max: 10,
    //   message: '长度在 1 到 10 个字符',
    //   trigger: 'blur',
    // },
  ],
  account: [
    {
      required: true,
      message: '请输入已有MetaId或地址进行绑定',
      trigger: 'blur',
    },
  ],
  pass: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (form.checkPass !== '') {
            formRef.value.validateField('checkPass')
          }
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  checkPass: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== form.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
const formRef = ref()

function back() {
  formRef.value.resetFields()
  status.value = BindStatus.ChooseType
}

function submitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      let res: BindMetaIdRes
      try {
        if (status.value == BindStatus.BindHavedMetaId) {
          //绑定metaid用户
          res = await bindingMetaidOrAddressLogin()
        } else if (status.value === BindStatus.BindRegisterMetaId) {
          //新用户
          res = await createMetaidAccount()
        } else {
          // 使用密码 和 助记词登陆
          const getMnemonicRes = await LoginByHashData({
            hashData: props.thirdPartyWallet.signAddressHash,
          })
          if (getMnemonicRes?.code === 0 && getMnemonicRes.data) {
            res = await loginByMnemonic(getMnemonicRes.data, form.pass)
          }
        }
        if (res!) {
          await loginSuccess(res)
        }
      } catch (error) {
        loading.value = false
        ElMessage.error((error as any).message)
      }
    }
  })
}

function loginSuccess(params: BindMetaIdRes) {
  return new Promise<void>(async (resolve, reject) => {
    const metaIdInfo = await GetUserInfo(params.userInfo.metaId)
    await userStore.updateUserInfo({
      ...params.userInfo,
      ...metaIdInfo,
      password: params.password,
    })
    userStore.$patch({ wallet: new SDK() })
    userStore.showWallet.initWallet()
    formRef.value.resetFields()
    if (status.value === BindStatus.BindHavedMetaId) {
      status.value = BindStatus.BindSuccess
    } else {
      emit('update:modelValue', false)
      if (status.value === BindStatus.BindRegisterMetaId) {
        emit('register')
      }
    }
    loading.value = false
  })
}

function createMetaidAccount() {
  return new Promise<BindMetaIdRes>(async (resolve, reject) => {
    try {
      const mnemonic = await createMnemonic(
        props.thirdPartyWallet.signAddressHash,
        encode(form.pass)
      )
      const hdWallet = await hdWalletFromMnemonic(mnemonic, 'new', Network.testnet)
      const HdWalletInstance = new HdWallet(hdWallet)

      const account: any = {
        name: form.name,
      }
      const address = hdWallet
        .deriveChild(0)
        .deriveChild(0)
        .privateKey.toAddress()
        .toString()
      //
      const pubKey = hdWallet
        .deriveChild(0)
        .deriveChild(0)
        .publicKey.toString()

      const encryptmnemonic = encryptMnemonic(mnemonic, form.pass)

      const getUserInfoRes = await LoginByNewUser({
        address: address,
        xPub: hdWallet.xpubkey,
        pubKey: pubKey,
        hashData: props.thirdPartyWallet.signAddressHash,
        mnemonic: encryptmnemonic,
        userName: account.name,
      })
      // @ts-ignore
      if (getUserInfoRes.code == 0) {
        ;(account.accessKey = getUserInfoRes.data.token),
          (account.userName =
            getUserInfoRes.data.registerType === 'email'
              ? getUserInfoRes.data.email
              : getUserInfoRes.data.phone)
        const { metaId } = await HdWalletInstance.initMetaIdNode({
          ...account,
          userType: getUserInfoRes.data.registerType,
          email: getUserInfoRes.data.email,
          phone: getUserInfoRes.data.phone,
        })
        const newUserInfo = Object.assign(getUserInfoRes.data, {
          metaId: metaId,
        })
        await sendHash(newUserInfo)
        resolve({
          userInfo: newUserInfo,
          wallet: hdWallet,
          password: form.pass,
        })
      }
    } catch (error) {
      reject(error)
    }

    // const res = await props.registerMetaId({
    //     name: ruleForm.name,
    //     password: ruleForm.pass
    // })

    // const encryptmnemonic = encryptMnemonic(
    //     res.userInfo.enCryptedMnemonic!,
    //     res.password
    // )

    // const reportUserInfoRes = await loginByNewUser({
    //     address: res.userInfo.address,
    //     xPub: res.wallet.xpubkey.toString(),
    //     pubKey: res.wallet.deriveChild(0).deriveChild(0).publicKey.toString(),
    //     hashData: hash,
    //     mnemonic: encryptmnemonic,
    //     userName: res.userInfo.name,
    // })
    // if (reportUserInfoRes.code === 0) {
    //     const reportMetaIdRes = await sendHash(hash, res.userInfo)
    //     if (reportMetaIdRes.code === 0) {
    //         resolve(res)
    //     }
    // }
  })
}

function createETHBindingNode(wallet: HdWallet) {
  return new Promise(async (resolve, reject) => {
    const res = await wallet.createBrfcNode({
      nodeName: AllNodeName.ETHBinding,
    })
  })
}

function loginByMnemonic(mnemonic: string, password: string) {
  return new Promise<BindMetaIdRes>(async (resolve, reject) => {
    try {
      const decodeMnemonic = decryptMnemonic(mnemonic, password)
      const word = await GetRandomWord()
      if (word.code == 0) {
        const hdWallet = await hdWalletFromMnemonic(decodeMnemonic, 'new', Network.testnet)
        const sign = signature(
          word.data.word,
          hdWallet
            .deriveChild(0)
            .deriveChild(0)
            .privateKey.toString()
        )
        const loginInfo = await MnemoicLogin({
          xpub: hdWallet.xpubkey.toString(),
          sign,
          word: word.data.word,
          type: 1,
        })
        if (loginInfo.code == 0) {
          resolve({
            userInfo: Object.assign(loginInfo.data, {
              enCryptedMnemonic: mnemonic,
            }),
            wallet: hdWallet,
            password: password,
          })
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

function bindingMetaidOrAddressLogin() {
  return new Promise<BindMetaIdRes>(async (resolve, reject) => {
    try {
      // get metaId
      const mnemonic = await loginByMetaidOrAddress({
        metaId: '',
      })
      // @ts-ignore
      if (mnemonic.code == 0) {
        const res = await loginByMnemonic(mnemonic.data)
        await sendHash(res.userInfo)
        resolve(res)
      }
    } catch (error) {
      reject(error)
    }
  })
}

function sendHash(userInfo: BindUserInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await setHashData({
        accessKey: userInfo.token,
        userName:
          userInfo.register == 'email' || userInfo.registerType == 'email'
            ? userInfo.email
            : userInfo.phone,
        timestamp: +new Date(),
        hashData: props.thirdPartyWallet.signAddressHash,
        metaId: userInfo.metaId,
        address: props.thirdPartyWallet.address,
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

defineExpose({
  loginByMnemonic,
  loginSuccess,
  status: status,
})
</script>

<style lang="scss" scoped src="./BindMetaId.scss"></style>
