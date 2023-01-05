import HttpRequest from '@/utils/request'
import { Channel, Community, CommunityAuth } from '@/@types/talk'
import { sleep } from '@/utils/util'

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

export const getMetaNames = async (params?: any): Promise<any[]> => {
  const metaId = params.metaId
  delete params.metaId

  const query = new URLSearchParams(params).toString()

  return TalkApi.get(`/community/auths/${metaId}?${query}`).then(res => {
    return res.data.results.items
  })
}

export const getOneCommunity = async (communityId: string): Promise<Community[]> => {
  return TalkApi.get(`/community/${communityId}`).then(res => {
    const community = res.data
    community.id = community.communityId

    return community
  })
}

export const getCommunityAuth = async (communityId: string): Promise<CommunityAuth> => {
  return TalkApi.get(`/community/${communityId}/auth/info`).then(res => res.data)
}

export const getCommunityMembership = async (communityId: string, metaId: string): Promise<any> => {
  const query = new URLSearchParams({ metaId }).toString()
  return TalkApi.get(`/community/${communityId}/person/info?${query}`).then(res => {
    return res.data.communityState !== -1
  })
}

export const getAtMeChannels = async (params?: any): Promise<any> => {
  params = params || {}
  const metaId = params.metaId

  // return TalkApi.get(`/chat/sessions/${metaId}`, { data: JSON.stringify(params) }).then(res => {
  //   return res.data.data.map((channel: any) => {
  //     const channelSide = channel.from === metaId ? 'to' : 'from'

  //     channel.name = channel[`${channelSide}Name`]
  //     channel.id = channel[`${channelSide}`]
  //     channel.publicKeyStr = channel[`${channelSide}PublicKey`]
  //     channel.lastMessageTimestamp = channel.timestamp
  //     channel.lastMessage = '你收到了一条信息'
  //     channel.pastMessages = []
  //     channel.newMessages = []

  //     return channel
  //   })
  // })

  return TalkApi.get(`/chat/homes/${metaId}`, { data: JSON.stringify(params) }).then(res => {
    return res.data.data.map((channel: any) => {
      const channelSide = channel.from === metaId ? 'to' : 'from'

      channel.name = channel[`${channelSide}Name`]
      channel.id = channel.metaId = channel[`${channelSide}`]
      channel.avatarImage = channel[`${channelSide}AvatarImage`]
      channel.publicKeyStr = channel[`${channelSide}PublicKey`]
      channel.lastMessageTimestamp = channel.timestamp
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
        channel.uuid = channel.txId // 用于key,不修改
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
  params.pageSize = '100'
  params.page = '1'
  const selfMetaId = params.metaId
  delete params.metaId
  const query = new URLSearchParams(params).toString()

  if (type === 'session') {
    const {
      data: { data: messages },
    } = await TalkApi.get(`/chat/${selfMetaId}/${channelId}?${query}`)

    return messages
  }

  const {
    data: {
      results: { items: messages },
    },
  } = await TalkApi.get(`/room/${channelId}/chats?${query}`)

  return messages
}

export const getCommunityMembers = (communityId: string): Promise<any> => {
  const params = {
    pageSize: '100',
    page: '1',
  }
  const query = new URLSearchParams(params).toString()
  return TalkApi.get(`/community/${communityId}/persons?${query}`).then(
    res => res.data.results.items
  )
}

// 红包相关

export const getOneRedPacket = async (params: any): Promise<any> => {
  params = params || {}
  const channelId = params.channelId
  const redPacketId = params.redPacketId
  const query = params.address ? new URLSearchParams({ address: params.address }).toString() : ''

  return TalkApi.get(`/room/${channelId}/redenvelope/${redPacketId}?${query}`).then(res => {
    return res.data
  })
}

export const getRedPacketRemains = async (params: any): Promise<any> => {
  params = params || {}
  const channelId = params.channelId
  const redPacketId = params.redPacketId
  const query = params.address ? new URLSearchParams({ address: params.address }).toString() : ''

  return TalkApi.get(`/room/${channelId}/redenvelope/${redPacketId}/unused?${query}`).then(res => {
    return res.data
  })
}

export const grabRedPacket = async (params: any): Promise<any> => {
  params = params || {}
  const channelId = params.channelId
  const redPacketId = params.redPacketId
  const metaId = params.selfMetaId
  const address = params.address
  const query = new URLSearchParams({ metaId, address }).toString()

  return TalkApi.get(`/room/${channelId}/gift/${redPacketId}?${query}`).then(res => {
    console.log(res)
  })
}
