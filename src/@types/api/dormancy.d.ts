declare interface GetHaveReciveNFTsRes {
  id: number
  createdAt: string
  updatedAt: string
  metaId: string
  transferType: string
  transferStatus: string
  fromAddress: string
  toAddress: string
  transferTxId: null | string
  genesis: string
  codehash: string
  tokenIndex: number
}

declare interface GetHaveReciveNFTsRes extends apiResponse {
  data: GetHaveReciveNFTsRes[]
}

declare interface GetGenesisHoldersResItem {
  address: string
  name: string
  avatar: string
  avatarType: string
  metaId: string
  credits: string
}
declare interface GetGenesisHoldersRes extends apiResponse {
  data: GetGenesisHoldersResItem[]
}
