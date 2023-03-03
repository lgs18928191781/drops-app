import { SendMetaNameTransationResult } from '@/@types/sdk'
import { EnvMode, NodeName, SdkPayType } from '@/enum'
import { useUserStore } from '@/stores/user'
import Decimal from 'decimal.js-light'
import { ElMessage } from 'element-plus'
import i18n from './i18n'
import { emoji } from './reg'
import { bytesLength } from './util'
import { MetaNameReqCode, MetaNameRequestDate, Reqswapargs } from './wallet/hd-wallet'
// @ts-ignore
import namehash from 'eth-ens-namehash'
import { CheckMetaNameValid } from '@/api/wxcore'

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

export const validateMetaName = (value: string) => {
  return new Promise(async resolve => {
    if (value === '') {
      // @ts-ignore
      return ElMessage.error(i18n.global.t('MetaName.MetaName cannot be empty'))
    } else if (value.trim() !== value || /\s/.test(value)) {
      ElMessage.error(`${i18n.global.t('metanameNotAllowSpace')}`)
      resolve(false)
    }
    // else if (emoji.test(value)) {
    //   ElMessage.error(`${i18n.global.t('metanameNotAllowEmoji')}`)
    //   resolve(false)
    // }
    // else if (/[\u4e00-\u9fa5]/.test(value) && import.meta.env.MODE === EnvMode.Mainnet) {
    //   ElMessage.error(`${i18n.global.t('metanameNotAllowCh')}`)
    //   resolve(false)
    // }
    else {
      const testResult = bytesLength(value.trim())
      if (testResult > 0 && testResult <= 2) {
        ElMessage.error(`${i18n.global.t('metanameNotAllowMin')}`)
        resolve(false)
      } else if (testResult > 63) {
        ElMessage.error(`${i18n.global.t('metanameNotAllowOverLenght')}`)
        resolve(false)
      } else {
        let illgelRes: string
        const MetaNameReg = /\./g
        try {
          illgelRes = namehash.normalize(value)
          if (MetaNameReg.test(illgelRes)) {
            resolve(false)
          } else {
            const result = await CheckMetaNameValid(illgelRes)
            if (result) {
              resolve(illgelRes)
            } else {
              ElMessage.error(`${i18n.global.t('inputMetaNameSensitiveWords')}`)
              resolve(false)
            }
          }
        } catch {
          try {
            const { content } = JSON.parse(`{"content":"${value}"}`)
            illgelRes = namehash.normalize(content)
            if (MetaNameReg.test(illgelRes)) {
              resolve(false)
            } else {
              const result = await CheckMetaNameValid(value)
              if (result) {
                resolve(illgelRes)
              } else {
                ElMessage.error(`${i18n.global.t('inputMetaNameSensitiveWords')}`)
                resolve(false)
              }
            }
          } catch (error) {
            ElMessage.error(`${i18n.global.t('inputMetaNameIllgel')}`)
            resolve(false)
          }
        }
      }
    }
  })
}
