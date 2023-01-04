<template>
  <ElDialog
    custom-class="dialogWrap"
    :title="dialogTitle"
    :model-value="modelValue"
    :close-on-click-modal="false"
    center
  >
    <div class="signWrap" v-if="signType == 1 || signType == 4">
      <div class="logoWrap">
        <img src="@/assets/images/MetaMask_Fox.svg.png" alt="" />
      </div>
      <div class="tips" v-if="signType == 1">
        <span>{{ $t('useMetaMaskSign') }}</span>
      </div>
      <div class="tips" v-else-if="signType == 4">
        <span>{{ $t('useMeraMaskSucc') }}</span>
        <span>{{ $t('setMetaIDInfo') }}</span>
      </div>
    </div>
    <div v-if="noWallet" class="noWalletTips">
      <img src="@/assets/images/MetaMask_Fox.svg.png" alt="" />
      <a href="https://metamask.io/download/" target="blank">{{ $t('downloadMetaMask') }}</a>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
// @ts-ignore
import Wallet, { MetaMaskEthereumProvider } from './utils/wallet'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import {ethers} from 'ethers'
import { getRandomWord, loginByHashData, loginByMetaidOrAddress, mnemoicLogin, setHashData, loginByNewUser } from './utils/api';
import type { MetaMaskLoginUserInfo } from './utils/api';
import { encode, decode } from 'js-base64'
import { aesEncrypt, createMnemonic, decryptMnemonic, encryptMnemonic, HdWallet, hdWalletFromMnemonic, Network, signature } from '@/utils/wallet/hd-wallet';
import { bsv } from 'sensible-sdk';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import { useRootStore } from '@/stores/root';
import { currentSupportChain } from '@/config'

export interface MetaMaskLoginRes {
    userInfo: MetaMaskLoginUserInfo
    wallet: bsv.HDPrivateKey
    password: string
    type: 'register' | 'login'
}

enum SignType {
    isLogined = 1,
    isBindMetaidOrAddressLogin = 2,
    isRegister = 3,
    isPending = 4,
    isInputPassword = 5,
}

interface Props {
    modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue', 'success', 'logout'])
defineExpose({
    ethPersonalSignSign
})

const userStore = useUserStore()
const route = useRoute()
let type: 'register' | 'login' = 'login'

const i18n = useI18n()

const signType = ref(SignType.isLogined)
const noWallet = ref(false)
const ruleForm = reactive({
    name: '',
    pass: '123456',
    checkPass: '',
    ShowAccount: '49856d813daa21dcffc6aafa94bc4630c93de9ebd209e723e64266ce55fba64b',
})
const rules = {
    name: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur',
        },
    ],
    ShowAccount: [
        {
            required: true,
            message: '请输入Show账户名',
            trigger: 'blur',
        },
    ],
    pass: [
        {
            required: true,
            validator: validatePass,
            trigger: 'blur',
        },
    ],
    checkPass: [
        {
            required: true,
            validator: validatePass2,
            trigger: 'blur',
        },
    ],
}
const ruleFormRef = ref()

const ethAddress = ref('')
const ethAddressHash = ref('')
const userInfo: { val: any } = reactive({ val: null })
let provider: null | MetaMaskEthereumProvider = null
const root = useRootStore()


const password = computed(() => {
    let pw = ''
    if (props.password) {
        pw = decode(props.password)
    } else if (ruleForm.pass) {
        pw = ruleForm.pass
    }
    return pw
})

watch(() => props.modelValue, async () => {

    if (props.modelValue) {
        startConnect()
    }
})




const dialogTitle = computed(() => {
    if (signType.value === SignType.isLogined) {
        if (noWallet.value) {
            return i18n.t('checkEnvNoWallet')
        } else {
            return ``
        }
    } else if (signType.value === SignType.isBindMetaidOrAddressLogin) {
        return i18n.t('bindMetaidOrAddress')
    } else if (signType.value === SignType.isRegister) {
        return i18n.t('registerLogin')
    } else if (signType.value == SignType.isPending) {
        return i18n.t('selectLoginType')
    } else if (signType.value === SignType.isInputPassword) {
        return i18n.t('inputPw')
    }
})

