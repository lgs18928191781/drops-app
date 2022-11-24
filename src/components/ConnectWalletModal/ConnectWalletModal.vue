<template>
  <!-- 连接钱包 -->
  <ElDialog
    :model-value="rootStore.isShowLogin"
    :title="$t('Login.connectWallet')"
    :close-on-click-modal="!loading"
    @close="rootStore.$patch({ isShowLogin: false })"
  >
    <div class="login-warp flex">
      <div class="flex1 login-cover">
        <img src="@/assets/images/login_img.png" />
      </div>
      <div class="flex1">
        <!-- 选择钱包 -->
        <div class="connect-wallet flex flex-v" v-if="status === ConnectWalletStatus.Watting">
          <div class="connect-wallet-section flex1" v-for="(item, index) in wallets" :key="index">
            <div class="title">{{ item.title() }}</div>
            <div
              class="btn-list flex flex-v"
              v-for="(wallet, walletIndex) in item.list"
              :key="walletIndex"
            >
              <div class="main-border flex flex-align-center" @click="wallet.fun()">
                <img class="icon" :src="wallet.icon" />
                {{ wallet.name() }}
              </div>
            </div>
          </div>
        </div>

        <!-- 使用MetaId钱包 -->
        <MetaIdWalletVue
          v-model:type="type"
          v-model:loading="loading"
          v-else-if="status === ConnectWalletStatus.UseMetaId"
          @back="status = ConnectWalletStatus.Watting"
          @success="rootStore.$patch({ isShowLogin: false })"
          @register="OnMetaIdRegister"
        />
      </div>
    </div>
  </ElDialog>

  <!-- MetaMask -->
  <MetaMask
    v-model="isShowMetaMak"
    ref="MetaMaskRef"
    id="metamask"
    @success="onThreePartLinkSuccess"
  />

  <!-- 登录注册 -->
  <!-- <LoginAndRegisterModalVue
    v-model="isShowLoginAndRegister"
    v-model:type="type"
    @success="onLoginAndRegisterSuccess"
  /> -->

  <!-- setBaseInfo -->
  <SetBaseInfoVue
    v-model="isShowSetBaseInfo"
    :loading="loading"
    @success="onSetBaseInfoSuccess"
    ref="setBaseInfoRef"
  />

  <!-- send buzz -->
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

  <!-- 推荐关注 -->
  <RecommentFollowVue v-model="isShowRecommentFollow" />

  <!-- 助记词备份 -->
  <BackupMnemonicVue />

  <!-- 绑定metaId -->
  <BindMetaIdVue
    :thirdPartyWallet="thirdPartyWallet"
    ref="BindMetaIdRef"
    v-model="isShowBindModal"
    @register="isShowSetBaseInfo = true"
  />
</template>

<script setup lang="ts">
import IconMetaMask from '@/assets/images/login_logo_matamask.png'
import IconWallteConnect from '@/assets/images/login_logo_wallteconnect.png'
import IconAdd from '@/assets/images/wallte_icon_add.png'
import IconLine from '@/assets/images/wallte_icon_line.png'
import IconMVC from '@/assets/images/iocn_mvc.png'
import IconShowmoney from '@/assets/images/iocn_showmoney.png'
import MetaMask, { MetaMaskLoginRes } from '@/plugins/MetaMak.vue'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { AllNodeName, SDK } from '@/utils/sdk'
import {
  HdWallet,
  hdWalletFromMnemonic,
  eciesDecryptData,
  BaseUserInfoTypes,
  hdWalletFromAccount,
  encryptPassword,
  encryptMnemonic,
} from '@/utils/wallet/hd-wallet'
import LoginAndRegisterModalVue from '@/components/LoginAndRegisterModal/LoginAndRegisterModal.vue'
import FirstBuzzImg from '@/assets/images/first_buzz.svg?url'
import { toMvcScan } from '@/utils/util'
import MetaIdWalletVue, { MetaIdWalletRegisterBaseInfo } from './MetaIdWallet.vue'
import SetBaseInfoVue from './SetBaseInfo.vue'
import RecommentFollowVue from './RecommentFollow.vue'
import BackupMnemonicVue from './BackupMnemonic.vue'
import BindMetaIdVue from './BindMetaId.vue'

