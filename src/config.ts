import i18n from '@/utils/i18n'
import { PayPlatform } from './enum'
import WechatPayIcon from '@/assets/images/wechatTitle.svg?url'
import AliPayIcon from '@/assets/images/alipay-circle.svg?url'
import SandPayIcon from '@/assets/images/sandPay_title.svg?url'
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
  disabled: boolean
  suffix: boolean
}

export const payPlatformList: PayPlatformItem[] = [
  {
    icon: SandPayIcon,
    name: () => {
      // @ts-ignore
      return i18n.global.t('quickPay')
    },
    platform: PayPlatform.UnionPay,
    background: '#FCA63D',
    disabled: false,
    suffix: true,
  },
  {
    icon: WechatPayIcon,
    name: () => {
      return i18n.global.t('wechatpay') as string
    },
    platform: PayPlatform.WechatPay,
    background: '#909399',
    disabled: true,
    suffix: false,
  },
  {
    icon: AliPayIcon,
    name: () => {
      return i18n.global.t('aliPay')
    },
    platform: PayPlatform.AliPay,
    background: '#108EE9',
    disabled: false,
    suffix: false,
  },
]
