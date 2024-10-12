import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElMessageBoxOptions,
  LoadingParentElement,
} from 'element-plus'
import { router } from '@/router'
import Decimal from 'decimal.js-light'
import axios from 'axios'
import { isAndroidApp, isApp, isIOS, useRootStore, isAndroid, isIosApp } from '@/stores/root'
import { GetBankCards, GetWalletBalance, Inactivation } from '@/api/pay'
import {
  BlindboxUUIDStatus,
  CloudWalletStatus,
  IsEncrypt,
  PayPlatform,
  PayStatus,
  ToCurrency,
  PayType,
  NodeName,
  MetaNameOperateType,
  ProductType,
  Chains,
  EnvMode,
  PayPlatformUnit,
  SdkPayType,
  NFTSellState,
} from '@/enum'
import { CheckBlindboxOrderStatus } from '@/api/v3'
import AllCardJson from '@/utils/card.json'
import { CheckMetaNameValid, GetOrderStatus, IsWtiteUser, MetaNameBeforeReqRes } from '@/api/wxcore'
import { classifyName } from '@/config'
import { v1 as uuidv1 } from 'uuid'
import { decode, encode } from 'js-base64'
// @ts-ignore
import CryptoJs from 'crypto-js'
// @ts-ignore
import encHex from 'crypto-js/enc-hex'
import { QueryFindMetaDataForPost } from '@/api/showman'
import { GetFeeInfo } from '@/api/broad'
import { GetMyLegalAmount, LegalOffsale } from '@/api/legal'
import { AttachmentItem } from '@/@types/hd-wallet'
import { useUserStore } from '@/stores/user'
import {
  createMnemonic,
  encryptMnemonic,
  hdWalletFromMnemonic,
  MetaNameReqCode,
} from './wallet/hd-wallet'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import i18n from './i18n'
import { Ref } from 'vue'
import ShowSVG from '@/assets/svg/show.svg?component'
import { CreatOrder } from '@/api/wxcore'
import { LoadingTEXT } from './LoadingSVGText'
import DropLogin from '../../public/show3.svg?url'
import { Mitt, MittEvent } from './mitt'
import { ethers } from 'ethers'
import { getBlockHeight } from '@/api'
import { dateTimeFormat } from './filters'
import dayjs from 'dayjs'
import { SendMetaNameTransationResult } from '@/@types/sdk'
import { GetTxChainInfo } from '@/api/metaid-base'
import { useMetaNameStore } from '@/stores/metaname'
import { GetBalance, GetMetaIdByAddress, GetMetaNameInfo, GetUserAllInfo } from '@/api/aggregation'
//@ts-ignore
import namehash from 'eth-ens-namehash'
import Compressor from 'compressorjs'
//@ts-ignore
import { toUnicode } from 'idna-uts46-hx'
import { email } from './reg'
import zlib from 'zlib'
import { string } from 'yup'
import { MetaletWallet } from './wallet/Metalet-wallet'
import mvc from 'mvc-lib'
import {PlatformRate,MinPlatformFee,MinRoyaltyFee} from "@/data/constants"
import { useConnectionStore } from '@/stores/connection'
const emojiReg = /[\u{1F601}-\u{1F64F}\u{2702}-\u{27B0}\u{1F680}-\u{1F6C0}\u{1F170}-\u{1F251}\u{1F600}-\u{1F636}\u{1F681}-\u{1F6C5}\u{1F30D}-\u{1F567}]/gu
const oricalUrl = [
  'https://api.mvcswap.com/blockinfo1',
  'https://api.mvcswap.com/blockinfo2',
  'https://www.metaidservices.com/oracle/',
  'https://www.metaidservices.com/block-oracle/',
  'https://witnessonchain.com/v1/chain-info/mvc',
]
export function randomString() {
  return Math.random()
    .toString()
    .replace('.', '')
}

export const raise = (err: string): never => {
  throw new Error(err)
}

export function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000)
}

export const showLoading = async (fetch: Function, loading: Ref<boolean>) => {
  loading.value = true
  // 最少1秒，防止闪烁
  const currentTimestamp = new Date().getTime()
  await fetch()

  // 保证至少1秒
  const delay = Math.max(1000 - (new Date().getTime() - currentTimestamp), 0)
  if (delay) await sleep(delay)
  loading.value = false
}

export function realRandomString(length: number): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function checkSdkStatus(path: string, params?: ElMessageBoxOptions) {
  return new Promise<void>((resolve, reject) => {
    const userStore = useUserStore()
    if (!userStore.isAuthorized) {
      openLoginConfirm(path, params)
    } else {
      resolve()
    }
  })
}

export function checkUserLogin() {
  return new Promise<void>((resolve, reject) => {
    // const userStore = useUserStore()
    const rootStore = useRootStore()
    const connectionStore=useConnectionStore()
    if (!connectionStore.last.user.address) {
      rootStore.$patch({ isShowLogin: true })
      reject(new Error(i18n.global.t('Please Login First')))
      
      // reject(new Error(i18n.global.t('Please Login First')))
    } else {
      resolve()
    }
  })
}

export function openLoginConfirm(path: string, params?: ElMessageBoxOptions) {
  return new Promise<void>((resolve, reject) => {
    const userStore = useUserStore()
    if (userStore.isAuthorized) {
      resolve()
    } else {
      ElMessageBox.confirm('请先登录再操作', '温馨提示', {
        confirmButtonText: '注册/登录',
        cancelButtonText: '取消',
        type: 'warning',
        ...params,
      })
        .then(result => {
          if (result === 'confirm') {
            userStore.showWallet?.toLogin(path)
          }
        })
        .catch(() => {
          // 取消
        })
    }
  })
}

export function getMetaFileUrl(metafile: string) {
  if (typeof metafile !== 'string') return ''
  metafile = metafile.replace('metafile://', '')
  if (metafile === '') return ''
  return `${import.meta.env.VITE_AppImgApi}/content/${metafile}`
  //return `${import.meta.env.VITE_AppImgApi}/metafile/${metafile}`
}

export function setDataStrclassify(data: any) {
  const classify =
    data && data.classifyList instanceof Array
      ? data.classifyList
      : data && typeof data.classifyList === 'string' && data.classifyList !== ''
      ? JSON.parse(data.classifyList)
      : []
  return classify
}

export function sleep(timer = 2000) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}

export function getMetaCenterConfig(metaId: string | string[]) {
  return new Promise(async resolve => {
    const res = await QueryFindMetaDataForPost({
      find: {
        parentNodeName: 'MetaCenterConfig',
        rootTxId: `${metaId}`,
        isNew: true,
      },
      skip: 0,
      limit: 1,
      sort: { timestamp: -1 },
    })
    if (res.code === 200 && res.result.data[0]) {
      resolve(res.result.data[0])
    } else {
      resolve(null)
    }
  })
}

