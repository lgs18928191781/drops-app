import HttpRequest from '@/utils/request'

const Dashbroad = new HttpRequest(`http://localhost:3099/api`, {
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
