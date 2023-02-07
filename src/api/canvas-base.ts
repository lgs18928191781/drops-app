import HttpRequest from '@/utils/request'
const Canvas = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/canvas-base`).request

export const GetMetaNameCover = (metaname: string) => {
  return Canvas.get(`/v1/metaname/image`, { params: { name: metaname }, responseType: 'blob' })
}