// 获取用户购买 需额外付费的金额
// 默认费率
const platform = 0.025
const royalty = 0.035
const firstPlatform = 0.06
const firstRoyalty = 0
export function getUserBuyExtraFee(params: {
  codehash: string
  genesis: string
  isFirstSell: boolean
  amount: number
  ignoreIndex?: number
  isNotCache?: boolean
}) {
  return new Promise<{
    platformFee: number
    royaltyFee: number
    total: number
    platformPercentage: number
    royaltyPercentage: number
    coin_service: number
  }>(async (resolve, reject) => {
    try {
      const userStore = useUserStore()
      let coin_service = 0
      let platformPercentage = params.isFirstSell ? firstPlatform : platform
      let royaltyPercentage = params.isFirstSell ? firstRoyalty : royalty
      if (params.codehash && params.genesis) {
        let feeInfo: GerFeeInfoResData | null = null
        const key = `${params.genesis}/${params.codehash}`
        if (!params.isNotCache) {
          const feeInfoString = window.sessionStorage.getItem(key)
          if (feeInfoString) feeInfo = JSON.parse(feeInfoString)
        }
        if (!feeInfo) {
          const res = await GetFeeInfo({
            codehash: params.codehash,
            genesis: params.genesis,
            address: userStore.user?.address,
            ignoreIndex: params.ignoreIndex,
          })
          if (res.code === 0 && res.data) {
            feeInfo = res.data
            if (!params.isNotCache) window.sessionStorage.setItem(key, JSON.stringify(res.data))
          }
        }
        if (feeInfo) {
          platformPercentage = params.isFirstSell
            ? feeInfo.first_platform / 100
            : feeInfo.other_platform / 100
          royaltyPercentage = params.isFirstSell
            ? feeInfo.first_royalty / 100
            : feeInfo.other_royalty / 100
          coin_service = feeInfo.coin_service / 100
        }
      }
      let platformFee = Math.ceil(new Decimal(params.amount).mul(platformPercentage).toNumber())
      let royaltyFee = Math.ceil(new Decimal(params.amount).mul(royaltyPercentage).toNumber())
      const minAmount = parseInt(import.meta.env.VITE_MinAmount)
      if (platformFee < minAmount && platformFee !== 0) platformFee = minAmount
      if (royaltyFee < minAmount && royaltyFee !== 0) royaltyFee = minAmount

      resolve({
        platformFee,
        royaltyFee,
        total:
          platformFee + royaltyFee >= minAmount || platformFee + royaltyFee === 0
            ? platformFee + royaltyFee
            : minAmount,
        platformPercentage,
        royaltyPercentage,
        coin_service,
      })
    } catch (error) {
      reject(error)
    }
  })
}

