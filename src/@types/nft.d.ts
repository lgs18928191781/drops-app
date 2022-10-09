
declare interface NftItem{
    name: string,
    amount: number,
    foundryName: string,
    classify: string [],
    tokenId: string,
    coverUrl: string,
    metaId: string
    genesis: string
    tokenIndex: string
    codehash: string
    total?: number
    hasCount?: number
    putAway?: boolean
    productName?: string
    deadlineTime?: number
    head?: string
}
declare interface NftItemDetail{
    foundryName: string,
    foundryMetaId: string,
    foundryHead: string,
    amount: number,
    remainingTime: number,
    nftName: string,
    classify: string [],
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
    ownerAddress: string
    sensibleId: string
    sellContractTxId: string
    sellDesc: string
    issueMetaTxId: string
}