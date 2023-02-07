import { sleep } from '@/utils/util'
import { useQuery, useQueryClient } from '@tanstack/vue-query'

export const performSearch = async (keyword: string) => {
  console.log({ keyword })
  const allUsers = [
    {
      metaId: '74cc371c55d9fa38fc98467396c22fe6b20bfc3459a11530362fcdb1b6c07c5c',
      name: 'rr411',
      avatar: 'metafile://a62072ce9235e32abe1f27b3c61aa5087a67b90474fa3909f73f0ce67b97a282',
    },
    {
      metaId: '51cf50b8478df10ce8807b1e758cd181e8443c6825ea042cfe467dc67260685a',
      name: 'Kai',
      avatar: '',
    },
    {
      metaId: 'b616733cd1f516ee3aac6970cd486639fc95dd739bd3541de36da124a833f4d4',
      name: '小狐狸',
      avatar: 'metafile://d973b7bd61bcedbff831ec0d780949e07ca4db8dbe38e9dee8577b7331611e33',
    },
  ]

  const data = allUsers.filter(user => user.metaId.includes(keyword))
  await sleep(1000)

  return data
}

// export const useSearchQuery = (keyword: string, onSettled: Function) =>
//   useQuery({
//     queryKey: ['searchResults', { keyword }],
//     queryFn: () => performSearch(keyword),
//     onSettled,
//   })
