import i18n from '@/utils/i18n'
export interface Unit {
  unit: string
  sats: number
}

export enum UnitName {
  BSV = 'BSV',
  SATS = 'SATS',
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

export const pagination: Pagination = {
  page: 1,
  pageSize: 16,
  loading: false,
  nothing: false,
  totalPages: 0,
}
