import i18n from '@/utils/i18n'
import HttpRequest from '@/utils/request'

// @ts-ignore
const Strapi = new HttpRequest(import.meta.env.VITE_AdminBaseApi).request

// 查询我的盲盒分类
export const GetBlindboxClassify = (params: {
  [key: string]: number | string
}): Promise<GetBlindboxClassifyItem[]> => {
  return Strapi.get('/blind-boxes', { params })
}

export const GetProdTestMetaIds = (params: {
  [key: string]: any
}): Promise<GetProdTestMetaIdsItem[]> => {
  return Strapi.get('/ruoxi-dev-meta-ids', { params })
}

export const GetBalanceUser = (params: {
  [key: string]: any
}): Promise<GetProdTestMetaIdsItem[]> => {
  return Strapi.get('/ruoxi-balance-pay-users', { params })
}

export const GetBanners = (): Promise<HomeBanner[]> => {
  return Strapi.get('/show-3-home-banners', {
    params: {
      _sort: 'index',
      network: import.meta.env.VITE_NET_WORK,
    },
  })
}

export const GetCollects = (params: {
  _sort?: string
  _limit: number
  _start: number
}): Promise<Collect[]> => {
  return Strapi.get('/show-3-collections', {
    params: {
      _sort: 'index',
      network: import.meta.env.VITE_NET_WORK,
      ...params,
    },
  })
}

export const GetCollect = (id: number | string): Promise<Collect> => {
  return Strapi.get(`/show-3-collections/${id}`)
}
export const GetCollectByTopicType = async (topicType: string): Promise<Collect | undefined> => {
  const res: Collect[] = await Strapi.get(`/show-3-collections`, {
    params: {
      _sort: 'index',
      network: import.meta.env.VITE_NET_WORK,
      topicType,
    },
  })
  if (res.length) {
    return res[0]
  } else {
    ElMessage.error(i18n.global.t('NOT_FOUND'))
  }
}

export const GetHomeHotSeries = (params: {
  _sort?: string
  _limit: number
  _start: number
}): Promise<TypeCollction[]> => {
  return Strapi.get('/show-3-home-hot-series', {
    params: {
      _sort: 'index',
      'show_3_collection.network': import.meta.env.VITE_NET_WORK,
      ...params,
    },
  })
}

export const GetHomeLatestSeries = (params: {
  _sort?: string
  _limit: number
  _start: number
}): Promise<TypeCollction[]> => {
  return Strapi.get('/show-3-home-latest-series', {
    params: {
      _sort: 'index',
      'show_3_collection.network': import.meta.env.VITE_NET_WORK,
      ...params,
    },
  })
}

export const GetClassifyCollects = (params: { [key: string]: any }): Promise<Collect[]> => {
  return Strapi.get('/ruoxi-collects', { params })
}

export const GetClassifyCollectCount = (params: { [key: string]: any }): Promise<number> => {
  return Strapi.get('/ruoxi-collects/count', { params })
}

export const GetClassifies = (params: {
  [key: string]: string | number
}): Promise<MarketClassify[]> => {
  return Strapi.get('/ruoxi-classifies', { params })
}

export const GetActivitys = (params: {
  _sort: string
  _limit: number
  _start: number
}): Promise<HomeActivityItem[]> => {
  return Strapi.get('/ruoxi-v-2-home-activities', { params })
}

export const GetActivityCount = (): Promise<number> => {
  return Strapi.get('/ruoxi-v-2-home-activities/count')
}

export const GetCollectCount = (): Promise<number> => {
  return Strapi.get('/ruoxi-v-2-home-collects/count')
}

export const GetHomeRecomment = (params: {
  _sort: string
  _limit: number
  _start: number
}): Promise<GetHomeRecommentData[]> => {
  return Strapi.get('/ruoxi-home-recomments', { params })
}

export const GetAnnounces = (params: {
  _sort: string
  _limit: number
  _start: number
}): Promise<AnnounceItem[]> => {
  return Strapi.get('/ruoxi-announces', { params })
}

export const GetTemporaryUser = (params?: {
  [key: string]: string
}): Promise<{ metaId: string }[]> => {
  return Strapi.get('/temporary-meta-ids', { params })
}

export const GetMetaEggTask = (params?: { [key: string]: any }): Promise<MetaEggTaskItem[]> => {
  return Strapi.get('/meta-egg-tasks', { params })
}

export interface MetaNameConfig {
  id: number
  isOpen: boolean
  published_at: string
  created_at: string
  updated_at: string
}
export const GetMetaNameConfig = (): Promise<MetaNameConfig> => {
  return Strapi.get('/metaname-config')
}

export const GetCertifiedMetaId = (): Promise<{ data: { list: string[] } }> => {
  return Strapi.get('/certified-meta-id')
}

export interface NFTFeeInfo {
  reated_at: string
  firstSellPlatformFeeRate: number
  firstSellRoyaltyFeeRate: number
  id: number
  network: string
  platformAddress: string
  platformFeeRate: number
  published_at: string
  royaltyFeeRate: number
  updated_at: string
}
export const GetNFTFee = (): Promise<NFTFeeInfo> => {
  return new Promise(async (resolve, reject) => {
    const res: any = await Strapi.get('/nft-fees', {
      params: {
        network: import.meta.env.VITE_NET_WORK,
      },
    }).catch(error => {
      reject(error)
    })
    if (res) {
      resolve(res[0])
    }
  })
}
