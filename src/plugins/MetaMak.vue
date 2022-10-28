<template>
    <ElDialog custom-class="dialogWrap" :title="dialogTitle" :model-value="modelValue" :close-on-click-modal="false"
        center>
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
            <a href="https://metamask.io/download/" target="blank">{{
                    $t('downloadMetaMask')
            }}</a>
        </div>

        <div v-if="signType == 3" class="metamaskDialogContentWrap">
            <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="dialog-ruleForm">
                <el-form-item label="设置昵称" prop="name">
                    <el-input placeholder="想让大家怎么称呼您呢..." v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="设置密码" prop="pass">
                    <el-input placeholder="请设置你的密码" type="password" v-model="ruleForm.pass" autocomplete="off">
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input placeholder="请确认密码" type="password" v-model="ruleForm.checkPass" autocomplete="off">
                    </el-input>
                </el-form-item>
                <el-form-item class="btnItem">
                    <el-button type="primary" @click="submitForm()">{{ $t('createMetaId') }}</el-button>
                    <!-- <el-button @click="resetForm('ruleForm')"
                            >取消</el-button
                        > -->
                </el-form-item>
            </el-form>
        </div>

        <div v-else-if="signType == 2" class="metamaskDialogContentWrap">
            <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="80px" class="dialog-ruleForm">
                <el-form-item label="MetaID:" prop="MetaidOrAdress">
                    <el-input placeholder="请输入MetaID或地址进行绑定" v-model="ruleForm.MetaidOrAdress"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="pass">
                    <el-input placeholder="请输入showmoney登录密码" type="password" v-model="ruleForm.pass" autocomplete="off">
                    </el-input>
                </el-form-item>
                <el-form-item class="btnItem">
                    <el-button type="primary" @click="submitForm()">绑定</el-button>
                    <el-button @click="resetForm()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div v-else-if="signType == 4" class="selectLoginWrap">
            <div class="item">
                <el-button type="primary" @click="selectLoginType(SignType.isBindMetaidOrAddressLogin)">{{
                        $t('isMetaIdUser')
                }}</el-button>
                <span>{{ $t('hasMetaid') }}</span>
            </div>
            <div class="item">
                <el-button type="primary" @click="selectLoginType(SignType.isRegister)">{{
                        $t('iamnewuser')
                }}</el-button>
                <span>{{ $t('registerNewUser') }}</span>
            </div>
        </div>
        <div v-else-if="signType == 5">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="dialog-ruleForm">
                <el-form-item label="密码" prop="pass">
                    <el-input placeholder="请输入showmoney登录密码" type="password" v-model="ruleForm.pass" autocomplete="off">
                    </el-input>
                </el-form-item>
                <el-form-item class="btnItem">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                    <el-button @click="resetForm()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 
            <span
                v-if="signType == 1 && !noWallet"
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="centerDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="sign">确 定</el-button>
            </span> -->
    </ElDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
// @ts-ignore
import Wallet from './utils/wallet'
import { ElLoading, ElMessage } from 'element-plus'
import keccak256 from 'keccak256'
import { getRandomWord, loginByHashData, loginByMetaidOrAddress, mnemoicLogin, setHashData, loginByNewUser } from './utils/api';
import type { MetaMaskLoginUserInfo } from './utils/api';
import { encode, decode } from 'js-base64'
import { aesEncrypt, decryptMnemonic, encryptMnemonic, hdWalletFromMnemonic, Network, signature } from '@/utils/wallet/hd-wallet';
import { bsv } from 'sensible-sdk';

export interface MetaMaskLoginRes {
    userInfo: MetaMaskLoginUserInfo
    wallet: bsv.HDPrivateKey
    password: string
}

interface Props {
    modelValue: boolean
    hdWalletFromMnemonic: (decodeMnemonic: string, tag: 'new' | 'old', network: Network) => Promise<bsv.HDPrivateKey>
    registerMetaId: (params: { name: string, password: string }) => Promise<MetaMaskLoginRes>
    password?: string | null
}

