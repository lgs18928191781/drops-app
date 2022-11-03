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
import { isAndroidApp, isApp, isIOS, useRootStore } from '@/stores/root'
import { GetBankCards, GetWalletBalance, Inactivation } from '@/api/pay'
import { BlindboxUUIDStatus, CloudWalletStatus, IsEncrypt, PayPlatform, PayStatus } from '@/enum'
import { CheckBlindboxOrderStatus } from '@/api/v3'
import AllCardJson from '@/utils/card.json'
import { GetOrderStatus, IsWtiteUser } from '@/api/wxcore'
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
import { createMnemonic, encryptMnemonic, hdWalletFromMnemonic } from './wallet/hd-wallet'

export function randomString() {
  return Math.random()
    .toString()
    .replace('.', '')
}

export function checkSdkStatus(path: string, params?: ElMessageBoxOptions) {
  return new Promise<void>((resolve, reject) => {
    const userStroe = useUserStore()
    if (!userStroe.isAuthorized) {
      openLoginConfirm(path, params)
    } else {
      resolve()
    }
  })
}

export function openLoginConfirm(path: string, params?: ElMessageBoxOptions) {
  return new Promise<void>((resolve, reject) => {
    const userStroe = useUserStore()
    if (userStroe.isAuthorized) {
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
            userStroe.showWallet?.toLogin(path)
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
  return `${import.meta.env.VITE_ShowMan}/metafile/${metafile}`
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
      const userStroe = useUserStore()
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
            address: userStroe.user?.address,
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
    debugger
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

export function offSaleNFT(params: { name: string; uuid: string }) {
  return new Promise<boolean>(async resolve => {
    const userStroe = useUserStore()
    const loading = ElLoading.service()
    try {
      const signRes: string = await userStroe.showWallet.sigMessage(userStroe.user?.metaId!, '0/0')
      if (signRes) {
        const res = await LegalOffsale({ uuid: params.uuid, sig: signRes })
        if (res.code === 0) {
          loading.close()
          ElMessage.success('下架成功')
          resolve(true)
        } else {
          loading.close()
          // @ts-ignore
          ElMessage.error(res.error)
        }
      }
    } catch (error) {
      loading.close()
      alertCatchError(error)
      resolve(false)
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
  const userStroe = useUserStore()
  if (isAndroidApp) {
    await checkAppHasMethod('saveShareImage')
    window.appMetaIdJsV2.saveShareImage(userStroe.user?.token, url, name)
  } else {
    const a = document.createElement('a')
    a.href = url
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
    svg:
      '<defs><linearGradient x1="1" y1="0.5" x2="0" y2="0.5" id="master_svg0_9_280"><stop offset="0%" stop-color="#2AF598" stop-opacity="1"/><stop offset="100%" stop-color="#009EFD" stop-opacity="1"/></linearGradient></defs><path d="M10,0C10.5523,0,11,0.447715,11,1L11,4C11,4.55228,10.5523,5,10,5C9.44771,5,9,4.55228,9,4L9,1C9,0.447715,9.44771,0,10,0ZM10,15C10.5523,15,11,15.4477,11,16L11,19C11,19.5523,10.5523,20,10,20C9.44771,20,9,19.5523,9,19L9,16C9,15.4477,9.44771,15,10,15ZM20,10C20,10.5523,19.5523,11,19,11L16,11C15.4477,11,15,10.5523,15,10C15,9.44771,15.4477,9,16,9L19,9C19.5523,9,20,9.44771,20,10ZM5,10C5,10.5523,4.55228,11,4,11L1,11C0.447715,11,0,10.5523,0,10C0,9.44771,0.447715,9,1,9L4,9C4.55228,9,5,9.44771,5,10ZM17.071,17.071C16.6805,17.4614,16.0475,17.4614,15.657,17.071L13.536,14.95C13.157,14.5576,13.1625,13.9339,13.5482,13.5482C13.9339,13.1625,14.5576,13.157,14.95,13.536L17.071,15.656C17.462,16.0466,17.462,16.6804,17.071,17.071ZM6.464,6.464C6.0735,6.85438,5.4405,6.85438,5.05,6.464L2.93,4.344C2.53926,3.95353,2.53903,3.32024,2.9295,2.9295C3.31997,2.53876,3.95326,2.53853,4.344,2.929L6.464,5.05C6.85438,5.4405,6.85438,6.0735,6.464,6.464ZM2.93,17.071C2.53962,16.6805,2.53962,16.0475,2.93,15.657L5.051,13.536C5.4394,13.1339,6.08206,13.1283,6.47739,13.5236C6.87273,13.9189,6.86714,14.5616,6.465,14.95L4.345,17.071C3.95439,17.462,3.32061,17.462,2.93,17.071ZM13.536,6.464C13.1456,6.0735,13.1456,5.4405,13.536,5.05L15.656,2.929C16.0465,2.53826,16.6798,2.53803,17.0705,2.9285C17.4612,3.31897,17.4615,3.95226,17.071,4.343L14.95,6.464C14.5595,6.85438,13.9265,6.85438,13.536,6.464Z" fill="url(#master_svg0_9_280)" fill-opacity="1"/>',
    lock: params?.lock || true,
    svgViewBox: '0 0 20 20',
    text: params?.text || '加载中...',
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
    const userStroe = useUserStore()
    let amount = 0
    const res = await GetMyLegalAmount({
      currency: 'CNY',
      metaid: userStroe.user!.metaId,
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
    const userStroe = useUserStore()
    let amount = 0
    const res = await GetWalletBalance({
      bizUserNo: userStroe.user!.address!,
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
  const userStroe = useUserStore()
  // 控制是否有权限使用余额支付
  const result = await IsWtiteUser(userStroe.user!.metaId!)
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
      address: userStroe.user!.address!,
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
    const userStroe = useUserStore()
    const cards: BankCardItem[] = []
    const res = await GetBankCards({
      address: userStroe.user!.address,
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
  let isThtottle = true
  return () => {
    if (!isThtottle) return
    isThtottle = false
    setTimeout(() => {
      fn()
      isThtottle = true
    }, delay)
  }
}

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
      // @ts-ignore
      hex: hex,
      fileName: file.name,
      fileType: file.type,
      sha256: encHex.stringify(sha256Algo.finalize()),
      url: URL.createObjectURL(file),
      encrypt,
    })
  })
}
