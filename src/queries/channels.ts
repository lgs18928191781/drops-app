// import { useQuery } from '@tanstack/vue-query'

// type State = 'public' | 'pass'

// const fetchChannels = async (community: string, state: State) => {
//   const { data } = await fetch('/api/channels')
//   return data
// }

// export const useChannelsQuery = (community: string, state: State) =>
//   useQuery({
//     queryKey: ['channels', { community, state }],
//     queryFn: () => fetchChannels(community, state),
//   })