async function startConnect() {
    try {
        const res = await Wallet.connect()
        if (res) {
            // console.log("currentSupportChain", import.meta.env.VITE_ETH_CHAIN)
            // const chainWhiteList = currentSupportChain.filter((item) => {
            //   return parseInt(item.chainId, 10) === parseInt(res.provider.chainId)
            // })
            if (root.chainWhiteList.includes(res.provider.chainId)){
                startProvider(res.provider)



                const result = await ethPersonalSignSign({
                    address: res.ethAddress,
                    message:ethers.utils.sha256(ethers.utils.toUtf8Bytes(res.ethAddress)).split('0x')[1].toLocaleUpperCase()
                    // message: ethers.utils.sha256(ethers.utils.toUtf8Bytes(res.ethAddress)).slice(2, -2),
                })

                if (result) {
                    emit('success',{ signAddressHash:result, address: res.ethAddress});
                }
            } else {
                ElMessageBox.confirm(i18n.t('MetaMak.Chain Network Error Tips') + `${import.meta.env.VITE_ETH_CHAIN}`, i18n.t('MetaMak.Chain Network Error'), {
                    customClass: 'primary',
                    confirmButtonText: i18n.t('MetaMak.Change') + `${import.meta.env.VITE_ETH_CHAIN}`,
                    cancelButtonText: i18n.t('Cancel')
                }).then(() => {

                    ;(window as any).ethereum
                    .request({ method: 'wallet_switchEthereumChain', params: [{
                        // chainId: ethers.utils.hexValue(parseInt(import.meta.env.VITE_ETH_CHAINID))
                        chainId: import.meta.env.VITE_ETH_CHAIN == 'eth' ? currentSupportChain[0].chainId : currentSupportChain[1].chainId
                    }]})
                        .then((res: string[]) => {
                        startConnect()
                    })
                    .catch((error: any) => {
                        ElMessage.error(error.message)
                        emit('update:modelValue', false)
                    })
                })
                .catch(() => {
                    emit('update:modelValue', false)
                })
            }
        }
    } catch (error) {
        emit('update:modelValue', false)
    }
}

function ethPersonalSignSign(params: {
    message: string,
    address: string
}) {
    // console.log("messages",ethers.utils.hexValue(params.message) )
    //  debugger
    return new Promise<string>(async (resolve, reject) => {

        (window as any).ethereum
          .request({ method: 'personal_sign', params: [params.message,params.address] })
            .then((res: string) => {

            resolve(res)
          }).catch((error: any) => {
            reject({
                code: error.code,
                message: error.message
            })
          })
    })
}

function sign() {
    return new Promise(async (resolve, reject) => {
        const loading = ElLoading.service({ text: i18n.t('siging') })
        try {
            //检查hash是否已绑定
            const getMnemonicRes = await loginByHashData({
                hashData: ethAddressHash.value,
            }).catch((error) => {
                if (error.code === -1) {
                    signType.value = SignType.isPending
                    loading.close()
                } else {
                    throw new Error(error.message)
                }
            })

            if (getMnemonicRes?.code === 0 && getMnemonicRes.data) {
                // 有密码直接登录， 没有密码就要用户输入
                if (props.password || ruleForm.pass) {
                    const res = await loginByMnemonic(getMnemonicRes.data)
                    emit('update:modelValue', false)
                    emit('success', {
                        ...res,
                        password: password.value
                    })
                    loading.close()
                } else {
                    signType.value = SignType.isInputPassword
                    loading.close()
                }
            }
        } catch (error) {
            loading.close()
            emit('update:modelValue', false)
            ElMessage.error((error as any).message)
        }
    })
}

function hashSignLogin(mnemonic: string) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const res = await loginByMnemonic(mnemonic)
            userInfo.val = res
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

function loginByMnemonic(mnemonic: string) {
    return new Promise<MetaMaskLoginRes>(async (resolve, reject) => {
        try {
            const decodeMnemonic = decryptMnemonic(
                mnemonic,
                password.value
            )

            const word = await getRandomWord()
            if (word.code == 0) {
                const hdWallet = await props.hdWalletFromMnemonic(decodeMnemonic, 'new', Network.testnet)
                const sign = signature(
                    word.data.word,
                    hdWallet
                        .deriveChild(0)
                        .deriveChild(0)
                        .privateKey.toString()
                )
                const loginInfo = await mnemoicLogin({
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
                        password: password.value,
                        type: type
                    })
                }
            }
        } catch (error) {

            console.log('error', error)
        }
    })
}

function getPw() {
    return window.localStorage.getItem('pw') || null
}

function loginOperation(type = '') {
    return new Promise<void>((resolve, reject) => {
        emit('update:modelValue', false)
        if (type == 'newUser') {
            sign()
        } else {
            setloaclAccessKey()
        }
        resolve()
    })
}

function setloaclAccessKey() {
    const accessKey = aesEncrypt(
        decode(getPw()!),
        userInfo.val.pk2.slice(0, 32)
    )
    window.localStorage.setItem('accessKey', accessKey)
}