import { onMounted, reactive, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BindStatus, InviteActivityTag, NodeName } from '@/enum'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import { GetUserAllInfo } from '@/api/aggregation'
import { debug } from 'console'
import {
  LoginByHashData,
  RegisterCheck,
  SetUserInfo,
  SetUserPassword,
  SetUserWalletInfo,
} from '@/api/core'
import { decode, encode } from 'js-base64'
import { CommitActivity } from '@/api/broad'
import WalletConnect from '@walletconnect/client'
import AuthClient, { generateNonce } from '@walletconnect/auth-client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import keccak256 from 'keccak256'
import { RegisterSource } from '@/enum'

const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const emit = defineEmits(['metamask'])
const MetaMaskRef = ref()
const loading = ref(false)
const isShowMetaMak = ref(false)
const isShowLoginAndRegister = ref(false)
const type: Ref<'login' | 'register'> = ref('login')
const isShowSendBuzz = ref(false)
const buzz = ref('')
const isSendBuzzLoading = ref(false)
const isShowSendBuzzSuccess = ref(false)
const buzzResult = reactive({
  time: '',
  txId: '',
})
const setBaseInfoRef = ref()

const enum ConnectWalletStatus {
  Watting,
  WallteConnect,
  UseMetaId,
}

const status: Ref<ConnectWalletStatus> = ref(ConnectWalletStatus.Watting)

const BindMetaIdRef = ref()
const thirdPartyWallet = reactive({
  signAddressHash: '',
  address: '',
})
const isShowBindModal = ref(false)
const metaIdWalletRegisterBaseInfo: { val: undefined | MetaIdWalletRegisterBaseInfo } = reactive({
  val: undefined,
})

const wallets = [
  {
    title: () => {
      return i18n.t('Login.connectWallet')
    },
    list: [
      {
        name: () => {
          return 'MetaMask'
        },
        icon: IconMetaMask,
        fun: () => {
          rootStore.$patch({ isShowLogin: false })
          isShowMetaMak.value = true
        },
      },
      {
        name: () => {
          return 'WallteConnect'
        },
        icon: IconWallteConnect,
        fun: connectWalletConnect,
      },
    ],
  },
  {
    title: () => {
      return i18n.t('Login.useMetaIdWallet')
    },
    list: [
      {
        name: () => {
          return i18n.t('Login.createWallet')
        },
        desc: () => {
          return i18n.t('Login.notAnyWallet')
        },
        icon: IconAdd,
        fun: () => {
          type.value = 'register'
          // rootStore.$patch({ isShowLogin: false })
          // isShowMetaMak.value = true
          status.value = ConnectWalletStatus.UseMetaId
        },
      },
      {
        name: () => {
          return i18n.t('Login.connectWallet')
        },
        desc: () => {
          return i18n.t('Login.havedAnyWallet')
        },
        icon: IconLine,
        fun: () => {
          type.value = 'login'
          // rootStore.$patch({ isShowLogin: false })
          // isShowLoginAndRegister.value = true
          status.value = ConnectWalletStatus.UseMetaId
        },
      },
    ],
  },
]

// setbaseinfo
const isShowSetBaseInfo = ref(false)

const isShowRecommentFollow = ref(false)

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

async function connectMetaLet() {
  return ElMessage.info(i18n.t('Comming Soon'))
  if (typeof (window as any).Metalet === 'undefined') {
    return ElMessage.error(i18n.t('Not install MetaLet Wallet'))
  }
  // const result = await (window as any).metalet.getAccount()
  // console.log(result)
  // const metaId = result.userMetaIdInfo.metaId
  // const res = await GetUserAllInfo(metaId)
  // const hDPrivateKey = new mvc.HDPrivateKey(result.xprv)
  // const phone = eciesDecryptData(
  //   res.data.phone,
  //   hDPrivateKey.deriveChild(0).deriveChild(4).privateKey
  // )
}

