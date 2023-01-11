<template>
  <div @click="registerMetaName">MetaName点我</div>
  <!-- <div @click="metaname(21)">续费</div>
  <div @click="metaname(22)">更新</div>
  <div @click="queryMetaName('Eason')">查询</div> -->
  <div @click="getImgFileTx">获取图片对象</div>
  <img
    :src="
      $filters.metafile(
        `metafile://837d30b2769c35af101dc014f3d12a57b609aac62243bca002c025900b3110e4.png`
      )
    "
    alt=""
  />
  <div>{{ $filters.dateTimeFormat(1673221960000, 'UTC') }}</div>

  <div class="main flex">
    <LeftNavigationVue v-if="!blackRoute.includes(route.name)" />
    <div class="flex1 main-right">
      <RouterView v-slot="{ Component, route }">
        <KeepAlive>
          <component
            :is="Component"
            :key="route.fullPath"
            v-if="route.meta && route.meta.keepAlive"
          />
        </KeepAlive>
        <component
          :is="Component"
          :key="routeKey(route)"
          v-if="!route.meta || (route.meta && !route.meta.keepAlive)"
        />
      </RouterView>
    </div>
  </div>

  <DragonBall />
  <ConnectWalletModalVue />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, onUpdated, Ref } from 'vue'
import ConnectWalletModalVue from './components/ConnectWalletModal/ConnectWalletModal.vue'
import LeftNavigationVue from './components/LeftNavigation/LeftNavigation.vue'
import DragonBall from './views/talk/components/DragonBall.vue'
import { useRootStore, isAndroid, isApp, isIOS, isIosApp } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import { GetMetaNameIsRegister } from '@/api/aggregation'
import { dayjs, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { MetaNameFeePerYear } from '@/enum'
import { getBlockHeight } from '@/api/index'
import Decimal from 'decimal.js-light'
import { dateTimeFormat } from '@/utils/filters'
import {
  setInitImg,
  FileToAttachmentItem,
  urlToBlob,
  bytesLength,
  setPayQuitUrl,
  CheckMetaMaskAccount,
} from '@/utils/util'
import { NodeName, MetaNameRegisterStatus } from '@/enum'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import { CreatOrder, UpdatePay } from '@/api/wxcore'
import { PayPlatform, PayType, ProductType, MetaNameOperateType, OrderPayType } from '@/enum'
import { BigNumber } from 'ethers'
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const route = useRoute()
const blackRoute = reactive(['home'])
const base64Img = ref('')
const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)
const fileImg = reactive({
  val: null,
})
const active = ref(0)

const finishStatus: Ref<MetaNameRegisterStatus> = ref(MetaNameRegisterStatus.Finish)

const routeKey = (route: any) => {
  if (route.params.communityId) return route.params.communityId

  return route.fullPath
}

async function sendMetafileTx(res: any) {
  const node = {
    nodeName: NodeName.MetaFile,
    dataType: 'application/json',
    attachments: [res],
  }
  const newNode = await userStore.showWallet.createBrfcChildNode(node, {
    checkOnly: true,
  })
  return newNode
}

//上链NFT图片
async function getImgFileTx() {
  try {
    const res: { base64Res: string | ArrayBuffer; file: File } = await setInitImg(
      `https://img0.baidu.com/it/u=4236174082,2003855853&fm=253&fmt=auto&app=120&f=JPEG?w=720&h=432`,
      FileToAttachmentItem
    )
    base64Img.value = res.base64Res
    fileImg.val = res.file
    const metafileTx = await sendMetafileTx(res.file)
    if (metafileTx) {
      return metafileTx!.metaFiles[0].txId //生成NFT图片用于注册
    } else {
      return ElMessage.error(`${i18n.t('metanameNftImgError')}`)
    }
  } catch (error) {
    return ElMessage.error(`${(error as any).toString()}`)
  }
}

//获取UTC到期时间
async function GetExpiredUTC(name: string = 'Eason.l') {
  //获取当前块高信息：medianTime，blocks
  const blockHeight = await getBlockHeight()
  const { data } = await GetMetaNameIsRegister(name)
  const distanceDay = new Decimal(data.expiredBlockHeight)
    .sub(blockHeight.blocks)
    .div(144)
    .toNumber()
  const date: any = dateTimeFormat(blockHeight.medianTime * 1000)
  const res = dayjs(date).add(distanceDay, 'day')
  const result = dateTimeFormat(res.valueOf(), 'UTC')
  return result
}

//查询metaName注册详情
async function queryMetaName(name: string) {
  try {
    const res = await GetMetaNameIsRegister(name)
    if (res.code == 0) {
      return res.data
    }
  } catch (error) {
    return ElMessage.error(`${(error as any).toString()}`)
  }
}

function checkInputName(name: string) {
  const testResult = bytesLength(name.trim())
  switch (true) {
    case testResult >= 5 && testResult <= 63:
      return MetaNameFeePerYear.five
    case testResult == 4:
      return MetaNameFeePerYear.four
    case testResult == 3:
      return MetaNameFeePerYear.third
    case testResult > 0 && testResult <= 2:
      ElMessage.error(`${i18n.t('metanameNotAllowMin')}`)
      return false
    case testResult > 63:
      ElMessage.error(`${i18n.t('metanameNotAllowOverLenght')}`)
      return false
    default:
      return false
  }
}

