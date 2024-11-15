import { CheckNFTStatus } from '@/api/wxcore'
import { BuyNFTStatus, Chains, NFTSellState, NodeName, SdkPayType } from '@/enum'
import { useUserStore } from '@/stores/user'
import { ElMessageBox,ElMessage } from 'element-plus'
import {useNFTEntity} from '@/hooks/use-nft-entity'
import i18n from './i18n'
import { openLoading } from './util'
import {getNftStatus,submitNftOffSale} from '@/api/mrc721-api'
import {NftOrderState} from '@/data/constants'
import { useConnectionStore } from '@/stores/connection'
export function IsMyNFT(nft: NftItemType | null) {
  
  let result = false
  const userStore = useUserStore()
  if(!userStore.user?.address){
    return result
  }
  if (nft) {
    if (nft?.owner_info?.address == userStore.user?.address || nft.saler_address == userStore.user?.address) {
      result = true
    }
  }
  return result
}

export function IsReady(nft?: NftItemType | null) {
  let result = false
  
  if (nft) {
    if (nft.is_ready) {
      result = true
    }
  }
  return result
  
}

export function IsSale(nft?: NftItemType | null) {
  let result = false
  
  if (nft) {
    if (nft.order_status === 1) {
      result = true
    }
  }
  return result
}

export function isDestory(nft?: NftItemType | null) {
  let result = false
  
  if (nft) {
    if (nft.is_destroy === 1) {
      result = true
    }
  }
  return result
}

export function isNFTCanOperate(params:{
  nftPinid:string
}) {
  return new Promise(async (resolve, reject) => {
    //const result = await CheckNFTStatus(params)
    
    const result =await getNftStatus(params)
    
    if (result?.code === 200) {
      if (result.data.status === NftOrderState.isSaled) {
        // @ts-ignore
        reject(new Error(i18n.global.t('NFT.NFT Has been purchased')))
      } else if (result.data.status === NftOrderState.offSale) {
        reject(new Error(i18n.global.t('NFT.NotCanBuy')))
      } else if (result.data.status === NftOrderState.onSale) {
        resolve(true)
      }else if(result.data.status === NftOrderState.destory){
        reject(new Error(i18n.global.t('NFT.isDestory')))
      }
    }
  })
}

export function NFTOffSale(nft: NftItemType) {
  
  return new Promise<NftItemType | false>(async (resolve, reject) => {
    const userStore = useUserStore()
    const result = await isNFTCanOperate({
      nftPinid:nft.item_pinid
    }).catch(error => {
      reject(error)
    })
    if (result) {
      ElMessageBox.confirm(
        // @ts-ignore
        `${i18n.global.t('offsaleConfirm')} ${nft.nft_name} ?`,
        i18n.global.t('niceWarning'),
        {
          // @ts-ignore
          confirmButtonText: i18n.global.t('confirm'),
          cancelButtonText: i18n.global.t('Cancel'),
          closeOnClickModal: false,
          customStyle:'background:#242227',
          cancelButtonClass: 'main-border',
          confirmButtonClass: 'main-border primary',
        }
      )
        .then(async () => {
          const connectionStore=useConnectionStore()
          const loading = openLoading({ text: i18n.global.t('NFT.OffSaleing') })
      
          try {
            const offsaleRes= await submitNftOffSale({
              salerMetaid: connectionStore.last.user.metaid,
              salerAddress: connectionStore.last.user.address,
              collectionPinid:nft.collection_pinid,
              itemPinid: nft.item_pinid,
              psbtHex:nft.psbt_hex
            })
            if(offsaleRes.code == 200){
            loading.close()
            ElMessage.success(i18n.global.t('NFT.Offsale Success'))
            nft.order_status =3
            nft.sale_price=0
            console.log("nft",nft)
            
            resolve({
              ...nft,
            })
            }else{
              loading.close()
              resolve(false)
            }
          } catch (error) {
           
            loading.close()
            resolve(false)
          }
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

          // // Space 下架
          // const res = await userStore.showWallet
          //   .createBrfcChildNode(
          //     {
          //       nodeName: NodeName.NftCancel,
          //       data: JSON.stringify({
          //         genesis: nft.nftGenesis,
          //         codehash: nft.nftCodehash,
          //         tokenIndex: nft.nftTokenIndex,
          //         sellUtxo: {
          //           txId: nft.nftSellContractTxId,
          //           outputIndex: 0,
          //           sellerAddress: nft.nftOwnerAddress,
          //           price: nft.nftPrice,
          //         },
          //       }),
          //     }
          //     // {
          //     //   payType: SdkPayType.ME,
          //     // }
          //   )
          //   .catch(error => {
          //     ElMessage.error(error.message)
          //     loading.close()
          //   })
          // if (res) {
          //   loading.close()
          //   ElMessage.success(i18n.global.t('NFT.Offsale Success'))
          //   resolve({
          //     ...nft,
          //     nftSellState: NFTSellState.OffSale,
          //     nftPrice: 0,
          //   })
          // } else if (res === null) {
          //   loading.close()
          // }
        })
        .catch(error => {
          resolve(false)
        })
    }
  })
}

