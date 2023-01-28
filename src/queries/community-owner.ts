import { GetNFT, GetUserAllInfo } from '@/api/aggregation'
import { getCommunityAuth } from '@/api/talk'

type Solution = 'metacontract' | 'ens'

const solutionChainMapping = {
  metacontract: 'mvc',
  ens: 'eth',
}

export async function getCommunityOwner({
  communityId,
  metaName,
}: {
  communityId: string
  metaName: string
}) {
  // 如果没有 metaName，则尝试使用 communityId 作为 兼容查询
  if (!metaName || !metaName.includes('://')) {
    return getCommunityOwnerByCommunityId(communityId)
  }

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

export async function getCommunityOwnerByCommunityId(communityId: string) {
  // 获取拥有者metaId
  const { ownerMetaId } = await getCommunityAuth(communityId)

  // 获取拥有者信息
  const res = await GetUserAllInfo(ownerMetaId)

  const owner = res.data

  return owner
}