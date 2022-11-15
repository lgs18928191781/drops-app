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

const serviceApi = new HttpRequest(
  `${import.meta.env.VITE_BASEAPI}/serviceapi/api/v1/showService`,
  {
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
  }
).request

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

// 获取会话列表
export const getSessions = async (params?: any): Promise<any> => {
  params = params || {}
  params.showId = '74cc371c55d9fa38fc98467396c22fe6b20bfc3459a11530362fcdb1b6c07c5c'
  params.address = 'myPqtRpy1Ay65U5RmwX5q2sjXqcjDRCyVx'
  params.xpub =
    'tpubDC5etPJ6j9TguBb1x8VhuKyEn9HZTY2sqA4rBbKkukvpnz8KDLg6119R6yZao32QmBBj3dqWT9NdU7L5f52ouXbtEEEUj3MEnonnzTrxuh6'
  params.pageSize = 50
  params.page = 1

  return serviceApi.post(`/getHomeHistoryFast`, { data: JSON.stringify(params) })
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
  params.metaId = '74cc371c55d9fa38fc98467396c22fe6b20bfc3459a11530362fcdb1b6c07c5c'
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
