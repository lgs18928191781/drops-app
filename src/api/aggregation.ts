import { PostTag } from '@/stores/buzz/tag'
import HttpRequest from 'request-sdk'

const aggregation = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/aggregation`, {
  header: {
    SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
}).request

export const MetaBotV1 = (params: {
  address: string
  page: number
  pageSize: number
}): Promise<MetaBotRes> => {
  const { address, ...pagination } = params
  return aggregation.get(`/v2/app/metaBot/getMyMetaBotV1List/${address}`, {
    params: pagination,
  })
}

export const MetaBotV2 = (params: {
  address: string
  page: number
  pageSize: number
}): Promise<MetaBotRes> => {
  const { address, ...pagination } = params
  return aggregation.get(`/v2/app/metaBot/getMyMetaBotV2List/${address}`, {
    params: pagination,
  })
}

export const GetUserNFTList = (params: {
  address: string
  page: string
  pageSize: string
}): Promise<GetUserNFTListRes> => {
  return aggregation.post('/v2/app/nftAvatar/getMyNFTAvatarList', params)
}

export const GetGenesisInfo = (params: {
  codehash: string
  genesis: string
}): Promise<GetGenesisInfoRes> => {
  return aggregation.get(`/v2/app/nftOnShow/series/${params.codehash}/${params.genesis}`)
}

export const GetGenesisAddressCount = (params: {
  codehash: string
  genesis: string
  address: string
}): Promise<number> => {
  return new Promise(async resolve => {
    let total = 0
    const res = await aggregation.get(
      `/v2/app/sensible/getMyNftSummaryDetail/${params.codehash}/${params.genesis}/${params.address}/total`
    )
    if (res.code === 0) {
      total = res.data.total
    }
    resolve(total)
  })
}

export const GetHonors = (params: { value: string }): Promise<GetHonorsRes> => {
  return aggregation.get(`/v2/app/honor/nft/${params.value}`)
}

export const GetHotTopics = (params: {
  page: number
  pageSize: number
}): Promise<GetHotTopicsRes> => {
  return aggregation.get('v2/app/tag/getTagList', { params })
}

export const GetTopicbuzzs = (params: {
  page: number
  pageSize: number
  tag: string
}): Promise<GetTopicbuzzsRes> => {
  const { tag, ..._params } = params
  return aggregation.get(`/v2/app/tag/getTagBuzzList/${tag}`, { params: _params })
}

export const GetNFTEmojis = (params: {
  page: number
  pageSize: number
  address: string
}): Promise<GetTopicbuzzsRes> => {
  const { address, ..._params } = params
  return aggregation.get(`/v2/app/nftEmoji/getMyNftEmojiList/${address}`, { params: _params })
}

export const GetUserAllInfo = (
  metaId: string
): Promise<{
  code: number
  data: {
    metaId: string
    metaIdTag: string
    address: string
    pubKey: string
    infoTxId: string
    infoPublicKey: string
    protocolTxId: string
    protocolPublicKey: string
    name: string
    nameEncrypt: string
    phone: string
    phoneEncrypt: string
    email: string
    emailEncrypt: string
    avatarTxId: string
    avatarEncrypt: string
    coverUrl: string
    coverType: string
    coverPublicKey: string
    timestamp: number
  }
}> => {
  return aggregation.get(`/v2/app/user/getUserAllInfo/${metaId}`)
}

export const GetUserInfo = (
  metaId: string
): Promise<{
  code: number
  data: {
    metaId: string
    metaIdTag: string
    address: string
    pubKey: string
    infoTxId: string
    infoPublicKey: string
    protocolTxId: string
    protocolPublicKey: string
    name: string
    nameEncrypt: string
    phone: string
    phoneEncrypt: string
    email: string
    emailEncrypt: string
    avatarTxId: string
    avatarEncrypt: string
    coverUrl: string
    coverType: string
    coverPublicKey: string
    timestamp: number
  }
}> => {
  return aggregation.get(`/v2/app/user/getUserInfo/${metaId}`)
}

export const GetHomeBuzzs = (params: {
  metaId?: string
  page: string | number
  pageSize: string | number
  timestamp: number
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: BuzzItem[]
    }
  }
}> => {
  const { metaId, ..._params } = params
  return aggregation.get(`/v2/app/buzz/getBuzzHomeList/${metaId}`, { params: _params })
}

export const GetBuzzs = (params: {
  tag: 'timeline' | 'recommendline'
  metaId?: string
  page: string | number
  pageSize: string | number
  timestamp: number
  timeType?: 'today' | 'week' | 'month'
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: BuzzItem[]
    }
  }
}> => {
  const { tag, ..._params } = params
  return aggregation.get(`/v2/app/show/posts/line/${tag}`, { params: _params })
}

export const GetBuzz = (params: {
  txId: string
  metaId?: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: BuzzItem[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/buzz/getOneBuzz/${params.txId}`, {
    params: { metaId: params.metaId },
  })
}

export const GetTagBuzzs = (params: {
  tag: string
  page: string | number
  pageSize: string | number
  metaId?: string
  buzzType?: string
  timeType?: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: BuzzItem[]
    }
  }
}> => {
  const { tag, ..._params } = params
  return aggregation.get(`/v2/app/show/posts/${tag}`, {
    params: _params,
  })
}

export const GetTopicBuzzs = (params: {
  tag: string
  page: string | number
  pageSize: string | number
  metaId?: string
  buzzType?: string
  timeType?: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: BuzzItem[]
    }
  }
}> => {
  const { tag, ..._params } = params
  return aggregation.get(`/v2/app/show/posts/topic/${tag}`, {
    params: _params,
  })
}

export const GetRecommendCommunitys = (params: {
  page: number | string
  pageSize: number | string
  metaId?: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: recommnedCommunity[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/show/recommend/community`, {
    params,
  })
}

export const GetRecommendUsers = (params: {
  page: number | string
  pageSize: number | string
  metaId?: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: RecommnedUser[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/show/recommend/metaId`, {
    params,
  })
}

export const GetPostTags = (): Promise<{
  code: number
  data: {
    total: number
    results: PostTag[]
  }
}> => {
  return aggregation.get(`/v2/app/show/posts/line/tag/info`)
}

export const GetUserFollow = (
  metaId: string
): Promise<{
  code: number
  data: {
    metaId: string
    followingList: []
    followedList: []
    blackList: []
    friendList: []
  }
}> => {
  return aggregation.get(`/v2/app/show/follow/${metaId}`)
}

export const GetMetaFile = (
  params: string[]
): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: MetaFileInfo[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/metaFile/getMetaFile?txIds=${params.join(',')}`)
}