// 是否冬奥系列
export function isWinterOlympicSeries(genesis: string, codehash: string) {
  const series = [
    {
      genesis: '75a54625033c5b109df1667bfe53ea3a3cebc0c1',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: '071022161e00db31c6e8cf4dfc32b10acbee2039',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: '9c39bec1ed94867404cf7a9ccdb68f11acc8ce6c',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: 'bae198a3807febaaa34ba934a084051527c6b221',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: 'ccf0b9852afc82f976d39c9e2ec02a7b501dd245',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: '3c13169443de24533a3d81e5627ab60fe818f380',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: '0e22864ed5e96c7ff96dd6628889e0f5d2a0daf2',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: '0687f8eaaad0680ca6441579709094682d4a5dab',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: 'd32ce142d1dc4cb4581f9ec4b0839dd80c5725c2',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: 'c04f2af56088347cab32b73318647cd09c4136b6',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: '376e6a397a7aae84bc04f7492c74ba6d1c5c6b3d',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
    {
      genesis: '10ec817567a29ac0543666d4876433d7f087700c',
      codehash: '22519e29424dc4b94b9273b6500ebadad7b9ad02',
    },
  ]
  const index = series.findIndex(item => item.codehash === codehash && item.genesis === genesis)
  return index !== -1
}

export function calcCnyPrice(params: {
  amount: number
  genesis: string
  codehash: string
  isFirstSell?: boolean
  isLegal?: boolean
}) {
  return new Promise<number>(async resolve => {
    const rootStore = useRootStore()
    //  法币价格
    let cnyAmount = 0
    if (params.isLegal) {
      cnyAmount = new Decimal(params.amount).div(100).toNumber()
    } else {
      // bsv
      const res = await getUserBuyExtraFee({
        codehash: params.codehash,
        genesis: params.genesis,
        isFirstSell: !!params.isFirstSell,
        amount: params.amount,
      })
      if (res) {
        // cny 平台手续费
        let cnyPlatformFee = new Decimal(res.platformFee)
          .div(Math.pow(10, 8))
          .mul(rootStore.exchangeRate.cnyRate)
          .toNumber()
        if (cnyPlatformFee < 0.01) cnyPlatformFee = 0.01
        // cny 版税
        let cnyRoyaltyFee = new Decimal(res.royaltyFee)
          .div(Math.pow(10, 8))
          .mul(rootStore.exchangeRate.cnyRate)
          .toNumber()
        if (cnyRoyaltyFee < 0.01) cnyRoyaltyFee = 0.01
        cnyPlatformFee = new Decimal(new Decimal(cnyPlatformFee).toFixed(2)).toNumber()
        cnyRoyaltyFee = new Decimal(new Decimal(cnyRoyaltyFee).toFixed(2)).toNumber()

        // cny nft pirce
        let cnyNFTPrice = new Decimal(params.amount)
          .div(Math.pow(10, 8))
          .mul(rootStore.exchangeRate.cnyRate)
          .toNumber()
        if (cnyNFTPrice < 0.01) cnyNFTPrice = 0.01
        cnyNFTPrice = new Decimal(new Decimal(cnyNFTPrice).toFixed(2)).toNumber()

        // 跨币种 服务费
        let cnyConversionServiceFee = new Decimal(params.amount)
          .div(Math.pow(10, 8))
          .mul(res.coin_service)
          .mul(rootStore.exchangeRate.cnyRate)
          .toNumber()
        if (cnyConversionServiceFee < 0.01) cnyConversionServiceFee = 0.01
        cnyConversionServiceFee = new Decimal(
          new Decimal(cnyConversionServiceFee).toFixed(2)
        ).toNumber()

        // 总价 = cny nft  + cny 平台手续费 + cny 版税费 + 跨币种服务费
        cnyAmount = new Decimal(cnyNFTPrice)
          .plus(cnyPlatformFee)
          .plus(cnyRoyaltyFee)
          .plus(cnyConversionServiceFee)
          .toNumber()
      }
    }

    resolve(cnyAmount)
  })
}

export function setDocumentTitle(title: string) {
  document.title = `${title} - ${import.meta.env.VITE_AppName}`
}

export function openAppForH5(url: string) {
  const iframe = document.createElement('iframe')
  iframe.id = 'h5-app-iframe'
  iframe.style.display = 'none'
  iframe.name = 'openAppForH5'
  iframe.src = url
  window.document.body.append(iframe)
  setTimeout(() => {
    window.postMessage({ url }, '*')
  }, 2000)
}

export function camelToKebab(str: string): string {
  return str
    .replace(/\B([A-Z])(?=[a-z])/g, '-$1')
    .replace(/\B([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

export function alertCatchError(error: any) {
  return new Promise<void>(resolve => {
    if (error) {
      if (typeof error === 'string') {
        ElMessage.error(error)
      } else if (error.message) {
        ElMessage.error({
          message: error.message,
          duration: 50000,
        })
      }
    }
    resolve()
  })
}

export function checkAppHasMethod(methodName: string) {
  return new Promise<void>((resolve, reject) => {
    // @ts-ignore
    if (window.appMetaIdJsV2[methodName]) {
      resolve()
    } else {
      reject(Error('当前App版本不支持此功能，请先升级到最新版本使用'))
    }
  })
}

export function trim(str: string) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function isTabarPage(routeName: any) {
  const tabbarPageNames = [
    'home',
    'homeCollcet',
    'homeBlindBox',
    'homeMarket',
    'homeActivity',
    'market',
    'marketClassify',
    'mine',
    'mineOffsale',
    'mineSale',
    'mineSaleNos',
    'mineSaleNFTonShow',
    'mineBlindbox',
    'mineRight',
    'mineLogin',
    'discovery',
    'discoveryCollect',
  ]
  return !!tabbarPageNames.find(item => item === routeName)
}

export function toUrl(url: string | undefined) {
  if (!url) return
  try {
    const Url = new URL(url!)
    let target
    if (isIOS) {
      target = '_selft'
    } else {
      target = '_blank'
    }
    window.open(url, target)
  } catch (error) {
    // 站内链接
    router.push(url)
  }
}

export async function downloadFile(url: string, name = 'file') {
  const userStore = useUserStore()
  if (isAndroidApp) {
    await checkAppHasMethod('saveShareImage')
    window.appMetaIdJsV2.saveShareImage(userStore.user?.token, url, name)
  } else {
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

export function openLoading(params?: {
  parent?: LoadingParentElement
  background?: string
  svg?: string
  svgViewBox?: string
  spinner?: string
  text?: string
  fullscreen?: boolean
  lock?: boolean
  customClass?: string
  visible?: boolean
  target?: HTMLElement
  beforeClose?: () => boolean
  closed?: () => void
}) {
  if (!params) params = {}
  if (!params.background) params.background = 'rgba(0,0,0,0.3)'
  return ElLoading.service({
    ...params,
    // svgViewBox: '0 0 156.99951171875 125.99756622314453',
    svg:`<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1728374894194" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1597" id="mx_n_1728374894195" width="16" height="16" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z" fill="#DE59FC" p-id="1598"></path></svg>`,
    //svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="26.508193969726562" height="32" viewBox="0 0 26.508193969726562 32"><defs><linearGradient x1="1" y1="0.015281280502676964" x2="0" y2="1" id="master_svg0_20_6353"><stop offset="2.857142873108387%" stop-color="#905ADC" stop-opacity="1"/><stop offset="100%" stop-color="#4C0D29" stop-opacity="1"/></linearGradient><linearGradient x1="0.005919137038290501" y1="1.002891182899475" x2="0.9842951893806458" y2="0.007127248216420412" id="master_svg1_20_6438"><stop offset="0%" stop-color="#F4BED6" stop-opacity="1"/><stop offset="100%" stop-color="#E61673" stop-opacity="1"/></linearGradient></defs><g><g><path d="M20.6096,31.999966257858276L0,31.999966257858276L5.89968,3.5286662578582764L26.5082,3.5286662578582764L20.6096,31.999966257858276Z" fill="url(#master_svg0_20_6353)" fill-opacity="1" style="mix-blend-mode:passthrough"/></g><g><path d="M20.4004,29.0329L0,32L1.84551,2.96815L22.2448,0L20.4004,29.0329Z" fill="url(#master_svg1_20_6438)" fill-opacity="1" style="mix-blend-mode:passthrough"/></g><g><path d="M6.177888642059326,18.73735047302246C6.240534642059326,17.84665047302246,6.295753642059326,17.039750473022462,6.353097642059327,16.23395047302246C6.459283642059326,14.745050473022461,6.565469642059326,13.25614047302246,6.673777642059326,11.76829047302246C6.792707642059327,10.135210473022461,6.911637642059326,8.50211047302246,7.044367642059326,6.870120473022461C7.051797642059326,6.777580473022461,7.172847642059326,6.6732304730224605,7.265227642059326,6.615135473022461C7.343807642059327,6.565652473022461,7.459547642059326,6.575318473022461,7.558307642059326,6.561345473022461C9.559897642059326,6.274112473022461,11.561497642059326,5.984699473022461,13.564167642059326,5.6996194730224605C15.222787642059327,5.462946473022461,16.723227642059328,6.821680473022461,16.626527642059326,8.51932047302246C16.508727642059327,10.588100473022461,16.336727642059326,12.652570473022461,16.194427642059324,14.720280473022461C16.109427642059327,15.94885047302246,16.057427642059324,17.18065047302246,15.952327642059327,18.40815047302246C15.772827642059326,20.50595047302246,14.881937642059325,22.26175047302246,13.388967642059326,23.71515047302246C12.092437642059327,24.977050473022462,10.530437642059326,25.66235047302246,8.767757642059326,25.916250473022462C7.8450076420593255,26.048550473022463,6.921187642059326,26.17335047302246,5.9995046420593265,26.31755047302246C5.688374542059326,26.365950473022462,5.5864404420593265,26.278750473022463,5.618301352059326,25.952850473022462C5.687324642059326,25.23205047302246,5.732977642059327,24.509150473022462,5.773328642059326,23.78615047302246C5.789258642059326,23.49465047302246,5.896507642059326,23.342950473022462,6.202322642059326,23.30525047302246C7.042257642059326,23.20095047302246,7.878997642059327,23.07185047302246,8.715737642059326,22.94915047302246C11.029537642059326,22.61035047302246,13.030067642059326,20.25965047302246,13.103327642059327,17.88745047302246C13.151107642059326,16.35335047302246,13.302957642059326,14.82250047302246,13.404897642059325,13.289470473022462C13.478157642059326,12.190000473022462,13.558857642059326,11.09160047302246,13.610887642059327,9.991050473022462C13.643807642059326,9.30254047302246,13.185077642059326,8.79368047302246,12.509737642059326,8.83239047302246C11.682547642059326,8.879720473022461,10.857487642059326,9.00238047302246,10.038797642059325,9.137930473022461C9.917747642059325,9.158370473022462,9.762717642059325,9.41981047302246,9.748917642059325,9.58118047302246C9.666087642059326,10.533280473022462,9.622557642059327,11.48967047302246,9.562027642059327,12.44500047302246C9.480257642059327,13.731670473022461,9.392127642059325,15.019410473022461,9.311427642059327,16.30605047302246C9.280627642059326,16.79775047302246,9.248787642059327,17.28935047302246,9.241347642059326,17.78105047302246C9.236027642059327,18.17155047302246,9.116037642059325,18.38775047302246,8.682807642059327,18.42435047302246C8.026567642059327,18.48025047302246,7.375657642059326,18.60395047302246,6.722617642059326,18.69435047302246C6.570770642059326,18.715850473022464,6.415743642059326,18.71915047302246,6.176826642059326,18.73845047302246L6.177888642059326,18.73735047302246Z" fill="#FFFFFF" fill-opacity="1" style="mix-blend-mode:passthrough"/></g></g></svg>`,
    lock: params?.lock || true,
    svgViewBox: '0 0 20 20',
    //spinner:'el-icon-loading',
    // @ts-ignore
    text: params?.text || i18n.global.t('Loading') + '...',
  })
}

export function urlToBlob(url: string): Promise<Blob> {
  return axios.get(url, { responseType: 'blob' }).then(res => {
    return res.data
  })
}

export function urlToBase64(url: string): Promise<string> {
  return urlToBlob(url).then(b => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e: any) => {
        resolve(e.target.result)
      }
      fileReader.onerror = err => {
        reject(err)
      }
      fileReader.readAsDataURL(b)
    })
  })
}

export function getRuoxiWalletBalance() {
  return new Promise<number>(async resolve => {
    const userStore = useUserStore()
    let amount = 0
    const res = await GetMyLegalAmount({
      currency: 'CNY',
      metaid: userStore.user!.metaId,
    }).catch(() => resolve(amount))
    if (res?.code === 0) {
      if (res.data.amount < 0) res.data.amount = 0
      amount = new Decimal(res.data.amount).div(100).toNumber()
    }
    resolve(amount)
  })
}

export function getCloudWalletBalance() {
  return new Promise<number>(async resolve => {
    const userStore = useUserStore()
    let amount = 0
    const res = await GetWalletBalance({
      bizUserNo: userStore.user!.address!,
      accountType: '01',
    }).catch(() => resolve(amount))
    if (res?.success) {
      amount = new Decimal(res.data.accountList[0].availableBal).toNumber()
    }
    resolve(amount)
  })
}

export function getWalletBalance() {
  return new Promise<{
    total: number
    ruoxi: number
    cloud: number
  }>(async resolve => {
    const result = {
      total: 0,
      ruoxi: 0,
      cloud: 0,
    }
    const res = await Promise.all([getRuoxiWalletBalance(), getCloudWalletBalance()])
    if (res) {
      if (res[0]) result.ruoxi = res[0]
      if (res[1]) result.cloud = res[1]
      if (res[1] || res[0]) result.total = new Decimal(res[0]).plus(res[1]).toNumber()
    }
    resolve(result)
  })
}

export async function toCreateWallet(status: CloudWalletStatus, fullPath: string) {
  const userStore = useUserStore()
  // 控制是否有权限使用餘额支付
  const result = await IsWtiteUser(userStore.user!.metaId!)
  if (!result) {
    return ElMessage.error('抱歉，您暂无权限使用此功能')
  }
  if (status === CloudWalletStatus.UnCreated) {
    router.push({
      name: 'walletActivation',
      query: {
        form: encodeURIComponent(fullPath),
      },
    })
  } else {
    const loading = openLoading()
    const res = await Inactivation({
      address: userStore.user!.address!,
      frontUrl: window.origin + '/wallet/check?form' + encodeURIComponent(fullPath),
    }).catch(error => {
      loading.close()
      alertCatchError(error)
    })
    if (res?.success) {
      window.open(res.data.url, '_self')
    }
  }
}

export function checkOrderStatus(params: {
  orderId: string
  payPlatform?: PayPlatform
  isBilinbox?: boolean
}) {
  return new Promise<{
    amount: number
    status: PayStatus
  }>(async (resolve, reject) => {
    if (params.isBilinbox) {
      const res = await CheckBlindboxOrderStatus({
        uuid: params.orderId,
      }).catch(() => {
        resolve({
          status: PayStatus.Fail,
          amount: 0,
        })
      })
      if (res?.code === 0) {
        if (res.data.status === BlindboxUUIDStatus.PaySuccess) {
          resolve({
            status: PayStatus.Success,
            amount: 0,
          })
        } else {
          resolve({
            status: PayStatus.Fail,
            amount: 0,
          })
        }
      }
    } else {
      const res = await GetOrderStatus({
        orderId: params.orderId,
        payType: params.payPlatform!,
      }).catch(error => reject(error))
      if (res?.code === 0) {
        const amount = res.data.pay_amount
        let status
        if (res.data.status === 2 || res.data.status === 3 || res.data.status === 4) {
          status = PayStatus.Success
        } else {
          status = PayStatus.Fail
        }
        resolve({
          amount,
          status,
        })
      }
    }
  })
}

export function getUserBankCard() {
  return new Promise<BankCardItem[]>(async resolve => {
    const userStore = useUserStore()
    const cards: BankCardItem[] = []
    const res = await GetBankCards({
      address: userStore.user!.address,
    }).catch(error => {
      alertCatchError(error)
      resolve(cards)
    })
    if (res?.success) {
      cards.length = 0
      res.data.bankCardList.forEach(item => {
        for (const i in AllCardJson) {
          if (AllCardJson[i] === item.bankName) {
            item.bankCode = i
            break
          }
        }
      })
      cards.push(...res.data.bankCardList)
    }
    resolve(cards)
  })
}

export function getNFTClassify(classifyList: string[] | undefined) {
  let classify = ''
  if (classifyList && classifyList?.length > 0) {
    classify = classifyList[0]
    const name = classifyName[classify]
    if (name) classify = name
  }
  return classify
}

export function toWhatsonchain(txId: string) {
  toUrl(`https://whatsonchain.com/tx/${txId}`)
}

export function toMvcScan(txId: string) {
  let target
  if (isIOS) {
    target = '_selft'
  } else {
    target = '_blank'
  }
  window.open(`https://mvcscan.com/tx/${txId}`, target)
}

export function setPayQuitUrl(params: {
  fullPath: string
  payPlatform: PayPlatform
  isBlindbox?: boolean
}) {
  const uuidMsg = {
    isBlindbox: !!params.isBlindbox,
    form: params.fullPath,
    payPlatform: params.payPlatform,
  }
  const uuid = uuidv1()
  window.sessionStorage.setItem(uuid, JSON.stringify(uuidMsg))
  const quitUrl = `${location.origin}${
    router.resolve({
      name: 'payResult',
      query: {
        uuid,
      },
    }).href
  }&orderId=`
  return quitUrl
}

// 是否邮箱
export function isEmail(email = '') {
  const emailReg = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$')
  return emailReg.test(email)
}

// 循环执行某方法
export function loopExecutionFunction(
  targetFunction: (params: any) => any,
  targetFunctionParams: any,
  callback: (params: any) => boolean,
  option?: {
    loop?: number
    timer?: number
  }
) {
  return new Promise<any>(async (resolve, reject) => {
    if (!option) option = {}
    if (!option.loop) option.loop = 10
    if (!option.timer) option.loop = 1000
    let isSuccess = false
    let resolveRes: any
    for (let i = 0; i < option!.loop; i++) {
      try {
        const res = await targetFunction(targetFunctionParams)
        if (res) {
          const result = callback(res)
          if (result) {
            isSuccess = true
            resolveRes = res
            break
          } else {
            await sleep(option.timer)
          }
        }
      } catch (error) {
        await sleep(option.timer)
      }
    }
    if (isSuccess) {
      resolve(resolveRes)
    } else {
      reject(new Error(`loop ${targetFunction.toString()} fail`))
    }
  })
}

// 随机数
export function randomNumber(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      // @ts-ignore
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      // @ts-ignore
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

// 防抖
export function debounce(fn: any, delay = 1000) {
  let timer: any
  return function() {
    clearTimeout(timer)

    timer = setTimeout(() => {
      console.log('debounce')
      fn.apply(this, arguments)
    }, delay)
  }
}

// 节流
export function throttle(func, delay = 500) {
  let timer: any
  let throttled = false

  return function() {
    if (!throttled) {
      func.apply(this, arguments)
      throttled = true
      timer = setTimeout(() => {
        throttled = false
      }, delay)
    }
  }
}

// export async function compressImage(image: File): Promise<File> {
//   return new Promise((resolve, reject) => {
//     new Compressor(image, {
//       quality: 0.6,
//       convertSize: 100_000, // 100KB
//       success: resolve as () => File,
//       error: reject,
//     })
//   })
// }
export async function compressImage(image: File) {
  if (image.type == 'image/gif') {
    return image
  }

  const compress = (quality: number): Promise<File> =>
    new Promise((resolve, reject) => {
      new Compressor(image, {
        quality,
        convertSize: 100_000, // 100KB
        success: resolve as () => File,
        error: reject,
      })
    })

  // Use 0.6 compression ratio first; If the result is still larger than 1MB, use half of the compression ratio; Repeat 5 times until the result is less than 1MB, otherwise raise an error
  let useQuality = 0.6
  for (let i = 0; i < 5; i++) {
    const compressed = await compress(useQuality)
    if (compressed.size < 1_000_000) {
      return compressed
    }
    useQuality /= 2
  }

  throw new Error('Image is too large')
}

// 降文件转为 AttachmentItem， 便于操作/上链
export function FileToAttachmentItem(
  file: File,
  encrypt: IsEncrypt = IsEncrypt.No,
  getBase64: boolean = false
) {
  return new Promise<AttachmentItem>(async (resolve, reject) => {
    function readResult(blob: Blob) {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // @ts-ignore
          const wordArray = CryptoJs.lib.WordArray.create(reader.result)
          // @ts-ignore
          const buffer = Buffer.from(reader.result)
          hex += buffer.toString('hex') // 更新hex
          // 增量更新计算结果
          sha256Algo.update(wordArray) // 更新hash
          resolve()
        }
        reader.readAsArrayBuffer(blob)
      })
    }

    function readResultToBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
      })
    }

    // 分块读取，防止内存溢出，这里设置为20MB,可以根据实际情况进行配置
    const chunkSize = 20 * 1024 * 1024

    let hex = '' // 二进制
    let base64
    const sha256Algo = CryptoJs.algo.SHA256.create()

    for (let index = 0; index < file.size; index += chunkSize) {
      await readResult(file.slice(index, index + chunkSize))
    }
    if (getBase64) {
      base64 = await readResultToBase64(file)
    }

    resolve({
      data: hex,
      fileName: file.name,
      fileType: file.type,
      sha256: encHex.stringify(sha256Algo.finalize()),
      url: URL.createObjectURL(file),
      base64: base64 ?? '',
      encrypt,
      size: file.size,
      originFile: file,
    })
  })
}

