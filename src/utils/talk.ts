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
  content: string
  channelId: string
  userName: string
}

export const sendMessage = async (messageDto: MessageDto) => {
  if (messageDto.type === MessageType.Text) {
    return await _sendTextMessage(messageDto)
  }
}

export const validateMessage = (message: string) => {
  message = message.trim()

  return message.length > 0 && message.length <= 5000
}

const _sendTextMessage = async (messageDto: MessageDto) => {
  const userStore = useUserStore()

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
    needConfirm: false,
  }

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return '1'
}
