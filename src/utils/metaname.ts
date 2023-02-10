import { SendMetaNameTransationResult } from '@/@types/sdk'
import { NodeName, SdkPayType } from '@/enum'
import { useUserStore } from '@/stores/user'
import Decimal from 'decimal.js-light'
import { MetaNameReqCode, MetaNameRequestDate, Reqswapargs } from './wallet/hd-wallet'

export function getRegisterOrRenewMetaNameParams(params: {
  op_code: number
  info?: {
    [key: string]: any
    metaid?: string
    mvc?: string
    icon?: string
  }
  years?: number
  reqswapargs: Reqswapargs
  payTo?: Array<{
    address: string
    amount: number
  }>
}) {
  return new Promise<SendMetaNameTransationResult>(async (resolve, reject) => {
    try {
      const userStore = useUserStore()
      const { reqswapargs, years, op_code, info } = params
      const requestIndex = new Decimal(reqswapargs.requestIndex).toString()
      const _params: MetaNameRequestDate = {
        requestIndex,
        years,
      }
      if (op_code === MetaNameReqCode.register) {
        // register
        _params.infos = info
      } else {
        // renew
        _params.nftOutputIndex = 0
        const res = await userStore.showWallet.createBrfcChildNode(
          {
            nodeName: NodeName.NftTransfer,
            data: JSON.stringify({
              receiverAddress: reqswapargs.nftToAddress,
              tokenIndex: reqswapargs.nftTokenIndex,
              codehash: reqswapargs.nftCodeHash,
              genesis: reqswapargs.nftGenesisID,
            }),
          },
          {
            isBroadcast: false,
            payType: SdkPayType.SPACE,
          }
        )

        if (res?.payToAddress?.transaction) {
          await userStore.showWallet.wallet!.provider!.broadcast(
            res?.payToAddress?.transaction.toString()
          )
        }
        if (res?.currentNodeBrfc.transaction) {
          await userStore.showWallet.wallet!.provider!.broadcast(
            res?.currentNodeBrfc?.transaction.toString()
          )
        }
        debugger
        _params.nftRawTx = res!.nft!.transfer?.transaction.toString()
      }
      const registerMetaNameResp = JSON.stringify(_params)
      resolve({
        registerMetaNameResp,
        MvcToAddress: reqswapargs.mvcToAddress,
        NftToAddress: reqswapargs.nftToAddress,
        TxFee: reqswapargs.txFee,
        FeePerYear: reqswapargs.feePerYear,
      })
    } catch (error) {
      reject(error)
    }
  })
}
