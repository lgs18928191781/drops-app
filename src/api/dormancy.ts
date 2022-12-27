import HttpRequest from '@/utils/request'

// @ts-ignore
const Dormancy = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/dormancy`).request
// const Dormancy = new HttpRequest(`http://localhost:8136`).request

export const GetHaveReciveNFTs = (params: {
  metaId: string
  page: number
  pageSize: number
}): Promise<GetHaveReciveNFTsRes> => {
  return Dormancy.get('/api/nft-status', { params })
}

export const GetGenesisHolders = (params: {
  genesis: string
  page: number
  pageSize: number
}): Promise<GetGenesisHoldersRes> => {
  const { genesis, ..._params } = params
  return Dormancy.get(`/api/nft-holder-stats/${genesis}`, { params: _params })
}

export const GetUserGenesisHolders = (params: {
  genesis: string
  metaId: string
}): Promise<GetGenesisHoldersRes> => {
  return Dormancy.get(`/api/nft-holder-stats/${params.genesis}/${params.metaId}`)
}