export function NFTRedeem(nft: NftOrderType) {
  return new Promise<NftOrderType | false>(async (resolve, reject) => {
    const userStore = useUserStore()
    // const result = await isNFTCanOperate({
    //   nftPinid:nft.item_pinid
    // }).catch(error => {
    //   reject(error)
    // })
/**
 *   <div class="flex flex-col">
          <span >1.${i18n.global.t(`redeemWaring1`)}</span>
            <span class='mt-2'>2.${i18n.global.t(`redeemWaring2`)}</span>
            <span class='mt-2'>${i18n.global.t(`redeemWaring3`)} <span >${nft.mint_price / 10 ** 8}</span> BTC</span>
        </div>
 */


    if (true) {
      ElMessageBox.confirm(
        // @ts-ignore
        `
        123
        `,
        i18n.global.t('niceWarning'),
        {
          // @ts-ignore
          dangerouslyUseHTMLString:false,
          confirmButtonText: i18n.global.t('confirm'),
          cancelButtonText: i18n.global.t('Cancel'),
          closeOnClickModal: false,
          customStyle:'background:#fff',
          cancelButtonClass: 'main-border',
          confirmButtonClass: 'main-border primary',
        }
      )
        .then(async () => {
          const connectionStore=useConnectionStore()
          const loading = openLoading({ text: i18n.global.t('NFT.redeeming') })
          
          try {
            const nftEntity=useNFTEntity()
            
           const redeeemRes=await nftEntity.redeemNft({
            nftPinid:nft.item_pinid,
            collectionPinid:nft.collection_pinid,
            psbtHex:nft.order_id,
            mintPrice:nft.mint_price
           })
           if(redeeemRes.txid){
            loading.close()
            ElMessage.success(i18n.global.t('NFT.redeeem Success'))
            nft.order_status =4
            resolve({
              ...nft,
            })
           }else{
            loading.close()
            resolve(false)
           }
          } catch (error) {
           
            // loading.close()
            // resolve(false)
          }
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

          // // Space 下架
          // const res = await userStore.showWallet
          //   .createBrfcChildNode(
          //     {
          //       nodeName: NodeName.NftCancel,
          //       data: JSON.stringify({
          //         genesis: nft.nftGenesis,
          //         codehash: nft.nftCodehash,
          //         tokenIndex: nft.nftTokenIndex,
          //         sellUtxo: {
          //           txId: nft.nftSellContractTxId,
          //           outputIndex: 0,
          //           sellerAddress: nft.nftOwnerAddress,
          //           price: nft.nftPrice,
          //         },
          //       }),
          //     }
          //     // {
          //     //   payType: SdkPayType.ME,
          //     // }
          //   )
          //   .catch(error => {
          //     ElMessage.error(error.message)
          //     loading.close()
          //   })
          // if (res) {
          //   loading.close()
          //   ElMessage.success(i18n.global.t('NFT.Offsale Success'))
          //   resolve({
          //     ...nft,
          //     nftSellState: NFTSellState.OffSale,
          //     nftPrice: 0,
          //   })
          // } else if (res === null) {
          //   loading.close()
          // }
        })
        .catch(error => {
          resolve(false)
        })
    }
  })
}
