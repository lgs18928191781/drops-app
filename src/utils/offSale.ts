import Decimal from 'decimal.js-light'
import { ElMessage, ElMessageBox } from 'element-plus'
import { store } from '@/store'
import { NftApiCode, OffSale, RemoveDeadlineTime } from '@/api'
import i18n from './i18n'

export default function NftOffSale(nft: NftItemDetail, loading?: any) {
  return new Promise<void>(async (resolve, reject) => {
    const params = {
      codehash: nft.codeHash,
      genesis: nft.genesis,
      tokenIndex: nft.tokenIndex,
      opreturnData: nft.tx,
      genesisTxid: nft.genesisTxId,
      txId: nft.sellTxId,
      satoshis: new Decimal(nft.amount).toNumber(),
      sensibleId: nft.sensibleId
    }
    const useAmountRes = await store.state.sdk?.nftCancel({
      checkOnly: true,
      ...params
    }).catch(() => {
      reject()
    }) 
    if (useAmountRes?.code === 200) {
      const useAmount = useAmountRes.data.amount!
      const userBalanceRes = await store.state.sdk?.getBalance().catch(() => reject())
      if (userBalanceRes && userBalanceRes.code === 200) {
        if (userBalanceRes.data.satoshis > useAmount) {
          // 有足夠钱
          ElMessageBox.confirm(`${i18n.global.t('useAmountTips')}: ${useAmount} SATS`, i18n.global.t('niceWarning'), {
            confirmButtonText: i18n.global.t('confirm'),
            cancelButtonText: i18n.global.t('cancel'),
            closeOnClickModal: false
          }).then(async () => {
            // 确认支付
            const res = await store.state.sdk?.nftCancel(params).catch(() => {
              reject()
            })
            if (res?.code === 200) {
              // 上报服务器 移除时间
              const res = await RemoveDeadlineTime({
                genesis: nft.genesis,
                codeHash: nft.codeHash,
                tokenIndex: nft.tokenIndex,
                deadlineTime: nft.remainingTime
              })
              if (res.code === NftApiCode.success) {
                nft.putAway = false
                ElMessage.success(i18n.global.t('offsale') + i18n.global.t('success'))
              } else {
                ElMessage.error(i18n.global.t('offsale') + i18n.global.t('fail'))
              }
              resolve()

              // 上链 cancel sell 协议 成功后 上报给服务器
              // const res = await OffSale({ tokenId: nft!.tokenId })
              // if (res.code === NftApiCode.success) {
              //   nft.putAway = false
              //   ElMessage.success(i18n.global.t('offsale') + i18n.global.t('success'))
              // } else {
              //   ElMessage.success(i18n.global.t('offsale') + i18n.global.t('fail'))
              // }
              // resolve()
            } else {
              reject()
            }
          })
          .catch(() => reject())
        } else {
          // 余额不足
          if (loading) loading.close()
          ElMessageBox.alert(
            `
            <p>${i18n.global.t('useAmountTips')}: ${useAmount} SATS</p>
            <p>${i18n.global.t('insufficientBalance')}</p>
          `,
            {
              confirmButtonText: i18n.global.t('confirm'),
              dangerouslyUseHTMLString: true,
            }
          )
          return
        }
      } else {
        reject()
      }
    }
  })
}
