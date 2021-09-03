import { GetDeadlineTime, NFTApiGetNFTDetail } from "@/api"
import { setDataStrclassify } from "./util"

export default function NFTDetail (genesis: string, codehash: string, tokenIndex: string) {
    return new Promise<NftItemDetail>(async (resolve, reject) => {
        const res = await NFTApiGetNFTDetail({
            genesis,
            codehash,
            tokenIndex
          }).catch(() => reject())
          if (res?.code === 0) {
            if (res.data.results.items.length > 0) {
              const item = res.data.results.items[0]
              const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : ''
              const deadlineTimeRes = await GetDeadlineTime({
                codeHash: item.nftCodehash,
                genesis: item.nftGenesis,
                tokenIndex: item.nftTokenIndex
              })
              const classify = setDataStrclassify(data)
              const nft: NftItemDetail = {
                foundryName: item.nftIssuer,
                foundryMetaId: item.nftIssueMetaId,
                foundryHead: '',
                amount: item.nftPrice ? item.nftPrice : 0,
                remainingTime: deadlineTimeRes && deadlineTimeRes.data && deadlineTimeRes.data.deadlineTime ? deadlineTimeRes.data.deadlineTime : null,
                nftName: item.nftName ? item.nftName : '--',
                classify: classify,
                describe: item.nftDesc,
                forgeTime: item.nftTimestamp,
                contractAddress: item.nftSensibleId,
                tokenId: item.nftTokenId,
                ownerName: item.nftOwnerName,
                ownerMetaId: item.nftOwnerMetaId,
                ownerHead: '',
                ownerAddress: item.nftOwnerAddress,
                type: data ? data.nftType : '',
                revenue: '',
                coverUrl: item.nftIcon,
                tx: data ? data.contentTxId : '',
                putAway: item.nftIsReady,
                codeHash: item.nftCodehash,
                genesis: item.nftGenesis,
                tokenIndex: item.nftTokenIndex,
                genesisTxId: item.nftGenesisTxId,
                sellTxId: item.nftSellTxId,
                sensibleId: item.nftSensibleId,
                sellContractTxId: item.nftSellContractTxId,
                sellDesc: item.nftSellDesc,
                issueMetaTxId: item.nftIssueMetaTxId
              }
              resolve(nft)
            } else {
                reject()
            }
        }
    })
}