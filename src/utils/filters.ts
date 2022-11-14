// @ts-ignore
import dayjs from 'dayjs'

export function dateTimeFormat(timestamp: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(timestamp).format(format)
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