function selectLoginType(_type: number) {
    if (_type === SignType.isBindMetaidOrAddressLogin) {
        signType.value = SignType.isBindMetaidOrAddressLogin
        type = 'login'
    } else if (_type == SignType.isRegister) {
        signType.value = SignType.isRegister
        type = 'register'
    } else {
        signType.value = SignType.isLogined
    }
}

function validatePass(rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (ruleForm.checkPass !== '') {
            ruleFormRef.value.validateField('checkPass')
        }
        callback()
    }
}

function validatePass2(rule: any, value: any, callback: any) {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

function resetForm() {
    ruleFormRef.value.resetFields()
    signType.value = SignType.isPending
}

function submitForm() {
    ruleFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
                if (signType.value == SignType.isBindMetaidOrAddressLogin) {
                    //绑定metaid用户
                    const loading = ElLoading.service({ text: `${i18n.t('bindingMetaid')}` })
                    const res = await bindingMetaidOrAddressLogin()
                    if (res) {
                        loginSuccess(res)
                    }
                    loginOperation()
                    emit('success', {
                        ...res,
                        password: password.value,
                        type
                    })
                    ruleFormRef.value.resetFields()
                    loading.close()
                } else if (signType.value == SignType.isRegister) {
                    //    //新用户
                    const loading = ElLoading.service({ text: `${i18n.t('registerLoading')}` })
                    const res = await createMetaidAccount().catch((error) => {
                        loading.close()
                        throw new Error(error.message)
                    })
                    ruleFormRef.value.resetFields()
                    emit('success', res)
                    loading.close()
                    emit('update:modelValue', false)
                } else if (signType.value == SignType.isInputPassword) {
                    sign()
                }
            } catch (error) {
                ElMessage.error((error as any).message)
            }
        }
    })
}

function loginSuccess(params: BindMetaIdRes) {
    ruleFormRef.value.resetFields()

}

function bindingMetaidOrAddressLogin() {
    return new Promise<MetaMaskLoginRes>(async (resolve, reject) => {
        const params =
            ruleForm.ShowAccount.length == 34
                ? { address: ruleForm.ShowAccount }
                : { metaId: ruleForm.ShowAccount }
        try {
            const mnemonic = await loginByMetaidOrAddress(params)
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


function sendHash(userInfo: MetaMaskLoginUserInfo) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await setHashData({
                accessKey: userInfo.token,
                userName:
                    userInfo.register == 'email' ||
                        userInfo.registerType == 'email'
                        ? userInfo.email
                        : userInfo.phone,
                timestamp: +new Date(),
                hashData: ethAddressHash.value,
                metaId: userInfo.metaId,
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

function createMetaidAccount() {
    return new Promise<MetaMaskLoginRes>(async (resolve, reject) => {
        try {
            const mnemonic = await createMnemonic(
                ethAddress.value,
                encode(ruleForm.pass)
            )
            const hdWallet = await hdWalletFromMnemonic(mnemonic, 'new', Network.testnet)
            const HdWalletInstance = new HdWallet(hdWallet)
            const account: any = {
                name: ruleForm.name,
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

            const encryptmnemonic = encryptMnemonic(
                mnemonic,
                ruleForm.pass
            )

            const userInfo = await loginByNewUser({
                address: address,
                xPub: hdWallet.xpubkey,
                pubKey: pubKey,
                hashData: ethAddress.value,
                mnemonic: encryptmnemonic,
                userName: account.name,
            })
            // @ts-ignore
            if (userInfo.code == 0) {
                ; (account.accessKey = userInfo.data.token),
                    (account.userName =
                        userInfo.data.registerType == 'email'
                            ? userInfo.data.email
                            : userInfo.data.phone)
                const { metaId } = await HdWalletInstance.initMetaIdNode({
                    ...account,
                    userType: userInfo.data.registerType,
                    email: userInfo.data.email,
                    phone: userInfo.data.phone
                })
                const newUserInfo = Object.assign(userInfo.data, {
                    metaId: metaId,
                })
                await sendHash(newUserInfo)
                resolve({
                    userInfo: newUserInfo,
                    wallet: hdWallet,
                    password: ruleForm.pass,
                    type
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

function startProvider(provider: MetaMaskEthereumProvider) {
    window.provider = provider
    window.provider!.on('accountsChanged', (res: string[]) => {
        userStore.logout(route)
        if (res.length > 0) {
            startConnect()
        }
    })
}

function logout() {
    provider = null
    ethAddress.value = ''
    ethAddressHash.value = ''
    signType.value = SignType.isLogined
    emit('logout')
}
</script>

<style lang="scss" scoped src="./MetaMak.scss"></style>
<style>
.dialogWrap {
  width: 440px;
}
</style>
