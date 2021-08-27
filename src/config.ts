import i18n from '@/utils/i18n'

export const nftTypes = [
    { name: i18n.global.t('image'), value: '1', disabled: false, key: 'image' },
    { name: i18n.global.t('copyright'), value: '3', disabled: false, key: 'copyright' },
    { name: i18n.global.t('inkind'), value: '2', disabled: true, key: 'inkind' }
]
export interface Unit {
    unit: string,
    sats: number
}
export const units: Unit [] = [
    {
      unit: "BSV",
      sats: Math.pow(10, 8),
    },
    {
      unit: "SATS",
      sats: Math.pow(10, 0),
    }
]

export const classifyList = [
  { classify: '艺术' },
  { classify: '纪念卡', disabled: true, },
  { classify: '别名', disabled: true, },
  { classify: '头像', disabled: true, },
  { classify: '权益', disabled: true, },
  { classify: '游戏' },
] 


export const pagination: Pagination = {
  page: 1,
  pageSize: 16,
  loading: false,
  nothing: false
}