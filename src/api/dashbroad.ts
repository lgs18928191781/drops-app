import { UtxoItem } from '@/@types/sdk'
import { useUserStore } from '@/stores/user'
import HttpRequest from '@/utils/request'

const Dashbroad = new HttpRequest(import.meta.env.VITE_Dashbroad_API, {
  header: () => {
    const userStore = useUserStore()
    if (userStore.isAuthorized) {
      return {
        accessKey: userStore.user?.token,
        userName: userStore.userName,
        timestamp: new Date().getTime(),
      }
    } else {
      return {}
    }
  },
  errorHandel: (error: any) => {
    if (error.response && error.response.data && error.response.data.message !== '') {
      return Promise.reject({
        code: error.response.data.statusCode,
        message: error.response.data.message,
      })
    } else {
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  },
}).request

export const CreateBroadcastTask = (params: {
  txId: string
  metaId: string
  hex: string
  protocol: string
  broadcastAt: string
  utxo: {
    txId: string
    metaId: string
    outputIndex: number
    addressIndex: number
    addressType: number
    satoshis: number
    script: string
    address: string
    wif: string
  }
}): Promise<apiResponse> => {
  return Dashbroad.post('/broadcast-tasks', params)
}

export const Utxos = (params?: {
  page?: number
  pageSize?: number
  order?: string
}): Promise<[UtxoItem[], number]> => {
  return Dashbroad.get('/utxos', { params })
}
