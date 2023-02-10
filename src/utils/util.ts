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
} from '@/enum'
import { CheckBlindboxOrderStatus } from '@/api/v3'
import AllCardJson from '@/utils/card.json'
import { GetOrderStatus, IsWtiteUser, MetaNameBeforeReqRes } from '@/api/wxcore'
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
import { Mitt, MittEvent } from './mitt'
import { ethers } from 'ethers'
import { getBlockHeight } from '@/api'
import { dateTimeFormat } from './filters'
import dayjs from 'dayjs'
import { SendMetaNameTransationResult } from '@/@types/sdk'
import { GetTxChainInfo } from '@/api/metaid-base'
import { useMetaNameStore } from '@/stores/metaname'
import { GetBalance } from '@/api/aggregation'
import namehash from 'eth-ens-namehash'

export function randomString() {
  return Math.random()
    .toString()
    .replace('.', '')
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
    const userStore = useUserStore()
    const rootStore = useRootStore()
    if (!userStore.isAuthorized) {
      rootStore.$patch({ isShowLogin: true })
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
  return `${import.meta.env.VITE_AppImgApi}/metafile/${metafile}`
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
  if (url.indexOf('https://') !== -1 || url.indexOf('http://') !== -1) {
    // router.push({
    //   path: '/iframe',
    //   query: {
    //     url: encodeURIComponent(url),
    //   },
    // })
    if (isApp) {
      window.location.href = url
    } else {
      window.open(url, '_blank')
    }
  } else {
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
    svg: LoadingTEXT,
    lock: params?.lock || true,
    svgViewBox: '0 0 20 20',
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
  // 控制是否有权限使用余额支付
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
  let target
  if (isIOS) {
    target = '_selft'
  } else {
    target = '_blank'
  }
  window.open(`https://whatsonchain.com/tx/${txId}`, target)
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
      break
    case 2:
      // @ts-ignore
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      break
    default:
      return 0
      break
  }
}

// 防抖
export function debounce(fn: any, delay = 1000) {
  let timer: any
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

// 节流
export function throttle(fn: any, delay = 500) {
  let isThrottle = true
  return () => {
    if (!isThrottle) return
    isThrottle = false
    setTimeout(() => {
      fn()
      isThrottle = true
    }, delay)
  }
}

// 降文件转为 AttachmentItem， 便于操作/上链
export function FileToAttachmentItem(file: File, encrypt: IsEncrypt = IsEncrypt.No) {
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
    // 分块读取，防止内存溢出，这里设置为20MB,可以根据实际情况进行配置
    const chunkSize = 20 * 1024 * 1024

    let hex = '' // 二进制
    const sha256Algo = CryptoJs.algo.SHA256.create()

    for (let index = 0; index < file.size; index += chunkSize) {
      await readResult(file.slice(index, index + chunkSize))
    }
    resolve({
      data: hex,
      fileName: file.name,
      fileType: file.type,
      sha256: encHex.stringify(sha256Algo.finalize()),
      url: URL.createObjectURL(file),
      encrypt,
      size: file.size,
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

export async function tx(txId: string | undefined) {
  if (!txId) return
  const chainInfoRes = await GetTxChainInfo(txId)
  const chain =
    chainInfoRes.code === 0 && chainInfoRes.data.chainFlag
      ? chainInfoRes.data.chainFlag
      : Chains.MVC
  const url =
    chain === Chains.MVC ? `https://mvcscan.com/tx/${txId}` : `https://whatsonchain.com/tx/${txId}`
  window.open(url, '_blank')
}

// 随机数
export function randomRange(min: number, max: number) {
  // min最小值，max最大值

  return Math.floor(Math.random() * (max - min)) + min
}

export function getCurrencyAmount(
  price: string | number,
  currency: ToCurrency,
  toCurrency?: ToCurrency
) {
  const rootStore = useRootStore()
  if (!toCurrency) {
    toCurrency = rootStore.currentPrice
  }
  const rate = rootStore.exchangeRate.find(
    item => item.symbol.toUpperCase() === toCurrency!.toUpperCase()
  )
  if (toCurrency === 'CNY') {
    if (currency === 'CNY') {
      //  cny -> cny
      return new Decimal(price).div(100).toNumber()
    } else {
      // mvc -> cny
      const rateUSD = new Decimal(rate!.price.CNY).div(rate!.price.USD).toNumber()
      return new Decimal(
        new Decimal(price)
          .div(100)
          .div(rateUSD)
          .toFixed(2)
      ).toNumber()
    }
  } else if (toCurrency === ToCurrency.ETH) {
    if (currency === 'CNY') {
      // cny -> eth
      let result = new Decimal(
        new Decimal(price)
          .div(100)
          .div(rate!.price.CNY)
          .toFixed(5)
      ).toNumber()
      if (result < 0.00001) result = 0.00001
      return result
    } else if (currency === ToCurrency.USD) {
      // usd -> eth
      let result = new Decimal(new Decimal(price).div(rate!.price.USD).toFixed(5)).toNumber()
      if (result < 0.00001) result = 0.00001
      return result
    } else {
      // mvc -> eth
      return 0
    }
  } else if (toCurrency === ToCurrency.BSV) {
    if (currency === 'CNY') {
      let result = new Decimal(
        new Decimal(price)
          .div(100)
          .div(rate!.price.CNY)
          .toFixed(5)
      ).toNumber()
      if (result < 0.00001) result = 0.00001
      return result
    } else if (currency === ToCurrency.USD) {
      // usd -> eth
      let result = new Decimal(new Decimal(price).div(rate!.price.USD).toFixed(5)).toNumber()
      if (result < 0.00001) result = 0.00001
      return result
    } else {
      // mvc -> eth
      return 0
    }
  } else if (toCurrency === ToCurrency.POLYGON) {
    if (currency === 'CNY') {
      let result = new Decimal(
        new Decimal(price)
          .div(100)
          .div(rate!.price.CNY)
          .toFixed(5)
      ).toNumber()
      if (result < 0.00001) result = 0.00001
      return result
    } else if (currency === ToCurrency.USD) {
      // usd -> eth
      let result = new Decimal(new Decimal(price).div(rate!.price.USD).toFixed(5)).toNumber()
      if (result < 0.00001) result = 0.00001
      return result
    } else {
      // mvc -> eth
      return 0
    }
  } else {
    //  USD

    if (currency === 'CNY') {
      // cny -> usd
      const rateUSD = new Decimal(rootStore.exchangeRate[1]!.price.CNY)
        .div(rootStore.exchangeRate[1]!.price.USD)
        .toNumber()
      return new Decimal(
        new Decimal(price)
          .div(100)
          .div(rateUSD)
          .toFixed(2)
      ).toNumber()
    } else {
      // mvc -> usd
      return new Decimal(
        new Decimal(price)
          .div(Math.pow(10, 8))
          .mul(rate!.price.USD)
          .toFixed(2)
      ).toNumber()
    }
  }
}

export function NFTOffSale(nft: GenesisNFTItem) {
  return new Promise(async resolve => {
    ElMessageBox.confirm(
      `${i18n.global.t('offsaleConfirm')} ${nft.nftName} ?`,
      i18n.global.t('niceWarning'),
      {
        confirmButtonText: i18n.global.t('confirm'),
        cancelButtonText: i18n.global.t('Cancel'),
        closeOnClickModal: false,
        cancelButtonClass: 'main-border',
        confirmButtonClass: 'main-border primary',
      }
    )
      .then(async () => {
        const userStore = useUserStore()
        const signRes: string = await userStore.showWallet!.sigMessage(
          userStore.user!.metaId!,
          '0/0'
        )
        if (signRes) {
          const res = await LegalOffsale({ uuid: nft.nftLegalUuid, sig: signRes })
          if (res.code === 0) {
            ElMessage.success('下架成功')
            resolve(true)
          }
        }
      })
      .catch(error => {
        resolve(false)
      })
  })
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
      from += `:${import.meta.env.VITE_AppName}`
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
        count:
          params.product_type === 100
            ? new Decimal(params.count).mul(100).toNumber()
            : params.count,
        description: params.product_type === 100 ? 'Recharge ME' : 'Buy NFT',
        from,
        goods_name: params.goods_name,
        metaid: userStore.user!.metaId,
        pay_type: params.platform,
        quit_url: quitUrl,
        types: type,
        from_coin_address: userStore.user?.evmAddress,
        product_type: params.product_type,
        uuid: params.uuid,
        // metaname
        data: params.data,
        operate_type: params.operate_type,
        mvc_to_address: params.mvc_to_address,
        nft_to_address: params.nft_to_address,
        tx_fee: params.tx_fee,
        fee_per_year: params.fee_per_year,
        meta_name_len: params.meta_name_len,
        meta_name_uts_ascii: params.meta_name_uts_ascii,
      })
      if (res?.code === 0) {
        resolve(res.data)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function CheckMetaMaskAccount(address: string) {
  return new Promise<void>(async (resolve, reject) => {
    const result = await (window as any).ethereum.enable()
    if (result && result.length) {
      const root = useRootStore()
      const chain = (window as any).ethereum?.chainId
      const chainId = parseInt(chain).toString()

      if (root.chainWhiteList.includes(chain)) {
      } else {
        await ChangeMetaMaskChain().catch(error => reject(error))
      }
      // const request = await (window as any).ethereum.request({
      //   method: 'eth_requestAccounts',
      //   params: [address],
      // })
      // const res = await (window as any).ethereum.request({
      //   method: 'wallet_requestPermissions',
      //   params: [{ eth_accounts: address }],
      // })

      resolve()
    }
  })
}

export function ChangeMetaMaskChain() {
  return new Promise<void>(async (resolve, reject) => {
    // if ((window as any).ethereum?.chainId)

    const res = await ElMessageBox.confirm(
      // @ts-ignore
      i18n.global.t('MetaMak.Chain Network Error Tips') + `${import.meta.env.VITE_ETH_CHAIN}`,
      i18n.global.t('MetaMak.Chain Network Error'),
      {
        customClass: 'primary',
        confirmButtonText: i18n.global.t('MetaMak.Change') + `${import.meta.env.VITE_ETH_CHAIN}`,
        cancelButtonText: i18n.global.t('Cancel'),
      }
    )
      .then(() => {
        ;(window as any).ethereum
          .request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: ethers.utils.hexValue(parseInt(import.meta.env.VITE_ETH_CHAINID)),
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
  //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
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
  let intLength = 0
  for (let i = 0; i < str.length; i++) {
    let a = str.charAt(i)
    if (a.match(/[^\x00-\xff]/gi) != null) {
      intLength += 2
    } else {
      intLength += 1
    }
  }
  return intLength
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

export async function metanameOperation(params: {
  //注册时mvc跟metaid,更新信息时不需要传入years,注册时必须要传入icon
  registerName: string
  op: MetaNameReqCode
  //注册和更新操作info必填,续费info字段不需要
  info?: Partial<MetaNameInfo>
  years?: number
}) {
  return new Promise<SendMetaNameTransationResult>(async (resolve, reject) => {
    try {
      const userStore = useUserStore()
      const res = await MetaNameBeforeReqRes({
        name: `${params.registerName}`,
        op: params.op,
        years: params.years,
        address: userStore.showWallet.wallet!.rootAddress,
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
        if (result) {
          resolve(result)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
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
      ...params!,
    }).catch(error => {
      reject(error)
    })
    if (res) {
      resolve(res)
    }
  })
}

function loopExecutionRun(params: {
  maxLoopCount: number
  sleepTime: number
  currentCount?: number
  fun: (params: any) => Promise<any>
  funParams: any
  parentResolve?: () => any
  parentReject?: (reason?: any) => void
}) {
  return new Promise<any>(async (resolve, reject) => {
    if (!params.currentCount) params.currentCount = 1
    const res = await params.fun(params.funParams).catch(error => {
      debugger
      if (params.currentCount! < params.maxLoopCount) {
        setTimeout(() => {
          loopExecutionRun({
            ...params,
            currentCount: params.currentCount! + 1,
            parentResolve: params.parentResolve ? params.parentResolve : (resolve as () => any),
            parentReject: params.parentReject ? params.parentReject : reject,
          })
        }, params.sleepTime)
      } else {
        if (params.parentReject) params.parentReject(error)
        else reject(error)
      }
    })
    if (res) {
      if (params.parentResolve) params.parentResolve(res)
      else resolve(res)
    }
  })
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

export const validateMetaName = (value: string) => {
  if (value === '') {
    return ElMessage.error(i18n.global.t('MetaName.MetaName cannot be empty'))
  } else if (value.trim() !== value || /\s/.test(value)) {
    return ElMessage.error(`${i18n.global.t('metanameNotAllowSpace')}`)
  } // else if (/[^x00-xff]/.test(value)) {
  //   return ElMessage.error(`${i18n.global.t('metanameNotAllowCh')}`)
  // }
  else {
    const testResult = bytesLength(value.trim())
    if (testResult > 0 && testResult <= 2) {
      return ElMessage.error(`${i18n.global.t('metanameNotAllowMin')}`)
    } else if (testResult > 63) {
      return ElMessage.error(`${i18n.global.t('metanameNotAllowOverLenght')}`)
    }
  }
  let illgelRes: any
  const MetaNameReg = /\./g
  try {
    illgelRes = namehash.normalize(value)
    if (MetaNameReg.test(illgelRes)) return false
    return illgelRes
  } catch {
    try {
      const { content } = JSON.parse(`{"content":"${value}"}`)
      illgelRes = namehash.normalize(content)
      if (MetaNameReg.test(illgelRes)) return false
      return illgelRes
    } catch (error) {
      ElMessage.error(`${i18n.global.t('inputMetaNameIllgel')}`)
      return null
    }
  }
}
