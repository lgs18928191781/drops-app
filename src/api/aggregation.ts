import { PostTag } from '@/stores/buzz/tag'
import HttpRequest from '@/utils/request'

const aggregation = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/aggregation`, {
  header: {
    SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
}).request

const metanameApi = new HttpRequest(`${import.meta.env.VITE_MetaName_BaseApi}`, {}).request

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
  data: UserAllInfo
}> => {
  return aggregation.get(`/v2/app/user/getUserAllInfo/${metaId}`)
}

export const GetUserSimpleInfo = (
  metaId: string
): Promise<{
  code: number
  data: UserAllInfo
}> => {
  return aggregation.get(`/v2/app/user/getUserSimpleInfo/${metaId}`)
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

export const NFTApiGetNFTDetail = (params: {
  tokenIndex: string
  codehash: string
  genesis: string
}): Promise<NFTApiGetNFTDetailRes> => {
  return aggregation.post('/v2/app/sensible/getOneNftSummaryDetail', params)
}

export const GetCertMetaIdList = (): Promise<GetCertMetaIdListRes> => {
  return aggregation.get('/v2/app/nftOnShow/getNosCertificationMetaIdList')
}

export const GetNftHolderList = (params: {
  codehash: string
  genesis: string
  tokenIndex: string
  page: string
  pageSize: string
}): Promise<GetNftHolderListRes> => {
  const { codehash, genesis, tokenIndex, ..._params } = params
  return aggregation.get(
    `/v2/app/nftOnShow/getNftHolderList/${codehash}/${genesis}/${tokenIndex}`,
    {
      params: _params,
    }
  )
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
  subTag?: string
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
    followingList: string[]
    followedList: string[]
    blackList: string[]
    friendList: string[]
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

export const GetNFTs = (params: {
  address: string
  chain?: string
  page: number | string
  pageSize: number | string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: UserNFTItem[]
    }
  }
}> => {
  const { address, ..._params } = params
  return aggregation.get(`/v2/app/show/nft/${address}/summary`, { params: _params })
}

export const GetFTs = (params: {
  address: string
  chain?: string
  page: number | string
  pageSize: number | string
  codehash?: string
  genesis?: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: FungibleToken[]
    }
  }
}> => {
  const { address, ..._params } = params
  return aggregation.get(`/v2/app/show/ft/${address}/summaries`, { params: _params })
}

export const GetBalance = (params: {
  chain: string
  address?: string
  xpub?: string
}): Promise<{
  code: number
  data: {
    balance: number
  }
}> => {
  return aggregation.get(`/v2/app/show/balance`, { params: params })
}

export const GetGenesisNFTs = (params: {
  address: string
  codehash: string
  genesis?: string
  chain?: string
  page: number | string
  pageSize: number | string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: GenesisNFTItem[]
    }
  }
}> => {
  const { address, ..._params } = params
  return aggregation.get(`/v2/app/show/nft/${address}/details`, { params: _params })
}

export const GetNFT = (params: {
  chain?: string
  metaId?: string
  codehash?: string
  genesis: string
  tokenIndex: number | string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: GenesisNFTItem[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/show/nft/info`, { params: params })
}

