import { isAuthorized, user } from '@/stores/user'
import HttpRequest from 'request-sdk'
// @ts-ignore
const Tiger = new HttpRequest(import.meta.env.VITE_BASEAPI + '/tigertal', {
  header: {
    accessKey: () => (isAuthorized.value ? user.value!.token! : undefined),
    userName: () => {
      if (isAuthorized) {
        return user.value!.userType === 'email' ? user.value!.email! : user.value!.phone!
      }
    },
    timestamp: () => new Date().getTime(),
  },
}).request

export const GetTigerCount = (address: string): Promise<GetTigerCountRes> => {
  return Tiger.get(`/v1/app/smirktiger/${address}/summary`)
}

export const GetTigerList = (address: string): Promise<GetTigerListRes> => {
  return Tiger.get(`/v1/app/smirktiger/${address}/details`)
}
