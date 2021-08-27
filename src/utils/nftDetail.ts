import { NFTApiGetNFTDetail } from "@/api"

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
              const nft: NftItemDetail = {
                foundryName: item.nftIssuer,
                foundryMetaId: item.nftIssueMetaId,
                foundryHead: '',
                amount: item.nftPrice,
                remainingTime: new Date().getTime(),
                nftName: data ? data.nftname : item.nftName,
                classify: data ? data.classifyList : '',
                describe: data ? data.nftdesc : item.nftDesc,
                forgeTime: item.nftTimestamp,
                contractAddress: '',
                tokenId: item.nftGenesis + item.nftTokenIndex,
                ownerName: item.nftOwnerName,
                ownerMetaId: item.nftOwnerMetaId,
                ownerHead: '',
                ownerAddress: item.nftOwnerAddress,
                type: data ? data.nftType : '',
                revenue: '',
                coverUrl: data ? data.nfticon : item.nftIcon,
                tx: data ? data.contentTxId : '',
                putAway: false,
                codeHash: item.nftCodehash,
                genesis: item.nftGenesis,
                tokenIndex: item.nftTokenIndex,
                genesisTxId: item.nftGenesisTxId,
                sellTxId: item.nftSellTxId
              }
              resolve(nft)
            } else {
                reject()
            }
        }
    })
}