async function onThreePartLinkSuccess(params: { signAddressHash: string; address: string }) {
  //检查hash是否已绑定

  const getMnemonicRes = await LoginByHashData({
    hashData: params.signAddressHash,
  }).catch(error => {
    if (error.code === -1) {
      // 还没绑定
      thirdPartyWallet.signAddressHash = params.signAddressHash
      thirdPartyWallet.address = params.address
      BindMetaIdRef.value.status = BindStatus.ChooseType
      isShowMetaMak.value = false
      isShowBindModal.value = true
    } else {
      throw new Error(error.message)
    }
  })
  let res
  debugger
  if (
    getMnemonicRes?.data?.metaId &&
    getMnemonicRes?.data?.registerSource === RegisterSource.metamask
  ) {
    //这里需要再判断一下用户注册来源，如果是metamask注册的用户要拿metaid来解

    try {
      const signHashForMnemonic = await MetaMaskRef.value.ethPersonalSignSign({
        address: params.address,
        message: getMnemonicRes?.data?.metaId.slice(0, 6),
      })

      res = await BindMetaIdRef.value.loginByMnemonic(
        getMnemonicRes.data.menmonic,
        signHashForMnemonic
      )
      if (res) {
        await BindMetaIdRef.value.loginSuccess(res)
      }
    } catch (error) {
      isShowMetaMak.value = false
      return ElMessage.error(`${i18n.t('walletError')}`)
    }

    // return  emit('update:modelValue', false)
  } else if (
    getMnemonicRes?.code === 0 &&
    getMnemonicRes.data.menmonic &&
    getMnemonicRes?.data?.registerSource === RegisterSource.showmoney
  ) {
    // 有密码直接登录， 没有密码就要用户输入
    const password = localStorage.getItem(encode('password'))
    if (password) {
      res = await BindMetaIdRef.value.loginByMnemonic(
        getMnemonicRes.data.menmonic,
        decode(password)
      )
      if (res) {
        await BindMetaIdRef.value.loginSuccess(res)
      }
    } else {
      thirdPartyWallet.signAddressHash = params.signAddressHash
      thirdPartyWallet.address = params.address
      BindMetaIdRef.value.status = BindStatus.InputPassword
      isShowMetaMak.value = false
      isShowBindModal.value = true
    }
  }
}

function OnMetaIdRegister(params: MetaIdWalletRegisterBaseInfo) {
  metaIdWalletRegisterBaseInfo.val = params
  rootStore.$patch({ isShowLogin: false })
  isShowSetBaseInfo.value = true
}

