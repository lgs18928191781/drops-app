import { isAuthorized, user, UserType } from '@/stores/user'
import HttpRequest from 'request-sdk'

// @ts-ignore
const Core = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/showpaycore`, {
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

export const UpdateUserInfo = (): Promise<apiResponse> => {
  const params = {
    userType: user.value?.userType,
    phone: user.value?.phone ? user.value?.phone : undefined,
    email: user.value?.email ? user.value?.email : undefined,
  }
  return Core.post('/api/v1/user/setuserinfo', params)
}
