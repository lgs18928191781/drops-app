import i18n from '@/utils/i18n'
import { PayPlatform } from './enum'
import WechatPayIcon from '@/assets/images/wechatTitle.svg?url'
import AliPayIcon from '@/assets/images/alipay-circle.svg?url'
import SandPayIcon from '@/assets/images/sandPay_title.svg?url'
import ETHIcon from '@/assets/svg/eth.svg?url'
import MVC from '@/assets/svg/mvc.svg?url'
import POLYGON from '@/assets/svg/polygon.svg?url'

import { useUserStore } from './stores/user'
export interface Unit {
  unit: string
  sats: number
}

export enum UnitName {
  BSV = 'BSV',
  SATS = 'SATS',
  RMB = 'CNY',
}

export enum Platform {
  native = 1,
  app = 2,
  h5 = 3,
  jsapi = 4,
}

export const units: Unit[] = [
  {
    unit: UnitName.BSV,
    sats: 0.00000001,
  },
  {
    unit: UnitName.SATS,
    sats: Math.pow(10, 8),
  },
]

export const classifyList = [
  { classify: 'art' },
  { classify: 'card', disabled: true },
  { classify: 'alias', disabled: true },
  { classify: 'avatar', disabled: true },
  { classify: 'rights', disabled: true },
  { classify: 'game' },
]

export const initPagination: Pagination = {
  page: 1,
  pageSize: 16,
  loading: false,
  nothing: false,
  totalPages: 0,
}

export const classifyName: { [key: string]: string } = {
  fragment: '碎片',
  art: '艺术',
  card: '纪念卡',
  alias: '别名',
  rights: '权益',
  game: '游戏',
  avatar: '头像',
  music: '音乐',
  article: '文章',
  emoji: '表情包',
  background: '背景',
}

export const pagination: Pagination = {
  page: 1,
  pageSize: 16,
  loading: false,
  nothing: false,
}

export interface PayPlatformItem {
  icon: string
  name: () => string
  platform: PayPlatform
  background: string
  disabled: () => boolean
  suffix: boolean
}

export const payPlatformList: PayPlatformItem[] = [
  {
    icon: ETHIcon,
    name: () => {
      // @ts-ignore
      return import.meta.env.VITE_ETH_CHAIN + i18n.global.t('Pay')
    },
    platform: PayPlatform.ETH,
    background: '#108EE9',
    disabled: () => {
      let result = true
      const userStore = useUserStore()
      if (userStore.isAuthorized && userStore.user?.evmAddress) {
        result = false
      }
      return result
    },
    suffix: false,
  },
  {
    icon: SandPayIcon,
    name: () => {
      // @ts-ignore
      return i18n.global.t('quickPay')
    },
    platform: PayPlatform.UnionPay,
    background: '#FCA63D',
    disabled: () => {
      return false
    },
    suffix: true,
  },
  // {
  //   icon: WechatPayIcon,
  //   name: () => {
  //     return i18n.global.t('wechatpay') as string
  //   },
  //   platform: PayPlatform.WechatPay,
  //   background: '#909399',
  //   disabled: () => {
  //     return true
  //   },
  //   suffix: false,
  // },
  // {
  //   icon: AliPayIcon,
  //   name: () => {
  //     return i18n.global.t('aliPay')
  //   },
  //   platform: PayPlatform.AliPay,
  //   background: '#108EE9',
  //   disabled: () => {
  //     return true
  //   },
  //   suffix: false,
  // },
]

export const currentSupportChain: Array<{
  chainId: string
  chainName: string
}> = [
  {
    chainId: '0x1',
    chainName: 'eth',
  },
  {
    chainId: '0x5',
    chainName: 'goerli',
  },
  {
    chainId: '0x89',
    chainName: 'polygon',
  },
  {
    chainId: '0x13881',
    chainName: 'mumbai',
  },
]

export const chains = [
  { name: 'ETH', icon: ETHIcon, value: import.meta.env.VITE_ETH_CHAIN, disabled: () => false },
  {
    name: 'POLYGON',
    icon: POLYGON,
    value: 'polygon',
    disabled: () => {
      return true
    },
  },
  {
    name: 'MVC',
    icon: MVC,
    value: 'mvc',
    disabled: () => {
      const userStore = useUserStore()
      return !(userStore.isAuthorized && userStore.user!.evmAddress)
    },
  },
]
