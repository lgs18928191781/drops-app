import { GetUserFollow } from '@/api/aggregation'

export async function getFollowings(metaId: string) {
  const {
    data: { followingList: followings },
  } = await GetUserFollow(metaId)

  return followings
}
