import HttpRequest from 'request-sdk'
import messages from './mockMessages.json'
import members from './mockMembers.json'
import { sleep } from '@/utils/util'
const env = import.meta.env

// const TalkApi = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/talkAggregation`, {
const TalkApi = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/talkAggregation/v2/app/room`, {
  header: {
    'Content-Type': 'application/json',
    // accessKey: () => (isAuthorized.value ? user.value!.token! : undefined),
    // userName: () => {
    //   if (isAuthorized) {
    //     return user.value!.userType === 'email' ? user.value!.email! : user.value!.phone!
    //   }
    // },
    // timestamp: () => new Date().getTime(),
  },
}).request

export const getCommunities = (data: any): Promise<any> => {
  const communities = [
    {
      id: 1,
      updatedAt: 1666684283,
    },
    {
      id: 2,
      updatedAt: 1666683283,
    },
  ]

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(communities)
    }, 1000)
  })
}

export const getChannels = (): Promise<any> => {
  const channels = [
    {
      id: 1,
      updatedAt: 1666684283,
    },
    {
      id: 2,
      updatedAt: 1666683283,
    },
  ]

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(channels)
    }, 1000)
  })
}

export const getChannelMessages = async (channelId: string, params?: any): Promise<any> => {
  params = params || {}
  params.metaId = '261562cd13734c7e9f3809e32d3d7c56f0b27788f88d6738fc95f96ddb89eb01'
  params.pageSize = '50'
  params.page = '1'
  params.groupId = channelId

  return TalkApi.post(`/getRoomChatList`, params)
}

export const getChannelMembers = (channelId: string): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(members)
    }, 1000)
  })
}
