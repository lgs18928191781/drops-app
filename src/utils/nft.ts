import { Chains } from '@/enum'
import { useUserStore } from '@/stores/user'

export function IsMyNFT(nft: GenesisNFTItem | null) {
  let result = false
  const userStore = useUserStore()
  if (nft && userStore.isAuthorized) {
    if (nft.nftChain === Chains.MVC || nft.nftChain === Chains.BSV) {
      console.log(nft.nftOwnerMetaId === userStore.user?.metaId)
      if (nft.nftOwnerMetaId === userStore.user?.metaId) {
        result = true
      }
    } else {
      if (nft.nftOwnerAddress === userStore.user?.evmAddress) {
        result = true
      }
    }
  }
  return result
}

export function IsSale(nft?: GenesisNFTItem | null) {
  let result = false
  if (nft) {
    if (nft.nftIsLegal) {
      if (nft.nftSellState === 0) {
        result = true
      }
    } else {
      if (nft.nftSellState === 0 && nft.nftIsReady) {
        result = true
      }
    }
  }
  return result
}
