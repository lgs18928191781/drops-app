import HttpRequest from 'request-sdk'
import members from './mockMembers.json'
import { sleep } from '@/utils/util'

const TalkApi = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/talkAggregation/v3/app`, {
  header: {
    'Content-Type': 'application/json',
  },
}).request

export const getCommunities = async (params?: any): Promise<Community[]> => {
  const communities = [
    {
      id: '123',
      address: '123',
      admins: ['123'],
      cover: '123',
      description: '123',
      metaId: '123',
      metaName: '123',
      metaNameNft: '123',
      metanetId: '123',
      name: '123',
      publicKey: '123',
      reserved: '123',
      timestamp: 123,
      txId: '123',
      zeroAddress: '123',
      icon: '123',
    },
  ]

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(communities)
    }, 1000)
  })

  params = params || {}

  return TalkApi.get(`/community/list`, { data: JSON.stringify(params) })
}

// 获取会话列表
export const getAtMeChannels = async (params?: any): Promise<any> => {
  params = params || {}
  const metaId = params.metaId

  return TalkApi.get(`/chat/homes/${metaId}`, { data: JSON.stringify(params) })
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

export const getChannelMessages = async (
  channelId: string,
  params?: any,
  type?: string
): Promise<any> => {
  params = params || {}
  params.metaId = '74cc371c55d9fa38fc98467396c22fe6b20bfc3459a11530362fcdb1b6c07c5c'
  params.pageSize = '50'
  params.page = '1'
  params.groupId = channelId

  if (type === 'session') {
    const selfMetaId = params.metaId
    console.log({ channelId })
    const {
      data: { data: messages },
    } = await TalkApi.get(`/chat/${selfMetaId}/${channelId}`, { data: JSON.stringify(params) })

    return messages
  }

  const {
    data: {
      results: { items: messages },
    },
  } = await TalkApi.post(`/room/getRoomChatList`, params)

  return messages
}

export const getChannelMembers = (channelId: string): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(members)
    }, 1000)
  })
}
