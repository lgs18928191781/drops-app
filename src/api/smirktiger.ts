import { InviteActivityTag } from '@/enum'
import { isAuthorized, user } from '@/stores/user'
import HttpRequest from 'request-sdk'

const env = import.meta.env

// @ts-ignore
const Smirktiger = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/tigertal`, {
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
