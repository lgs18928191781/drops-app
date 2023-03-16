import { CheckNFTStatus } from '@/api/wxcore'
import { BuyNFTStatus, Chains, NFTSellState, NodeName, SdkPayType } from '@/enum'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import i18n from './i18n'
import { openLoading } from './util'

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

export function isNFTCanOperate(params: {
  codehash: string
  genesis: string
  tokenIndex: string
  contract: string
  metaId: string
}) {
  return new Promise(async (resolve, reject) => {
    const result = await CheckNFTStatus(params)
    if (result?.code === 0) {
      if (result.data.status === BuyNFTStatus.Purchased) {
        reject(new Error(i18n.global.t('NFT.NFT Has been purchased')))
      } else if (result.data.status === BuyNFTStatus.NotCanBuy) {
        reject(new Error(i18n.global.t('NFT.NotCanBuy')))
      } else if (result.data.status === BuyNFTStatus.CanBuy) {
        resolve(true)
      }
    }
  })
}

export function NFTOffSale(nft: GenesisNFTItem) {
  return new Promise<GenesisNFTItem | false>(async (resolve, reject) => {
    const userStore = useUserStore()
    const result = await isNFTCanOperate({
      genesis: nft.nftGenesis,
      codehash: nft.nftCodehash,
      tokenIndex: nft.nftTokenIndex,
      contract: nft.nftSellContractTxId,
      metaId: userStore.user!.metaId,
    }).catch(error => reject(error))
    if (result) {
      ElMessageBox.confirm(
        // @ts-ignore
        `${i18n.global.t('offsaleConfirm')} ${nft.nftName} ?`,
        i18n.global.t('niceWarning'),
        {
          // @ts-ignore
          confirmButtonText: i18n.global.t('confirm'),
          cancelButtonText: i18n.global.t('Cancel'),
          closeOnClickModal: false,
          cancelButtonClass: 'main-border',
          confirmButtonClass: 'main-border primary',
        }
      )
        .then(async () => {
          const userStore = useUserStore()
          const loading = openLoading({ text: i18n.global.t('NFT.OffSaleing') })

          // 法币下架

          // const signRes: string = await userStore.showWallet!.sigMessage(
          //   userStore.user!.metaId!,
          //   '0/0'
          // )
          // if (signRes) {
          //   const res = await LegalOffsale({ uuid: nft.nftLegalUuid, sig: signRes })
          //   if (res.code === 0) {
          //     ElMessage.success('下架成功')
          //     resolve(true)
          //   }
          // }

          // Space 下架
          const res = await userStore.showWallet
            .createBrfcChildNode(
              {
                nodeName: NodeName.NftCancel,
                data: JSON.stringify({
                  genesis: nft.nftGenesis,
                  codehash: nft.nftCodehash,
                  tokenIndex: nft.nftTokenIndex,
                  sellUtxo: {
                    txId: nft.nftSellContractTxId,
                    outputIndex: 0,
                    sellerAddress: nft.nftOwnerAddress,
                    price: nft.nftPrice,
                  },
                }),
              },
              {
                payType: SdkPayType.ME,
              }
            )
            .catch(error => {
              ElMessage.error(error.message)
              loading.close()
            })
          if (res) {
            loading.close()
            ElMessage.success(i18n.global.t('NFT.Offsale Success'))
            resolve({
              ...nft,
              nftSellState: NFTSellState.OffSale,
              nftPrice: 0,
            })
          } else if (res === null) {
            loading.close()
          }
        })
        .catch(error => {
          resolve(false)
        })
    }
  })
}
