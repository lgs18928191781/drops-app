declare interface Message {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  metaId?: string
  nickName: string
  timestamp: number
  txId: string
  isMock?: boolean
  encryption?: string
}

declare interface TalkError {
  message: string
  type?: string
  code?: number
  timestamp?: number
}
