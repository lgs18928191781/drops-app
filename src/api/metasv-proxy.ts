import { callMetasvApi } from './index'

export async function getOneNft({
  codehash,
  genesis,
  tokenIndex,
}: {
  codehash: string
  genesis: string
  tokenIndex: string
}) {
  const path = `/contract/nft/genesis/${codehash}/${genesis}/utxo`
  const params = { tokenIndex }
  return callMetasvApi(path, params).then((res: any) => {
    return res[0]
  })
}
