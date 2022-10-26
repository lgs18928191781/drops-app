import HttpRequest from 'request-sdk'

const aggregation = new HttpRequest(import.meta.env.VITE_AggregationBaseUrl, {
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