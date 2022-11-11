import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import { IsEncrypt, NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { useTalkStore } from '@/stores/talk'

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
  attachments?: any[]
  originalFileUrl?: any
}

const userStore = useUserStore()
const talkStore = useTalkStore()

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

  // 2.5. mock发送
  const mockMessage = {
    protocol: 'simpleGroupChat',
    contentType: 'text/plain',
    content,
    avatarType: userStore.user?.avatarType || 'undefined',
    avatarTxId: userStore.user?.avatarTxId || 'undefined',
    metaId: userStore.user?.metaId || 'undefined',
    nickName: userStore.user?.name || '',
    timestamp: timestamp * 1000, // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption,
    isMock: true,
  }
  talkStore.$patch(state => {
    state.newMessages.push(mockMessage)
  })

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return '1'
}

const _sendImageMessage = async (messageDto: MessageDto) => {
  const { channelId: groupId, userName: nickName, attachments, originalFileUrl } = messageDto

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

  // 2.5. mock发送
  const mockMessage: Message = {
    protocol: 'SimpleFileGroupChat',
    contentType: fileType,
    content: originalFileUrl,
    avatarType: userStore.user?.avatarType || 'undefined',
    avatarTxId: userStore.user?.avatarTxId || 'undefined',
    metaId: userStore.user?.metaId || 'undefined',
    nickName: userStore.user?.name || '',
    timestamp: timestamp * 1000, // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption: encrypt,
    isMock: true,
  }
  talkStore.$patch(state => {
    state.newMessages.push(mockMessage)
  })

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return
}