enum SignType {
    isLogined = 1,
    isBindMetaidOrAddressLogin = 2,
    isRegister = 3,
    isPending = 4,
    isInputPassword = 5,
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue', 'success'])


const i18n = useI18n()
const signType = ref(SignType.isLogined)
const noWallet = ref(false)
const ruleForm = reactive({
    name: '',
    pass: '123456',
    checkPass: '',
    MetaidOrAdress: '49856d813daa21dcffc6aafa94bc4630c93de9ebd209e723e64266ce55fba64b',
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
    MetaidOrAdress: [
        {
            required: true,
            message: '请输入已有MetaId或地址进行绑定',
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

const hashData = ref('')
const userInfo: { val: any } = reactive({ val: null })


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
        const res = await Wallet.connect().catch((error: any) => {
            ElMessage.error(error.message)
            emit('update:modelValue', false)
        })
        if (typeof res !== 'undefined') {
            if (!res) {
                noWallet.value = true
            } else {
                noWallet.value = false

                setTimeout(() => {
                    sign()
                }, 0.5 * 1000)
            }
        }

    }
})


const dialogTitle = computed(() => {
    if (signType.value === SignType.isLogined) {
        if (noWallet.value) {
            return ``
        } else {
            return i18n.t('checkEnvNoWallet')
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

function connectWallet() {
    return new Promise((resolve, reject) => {
        if ((window as any).web3) {
            Wallet.connect()
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

function gethashData() {
    return new Promise<string>(async (resolve, reject) => {
        (window as any).web3.eth.personal
            .sign(
                keccak256((window as any).connectedAddress).toString('hex'),
                (window as any).connectedAddress
            )
            .then(async (res: any) => {
                resolve(res)
            })
            .catch((error: any) => reject(error))
    })
}

async function sign() {
    const loading = ElLoading.service({ text: i18n.t('siging') })
    if (!(window as any).web3?.eth) {
        loading.close()
        emit('update:modelValue', false)
        return ElMessage.error(i18n.t('noLoginWeb3'))
    }
    if (!hashData.value) {
        hashData.value = await gethashData()
    }
    //检查hash是否已绑定
    const getMnemonicRes = await loginByHashData({
        hashData: hashData.value,
    })
    if (getMnemonicRes.code === 0 && getMnemonicRes.data) {
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
    } else {
        signType.value = SignType.isPending
        loading.close()
    }
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
    return new Promise<{
        userInfo: any,
        wallet: bsv.HDPrivateKey
        password: string
    }>(async (resolve, reject) => {
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
                    console.log('mnemonic', mnemonic)
                    resolve({
                        userInfo: Object.assign(loginInfo.data, {
                            enCryptedMnemonic: mnemonic,
                        }),
                        wallet: hdWallet,
                        password: password.value
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
        // localStorage.setItem(
        //     'access_token',
        //     JSON.stringify({
        //         access_token: userInfo.val.token,
        //     })
        // )
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


function selectLoginType(type: number) {
    if (type === SignType.isBindMetaidOrAddressLogin) {
        signType.value = SignType.isBindMetaidOrAddressLogin
    } else if (type == SignType.isRegister) {
        signType.value = SignType.isRegister
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
            window.localStorage.setItem(
                'pw',
                encode(ruleForm.pass)
            )
            try {
                if (signType.value == SignType.isBindMetaidOrAddressLogin) {
                    //绑定metaid用户
                    const loading = ElLoading.service({ text: `${i18n.t('bindingMetaid')}` })
                    const res = await bindingMetaidOrAddressLogin(hashData.value)
                    loginOperation()
                    emit('success', {
                        ...res,
                        password: password.value
                    })
                    loading.close()
                } else if (signType.value == SignType.isRegister) {
                    //    //新用户
                    const loading = ElLoading.service({ text: `${i18n.t('registerLoading')}` })
                    const res = await createMetaidAccount(hashData.value)
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

function bindingMetaidOrAddressLogin(str: string) {
    return new Promise<MetaMaskLoginRes>(async (resolve, reject) => {
        const params =
            ruleForm.MetaidOrAdress.length == 34
                ? { address: ruleForm.MetaidOrAdress }
                : { metaId: ruleForm.MetaidOrAdress }
        try {
            const mnemonic = await loginByMetaidOrAddress(params)
            if (mnemonic.code == 0) {
                const res = await loginByMnemonic(mnemonic.data)
                await sendHash(hashData.value)
                resolve(res)
            }
        } catch (error) {
            reject(error)
        }
    })
}


function sendHash(hash: string, metaId = '') {
    return new Promise(async (resolve, reject) => {
        if (!metaId) {
            metaId = userInfo.val.metaId
        }
        try {
            const res = await setHashData({
                accessKey: userInfo.val.token,
                userName:
                    userInfo.val.register == 'email' ||
                        userInfo.val.registerType == 'email'
                        ? userInfo.val.email
                        : userInfo.val.phone,
                timestamp: +new Date(),
                hashData: hash,
                metaId: metaId,
            })
            if (res.code == 0) {
                resolve(res.msg)
            }
        } catch (error) {
            reject(error)
        }
    })
}

function createMetaidAccount(hash: string) {
    return new Promise<MetaMaskLoginRes>(async (resolve, reject) => {
        const res = await props.registerMetaId({
            name: ruleForm.name,
            password: ruleForm.pass
        })

        const encryptmnemonic = encryptMnemonic(
            res.userInfo.enCryptedMnemonic!,
            res.password
        )

        const reportUserInfoRes = await loginByNewUser({
            address: res.userInfo.address,
            xPub: res.wallet.xpubkey.toString(),
            pubKey: res.wallet.deriveChild(0).deriveChild(0).publicKey.toString(),
            hashData: hash,
            mnemonic: encryptmnemonic,
            userName: res.userInfo.name,
        })
        if (reportUserInfoRes.code === 0) {
            const reportMetaIdRes = await sendHash(hash, res.userInfo.metaId)
            if (reportMetaIdRes.code === 0) {
                resolve(res)
            }
        }

        // const mnemonic = await createMnemonic(
        //     window.connectedAddress,
        //     encode(ruleForm.pass)
        // )
        // const hdWallet = await hdWalletFromMnemonic(mnemonic)
        // this.$store.dispatch('setHdWallet', hdWallet)
        // const HdWalletInstance = new HdWallet(hdWallet)
        // const account = {
        //     name: ruleForm.name,
        // }
        // const address = hdWallet
        //     .deriveChild(0)
        //     .deriveChild(0)
        //     .privateKey.toAddress()
        //     .toString()
        // //
        // const pubKey = hdWallet
        //     .deriveChild(0)
        //     .deriveChild(0)
        //     .publicKey.toString()

        // const encryptmnemonic = encryptMnemonic(
        //     mnemonic,
        //     decode(getPw()!)
        // )

        // const userInfo = await loginByNewUser({
        //     address: address,
        //     xPub: hdWallet.xpubkey,
        //     pubKey: pubKey,
        //     // metaId: metaId,
        //     hashData: hash,
        //     mnemonic: encryptmnemonic,
        //     userName: account.name,
        // })
        // if (userInfo.code == 0) {
        //     ; (account.accessKey = userInfo.data.token),
        //         (account.userName =
        //             userInfo.data.registerType == 'email'
        //                 ? userInfo.data.email
        //                 : userInfo.data.phone)
        //     const { metaId } = await HdWalletInstance.initMetaIdNode(
        //         account
        //     )
        //     const newUserInfo = Object.assign(userInfo.data, {
        //         metaId: metaId,
        //     })
        //     console.log('zxczxczxaxzx', newUserInfo)

        //     userInfo.val = newUserInfo
        //     await sendHash(hash, metaId)
        // }
    })
}
</script>

<style lang="scss" scoped src="./MetaMak.scss">

</style>
<style>
.dialogWrap {
    width: 440px;
}
</style>