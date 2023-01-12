import HttpRequest from '@/utils/request'

const metanameApi = new HttpRequest(`${import.meta.env.VITE_MetaName_BaseApi}`, {
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.msg,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

//metaname注册查询
export const GetMetaNameIsRegister = (
  name: string
): Promise<{
  code: number
  data: MetaNameSearchResult
}> => {
  return metanameApi.get(`/getinfo/?name=${name}`)
}
