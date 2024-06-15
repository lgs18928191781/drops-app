import { useConnectionStore } from '@/stores/connection'
import HttpRequest from '@/utils/request'
 //
const follow = new HttpRequest(`http://localhost:5173/followapi`, {
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
  return follow.get(`/metaid/followingList/${connectStore.last.metaid}`)
}

export const FollowMe = (): Promise<MyFollowList> => {
  const connectStore = useConnectionStore()
  return follow.get(`/metaid/followerList/${connectStore.last.metaid}`)
}

export const FollowInfo = (params: {
  metaId: string //被follow的metaid
  followerMetaId: string //用户的metaid
}): Promise<FollowInfo> => {
  return follow.get(`/follow/record`, { params })
}


