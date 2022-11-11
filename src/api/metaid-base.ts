import HttpRequest from 'request-sdk'

const MetaIdBase = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/metaid-base`).request

export const GetNFTs = (params: {
  address: string
  chain: string
  limit: string | number
  cursor: string
}): Promise<{
  cursor: string
  status: string
  total: number
  page: number
  page_size: number
  result: {
    amount: string
    block_number: string
    block_number_minted: string
    contract_type: string
    last_metadata_sync: string
    last_token_uri_sync: string
    metadata: string
    minter_address: string
    name: string
    owner_of: string
    symbol: string
    token_address: string
    token_hash: string
    token_id: string
    token_uri: string
  }[]
}> => {
  const { address, ..._params } = params
  return MetaIdBase.get(`/v1/eth/wallet/${address}/nfts`, { params: _params })
}
