
declare interface NftItem{
    name: string,
    amount: number,
    foundryName: string,
    classify: string,
    head?: string,
    tokenId: string,
    coverUrl: string,
    putAway?: boolean
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
    revenue: string
}