// 降 AttachmentItem， 转为具有占位符 的 数组
export function getAttachmentsMark(attachments: (AttachmentItem | string)[]) {
  let result = []
  for (let i = 0; i < attachments.length; i++) {
    if (typeof attachments[i] === 'string') {
      result.push(attachments[i])
    } else {
      result.push(`metafile://$[${i}]`)
    }
  }
  return result
}

export function copy(
  value: string | undefined,
  option?: {
    successText?: string
    errorText?: string
  }
) {
  return new Promise<void>((resolve, reject) => {
    if (value) {
      toClipboard(value)
        .then(() => {
          ElMessage.success(option?.successText || i18n.global.t('copysuccess'))
          resolve()
        })
        .catch(() => {
          ElMessage.success(option?.errorText || i18n.global.t('copyerror'))
        })
    }
  })
}

export async function tx(txId: string | undefined, chain: string | undefined) {
  // if (!txId) return
  // const chainInfoRes = await GetTxChainInfo(txId)
  // const chain =
  //   chainInfoRes.code === 0 && chainInfoRes.data.chainFlag
  //     ? chainInfoRes.data.chainFlag
  //     : Chains.MVC
  // const url =
  //   chain === Chains.MVC ? `https://mvcscan.com/tx/${txId}` : `https://whatsonchain.com/tx/${txId}`
  // toUrl(url)
  // const btcTxId = txId
  // console.log(btcTxId)
  // if (btcTxId.endsWith('i0')) {
  //   btcTxId = btcTxId.slice(0, -2)
  // }

  let str = txId
  if (str.slice(-2) === 'i0') {
    str = str.slice(0, -2)
  }

  if (chain == 'btc') {
    window.open(`${import.meta.env.VITE_MEMPOOL_URL}/${str}`, '_blank')
  } else {
    window.open(`${import.meta.env.VITE_MVCSCAN_URL}/${str}`, '_blank')
  }
}

