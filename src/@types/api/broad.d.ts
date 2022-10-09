declare interface CollectRecord {
  amount: number
  avatarTxId: string
  avatarType: string
  codehash: string
  genesis: string
  icon: string
  metaId: string
  name: string
  recordType: number
  timestamp: number
  tokenIndex: string
}

declare interface GetCollectRecords extends apiResponse {
  data: {
    results: {
      items: CollectRecord[]
    }
    total: number
  }
}
