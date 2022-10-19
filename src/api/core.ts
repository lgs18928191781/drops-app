import { useUserStore } from '@/stores/user'
import HttpRequest from 'request-sdk'

const userStore = useUserStore()

// @ts-ignore
const Core = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/showpaycore`, {
  header: {
    accessKey: () => (userStore.isAuthorized ? userStore.user!.token! : undefined),
    userName: () => {
      if (userStore.isAuthorized) {
        return userStore.user!.userType === 'email'
          ? userStore.user!.email!
          : userStore.user!.phone!
      }
    },
    timestamp: () => new Date().getTime(),
  },
}).request

export const UpdateUserInfo = (): Promise<apiResponse> => {
  const params = {
    userType: userStore.user!.userType,
    phone: userStore.user!.phone ? userStore.user!.phone : undefined,
    email: userStore.user!.email ? userStore.user!.email : undefined,
  }
  return Core.post('/api/v1/user/setuserinfo', params)
}
