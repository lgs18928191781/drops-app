import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import { encrypt } from './crypto'
import { useEnvStore } from '@/stores/env'
import { IsEncrypt, NodeName } from '@/enum'
import { SDK } from './sdk'
import { Network } from './wallet/hd-wallet'
import { useUserStore } from '@/stores/user'

export enum MessageType {
  Text = 'text',
  Image = 'image',
  NftEmoji = 'nftEmoji',
  OnChainImage = 'onChainImage',
}

type MessageDto = {
  type: MessageType
  content?: string
  channelId: string
  userName: string
  attachments?: any[]
}

const userStore = useUserStore()

export const sendMessage = async (messageDto: MessageDto) => {
  switch (messageDto.type) {
    case MessageType.Text:
      return _sendTextMessage(messageDto)
    case MessageType.Image:
      return _sendImageMessage(messageDto)
  }
}

export const validateMessage = (message: string) => {
  message = message.trim()

  return message.length > 0 && message.length <= 5000
}

const _sendTextMessage = async (messageDto: MessageDto) => {
  const { content, channelId: groupID, userName: nickName } = messageDto

  // 1. 构建协议数据
  // 1.1 groupID: done
  // 1.2 timestamp
  const timestamp = parseInt(dayjs().format('X'))
  // 1.3 nickName: done
  // 1.4 content: done
  // 1.5 contentType
  const contentType = 'text/plain'
  // 1.6 encryption
  const encryption = 'aes'
  const dataCarrier = {
    groupID,
    timestamp,
    nickName,
    content,
    contentType,
    encryption,
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleGroupChat,
    encrypt: IsEncrypt.No,
    payCurrency: 'usd',
    dataType: 'application/json',
    data: JSON.stringify(dataCarrier),
  }

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return '1'
}

const _sendImageMessage = async (messageDto: MessageDto) => {
  const { channelId: groupId, userName: nickName, attachments } = messageDto

  // 1. 构建协议数据
  // 1.1 groupId: done
  // 1.2 timestamp
  const timestamp = parseInt(dayjs().format('X'))
  // 1.3 nickName: done
  // 1.4 fileType
  const file = attachments![0]
  const fileType = file.fileType.split('/')[1]
  // 1.5 encrypt
  const encrypt = '0'
  const attachment = 'metafile://$[0]'
  const dataCarrier = {
    groupId,
    timestamp,
    nickName,
    encrypt,
    fileType,
    attachment,
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleFileGroupChat,
    dataType: 'application/json',
    data: JSON.stringify(dataCarrier),
    attachments,
  }

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return
}

export const chainalize = async (base64Str: string) => {
  const node = {
    nodeName: NodeName.MetaFile,
    encrypt: IsEncrypt.No,
    dataType: 'image/jpeg', // TODO
    encoding: 'binary',
    data: base64Str,
  }

  const sdk = userStore.showWallet
  const res = await sdk.createBrfcChildNode(node)
  if (res) {
    return res.txId
  }

  return ''
}

export function hexToBase64(str: string) {
  if (!str) {
    return ''
  }
  var a = []
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16))
  }
  var binary = ''
  var bytes = new Uint8Array(a)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
