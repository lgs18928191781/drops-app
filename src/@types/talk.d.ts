import { ChannelType, MessageType } from '@/enum'

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

declare interface Community {
  id: string
  communityId: string
  address: string
  admins: string[]
  cover: string
  description: string
  metaId: string
  metaName: string
  metaNameNft: string
  metanetId: string
  name: string
  publicKey: string
  reserved: string
  timestamp: number
  txId: string
  zeroAddress: string
  icon: string
}

declare interface CommunityAuth {
  communityId: string
  ownerMetaId: string
  metaName: string
  signature: string
}

declare interface Channel {
  id: string
  communityId?: string
  address: string
  admins: string[]
  cover: string
  description: string
  metaId: string
  metaName: string
  metaNameNft: string
  metanetId: string
  name: string
  publicKey: string
  reserved: string
  timestamp: number
  txId: string
  zeroAddress: string
  icon: string
}

declare interface MessageDto {
  type: MessageType
  content: string
  channelId: string
  userName: string
  attachments?: any[]
  originalFileUrl?: any
  channelType?: ChannelType
}
