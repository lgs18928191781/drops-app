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

export enum ChannelType {
  Group = 'group',
  Session = 'session',
}

type MessageDto = {
  type: MessageType
  content: string
  channelId: string
  userName: string
  attachments?: any[]
  originalFileUrl?: any
  channelType?: ChannelType
}

export const sendMessage = async (messageDto: MessageDto) => {
  switch (messageDto.type) {
    case MessageType.Text:
      if (messageDto.channelType === ChannelType.Session) {
        return _sendTextMessageForSession(messageDto)
      }
      return _sendTextMessage(messageDto)
    case MessageType.Image:
      if (messageDto.channelType === ChannelType.Session) {
        // return _sendImageMessageForSession(messageDto)
      }
      return _sendImageMessage(messageDto)
  }
}

export const validateMessage = (message: string) => {
  message = message.trim()

  return message.length > 0 && message.length <= 5000
}

const _sendTextMessage = async (messageDto: MessageDto) => {
  const userStore = useUserStore()
  const talkStore = useTalkStore()
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
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return '1'
}

const _sendTextMessageForSession = async (messageDto: MessageDto) => {
  const userStore = useUserStore()
  const talkStore = useTalkStore()
  const { content, channelId: to } = messageDto

  // 1. 构建协议数据
  // 1.1 to: done
  // 1.2 timestamp
  const timestamp = parseInt(dayjs().format('X'))
  // 1.3 content: done
  // 1.4 contentType
  const contentType = 'text/plain'
  // 1.5 encrypt
  const encrypt = '1'
  const dataCarrier = {
    to,
    timestamp,
    content,
    contentType,
    encrypt,
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.ShowMsg,
    encrypt: IsEncrypt.No,
    dataType: 'application/json',
    data: JSON.stringify(dataCarrier),
  }

  // 2.5. mock发送
  const mockMessage = {
    nodeName: NodeName.ShowMsg,
    dataType: 'application/json',
    data: dataCarrier,
    avatarType: userStore.user?.avatarType || 'undefined',
    avatarTxId: userStore.user?.avatarTxId || 'undefined',
    metaId: userStore.user?.metaId || 'undefined',
    nickName: userStore.user?.name || '',
    timestamp: timestamp * 1000, // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption: encrypt,
    isMock: true,
    to,
  }

  // 查找store中的位置
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return '1'
}

const _sendImageMessage = async (messageDto: MessageDto) => {
  const userStore = useUserStore()
  const talkStore = useTalkStore()
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
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await sdk.createBrfcChildNode(node)

  return
}

export const formatTimestamp = (timestamp: number, i18n: any, showMinutesWhenOld = true) => {
  const day = dayjs(timestamp)
  // 如果是今天，则显示为“今天 hour:minute”
  if (day.isSame(dayjs(), 'day')) {
    return `${day.format('HH:mm')}`
  }

  // 如果是昨天，则显示为“昨天 hour:minute”
  if (day.isSame(dayjs().subtract(1, 'day'), 'day')) {
    return `${i18n.t('Talk.Datetime.yesterday')}${day.format('HH:mm')}`
  }

  // 如果是今年，则显示为“month day hour:minute”
  if (showMinutesWhenOld) {
    if (day.isSame(dayjs(), 'year')) {
      return day.format('MM/DD HH:mm')
    }

    // 如果不是今年，则显示为“year month day hour:minute”
    return day.format('YYYY/MM/DD HH:mm')
  } else {
    if (day.isSame(dayjs(), 'year')) {
      return day.format('MM/DD')
    }

    return day.format('YYYY/MM/DD')
  }
}

export const isFileTooLarge = (file: File) => {
  return file.size > 2 * 1024 * 1024 // 2MB
}

export const isImage = (file: File) => {
  const type = file.type

  return (
    type === 'image/jpeg' || type === 'image/png' || type === 'image/gif' || type === 'image/jpg'
  )
}
