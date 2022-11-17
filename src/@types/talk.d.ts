declare interface Message {
  protocol?: string
  nodeName?: string
  data?: any
  dataType?: string
  contentType?: string
  content?: string
  avatarType: string
  avatarTxId: string
  metaId?: string
  nickName: string
  timestamp: number
  txId: string
  isMock?: boolean
  encryption?: string
  to?: string
}

declare interface TalkError {
  message: string
  type?: string
  code?: number
  timestamp?: number
}

declare interface Contact {
  metaId: string
  name: string
  avatarType?: string
  avatarTxId?: string
  lastMessage: string
  lastMessageTimestamp: number
}