// 随机数
export function randomRange(min: number, max: number) {
  // min最小值，max最大值

  return Math.floor(Math.random() * (max - min)) + min
}

export const prettyAddress = (address: string, len = 6) => {
  return `${address.slice(0, len)}...${address.slice(-len)}`
}

export function getCurrencyAmount(
  price: string | number, // 最小单位
  currency: ToCurrency,
  toCurrency?: ToCurrency
) {
  const rootStore = useRootStore()
  console.log('rootStore.exchangeRate', rootStore.exchangeRate)
  if (!price) return 0
  const ToCurrencyAmountFix = {
    [ToCurrency.BSV]: 8,
    [ToCurrency.BTC]: 8,
    [ToCurrency.CNY]: 2,
    [ToCurrency.ETH]: 9,
    [ToCurrency.MVC]: 8,
    [ToCurrency.POLYGON]: 9,
    [ToCurrency.USD]: 2,
  }
  const ToCurrencyAmounRate = {
    [ToCurrency.BSV]: Math.pow(10, 8),
    [ToCurrency.BTC]: Math.pow(10, 8),
    [ToCurrency.CNY]: 100,
    [ToCurrency.ETH]: Math.pow(10, 9),
    [ToCurrency.MVC]: Math.pow(10, 8),
    [ToCurrency.POLYGON]: Math.pow(10, 9),
    [ToCurrency.USD]: 100,
  }
  if (!toCurrency) {
    toCurrency = rootStore.currentPrice
  }
  let amount
  
  amount = new Decimal(
    new Decimal(price).div(ToCurrencyAmounRate[currency].toFixed(ToCurrencyAmountFix[currency]))
  ).toNumber()
  // if (currency === toCurrency) {
  //   amount = new Decimal(
  //     new Decimal(price).div(ToCurrencyAmounRate[currency].toFixed(ToCurrencyAmountFix[currency]))
  //   ).toNumber()
  // } else if (currency === ToCurrency.CNY || currency === ToCurrency.USD) {
  //   if (currency === ToCurrency.CNY && toCurrency === ToCurrency.USD) {
  //     //  cny -> usd
  //     amount = new Decimal(
  //       new Decimal(rootStore.exchangeRate[0].price.USD)
  //         .div(rootStore.exchangeRate[0].price.CNY)
  //         .mul(price)
  //         .div(ToCurrencyAmounRate[currency])
  //         .toFixed(ToCurrencyAmountFix[toCurrency])
  //     ).toNumber()
  //   } else if (currency === ToCurrency.USD && toCurrency === ToCurrency.CNY) {
  //     // usd -> cny

  //     amount = new Decimal(
  //       new Decimal(rootStore.exchangeRate[0].price.CNY)
  //         .div(rootStore.exchangeRate[0].price.USD)
  //         .mul(price)
  //         .div(ToCurrencyAmounRate[currency])
  //         .toFixed(ToCurrencyAmountFix[toCurrency])
  //     ).toNumber()
  //   } else {
  //     // * -> cny/ usd
  //     const rate = rootStore.exchangeRate.find(
  //       item => item.symbol.toUpperCase() === toCurrency!.toUpperCase()
  //     )
  //     amount = new Decimal(
  //       new Decimal(price)
  //         .div(ToCurrencyAmounRate[currency])
  //         .div(rate!.price[currency])
  //         .toFixed(ToCurrencyAmountFix[toCurrency])
  //     ).toNumber()
  //   }
  // } else if (toCurrency === ToCurrency.CNY || toCurrency === ToCurrency.USD) {
  //   const currenyRate = rootStore.exchangeRate.find(
  //     item => item.symbol.toUpperCase() === currency!.toUpperCase()
  //   )
  //   amount = new Decimal(
  //     new Decimal(currenyRate!.price[toCurrency])
  //       .mul(price)
  //       .div(ToCurrencyAmounRate[currency])
  //       .toFixed(ToCurrencyAmountFix[toCurrency])
  //   ).toNumber()
  // } else {
  //   const currenyRate = rootStore.exchangeRate.find(
  //     item => item.symbol.toUpperCase() === currency!.toUpperCase()
  //   )
  //   const toCurrencyRate = rootStore.exchangeRate.find(
  //     item => item.symbol.toUpperCase() === toCurrency!.toUpperCase()
  //   )

  //   amount = new Decimal(
  //     new Decimal(currenyRate!.price.CNY)
  //       .div(toCurrencyRate!.price.CNY)
  //       .mul(price)
  //       .div(ToCurrencyAmounRate[currency])
  //       .toFixed(ToCurrencyAmountFix[toCurrency])
  //   ).toNumber()
  // }

  return amount

  // if (toCurrency === ToCurrency.CNY) {
  //   if (currency === ToCurrency.CNY) {
  //     //  cny -> cny
  //     return new Decimal(price).div(100).toNumber()
  //   } else if (currency === ToCurrency.USD) {
  //     // usd -> cny
  //     const rateUSD = new Decimal(rootStore.exchangeRate[1]!.price.CNY)
  //       .div(rate!.price.USD)
  //       .toNumber()
  //     return new Decimal(
  //       new Decimal(price)
  //         .div(100)
  //         .div(rateUSD)
  //         .toFixed(2)
  //     ).toNumber()
  //   } else {
  //     rate = rootStore.exchangeRate.find(
  //       item => item.symbol.toUpperCase() === currency.toUpperCase()
  //     )
  //     return new Decimal(new Decimal(price).mul(rate!.price.CNY).toFixed(2)).toNumber()
  //   }
  // } else if (toCurrency === ToCurrency.ETH) {
  //   if (currency === 'CNY') {
  //     // cny -> eth
  //     let result = new Decimal(
  //       new Decimal(price)
  //         .div(100)
  //         .div(rate!.price.CNY)
  //         .toFixed(5)
  //     ).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else if (currency === ToCurrency.USD) {
  //     // usd -> eth
  //     let result = new Decimal(new Decimal(price).div(rate!.price.USD).toFixed(5)).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else {
  //     // mvc -> eth
  //     return 0
  //   }
  // } else if (toCurrency === ToCurrency.BSV) {
  //   if (currency === 'CNY') {
  //     let result = new Decimal(
  //       new Decimal(price)
  //         .div(100)
  //         .div(rate!.price.CNY)
  //         .toFixed(5)
  //     ).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else if (currency === ToCurrency.USD) {
  //     // usd -> eth
  //     let result = new Decimal(new Decimal(price).div(rate!.price.USD).toFixed(5)).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else {
  //     // mvc -> eth
  //     return 0
  //   }
  // } else if (toCurrency === ToCurrency.POLYGON) {
  //   if (currency === 'CNY') {
  //     let result = new Decimal(
  //       new Decimal(price)
  //         .div(100)
  //         .div(rate!.price.CNY)
  //         .toFixed(5)
  //     ).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else if (currency === ToCurrency.USD) {
  //     // usd -> eth
  //     let result = new Decimal(new Decimal(price).div(rate!.price.USD).toFixed(5)).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else {
  //     // mvc -> eth
  //     return 0
  //   }
  // } else if (toCurrency === ToCurrency.MVC) {
  //   if (currency === 'CNY') {
  //     let result = new Decimal(
  //       new Decimal(price)
  //         .div(100)
  //         .div(rate!.price.CNY)
  //         .toFixed(5)
  //     ).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else if (currency === ToCurrency.USD) {
  //     // usd -> eth
  //     let result = new Decimal(new Decimal(price).div(rate!.price.USD).toFixed(5)).toNumber()
  //     if (result < 0.00001) result = 0.00001
  //     return result
  //   } else {
  //     // mvc -> eth
  //     return 0
  //   }
  // } else {
  //   //  USD

  //   if (currency === 'CNY') {
  //     // cny -> usd
  //     const rateUSD = new Decimal(rootStore.exchangeRate[1]!.price.CNY)
  //       .div(rootStore.exchangeRate[1]!.price.USD)
  //       .toNumber()
  //     return new Decimal(
  //       new Decimal(price)
  //         .div(100)
  //         .div(rateUSD)
  //         .toFixed(2)
  //     ).toNumber()
  //   } else {
  //     rate = rootStore.exchangeRate.find(
  //       item => item.symbol.toUpperCase() === currency.toUpperCase()
  //     )
  //     // mvc -> usd
  //     const result = new Decimal(new Decimal(price).mul(rate!.price.USD).toFixed(2)).toNumber()
  //     return result > 0.01 ? result : 0.01
  //   }
  // }
}

