import HttpRequest from 'request-sdk'
import { sleep } from '@/utils/util'
import { Channel, Community, CommunityAuth } from '@/@types/talk'

const TalkApi = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/talkAggregation/v3/app`, {
  header: {
    'Content-Type': 'application/json',
  },
}).request

export const getCommunities = async (params?: any): Promise<Community[]> => {
  params = params || {}
  const query = new URLSearchParams(params).toString()

  return TalkApi.get(`/community/list?${query}`).then(res => {
    const _communities = res.data.results.items.map((community: Community) => {
      community.id = community.communityId
      return community
    })

    return _communities
  })
}

export const getCommunityAuth = async (communityId: string): Promise<CommunityAuth> => {
  return TalkApi.get(`/community/${communityId}/auth/info`).then(res => res.data)
}

export const getAtMeChannels = async (params?: any): Promise<any> => {
  params = params || {}
  const metaId = params.metaId

  return TalkApi.get(`/chat/homes/${metaId}`, { data: JSON.stringify(params) }).then(res => {
    return res.data.data.map((channel: any) => {
      const channelSide = channel.from === metaId ? 'to' : 'from'

      channel.name = channel[`${channelSide}Name`]
      channel.id = channel[`${channelSide}`]
      channel.publicKeyStr = channel[`${channelSide}PublicKey`]
      channel.lastMessageTimestamp = channel.timestamp
      channel.lastMessage = '你收到了一条信息'
      channel.pastMessages = []
      channel.newMessages = []

      return channel
    })
  })
}

export const getChannels = async (params: any): Promise<Channel[]> => {
  params = params || {}
  const communityId = params.communityId

  return TalkApi.get(`/community/${communityId}/rooms`, { data: JSON.stringify(params) }).then(
    res => {
      return res.data.results.items.map((channel: any) => {
        channel.id = channel.groupId
        channel.name = channel.roomName
        return channel
      })
    }
  )
}

export const getChannelMessages = async (
  channelId: string,
  params?: any,
  type?: string
): Promise<any> => {
  params = params || {}
  params.pageSize = '50'
  params.page = '1'
  if (type === 'session') {
    const selfMetaId = params.metaId
    const {
      data: { data: messages },
    } = await TalkApi.get(`/chat/${selfMetaId}/${channelId}`, { data: JSON.stringify(params) })

    return messages
  }

  const {
    data: {
      results: { items: messages },
    },
  } = await TalkApi.get(`/room/${channelId}/chats`, params)

  return messages
}

export const getCommunityMembers = (communityId: string): Promise<any> => {
  return TalkApi.get(`/community/${communityId}/persons`).then(res => res.data.results.items)
}

export const getNftSeries = async (metaId: string): Promise<any> => {
  await sleep(1000)
  return [
    {
      name: '假笑虎',
      icon: 'metafile://53ea0f197c9fdc8cbd7730af7c7abcbf493efdc6478f70bae6eb9e1aa78456c2',
      genesis: '123',
      codehash: '1',
    },
    {
      name: 'MetaBot',
      icon: 'metafile://93dbaa37e8fb7f2e7bf47c9bcff73512342e2ef9967470e961bc176d37f4ab47',
      genesis: '456',
      codehash: '1',
    },
    {
      name: '无聊猿',
      icon: 'metafile://5833c1c825aa0e40c2c851c9c215419729ec4d4f505ae97e62638ef63c83d7ce',
      genesis: '789',
      codehash: '1',
    },
  ]
}

export const getFtSeries = async (metaId: string): Promise<any> => {
  await sleep(1000)
  return [
    {
      name: 'MetaCoin',
      icon: 'metafile://53ea0f197c9fdc8cbd7730af7c7abcbf493efdc6478f70bae6eb9e1aa78456c2',
      genesis: '123',
      codehash: '1',
      amount: '100',
    },
    {
      name: 'ShowCoin',
      icon: 'metafile://93dbaa37e8fb7f2e7bf47c9bcff73512342e2ef9967470e961bc176d37f4ab47',
      genesis: '456',
      codehash: '1',
      amount: '123648.12',
    },
    {
      name: 'NullCoin',
      icon: 'metafile://5833c1c825aa0e40c2c851c9c215419729ec4d4f505ae97e62638ef63c83d7ce',
      genesis: '789',
      codehash: '1',
      amount: '6234',
    },
  ]
}
