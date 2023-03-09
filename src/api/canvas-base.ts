import i18n from '@/utils/i18n'
import HttpRequest from '@/utils/request'
const Canvas = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/canvas-base`, {
  errorHandel: (error: any) => {
    if (error?.response?.status === 400) {
      // @ts-ignore
      return Promise.reject(new Error(i18n.global.t('Contains unsupported characters')))
    } else {
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  },
}).request

export const GetMetaNameCover = (metaname: string) => {
  return Canvas.get(`/v1/metaname/image`, { params: { name: metaname }, responseType: 'blob' })
}
