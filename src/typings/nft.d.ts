
declare interface NftItem{
    name: string,
    amount: number,
    foundryName: string,
    classify: string,
    head?: string,
    tokenId: string,
    coverUrl: string,
    putAway?: boolean,
    metaId: string
    productName?: string
}
declare interface NftItemDetail{
    foundryName: string,
    foundryMetaId: string,
    foundryHead: string,
    amount: number,
    remainingTime: number,
    nftName: string,
    classify: string,
    describe: string,
    forgeTime: number,
    contractAddress: string,
    tokenId: string,
    ownerName: string,
    ownerMetaId: string,
    ownerHead: string,
    type: string,
    revenue: string,
    coverUrl: string,
    tx: string,
    putAway: boolean
    codeHash: string
    genesis: string
    tokenIndex: string
    genesisTxId: string
    sellTxId: string
}