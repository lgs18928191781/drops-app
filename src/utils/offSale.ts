import Decimal from "decimal.js-light"
import { ElMessage } from 'element-plus'
import { store } from "@/store"
import { NftApiCode, OffSale } from "@/api"
import i18n from "./i18n"


export default function NftOffSale (nft: NftItemDetail) {
    return new Promise<void>(async (resolve, reject) => {
        const params = {
            codehash: nft.codeHash,
            genesis: nft.genesis,
            tokenIndex: nft.tokenIndex,
            opreturnData: nft.tx,
            genesisTxid: nft.genesisTxId,
            txId: nft.sellTxId,
            sellTxId: nft.sellTxId,
            satoshisPrice: new Decimal(nft.amount).mul(10**8).toString()
          }
          const res = await store.state.sdk?.cancelSellNFT(params).catch(() => { reject() })
          if (res && res.code === 200) {
            // 上链 cancel sell 协议 成功后 上报给服务器
            const res = await OffSale({ tokenId: nft!.tokenId})
            if (res.code === NftApiCode.success) {
                nft.putAway = false
              ElMessage.success(i18n.global.t('offsale') + i18n.global.t('success'))
            } else {
              ElMessage.success(i18n.global.t('offsale') + i18n.global.t('fail'))
            }
            resolve()
          } else {
              reject()
          }
    })
}