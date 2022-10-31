import HttpRequest from 'request-sdk'
import messages from './mockMessages.json'
import members from './mockMembers.json'
import { sleep } from '@/utils/util'
const env = import.meta.env

// const TalkApi = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/talkAggregation`, {
const TalkApi = new HttpRequest(`${import.meta.env.VITE_BSV_API}/talkAggregation/v2/app/room`, {
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

export const getServers = (data: any): Promise<any> => {
  const servers = [
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
      resolve(servers)
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

export const getChannelMessages = async (channelId: string): Promise<any> => {
  return TalkApi.get(`/getRoomChatList/${channelId}`, {
    params: {
      metaId: '261562cd13734c7e9f3809e32d3d7c56f0b27788f88d6738fc95f96ddb89eb01',
      pageSize: 50,
    },
  })
}

export const getChannelMembers = (channelId: string): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(members)
    }, 1000)
  })
}
