import HttpRequest from 'request-sdk'

const MetaIdBase = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/metaid-base/`).request

export const GetNFTs = (params: { address: string }): Promise<GetLegalBuyNft> => {
  return MetaIdBase.get(`/v1/eth/wallet/${params.address}/nfts`)
}
