import HttpRequest from 'request-sdk'
import { sleep } from '@/utils/util'

const TalkApi = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/talkAggregation/v3/app`, {
  header: {
    'Content-Type': 'application/json',
  },
}).request

export const getCommunities = async (params?: any): Promise<Community[]> => {
  params = params || {}

  return TalkApi.get(`/community/list`, { data: JSON.stringify(params) }).then(res => {
    const _communities = res.data.results.items.map((community: Community) => {
      community.id = community.metanetId
      return community
    })

    return _communities
  })
}

export const getCommunityAuth = async (communityId: string): Promise<CommunityAuth> => {
  return TalkApi.get(`/community/${communityId}/auth/info`).then(res => res.data)
}

// 获取会话列表
export const getAtMeChannels = async (params?: any): Promise<any> => {
  params = params || {}
  const metaId = params.metaId

  return TalkApi.get(`/chat/homes/${metaId}`, { data: JSON.stringify(params) })
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
  } = await TalkApi.get(`/room/${channelId}/chats`, params)

  return messages
}

export const getCommunityMembers = (communityId: string): Promise<any> => {
  return TalkApi.get(`/community/${communityId}/persons`).then(res => res.data.results.items)
}
