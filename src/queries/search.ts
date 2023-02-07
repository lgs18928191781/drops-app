import { sleep } from '@/utils/util'
import { useQuery } from '@tanstack/vue-query'

const performSearch = async (keyword: string) => {
  const data = await new Promise(async resolve => {
    await sleep(3000)

    resolve([
      {
        metaId: '123',
        name: 'aha',
        avatar: 'https://avatars.githubusercontent.com/u/12668546?v=4',
      },
      {
        metaId: '123',
        name: 'aha',
        avatar: 'https://avatars.githubusercontent.com/u/12668546?v=4',
      },
    ])
  })

  return data
}

export const useSearchQuery = (keyword: string) =>
  useQuery({
    queryKey: ['searchResults', { keyword }],
    // queryFn: () => fetchChannels(community, state),
  })