async function onSetBaseInfoSuccess(params: {
  name: string
  nft?: {
    image: string
    description: string
    attributes: string
    token_address: string
    token_id: string
  }
}) {
  loading.value = true
  try {
    const wallet = userStore.showWallet!.wallet
    console.log('wallet', wallet)
    if (userStore.isAuthorized) {
      let utxos = await wallet?.provider.getUtxos(wallet.wallet.xpubkey.toString())
      const broadcasts: string[] = []
      const infoAddress = wallet
        ?.getPathPrivateKey(wallet.keyPathMap.Info.keyPath)
        .publicKey.toAddress(wallet.network)
        .toString()
      // 把钱打到 info, protocol 节点
      const payTo = [
        {
          amount: 1000,
          address: infoAddress,
        },
      ]
      if (params.nft) {
        payTo.push({
          amount: 2000,
          address: wallet!.protocolAddress,
        })
      }
      const transfer = await wallet?.makeTx({
        utxos: utxos,
        opReturn: [],
        change: wallet.rootAddress,
        payTo,
      })
      broadcasts.push(transfer.toString())
      let utxo = await wallet?.utxoFromTx({
        tx: transfer,
        addressInfo: {
          addressType: parseInt(wallet.keyPathMap.Info.keyPath.split('/')[0]),
          addressIndex: parseInt(wallet.keyPathMap.Info.keyPath.split('/')[1]),
        },
        outPutIndex: 0,
      })
      if (utxo) {
        utxos = [utxo]
        const createNameNode = await userStore.showWallet!.wallet!.createNode({
          nodeName: 'name',
          parentTxId: userStore.user!.infoTxId,
          data: params.name,
          utxos: utxos,
          change: params.nft ? infoAddress : wallet!.rootAddress,
        })
        broadcasts.push(createNameNode.hex)
      }

      if (params.nft) {
        // 创建 NFTAvatar brfc 节点
        utxo = await wallet?.utxoFromTx({
          tx: transfer,
          addressInfo: {
            addressType: parseInt(wallet.keyPathMap.Protocols.keyPath.split('/')[0]),
            addressIndex: parseInt(wallet.keyPathMap.Protocols.keyPath.split('/')[1]),
          },
          outPutIndex: 1,
        })
        if (utxo) utxos = [utxo]
        const createNFTAvatarBrfcNode = await wallet!.createNode({
          nodeName: NodeName.NFTAvatar,
          parentTxId: userStore.user!.infoTxId,
          parentAddress: wallet?.protocolAddress,
          keyPath: '0/0',
          data: AllNodeName[NodeName.NFTAvatar].brfcId,
          utxos: utxos,
          change: wallet!.createAddress('0/0').address,
        })
        broadcasts.push(createNFTAvatarBrfcNode.hex)

        // 创建 NFTAvatar 子节点
        utxo = await wallet?.utxoFromTx({
          tx: createNFTAvatarBrfcNode.raw,
          addressInfo: {
            addressType: 0,
            addressIndex: 0,
          },
        })
        if (utxo) utxos = [utxo]
        const createNFTAvatarBrfcChildNode = await wallet!.createNode({
          nodeName: [
            NodeName.NFTAvatar,
            wallet!
              .createAddress('0/0')
              .publicKey.toString()
              .slice(0, 11),
          ].join('-'),
          parentTxId: createNFTAvatarBrfcNode.txId,
          parentAddress: wallet!.createAddress('0/0').address,
          keyPath: '0/0',
          data: JSON.stringify({
            type: 'nft-eth',
            tx: params.nft.token_address,
            codehash: '',
            genesis: '',
            tokenIndex: params.nft.token_id,
            updateTime: new Date().getTime(),
            memo: params.nft.description,
            image: params.nft.image,
            chain: 'goerli',
          }),
          utxos: utxos,
        })
        broadcasts.push(createNFTAvatarBrfcChildNode.hex)
      }
      //  广播
      let errorMsg: any
      for (let i = 0; i < broadcasts.length; i++) {
        try {
          await wallet?.provider.broadcast(broadcasts[i])
        } catch (error) {
          errorMsg = error
          break
        }
      }
      if (errorMsg) throw new Error(errorMsg.message)
      // 更新本地用户信息
      userStore.updateUserInfo({
        ...userStore.user!,
        name: params.name,
      })
    } else {
      // 注册 metaId 钱包
      const baseInfo = metaIdWalletRegisterBaseInfo.val!
      const _params = {
        type: 1, // 注册时必须加上图片验证码验证， 1 是给App用的的，App没有图片验证码
        ...baseInfo,
        name: params.name,
      }
      const loginName = baseInfo!.userType === 'phone' ? baseInfo!.phone : baseInfo!.email
      const registerRes = await RegisterCheck(_params)
      // console.log(registerRes)
      if (registerRes.code === 0) {
        let userInfo = registerRes.result as BaseUserInfoTypes
        const walletInfo = await hdWalletFromAccount(
          {
            ...userInfo,
            userType: baseInfo.userType,
            phone: baseInfo!.phone,
            email: baseInfo!.email,
            pk2: userInfo.pk2,
            name: params.name,
            password: baseInfo!.password,
          },
          import.meta.env.VITE_NET_WORK
        )

        const userInfoParams = {
          userType: baseInfo.userType,
          phone: baseInfo!.phone,
          email: baseInfo!.email,
          remark: loginName,
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
        const ePassword = encryptPassword(baseInfo!.password)
        const eMnemonic = encryptMnemonic(walletInfo.mnemonic, baseInfo!.password)
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
          userType: baseInfo.userType,
          phone: baseInfo!.phone,
          email: baseInfo.email,
          password: baseInfo!.password,
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
          phone: baseInfo!.phone,
          email: baseInfo.email,
          userType: baseInfo.userType,
          enCryptedMnemonic: eMnemonic,
          // @ts-ignore
          rootAddress: walletInfo.rootAddress,
          address: walletInfo.rootAddress,
        }
        await SetUserInfo({
          userType: baseInfo.userType,
          metaid: metaIdInfo.metaId,
          // @ts-ignore
          accessKey: userInfo.token,
          phone: userInfo.phone,
          email: userInfo.email,
        })
        // @ts-ignore
        await userStore.updateUserInfo({
          ...userInfo,
          password: baseInfo!.password,
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
      }
    }
    setBaseInfoRef.value.FormRef.resetFields()
    loading.value = false
    isShowSetBaseInfo.value = false
    isShowRecommentFollow.value = true
  } catch (error) {
    loading.value = false
    ElMessage.error((error as any).message)
  }
}

async function connectWalletConnect() {
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org', // Required
    qrcodeModal: QRCodeModal,
    clientMeta: {
      description: 'My website description ',
      url: 'https://mywebsite.url',
      icons: ['../assets/svg/icon.svg'],
      name: 'My website name',
    },
  })

  connector.on('session_update', (error, payload) => {
    if (error) {
      throw error
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0]
  })

  connector.on('disconnect', (error, payload) => {
    if (error) {
      throw error
    }

    // Delete connector
  })

  const { accounts, chainId } = await connector.connect()
  if (chainId !== 5) {
    throw new Error(i18n.t('Login.ETH.changeGoerliNetword'))
  }
  const res = await connector.signPersonalMessage([
    accounts[0],
    keccak256(accounts[0]).toString('hex'),
  ])
  if (res) {
    rootStore.$patch({ isShowLogin: false })
    await onThreePartLinkSuccess({
      signAddressHash: res,
      address: accounts[0],
    })
  }
  connector.killSession()
}

// onMounted(async () => {
//   const authClient = await AuthClient.init({
//     projectId: '39eec2aad9a4402a5c02f37b1f942f24',
//     iss: `did:pkh:eip155:1`,
//     metadata: {
//       name: 'ShowApp3',
//       description: 'A dapp using WalletConnect AuthClient',
//       url: 'www.baidu.com',
//       icons: ['https://my-auth-dapp.com/icons/logo.png'],
//     },
//   })
//   console.log(authClient)
//   authClient.on('auth_response', res => {
//     console.log(res)
//     if (Boolean(params.result?.s)) {
//       // Response contained a valid signature -> user is authenticated.
//     } else {
//       // Handle error or invalid signature case
//       console.error(params.message)
//     }
//   })
//   const { uri } = await authClient.request({
//     aud: 'https://www.baidu.com/',
//     domain: 'www.baidu.com',
//     chainId: 'eip155:1',
//     nonce: generateNonce(),
//   })
//   debugger
//   if (uri) {
//     await authClient.core.pairing.pair({ uri })
//     QRCodeModal.open(uri, res => {
//       console.log('EVENT', 'QR Code Modal closed')
//     })
//   }
// })
</script>

<style lang="scss" scoped src="./ConnectWalletModal.scss"></style>
