import { GetNFT } from '@/api/aggregation'

type Solution = 'metacontract' | 'ens'

const solutionChainMapping = {
  metacontract: 'mvc',
  ens: 'eth',
}

export async function getCommunityOwnerByMetaNameNft(metaName: string) {
  // 解析metaName
  const [solution, nft] = metaName.split('://') as [Solution, string]
  const [codehash, genesis, tokenIndex] = nft.split('/')
  const chain = solutionChainMapping[solution]
  const {
    data: {
      results: {
        items: { 0: metaNameNft },
      },
    },
  } = await GetNFT({ codehash, genesis, tokenIndex, chain })

  if (!metaNameNft) {
    throw new Error('MetaName not found')
  }

  const { nftOwnerUserInfo } = metaNameNft

  if (!nftOwnerUserInfo) {
    throw new Error('MetaName owner not found')
  }

  const owner: typeof nftOwnerUserInfo & { metaId: string } = {
    ...nftOwnerUserInfo,
    metaId: metaNameNft.nftOwnerMetaId,
  }

  return owner
}
