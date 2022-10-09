declare interface GetHonorsResItem {
  codehash: string
  genesis: string
  issueIcon: string
  issueMetaTxId: string
  issueName: string
  issueTimestamp: number
  issueVersion: string
  issuerAvatarTxId: string
  issuerAvatarType: string
  issuerMetaId: string
  issuerName: string
  nftHash: string
  ownerAddress: string
  ownerAvatarTxId: string
  ownerAvatarType: string
  ownerMetaId: string
  ownerName: string
  part: string
  tokenIndex: string
  age?: string
}

declare interface GetHonorsRes extends apiResponse {
  data: {
    total: number
    results: {
      items: []
    }
  }
}

declare interface GetGenesisInfoRes extends apiResponse {
  data: {
    seriesName: string
  }
}

declare interface GetHotTopicsResItem {
  tag: string
  txTotal: number
}
declare interface GetHotTopicsRes extends apiResponse {
  data: {
    results: {
      items: GetHotTopicsResItem[]
    }
    total: number
  }
}
declare interface GetTopicbuzzsRes extends apiResponse {
  data: {
    results: {
      items: BuzzItem[]
    }
    total: number
  }
}