export function SetLang(lang: string) {
  if (i18n.global.locale.value === lang) return
  i18n.global.locale.value = lang
  window.localStorage.setItem('lang', lang)
  if (!window.localStorage.getItem('currentPrice')) {
    const rootStore = useRootStore()
    rootStore.$patch({ currentPrice: i18n.global.locale.value === 'en' ? 'USD' : 'CNY' })
  }
}

export function CreatePayOrder(params: {
  platform: PayPlatform
  fullPath: string
  goods_name: string
  count: number
  product_type: ProductType // 100-ME, 200-Legal_NFT,
  uuid?: string

  // 购买合约 NFT
  genesis?: string
  codehash?: string
  contract?: string
  tokenIndex?: string

  // metanem
  data?: string
  operate_type?: MetaNameOperateType
  mvc_to_address?: string
  nft_to_address?: string
  tx_fee?: number
  fee_per_year?: number
  meta_name_len?: number
  meta_name_uts_ascii?: string
}) {
  return new Promise<PayOrderStatus>(async (resolve, reject) => {
    try {
      const userStore = useUserStore()
      let from = !isApp ? 'web' : isAndroid ? 'android' : isIOS ? 'ios' : ''
      from += `:${import.meta.env.VITE_App_Key}`
      // 支付回调地址
      const quitUrl = setPayQuitUrl({
        payPlatform: params.platform,
        fullPath: params.fullPath,
        isBlindbox: false,
      })
      const type = isIosApp
        ? PayType.H5
        : isApp
        ? PayType.App
        : isAndroid && isIOS
        ? PayType.H5
        : PayType.H5
      const res = await CreatOrder({
        address: userStore.user!.address!,
        description: params.product_type === 100 ? 'Recharge ME' : 'Buy NFT',
        from,
        metaid: userStore.user!.metaId,
        pay_type: params.platform,
        quit_url: quitUrl,
        types: type,
        from_coin_address:
          params.platform === PayPlatform.ETH || params.platform === PayPlatform.POLYGON
            ? userStore.user?.evmAddress
            : userStore.user!.address,
        ...params,
        count:
          params.product_type === ProductType.ME
            ? new Decimal(params.count).mul(100).toNumber()
            : params.count,
      })
      if (res?.code === 0) {
        resolve(res.data)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function CheckMetaMaskAccount(params: { chainId: string }) {
  return new Promise<void>(async (resolve, reject) => {
    const result = await (window as any).ethereum.enable()
    if (result && result.length) {
      const root = useRootStore()
      const chain = (window as any).ethereum?.chainId
      const chainId = parseInt(chain).toString()

      if (params.chainId === chainId) {
        resolve()
      } else {
        ChangeMetaMaskChain(params)
          .then(() => {
            resolve()
          })
          .catch(error => reject(error))
      }
      // const request = await (window as any).ethereum.request({
      //   method: 'eth_requestAccounts',
      //   params: [address],
      // })
      // const res = await (window as any).ethereum.request({
      //   method: 'wallet_requestPermissions',
      //   params: [{ eth_accounts: address }],
      // })
    }
  })
}

export function ChangeMetaMaskChain(params: { chainId: string }) {
  return new Promise<void>(async (resolve, reject) => {
    // if ((window as any).ethereum?.chainId)
    const evmChanName = {
      [import.meta.env.VITE_ETH_CHAINID]: import.meta.env.VITE_ETH_CHAIN,
      [import.meta.env.VITE_POLYGON_CHAINID]: import.meta.env.VITE_POLYGON_CHAIN,
    }

    const res = await ElMessageBox.confirm(
      // @ts-ignore
      i18n.global.t('MetaMak.Chain Network Error Tips') + `${evmChanName[params.chainId]}`,
      i18n.global.t('MetaMak.Chain Network Error'),
      {
        customClass: 'primary',
        // @ts-ignore
        confirmButtonText: i18n.global.t('MetaMak.Change') + `${evmChanName[params.chainId]}`,
        cancelButtonText: i18n.global.t('Cancel'),
      }
    )
      .then(() => {
        ;(window as any).ethereum
          .request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: ethers.utils.hexValue(parseInt(params.chainId)),
                // chainId:
                //   import.meta.env.VITE_ETH_CHAIN == 'eth'
                //     ? currentSupportChain[0].chainId
                //     : currentSupportChain[1].chainId,
              },
            ],
          })
          .then((res: string[]) => {
            resolve()
          })
          .catch((error: any) => {
            reject(error)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function followUser(params: {
  value: boolean
  name: string
  metaId: string
  address: string
}) {
  return new Promise<void | NodeTransactions | null>(async (resolve, reject) => {
    if (!params.value) {
      ElMessageBox.confirm(
        // @ts-ignore
        `${i18n.global.t('cancelFollowTips')}: ${params.name}`,
        i18n.global.t('Warning'),
        {
          confirmButtonText: i18n.global.t('Confirm'),
          cancelButtonText: i18n.global.t('Cancel'),
          confirmButtonClass: 'main-border primary',
          cancelButtonClass: 'main-border',
        }
      )
        .then(async () => {
          const res = await confirmFollow(params)
          resolve(res)
        })
        .catch(() => {
          resolve(null)
        })
    } else {
      const res = await confirmFollow(params)
      resolve(res)
    }
  })
}

export function createBrfcid(params: { title: string; author: string; versions: string }) {
  const content = `${params.title.trim()}${params.author.trim()}${params.versions.trim()}`
  const res = mvc.crypto.Hash.sha256(mvc.crypto.Hash.sha256(Buffer.from(content)))
    .reverse()
    .toString('hex')
    .substring(0, 12)

  return res
}

export async function confirmFollow(params: { address: string; metaId: string; value: boolean }) {
  return new Promise<void | NodeTransactions | null>(async (resolve, reject) => {
    const userStore = useUserStore()
    const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
    const res = await userStore.showWallet
      .createBrfcChildNode({
        nodeName: NodeName.PayFollow,
        data: JSON.stringify({
          createTime: new Date().getTime(),
          MetaID: params.metaId,
          pay: payAmount,
          payTo: params.address,
          status: params.value ? 1 : -1,
        }),
        payTo: [{ amount: payAmount, address: params.address }],
      })
      .catch(error => reject(error))
    if (res) {
      Mitt.emit(MittEvent.FollowUser, { metaId: params.metaId, result: params.value })
    }
    resolve(res)
  })
}
function getBase64(url: string, callback: Function) {
  //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗餘和污染
  let Img = new Image()
  let dataURL = ''
  Img.src = url + '?v=' + Math.random() // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
  Img.setAttribute('crossOrigin', 'Anonymous') // 解决控制台跨域报错的问题
  Img.onload = function() {
    //要先确保图片完整获取到，这是个异步事件
    let canvas = document.createElement('canvas'), //创建canvas元素
      context = canvas.getContext('2d'),
      width = Img.width, //确保canvas的尺寸和图片一样
      height = Img.height
    canvas.width = width
    canvas.height = height
    context!.drawImage(Img, 0, 0, width, height) //将图片绘制到canvas中
    dataURL = canvas.toDataURL('image/png') //转换图片为dataURL
    // canvas.toBlob(blob => {

    //   resolve(blob)
    // },'image/png')
    callback(dataURL)
  }
}

export function dataURLtoFile(dataurl: any, filename: string) {
  //将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export const setInitImg = (
  url: string,
  callback: Function
): Promise<{ file: File; base64Res: string | ArrayBuffer | null }> => {
  let img = url //这里是图片URL
  return new Promise(resolve => {
    getBase64(img, async dataURL => {
      let fileImgRes = dataURLtoFile(dataURL, img)
      const file = await callback(fileImgRes)
      let reader = new FileReader()
      reader.readAsDataURL(fileImgRes)
      reader.onload = function() {
        let base64Res = reader.result
        resolve({
          file,
          base64Res,
        })
      }
    })
  })
}

export const bytesLength = (str: string) => {
  return Buffer.from(toUnicode(str)).length
  // let intLength = 0
  // for (let i = 0; i < str.length; i++) {
  //   let a = str.charAt(i)
  //   if (a.match(/[^\x00-\xff]/gi) != null) {
  //     intLength += 2
  //   } else {
  //     intLength += 1
  //   }
  // }
  // return intLength
}

export const getMetaNamePrice = (metaName: string) => {
  const metaNameStore = useMetaNameStore()
  const result = bytesLength(metaName)
  if (result === 3) return metaNameStore.MetaNameFeePerYear.third
  else if (result === 4) return metaNameStore.MetaNameFeePerYear.four
  else return metaNameStore.MetaNameFeePerYear.five
}

//获取UTC到期时间
// export function GetExpiredUTC(expiredBlockHeight: number, blockHeight?: any) {
//   return new Promise<string | null>(async (resolve, reject) => {
//     try {
//       //获取当前块高信息：medianTime，blocks
//       if (!blockHeight) {
//         blockHeight = await getBlockHeight()
//       }
//       const distanceDay = new Decimal(expiredBlockHeight)
//         .sub(blockHeight.blocks)
//         .div(144)
//         .toNumber()
//       const date: any = dateTimeFormat(blockHeight.medianTime * 1000)
//       const res = dayjs(date).add(distanceDay, 'day')
//       const result = dateTimeFormat(res.valueOf(), 'UTC')
//       resolve(result)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

//获取UTC到期时间
export function GetExpiredUTC(expiredBlockTime: number) {
  if (new Decimal(expiredBlockTime).toString().length < 13) {
    return dateTimeFormat(new Decimal(expiredBlockTime).mul(1000).toNumber(), 'UTC')
  } else {
    return dateTimeFormat(expiredBlockTime, 'UTC')
  }
}

//到期时间提醒
export function remindExpired(expireTime: any) {
  const remindTime = 3 //单位:月
  return (
    dayjs(expireTime.split(' ')[0]).diff(
      dateTimeFormat(+Date.now(), 'UTC', 'YYYY-MM-DD'),
      'month'
    ) < remindTime
  )
}

export function getLocalAccount() {
  const localPassword = window.localStorage.getItem(encode('password'))
  const localUserInfo = window.localStorage.getItem(encode('user'))
  if (!localPassword || !localUserInfo) {
    throw new Error('用户登录失败')
  }
  const password = decode(localPassword)
  const userInfo: UserInfo = JSON.parse(decode(localUserInfo))
  // 如果缓存是老的（没有Path），则删除缓存重新登录
  if (!userInfo.path) {
    window.localStorage.removeItem(encode('password'))
    window.localStorage.removeItem(encode('user'))
    // reload
    window.location.reload()
  }
  return {
    password,
    userInfo,
  }
}

export function loopExecution(
  fun: (params: any) => Promise<any>,
  funParams: any,
  params?: {
    sleepTime?: number
    maxLoopCount?: number
  }
) {
  return new Promise(async (resolve, reject) => {
    const initParams = {
      maxLoopCount: 10,
      sleepTime: 1000,
    }
    params = {
      ...initParams,
      ...params,
    }
    // @ts-ignore
    const res = await loopExecutionRun({
      fun,
      funParams,
    }).catch(error => {
      reject(error)
    })
    if (res) {
      resolve(res)
    }
  })
}

// 循环执行 递归 Promise 函数
export function loopExecutionRun(params: {
  fun: (params?: any) => Promise<any> // 需要递归的方法
  funParams?: any // 方法的参数
  maxLoopCount?: number // 最大循环次数
  sleepTime?: number //
  currentCount?: number // 当前循环次数
}) {
  return new Promise<any>(async (resolve, reject) => {
    const initParams = {
      maxLoopCount: 10,
      sleepTime: 1000,
      currentCount: 1,
    }
    params = {
      ...initParams,
      ...params,
    }
    for (let i = 0; i < params.maxLoopCount!; i++) {
      const res = await params.fun(params.funParams).catch(error => {
        if (i == params.maxLoopCount! - 1) {
          reject(error)
        }
      })
      if (res || res === null) {
        resolve(res)
        break
      }
      await sleep(params.sleepTime)
    }
  })
}

export function currentConnectChain(chainId: string) {
  switch (chainId) {
    case '0x1':
    case '0xr':
      return 'eth'
    case '0x89':
    case '0x13881':
      return 'polygon'
  }
}

export function mappingChainName(chainName: string) {
  switch (chainName.toLocaleLowerCase()) {
    case 'eth':
      return '0x1'
    case 'goerli':
      return '0x5'
    case 'polygon':
      return '0x89'
    case 'mumbai':
      return '0x13881'
  }
}

export function mappingChainId(chainId: string) {
  switch (chainId) {
    case '0x1':
    case '0x5':
      return PayPlatform.ETH
    default:
      return PayPlatform.POLYGON
  }
}

export function getUserBsvBalance() {
  return new Promise<number>(async (resolve, reject) => {
    const userStore = useUserStore()
    const res = await GetBalance({
      chain: Chains.BSV,
      xpub: userStore.showWallet.wallet?.wallet.xpubkey.toString(),
    }).catch(error => {
      reject(error)
    })
    if (res?.code === 0) {
      resolve(new Decimal(res.data.balance).toNumber())
    }
  })
}

export const nativePayPlatforms = [
  PayPlatform.ETH,
  PayPlatform.POLYGON,
  PayPlatform.BSV,
  PayPlatform.SPACE,
  PayPlatform.BTC
]

export function getPlatformSymbol(platform: PayPlatform, defaultValue = '') {
  if (nativePayPlatforms.includes(platform)) {
    return PayPlatformUnit[platform]
  } else {
    if (defaultValue) return defaultValue
    else return '￥'
    // return rootStore.currentPriceSymbol
  }
}

export function getAccountUserInfo(account: string) {
  return new Promise<UserAllInfo>(async (resolve, reject) => {
    try {
      let metaId: string = ''
      let address: string = ''
      const userStore = useUserStore()
      if (email.test(account)) {
        const res = await userStore.showWallet.wallet?.provider.getPayMailAddress(account)
        if (res) {
          address = res
        }
      }

      let isAddress: any = false

      try {
        // @ts-ignore
        isAddress = mvc.Address._transformString(account)
        if (isAddress) {
          address = account
        }
      } catch (error) {
        isAddress = false
      }

      if (account.length === 64 && !email.test(account) && !isAddress) {
        // MetaId
        metaId = account
      }

      if (account.length !== 64 && !email.test(account) && !isAddress) {
        const res = await GetMetaNameInfo(account.replace('.metaid', ''))
        if (res.code === 0) {
          if (
            res.data.resolveAddress &&
            res.data.ownerAddress &&
            res.data.ownerAddress === res.data.resolveAddress
          ) {
            address = res.data.resolveAddress
          } else {
            throw new Error(i18n.global.t('NFT.TransferToMetaNameNotMatch'))
          }
        }
      }

      if (address) {
        const res = await GetMetaIdByAddress(address).catch(() => {
          metaId = ''
        })
        if (res?.code === 0) {
          metaId = res.data
        }
      }

      if (metaId === '') {
        resolve({
          metaId: '',
          address: address,
          name: email.test(account) ? account : '',
          avatarImage: '',
        } as UserAllInfo)
      } else {
        const res = await GetUserAllInfo(metaId!).catch(error => {
          ElMessage.error(error.message)
        })
        if (res?.code === 0) {
          resolve(res.data)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function getBalance(params: { chain: Chains }) {
  return new Promise<number>(async (resolve, reject) => {
    const userStore = useUserStore()
    const isBtLink = params.chain === Chains.BSV || params.chain === Chains.MVC
    const isETHChain = params.chain === Chains.ETH || params.chain === Chains.Goerli
    const isPOLYGONChain = params.chain === Chains.POLYGON || params.chain === Chains.MUMBAI
    const _params: any = {}
    _params.address = isBtLink ? userStore.user!.address : userStore.user!.evmAddress
    _params.chain = isBtLink
      ? params.chain
      : isETHChain
      ? import.meta.env.VITE_ETH_CHAIN
      : import.meta.env.VITE_POLYGON_CHAIN
    if (userStore.metaletLogin) {
      console.log(userStore)
      const metaWallet = userStore.showWallet.wallet as MetaletWallet
      _params.xpub = await metaWallet.metaIDJsWallet.getXPublicKey()
    }
    if (isBtLink && !userStore.metaletLogin) {
      //@ts-ignore
      _params.xpub = userStore.showWallet.wallet?.wallet.xpubkey.toString()
    }
    if (!isBtLink && !userStore.user?.evmAddress) {
      resolve(0)
    } else if (params.chain === Chains.BSV && import.meta.env.MODE === EnvMode.TestnetGray) {
      //  BSV 沒有測試網
      resolve(0)
    } else {
      const res = await GetBalance(_params).catch(error => reject(error))
      if (res?.code === 0) {
        resolve(res.data.balance)
      }
    }
  })
}

export function getUserInfoByAddress(address: string) {
  return new Promise<UserAllInfo>(async (resolve, reject) => {
    try {
      const res = await GetMetaIdByAddress(address)
      if (res.code === 0) {
        const response = await GetUserAllInfo(res.data)
        if (response.code === 0) {
          resolve(response.data)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function replaceMarkdownTag(markdown: string) {
  return markdown
    .replace(/```+/g, '')
    .replace(/#+/g, '')
    .replace(/-+/g, '')
    .replace(/\n(&gt;|\\>)/g, '')
    .replace(/^>{1}/g, '')
}

export function Orical(select: number[]) {
  const seleted = oricalUrl.filter((item, index) => {
    return select.includes(index)
  })
  const requestList = []
  for (const request of seleted) {
    requestList.push(axios.get(request))
  }
  if (requestList.length) {
    return Promise.all([...requestList])
  }
}

export function changeSymbol(symbol: string) {
  if (symbol.indexOf('stake_dao_test') !== -1) {
    return `stake_dao_test`
  } else {
    return symbol
  }
}

export function calcNftRealSalePrice(salePrice:number,royaltyRate:number=0):{
  salePrice:number
  platformFee:number
  royaltyFee:number
  total:number
}{
  if(!salePrice){
    return {
      salePrice:0,
    platformFee:0,
    royaltyFee:0,
    total:0
    }
  }
  const platformFee=new Decimal(salePrice).mul(PlatformRate).div(100).toNumber()
  const realplatformFee=platformFee > MinPlatformFee ? platformFee : MinPlatformFee
  const royaltyFee = royaltyRate > 0 ? new Decimal(salePrice).mul(royaltyRate).div(100).toNumber() : 0
  let realroyaltyFee=0
  if(royaltyRate== 0){
    realroyaltyFee=0
  }else{
    if(royaltyFee < MinRoyaltyFee){
      realroyaltyFee=MinRoyaltyFee
    }else{
      realroyaltyFee=royaltyFee
    }
  }
 
  return {
    salePrice:salePrice,
    platformFee:realplatformFee,
    royaltyFee:realroyaltyFee,
    total:new Decimal(salePrice).add(realplatformFee).add(realroyaltyFee).toNumber()
  }
}

export function formatDataUrltoBase64(content:string,type:string){
  return `data:${type};base64,${content}`
}

export function formatDataUrl(pinid:string){
  try {
    const imgPin=JSON.parse(pinid)
    if(!imgPin?.attachment[0]){
      return ``
    }else{
      return `${imgPin.attachment[0].content}`
    }
  } catch (error) {
     return ``
  }
   //`${import.meta.env.VITE_MAN_API}/content/${pinid}`
}