async function registerMetaName(params: {
  //注册时mvc跟metaid,更新信息时不需要传入years,注册时必须要传入icon
  registerName: string
  op: MetaNameReqCode
  //注册和更新操作info必填,续费info字段不需要
  info?: {
    [k: string]: any
    metaid?: string
    mvc?: string
    icon?: string //格式:metafile://tx
  }
  years?: number
}) {
  // const params = {
  //   registerName: 'Stars',
  //   op: MetaNameReqCode.register,
  //   info: {
  //     icon: `metafile://adb7015c50d9d32e803b85cc9d67c0f5b7a663a848e8c3d2ef18dffb7a745941.png`,
  //     metaid: userStore.user!.metaId,
  //     mvc: userStore.user!.address,
  //   },
  //   years: 1,
  // }
  try {
    const res = await metanameOperation(params)
    if (JSON.parse(res!.registerMetaNameResp!)) {
      let from = !isApp ? 'web' : isAndroid ? 'android' : isIOS ? 'ios' : ''
      from += `:${import.meta.env.VITE_AppName}`
      // 支付回调地址
      await CheckMetaMaskAccount(userStore.user!.evmAddress!)
      const quitUrl = setPayQuitUrl({
        payPlatform: currentPayPlatform.value,
        fullPath: route.fullPath,
        isBlindbox: false,
      })
      const type = isIosApp
        ? PayType.H5
        : isApp
        ? PayType.App
        : isAndroid && isIOS
        ? PayType.H5
        : PayType.H5
      const orderRes = await CreatOrder({
        address: userStore.user!.address!,
        count: 0,
        meta_name_len: bytesLength(params.registerName.trim()),
        data: res?.registerMetaNameResp?.toString(),
        from,
        goods_name: params.registerName,
        metaid: userStore.user!.metaId,
        pay_type: currentPayPlatform.value,
        quit_url: quitUrl,
        types: type,
        operate_type: MetaNameOperateType.Register,
        from_coin_address: userStore.user?.evmAddress,
        product_type: ProductType.MetaName,
        mvc_to_address: res?.MvcToAddress,
        nft_to_address: res?.NftToAddress,
        tx_fee: res?.TxFee,
        fee_per_year: res?.FeePerYear,
      })
      console.log('orderRes', orderRes)
      debugger
      if (orderRes.code == 0) {
        const { pay_amount, pay_decimal_num, url, outside_order_id, pay_currency } = orderRes.data
        debugger
        await sendEth({
          amount: pay_amount!,
          ethRecevierAddress: url,
          orderId: outside_order_id,
          product_type: ProductType.MetaName,
        })
      }

      // if (orderRes) {
      //
      // }
    }
  } catch (error) {
    ElMessage.error(`${(error as any).toString()}`)
  }
}

async function renewMetaName() {
  const params = {
    registerName: '',
    op: MetaNameReqCode.renew,
    years: 1,
  }
  const res = await metanameOperation(params)
}

async function updateInfoMetaName() {
  const params = {
    registerName: '',
    op: MetaNameReqCode.updataInfo,
    info: {
      metaid: userStore.user!.metaId,
      mvc: userStore.user!.address,
    },
  }
  const res = await metanameOperation(params)
}

async function metanameOperation(params: {
  registerName: string
  op: number
  info?: any
  years?: number
}) {
  if (params.op == MetaNameReqCode.register) {
    const check = checkInputName(params.registerName)
    if (!check) {
      return
    }
  }
  try {
    const res = await userStore.showWallet.MetaNameBeforeReq({
      name: `${params.registerName}`,
      op: params.op,
    })

    if (res.code == 0) {
      const { data } = res
      const metaNameParams = {
        op_code: data.op,
        info: params.info,
        years: params.years!,
        reqswapargs: data,
      }
      const result = await userStore.showWallet.sendMetaNameTransation(metaNameParams)
      return result
    } else {
      throw new Error(`${res?.msg}`)
    }
  } catch (error) {
    throw new Error(`${(error as any).toString()}`)
  }
}

async function sendEth(params: {
  amount: string
  ethRecevierAddress: string
  orderId: string
  product_type: number
}) {
  debugger
  const tx = await window.ethereum!.request!({
    method: 'eth_sendTransaction',
    params: [
      {
        value: BigNumber.from(
          new Decimal(params.amount).mul(Math.pow(10, 9)).toString()
        ).toHexString(),
        to: params.ethRecevierAddress,
        from: userStore.user?.evmAddress,
      },
    ],
  })
  //有TX就代表用户打款成功
  if (tx) {
    const res = await UpdatePay({
      order_id: params.orderId,
      tx_hash: tx,
      from_coin_address: userStore.user!.evmAddress!,
      product_type: params.product_type,
    })
    if (res.code === 0) {
      //注册成功
      debugger
    }
  } else {
    debugger
  }
}
</script>
<style lang="css" src="@/assets/styles/tailwind.css"></style>
<style lang="scss" scoped>
.main {
}

@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney'), url('@/assets/fonts/whitneybook.otf') format('opentype');
  font-weight: 400;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Medium'), url('@/assets/fonts/whitneymedium.otf') format('opentype');
  font-weight: 500;
}
@font-face {
  font-family: Whitney;
  font-style: normal;
  src: local('Whitney Bold'), url('@/assets/fonts/whitneybold.otf') format('opentype');
  font-weight: 700;
}

// *::-webkit-scrollbar {
//   width: 8px;
// }

// *::-webkit-scrollbar-track {
//   background: #edeff2;
// }

// .dark *::-webkit-scrollbar-track {
//   background: #111827;
// }

// *::-webkit-scrollbar-thumb {
//   background-color: #bfc2cc;
//   border-radius: 20px;
// }

// .dark *::-webkit-scrollbar-thumb {
//   background-color: #374151;
// }
</style>