export const GetFT = (params: {
  chain?: string
  codehash?: string
  genesis: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: FungibleToken[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/show/ft/info`, { params: params })
}

export const GetOneFTFromAddress = (params: {
  address: string
  codehash: string
  genesis?: string
  chain?: string
  page: number | string
  pageSize: number | string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: FungibleToken[]
    }
  }
}> => {
  const { address, ..._params } = params
  return aggregation.get(`/v2/app/show/ft/${address}/details`, { params: _params })
}

export const GetNFTAvatars = (params: {
  chain: string
  page: number
  pageSize: number
  flag?: string
  address: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: NFTAvatarItem[]
    }
  }
}> => {
  const { address, ..._params } = params
  return aggregation.get(`/v2/app/show/pfp/${address}/details`, { params: _params })
}

export const GetBuzzInteractive = (params: {
  buzzTxId: string
  page: number
  pageSize: number
  protocols: string[]
  metaId?: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: BuzzInteractiveItem[]
    }
  }
}> => {
  const { buzzTxId, protocols, ..._params } = params
  return aggregation.get(`/v2/app/show/posts/buzz/${buzzTxId}/interactive?`, {
    params: {
      ..._params,
      protocols: protocols.join(','),
    },
  })
}

export const GetMetaNote = (params: {
  txId: string
  metaId?: string
}): Promise<{
  code: number
  data: MetaNoteItem
}> => {
  const { txId, ..._params } = params
  return aggregation.get(`/v2/app/metaNote/getOneMetaNote/${txId}`, {
    params: _params,
  })
}

export const GetUserBuzzs = (params: {
  isNoEncrypt: boolean
  metaId?: string
  page: number
  pageSize: number
  myMetaId?: string
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
  return aggregation.get(`/v2/app/buzz/getBuzzMySelfList/${metaId}`, { params: _params })
}

export const GetPublishShare = (
  txId: string
): Promise<{
  code: number
  data: PublishShareItem
}> => {
  return aggregation.get(`/v2/app/show/posts/share/${txId}/info`)
}

export const GetSellNft = (
  txId: string
): Promise<{
  code: number
  data: SellNftItem
}> => {
  return aggregation.get(`/v2/app/show/posts/nftmarket/${txId}/info`)
}

export const GetMetaIdByAddress = (
  address: string
): Promise<{
  code: number
  data: string
}> => {
  return aggregation.get(`/v2/app/user/metaId/${address}/address/absolute`)
}

export const GetBindMetaidAddressList = (
  metaid: string
): Promise<{
  code: number
  data: {
    thirdPartyAddresses?: string
  }
}> => {
  return aggregation.get(`/v2/app/user/${metaid}/third/addresses`)
}

export const GetGenesis = (params: {
  chain: string
  codehash?: string
  genesis: string
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: UserNFTItem[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/show/nft/summary`, { params })
}

export const GetUserGenesisList = (params: {
  metaId: string
  page: number
  pageSize: number
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: GenesisItem[]
    }
  }
}> => {
  const { metaId, ..._params } = params
  return aggregation.get(`/v2/app/sensible/getMyGenesisList/${metaId}`, { params: _params })
}

export const GetAllAnnouncements = (params: {
  page: number
  pageSize: number
}): Promise<{
  code: number
  data: {
    total: number
    results: {
      items: AnnouncementItem[]
    }
  }
}> => {
  return aggregation.get(`/v2/app/announcement/list`, { params })
}

export const GetOneAnnouncement = (params: {
  txId: string
}): Promise<{
  code: number
  data: AnnouncementItem
}> => {
  const { txId } = params
  return aggregation.get(`/v2/app/announcement/one/${txId}`)
}

export const GetUserMetaNames = (params: {
  address: string
  page: number
  pageSize: number
  flag: string
}): Promise<{
  code: number
  data: {
    total: number
    nextFlag: string
    results: {
      items: MetaNameItem[]
    }
  }
}> => {
  const { address, ..._params } = params
  return aggregation.get(`/v2/app/metaname/${address}/list?`, { params: _params })
}

export const GetCollectionNFTs = (params: {
  topicType: string
  page: number
  pageSize: number
  certificationType?: number
  sortType?: number
  orderType?: number
  sellType?: string
  metaId?: string
  startPrice?: string
  endPrice?: string
  startIndex?: string
  endIndex?: string
  filterIndex?: string
  filterTagList?: string[]
}): Promise<{
  code: number
  data: {
    total: number
    nextFlag: string
    results: {
      items: GenesisNFTItem[]
    }
  }
}> => {
  const { topicType, ..._params } = params
  return aggregation.get(`/v2/app/show/market/topic/${topicType}`, { params: _params })
}
