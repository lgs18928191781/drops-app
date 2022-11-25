// @ts-ignore
import dayjs from 'dayjs'
import { Decimal } from 'decimal.js'
import { useRootStore } from '@/stores/root'
const RootStore = useRootStore()
export function dateTimeFormat(timestamp: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp) {
    return null
  }
  return dayjs(timestamp).format(format)
}

export function legalNftConverterCNY(amount: number | string) {
  if (amount) {
    let cnyPrice = new Decimal(amount)
      .div(100)
      .toNumber()
      .toFixed(2)
    return +cnyPrice < 0.01 ? 0.01 : cnyPrice
  } else {
    return '--'
  }
}

export function converterBSV(amount: number | string) {
  if (amount) {
    return new Decimal(amount).div(10 ** 8).toNumber()
  } else {
    return '--'
  }
}

export function converterCNY(amount: number | string) {
  if (amount) {
    let cnyPrice = (
      new Decimal(amount).div(10 ** 8).toNumber() * RootStore.exchangeRate.cnyRate
    ).toFixed(2)
    return +cnyPrice < 0.01 ? 0.01 : cnyPrice
  } else {
    return '--'
  }
}

export function legalNftConverterBSV(amount: number | string) {
  if (amount) {
    return parseFloat(
      new Decimal(amount)
        .div(100)
        .div(RootStore.exchangeRate.cnyRate)
        .toNumber()
        .toFixed(8)
    )
  } else {
    return '--'
  }
}

export function bsv(stas: number | string) {
  if (typeof stas === 'undefined') return 0

  return new Decimal(stas).div(Math.pow(10, 8)).toNumber()
}

export function metafile(metafile: string, width = 235, type: 'metafile' | 'metaId' = 'metafile') {
  if (typeof metafile !== 'string') return ''
  if (metafile.indexOf('http://') !== -1 || metafile.indexOf('https://') !== -1) return metafile
  metafile = metafile.replace('metafile://', '')
  metafile = metafile.replace('sensible://', 'sensible/')
  if (metafile === '') return ''
  let path = ''
  if (metafile.indexOf('ipfs://') !== -1) {
    // ETH 图片地址
    path = '/metafile/eth/ipfs/'
  } else if (type === 'metaId') {
    // metaId
    path = '/metafile/avatar/'
  } else {
    //  普通txId
    path = '/metafile/'
  }
  const fileUrl = `${import.meta.env.VITE_AppImgApi}${path}${metafile.replace('ipfs://', '')}`
  if (width === -1) {
    return fileUrl
  }
  let query = 'x-oss-process=image/auto-orient,1/quality,q_80'
  if (width) {
    query += `/resize,m_lfit,w_${width}`
  }
  return `${fileUrl}?${query}`
}
