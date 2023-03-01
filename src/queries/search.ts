import { Search } from '@/api/aggregation'
import { sleep } from '@/utils/util'

export const performSearch = async (keyword: string) => {
  const base64ed = Buffer.from(keyword).toString('base64')

  // 至少1秒
  const now = Date.now()
  const users = await Search(base64ed).then(res => {
    return res.data.results.items.slice(0, 5).map((item: any) => {
      return {
        metaId: item.metaId,
        address: item.address,
        name: item.userInfo.name,
        metaName: item.userInfo.metaName,
        avatarImage: item.userInfo.avatarImage,
      }
    })
  })

  // 至少1秒
  const minTime = 1000
  const wait = minTime - (Date.now() - now)
  if (wait > 0) {
    await sleep(wait)
  }

  return users
}
