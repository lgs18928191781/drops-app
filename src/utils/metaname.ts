import { SendMetaNameTransationResult } from '@/@types/sdk'
import { NodeName, SdkPayType } from '@/enum'
import { useUserStore } from '@/stores/user'
import Decimal from 'decimal.js-light'
import { MetaNameReqCode, MetaNameRequestDate, Reqswapargs } from './wallet/hd-wallet'

export function getMetaNameOperateParams(params: {
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
  return new Promise<SendMetaNameTransationResult | null>(async (resolve, reject) => {
    try {
      const userStore = useUserStore()
      const { reqswapargs, years, op_code, info } = params
      const requestIndex = new Decimal(reqswapargs.requestIndex).toString()
      const _params: MetaNameRequestDate = {
        requestIndex,
        years,
      }
      let isConfirm = true
      if (op_code === MetaNameReqCode.register || op_code === MetaNameReqCode.updataInfo) {
        // register
        _params.infos = info
      }

      if (op_code !== MetaNameReqCode.register) {
        // renew
        _params.nftOutputIndex = 0
        const taskList: any[] = []

        if (op_code === MetaNameReqCode.updataInfo) {
          taskList.push({
            nodeName: NodeName.SendMoney,
            payTo: [
              {
                address: reqswapargs.mvcToAddress,
                amount: reqswapargs.txFee,
              },
            ],
          })
        }

        taskList.push({
          nodeName: NodeName.NftTransfer,
          data: JSON.stringify({
            receiverAddress: reqswapargs.nftToAddress,
            tokenIndex: reqswapargs.nftTokenIndex,
            codehash: reqswapargs.nftCodeHash,
            genesis: reqswapargs.nftGenesisID,
          }),
        })

        const res = await userStore.showWallet.batchCreateBrfcChildNode(taskList, {
          isBroadcast: false,
          payType: SdkPayType.SPACE,
        })
        if (res) {
          if (res?.payToRes?.transaction) {
            await userStore.showWallet.wallet!.provider!.broadcast(
              res?.payToRes?.transaction.toString()
            )
          }
          if (op_code === MetaNameReqCode.updataInfo) {
            _params.mvcOutputIndex = 0
            _params.mvcRawTx = res!.transactionsList[0].sendMoney?.transaction.toString()
          }
          _params.nftRawTx = res!.transactionsList[
            res!.transactionsList.length - 1
          ].nft!.transfer?.transaction.toString()
        } else {
          isConfirm = false
          resolve(null)
        }
      }

      if (isConfirm) {
        let registerMetaNameResp
        if (op_code === MetaNameReqCode.updataInfo) {
          registerMetaNameResp = await userStore.showWallet.wallet!.provider.gzip(
            JSON.stringify(_params)
          )
        } else {
          registerMetaNameResp = JSON.stringify(_params)
        }
        resolve({
          registerMetaNameResp,
          MvcToAddress: reqswapargs.mvcToAddress,
          NftToAddress: reqswapargs.nftToAddress,
          TxFee: reqswapargs.txFee,
          FeePerYear: reqswapargs.feePerYear,
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
