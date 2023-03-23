import { ChannelType, MessageType } from '@/enum'
import { Address, HDPrivateKey, PrivateKey, PublicKey, Script } from 'meta-contract/dist/mvc'
import { AttachmentItem } from './hd-wallet'

declare interface Message {
  protocol?: string
  nodeName?: string
  data?: any
  dataType?: string
  contentType?: string
  content?: string
  avatarType: string
  avatarTxId: string
  avatarImage?: string
  metaId?: string
  nickName: string
  timestamp: number
  txId: string
  isMock?: boolean
  mockId?: string
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
  id?: string
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
  channels: Channel[]
  memberTotal?: number
}

declare interface CommunityAuth {
  communityId: string
  ownerMetaId: string
  metaName: string
  signature: string
}

declare interface Channel {
  uuid: string // 用于key,不修改
  id: string
  name: string
  chatSettingType: 0 | 1
  communityId: string
  createUserMetaId: string
  deleteStatus: number
  groupId: string
  metanetId: string
  roomAvatarUrl: string
  roomCodeHash: string
  roomGenesis: string
  roomGenesisSeriesName: string
  roomJoinType: string
  roomLimitAmount: number
  roomName: string
  roomNewestContent: string
  roomNewestMetaId: string
  roomNewestProtocol: string
  roomNewestTimestamp: number
  roomNewestTxId: string
  roomNewestUserName: string
  roomNinePersonHash: string
  roomNote: string
  roomPublicKey: string
  roomStatus: string
  roomType: import('@/enum').ChannelPublicityType
  timestamp: number
  txId: string
  userCount: number
}

declare interface MessageDto {
  type: MessageType
  content: string
  channelId: string
  userName: string
  attachments?: AttachmentItem[]
  originalFileUrl?: any
  channelType?: ChannelType
  replyTx?: string
}

declare interface CryptoInfo {
  hdPrivateKey: HDPrivateKey
  privateKey: PrivateKey
  publicKey: PublicKey
  address: Address
  addressStr: string
  wif: string
  script: Script
  scriptStr: string
  xpub: string
}
