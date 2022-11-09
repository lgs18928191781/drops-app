// @ts-ignore
import dayjs from 'dayjs'

export function avatar(showId: string) {
  if (!showId)
    return 'https://testmvc.showmoney.app/metafile/avatar/d96bdf3a76d3db284106aa32137ea1dd145b4202681128ff31f2c4fbe1389498?x-oss-process=image/auto-orient,1/resize,m_fill,w_128,h_128/quality,q_90&time=1667987226654'
  return `${import.meta.env.VITE_AppImgApi}/metafile/avatar/${showId}?time=${new Date().getTime()}`
}

export function dateTimeFormat(timestamp: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(timestamp).format(format)
}

export function metafile(metafile: string, width = 235) {
  if (typeof metafile !== 'string') return ''
  if (metafile.indexOf('http://') !== -1 || metafile.indexOf('https://') !== -1) return metafile
  metafile = metafile.replace('metafile://', '')
  metafile = metafile.replace('sensible://', 'sensible/')
  if (metafile === '') return ''
  const fileUrl = `${import.meta.env.VITE_SHOWMANURL}/metafile/${metafile}`
  if (width === -1) {
    return fileUrl
  }
  let query = 'x-oss-process=image/auto-orient,1/quality,q_80'
  if (width) {
    query += `/resize,m_lfit,w_${width}`
  }
  console.log(`${fileUrl}?${query}`)
  return `${fileUrl}?${query}`
}
