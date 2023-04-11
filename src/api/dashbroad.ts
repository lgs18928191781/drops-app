import HttpRequest from '@/utils/request'

const Dashbroad = new HttpRequest(`http://localhost:3099/api`).request

export const GetReceiveAddress = (): Promise<apiResponse> => {
  return Dashbroad.get('/api/v1/address')
}
