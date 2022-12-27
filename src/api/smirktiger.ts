import { useUserStore } from '@/stores/user'
import HttpRequest from '@/utils/request'

const env = import.meta.env

const userStore = useUserStore()
// @ts-ignore
const Smirktiger = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/tigertal`, {
  header: {
    accessKey: () => (userStore.isAuthorized ? userStore.user?.token! : undefined),
    userName: () => {
      if (userStore.isAuthorized) {
        return userStore.user?.userType === 'email' ? userStore.user.email! : userStore.user?.phone!
      }
    },
    timestamp: () => new Date().getTime(),
  },
}).request

export const getSmirktigerList = (address: string): Promise<any> => {
  const url = `/v1/app/smirktiger/${address}/init`
  return Smirktiger.get(url, {})
}

export const getSmirktigerTypeList = (address: string, type: string): Promise<any> => {
  const url = `/v1/app/smirktiger/${address}/init/${type}`
  return Smirktiger.get(url, {})
}

export const joinSmirktiger = (address: string, data: any): Promise<any> => {
  const url = `/v1/app/smirktiger/${address}/join`
  return Smirktiger.post(url, data)
}

export const emojiJoinSmirktiger = (address: string, data: any): Promise<any> => {
  const url = `/v1/app/smirktiger/${address}/emojijoin`
  return Smirktiger.post(url, data)
}

export const emojiSummarySmirktiger = (address: string): Promise<any> => {
  const url = `/v1/app/smirktiger/${address}/emojisummary`
  return Smirktiger.get(url)
}
