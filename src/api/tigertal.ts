import { useUserStore } from '@/stores/user'
import HttpRequest from 'request-sdk'

const userStore = useUserStore()
// @ts-ignore
const Tiger = new HttpRequest(import.meta.env.VITE_BASEAPI + '/tigertal', {
  header: {
    accessKey: () => userStore.token,
    userName: () => userStore.userName,
    timestamp: () => new Date().getTime(),
  },
}).request

export const GetTigerCount = (address: string): Promise<GetTigerCountRes> => {
  return Tiger.get(`/v1/app/smirktiger/${address}/summary`)
}

export const GetTigerList = (address: string): Promise<GetTigerListRes> => {
  return Tiger.get(`/v1/app/smirktiger/${address}/details`)
}
