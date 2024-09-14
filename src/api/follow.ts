import { useConnectionStore } from '@/stores/connection'
import HttpRequest from '@/utils/request'
import { useNetworkStore } from '@/stores/network'
////
const follow = new HttpRequest(`${import.meta.env.VITE_PROXY_URL}`, {
  header: {
    SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 1 || response.data.code === 601) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.data,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const MyFollow = (): Promise<MyFollowList> => {
  const connectStore = useConnectionStore()
  const networkStore = useNetworkStore()
  
  return follow.get(`/followingList`, {
    params: {
      metaid: connectStore.last.metaid,
      network: networkStore.network,
    },
  })
}

export const FollowMe = (): Promise<MyFollowList> => {
  const connectStore = useConnectionStore()
  const networkStore = useNetworkStore()
  return follow.get(`/followerList`, {
    params: {
      metaid: connectStore.last.metaid,
      network: networkStore.network,
    },
  })
}

export const FollowInfo = (params: {
  metaId: string //被follow的metaid
  followerMetaId: string //用户的metaid
}): Promise<FollowInfo> => {
  const networkStore = useNetworkStore()
  return follow.get(`/follow/record`, { ...params, network: networkStore.network })
}
