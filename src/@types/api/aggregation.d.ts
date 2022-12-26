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

declare interface NFTAvatarItem {
  avatarTxId: string
  avatarType: string
  codehash: string
  desc: string
  genesis: string
  genesisId: string
  genesisTxId: string
  icon: string
  issueMetaTxId: string
  issuerName: string
  metaId: string
  metaIdName: string
  metanetId: string
  name: string
  timestamp: number
  tokenId: string
  tokenIndex: string
  txId: string
  website: string
  avatarImage: string
}

declare interface BuzzInteractiveItem {
  amount: number
  avatarImage: string
  avatarTxId: string
  avatarType: string
  blockHeight: number
  buzzTxId: string
  commentCount: number
  confirmState: number
  content: string
  hasComment: boolean
  hasMyLike: boolean
  isValid: boolean
  likeCount: number
  metaId: string
  metanetId: string
  protocol: string
  publicKey: string
  replyTo: string
  replyToAvatarImage: string
  replyToAvatarTxId: string
  replyToAvatarType: string
  replyToUserName: string
  timestamp: number
  txId: string
  userName: string
  zeroAddress: string
  subInteractiveItem: BuzzInteractiveItem[]
  commentTo?: string
}

declare interface MetaNoteItem {
  txId: string
  metaId: string
  metanetId: string
  zeroAddress: string
  address: string
  publicKey: string
  name: string
  avatarTxId: string
  avatarImage: string
  avatarType: string
  isPrivate: string
  title: string
  content: string
  contentType: string
  metaNoteCreateTime: string
  isTop: string
  folderId: string
  folderName: string
  tags: string[]
  attachments: string[]
  headImg: string
  encrypt: string
  version: string
  dataType: string
  encoding: string
  isValid: boolean
  isNew: boolean
  blockHeight: number
  confirmState: number
  timestamp: number
  likeCount: number
  hasLike: boolean
}

declare interface UserAllInfo {
  metaId: string
  metaIdTag: string
  address: string
  pubKey: string
  infoTxId: string
  infoPublicKey: string
  protocolTxId: string
  protocolPublicKey: string
  name: string
  nameEncrypt: string
  phone: string
  phoneEncrypt: string
  email: string
  emailEncrypt: string
  avatarTxId: string
  avatarImage: string
  avatarEncrypt: string
  coverUrl: string
  coverType: string
  coverPublicKey: string
  timestamp: number
}

declare interface PublishShareItem {
  icon: string
  cover: string
  title: string
  detail: string
  shareProtocol: string
  shareId: string
  shareIdType: string
  shareFromMetaID: string
  shareContent: string
  shareContentType: string
  mention: string
}

declare interface SellNftItem {
  chain: string
  codehash: string
  cover: string
  currency: string
  decimalNum: number
  detail: string
  genesis: string
  genesisTag: string
  icon: string
  name: string
  orderId: string
  price: number
  sensibleId: string
  status: number
  title: string
  tokenIndex: string
  tokenIndexInt: number
}
