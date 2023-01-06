import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import {
  ChannelType,
  CommunityJoinAction,
  GroupChannelType,
  IsEncrypt,
  MessageType,
  NodeName,
  RedPacketDistributeType,
  SdkPayType,
} from '@/enum'
import { useUserStore } from '@/stores/user'
import { useTalkStore } from '@/stores/talk'
import { SDK } from './sdk'
import { FileToAttachmentItem, getTimestampInSeconds, realRandomString } from './util'
import { Message, MessageDto } from '@/@types/talk'
import { buildCryptoInfo, decrypt, encrypt, MD5Hash } from './crypto'
import Decimal from 'decimal.js-light'
import { TxComposer } from 'meta-contract/dist/tx-composer'
import { Address } from 'meta-contract/dist/mvc'
import { DEFAULTS } from './wallet/hd-wallet'
import { useJobsStore } from '@/stores/jobs'
import { ElMessage } from 'element-plus'

export const createCommunity = async (form: any, userStore: any, sdk: SDK) => {
  console.log('start')
  // communityId, name, description, cover, metaName, mateNameNft, admins, reserved, icon
  const { icon, metaName, description, cover } = form
  const communityId = metaName.communityId
  const reserved = metaName.signature

  const attachments = []
  attachments.push(await FileToAttachmentItem(icon))
  const iconPlaceholder = 'metafile://$[0]'

  let coverPlaceholder = null

  if (cover) {
    coverPlaceholder = 'metafile://$[1]'
    attachments.push(await FileToAttachmentItem(cover))
  }

  const admins = [userStore.user?.metaId]
  const dataCarrier = {
    communityId,
    name: metaName.metaName,
    metaName: metaName.metaName,
    // metaNameNft: ''
    icon: iconPlaceholder,
    admins,
    description,
    cover: coverPlaceholder || '',
    reserved,
  }
  console.log({ dataCarrier })

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleCommunity,
    encrypt: IsEncrypt.No,
    dataType: 'application/json',
    data: JSON.stringify(dataCarrier),
    attachments,
  }

  // 3. 发送节点
  await sdk.createBrfcChildNode(node)

  return { communityId }
}

export const updateCommunity = async (form: any, sdk: SDK) => {
  // communityId, name, description, cover, metaName, mateNameNft, admins, reserved, icon
  let { icon, description, cover, original, metaName } = form

  const attachments = []
  let replaceIndex = 0
  let iconPlaceholder = original.icon
  if (icon) {
    iconPlaceholder = `metafile://$[${replaceIndex}]`
    attachments.push(await FileToAttachmentItem(icon))
    replaceIndex++
  }

  let coverPlaceholder = original.cover
  if (cover) {
    coverPlaceholder = `metafile://$[${replaceIndex}]`
    attachments.push(await FileToAttachmentItem(cover))
    replaceIndex++
  }

  const admins = original.admins

  const dataCarrier = {
    communityId: metaName.communityId,
    name: metaName.metaName,
    metaName: metaName.metaName,
    // metaNameNft: ''
    icon: iconPlaceholder,
    admins,
    description,
    cover: coverPlaceholder || '',
    reserved: metaName.signature,
  }
  console.log({ dataCarrier, form, original })

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleCommunity,
    data: JSON.stringify(dataCarrier),
    attachments,
  }

  // 3. 发送节点
  await sdk.createBrfcChildNode(node)

  // return { communityId }
}

export const switchFollowUser = async (form: any, sdk: SDK) => {
  const { metaId, address, isFollowed } = form
  const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
  const dataCarrier = {
    createTime: new Date().getTime(),
    MetaID: metaId,
    pay: payAmount,
    payTo: address,
    status: isFollowed ? -1 : 1,
  }
  console.log({ dataCarrier, isFollowed })

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.PayFollow,
    data: JSON.stringify(dataCarrier),
    payTo: [
      {
        amount: payAmount,
        address,
      },
    ],
  }

  // 3. 发送节点
  await sdk.createBrfcChildNode(node)
}

export const sendInviteBuzz = async (form: any, sdk: SDK) => {
  // shareProtocol, shareId, shareIdType, shareFromMetaID, shareContent, shareContentType, mention
  const shareProtocol = NodeName.SimpleGroupCreate
  let shareId, shareIdType
  if (!form.channel) {
    shareId = `${form.community.communityId}`
    shareIdType = 'communityId'
  } else {
    shareId = `${form.community.communityId}/${form.channel.id}`
    shareIdType = 'communityId/channelId'
  }

  const shareFromMetaID = form.community.metaId
  const shareContent = form.text
  const shareContentType = 'text/plain'
  const dataCarrier = {
    shareProtocol,
    shareId,
    shareIdType,
    shareFromMetaID,
    shareContent,
    shareContentType,
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimplePublicShare,
    data: JSON.stringify(dataCarrier),
  }

  // 3. 发送节点
  const res = await sdk.createBrfcChildNode(node)
  const txId = res?.currentNode?.txId
  return { txId }
}

const _putIntoRedPackets = (form: any, address: string): any[] => {
  const { amount, quantity, each, type } = form
  // NFT🧧：将NFT分成指定数量个红包，平均分配
  if (type === RedPacketDistributeType.Nft) {
    const redPackets = []
    for (let i = 0; i < quantity; i++) {
      redPackets.push({
        address,
        amount: each,
        index: i,
      })
    }
    return redPackets
  }

  // 构建🧧数量：随机将红包金额分成指定数量个小红包；指定最小系数为平均值的0.2倍，最大系数为平均值的1.8倍
  const minFactor = 0.2
  const maxFactor = 1.8
  const minSats = 1000 // 最小红包金额为1000sats
  const redPackets = []
  let remainsAmount = amount
  let remainsCount = quantity
  for (let i = 0; i < quantity - 1; i++) {
    let avgAmount = Math.round(remainsAmount / remainsCount)
    const randomFactor = Math.random() * (maxFactor - minFactor) + minFactor
    const randomAmount = Math.max(Math.round(avgAmount * randomFactor), minSats)
    redPackets.push({
      amount: randomAmount,
      address,
      index: i,
    })
    remainsAmount -= randomAmount
    remainsCount -= 1
  }
  redPackets.push({
    amount: Math.max(Math.floor(remainsAmount), minSats),
    address,
    index: quantity - 1,
  }) // 最后一个红包，使用剩余金额

  return redPackets
}

export const giveRedPacket = async (form: any, channelId: string, selfMetaId: string, sdk: SDK) => {
  // 1.1 构建红包地址
  const code = realRandomString(6)
  const subId = channelId.substring(0, 12)
  const createTime = Date.now()
  const key = `${subId.toLocaleLowerCase()}${code.toLocaleLowerCase()}${createTime}`
  const net = import.meta.env.VITE_NET_WORK || 'mainnet'
  const { addressStr: address } = buildCryptoInfo(key, net)

  // 1.2 构建红包数据
  // const amountInSat = amount * 100_000_000
  const amountInSat = form.amount // 现在直接使用sat为单位
  const redPackets = _putIntoRedPackets(form, address)
  console.table(redPackets)
  console.log({ form })

  // 2. 构建数据载体
  const dataCarrier: any = {
    createTime,
    subId,
    content: form.message,
    code,
    amount: amountInSat,
    count: form.quantity,
    metaid: selfMetaId,
    payList: redPackets,
  }

  // 2.1 nft红包处理
  if (form.nft && form.chain) {
    if (form.chain === 'eth' || form.chain === 'goerli') {
      dataCarrier.requireType = '2001'
    } else if (form.chain === 'polygon' || form.chain === 'mumbai') {
      dataCarrier.requireType = '2002'
    } else {
      dataCarrier.requireType = '2'
    }
    dataCarrier.requireCodehash = form.nft.nftCodehash
    dataCarrier.requireGenesis = form.nft.nftGenesis
  }

  // 3. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleRedEnvelope,
    data: JSON.stringify(dataCarrier),
    payTo: redPackets,
  }

  // 3. 发送节点
  await sdk.createBrfcChildNode(node)

  return
}

export const createChannel = async (
  form: any,
  communityId: string,
  sdk: SDK,
  subscribeId: string,
  selfMetaId?: string
) => {
  // communityId, groupName, groupNote, timestamp, groupType, status, type, codehash, genesis, limitAmount
  const { name: groupName } = form

  const { groupType, status, type, codehash, genesis, limitAmount } = _getChannelTypeInfo(
    form,
    selfMetaId!
  )
  // 发言设置，0：所有人，1：管理员
  const chatSettingType = form.adminOnly ? 1 : 0

  const dataCarrier = {
    communityId,
    groupName,
    groupNote: '',
    groupType,
    status,
    type,
    codehash,
    genesis,
    limitAmount,
    chatSettingType,
    timestamp: getTimestampInSeconds(),
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleGroupCreate,
    data: JSON.stringify(dataCarrier),
    publickey: form.publicKey,
    txId: form.txId,
  }

  // 3. 发送节点
  try {
    const res = await sdk.createBrfcChildNode(node, { useQueue: true, subscribeId })
    console.log({ res })

    if (res === null) {
      return { status: 'canceled' }
    }

    return { status: 'success', subscribeId }
  } catch (err) {
    console.log(err)
    ElMessage.error('创建群组失败')
    return { status: 'failed' }
  }
}

export const verifyPassword = (key: string, hashedPassword: string, creatorMetaId: string) => {
  const decrypted = decrypt(key, hashedPassword)

  return decrypted === creatorMetaId.substring(0, 16)

  // if (decrypted && decrypted === creatorMetaId.substring(0, 16)) {
  //   talk.hasActiveChannelConsent = true
  //   layout.isShowPasswordModal = false
  // }
}

const _getChannelTypeInfo = (form: any, selfMetaId: string) => {
  let groupType = null
  let status = null
  let type = null
  let codehash = null
  let genesis = null
  let limitAmount = null

  switch (form.type) {
    case GroupChannelType.PublicText:
      groupType = '1'
      status = '1'
      break

    case GroupChannelType.Password:
      groupType = '2'
      status = encrypt(selfMetaId.substring(0, 16), MD5Hash(form.password).substring(0, 16))
      type = '1'
      break

    case GroupChannelType.NFT:
      groupType = '2'
      status = encrypt(selfMetaId.substring(0, 16), MD5Hash(form.nft.nftGenesis).substring(0, 16))
      codehash = form.nft.nftCodehash
      genesis = form.nft.nftGenesis
      if (form.chain === 'eth' || form.chain === 'goerli') {
        type = '2001'
      } else if (form.chain === 'polygon' || form.chain === 'mumbai') {
        type = '2002'
      } else {
        type = '2'
      }
      break

    case GroupChannelType.FT:
      groupType = '2'
      status = encrypt(selfMetaId.substring(0, 16), MD5Hash(form.ft.genesis).substring(0, 16))
      codehash = form.ft.codehash
      genesis = form.ft.genesis
      type = '3'
      limitAmount = form.amount.toString()
      break

    default:
      break
  }

  return { groupType, status, type, codehash, genesis, limitAmount }
}

export const joinCommunity = async (communityId: string, sdk: SDK) => {
  const dataCarrier = {
    communityId,
    state: CommunityJoinAction.Join,
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleCommunityJoin,
    encrypt: IsEncrypt.No,
    dataType: 'application/json',
    data: JSON.stringify(dataCarrier),
  }

  // 3. 发送节点
  const nodeRes = await sdk.createBrfcChildNode(node)

  if (nodeRes === null) {
    return {
      status: 'failed',
    }
  }

  return { communityId }
}

export const sendMessage = async (messageDto: MessageDto) => {
  try {
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
  } catch (error) {
    console.error(error)
  }
}

export const validateTextMessage = (message: string) => {
  message = message.trim()

  return message.length > 0 && message.length <= 5000
}

const _sendTextMessage = async (messageDto: MessageDto) => {
  const userStore = useUserStore()
  const talkStore = useTalkStore()
  const { content, channelId: groupID, userName: nickName } = messageDto

  // 1. 构建协议数据
  const timestamp = getTimestampInSeconds()
  const contentType = 'text/plain'
  const encryption = 'aes'
  const dataCarrier = {
    groupID,
    timestamp,
    // nickName,
    content,
    contentType,
    encryption,
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleGroupChat,
    data: JSON.stringify(dataCarrier),
    timestamp: Date.now(), // 服务端返回的是毫秒，所以模拟需要乘以1000
  }

  // 2.5. mock发送
  const mockId = realRandomString(12)
  const mockMessage = {
    mockId,
    protocol: 'simpleGroupChat',
    contentType: 'text/plain',
    content,
    avatarType: userStore.user?.avatarType || 'undefined',
    avatarTxId: userStore.user?.avatarTxId || 'undefined',
    avatarImage: userStore.user?.avatarImage || '',
    metaId: userStore.user?.metaId || 'undefined',
    nickName: userStore.user?.name || '',
    timestamp: Date.now(), // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption,
    isMock: true,
  }
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await tryCreateNode(node, sdk, mockId)

  return '1'
}

export const tryCreateNode = async (node: any, sdk: SDK, mockId: string) => {
  const jobs = useJobsStore()
  const talk = useTalkStore()
  try {
    const nodeRes = await sdk.createBrfcChildNode(node)
    // 取消支付的情况下，删除mock消息
    console.log({ nodeRes })
    if (nodeRes === null) {
      talk.removeMessage(mockId)
    }
  } catch (error) {
    const timestamp = node.timestamp
    jobs.nodes.push({ node, timestamp })
    const newMessages = talk.activeChannel.newMessages
    const message = newMessages.find((item: any) => item.timestamp === timestamp && item.isMock)
    if (message) {
      message.error = true
    }
  }
}

const _sendTextMessageForSession = async (messageDto: MessageDto) => {
  const userStore = useUserStore()
  const talkStore = useTalkStore()
  const { content, channelId: to } = messageDto

  // 1. 构建协议数据
  // 1.1 to: done
  // 1.2 timestamp
  const timestamp = Date.now()
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
    data: JSON.stringify(dataCarrier),
    timestamp, // 服务端返回的是毫秒，所以模拟需要乘以1000
  }

  // 2.5. mock发送
  const mockId = realRandomString(12)
  const mockMessage = {
    mockId,
    nodeName: NodeName.ShowMsg,
    dataType: 'application/json',
    data: dataCarrier,
    avatarType: userStore.user?.avatarType || 'undefined',
    avatarTxId: userStore.user?.avatarTxId || 'undefined',
    avatarImage: userStore.user?.avatarImage || '',
    fromAvatarImage: userStore.user?.avatarImage || '',
    metaId: userStore.user?.metaId || 'undefined',
    from: userStore.user?.metaId,
    nickName: userStore.user?.name || '',
    timestamp, // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption: encrypt,
    isMock: true,
    to,
  }

  // 查找store中的位置
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await tryCreateNode(node, sdk, mockId)

  return '1'
}

const _uploadImage = async (file: File, sdk: SDK) => {
  const fileType = file.type.split('/')[1]
  const hexedFiles = await FileToAttachmentItem(file)
  const dataCarrier = {
    nodeName: 'icon',
    data: hexedFiles,
    dataType: fileType,
    encrypt: IsEncrypt.No,
    encoding: 'binary',
  }

  const node = {
    nodeName: NodeName.MetaFile,
    dataType: 'application/json',
    attachments: [hexedFiles],
  }

  const newNode = await sdk.createBrfcChildNode(node)
  if (!newNode) return { metafileUri: null }

  const txId = newNode.txId
  const metafileUri = 'metafile://' + txId + '.' + fileType

  return { metafileUri }
}

const _sendImageMessage = async (messageDto: MessageDto) => {
  const userStore = useUserStore()
  const talkStore = useTalkStore()
  const { channelId: groupId, userName: nickName, attachments, originalFileUrl } = messageDto

  // 1. 构建协议数据
  // 1.1 groupId: done
  // 1.2 timestamp
  const timestamp = getTimestampInSeconds()
  // 1.3 nickName: done
  // 1.4 fileType
  const file = attachments![0]
  const fileType = file.fileType.split('/')[1]
  // 1.5 encrypt
  const encrypt = '0'
  const attachment = 'metafile://$[0]'
  let dataCarrier: any = {
    timestamp,
    encrypt,
    fileType,
    attachment,
  }
  if (messageDto.channelType === ChannelType.Group) {
    dataCarrier.groupId = groupId
  } else {
    dataCarrier.to = groupId
  }

  const nodeName =
    messageDto.channelType === ChannelType.Group
      ? NodeName.SimpleFileGroupChat
      : NodeName.SimpleFileMsg
  // 2. 构建节点参数
  const node = {
    nodeName: nodeName,
    dataType: 'application/json',
    data: JSON.stringify(dataCarrier),
    attachments,
    timestamp: timestamp * 1000, // 服务端返回的是毫秒，所以模拟需要乘以1000
  }

  // 2.5. mock发送
  const mockId = realRandomString(12)
  const mockMessage = {
    mockId,
    protocol: nodeName,
    nodeName,
    contentType: fileType,
    content: originalFileUrl,
    avatarType: userStore.user?.avatarType || 'undefined',
    avatarTxId: userStore.user?.avatarTxId || 'undefined',
    avatarImage: userStore.user?.avatarImage || '',
    fromAvatarImage: userStore.user?.avatarImage || '',
    metaId: userStore.user?.metaId || 'undefined',
    from: userStore.user?.metaId,
    nickName: userStore.user?.name || '',
    timestamp: timestamp * 1000, // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption: encrypt,
    isMock: true,
  }
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await tryCreateNode(node, sdk, mockId)

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

export const openRedPacket = async (redPacket: any, sdk: SDK) => {
  const talkStore = useTalkStore()
  const userStore = useUserStore()
  const userAddressStr = userStore.user!.address as any
  const userAddress = new Address(userAddressStr, import.meta.env.VITE_NET_WORK || 'mainnet')
  const { subId, code, createTime } = redPacket
  const dataCarrier = {
    createTime,
    subId,
    code,
    type: redPacket.type,
    used: redPacket.iTake,
  }

  // 使用红包的钱构建交易本身
  const key = `${subId.toLocaleLowerCase()}${code.toLocaleLowerCase()}${createTime}`
  const net = import.meta.env.VITE_NET_WORK || 'mainnet'
  const redPacketCrypto = buildCryptoInfo(key, net)

  // const
  const satoshis = new Decimal(redPacket.iTake.amount)
  const amount = satoshis.dividedBy(100000000).toNumber()

  const iTakeUtxo = {
    address: redPacketCrypto.addressStr as any,
    satoshis: satoshis.toNumber(),
    txId: redPacket.id,
    outputIndex: redPacket.iTake.index,
  }
  console.log('iTakeUtxo', iTakeUtxo)
  const txComposer = new TxComposer()

  txComposer.appendP2PKHInput(iTakeUtxo)
  // const opReturn = _buildOpReturn()
  // txComposer.appendOpReturnOutput(opReturn)
  txComposer.appendChangeOutput(userAddress, DEFAULTS.feeb)
  txComposer.unlockP2PKHInput(redPacketCrypto.privateKey, 0)
  const verify = txComposer.tx.verify()
  console.log('verify', verify)

  // const txHex = txComposer.getRawHex()
  // await sdk.wallet?.provider.broadcast(txHex)
}

const _buildOpReturn = () => {
  //   'mvc',
  // nodeAddress.publicKey.toString(),
  // parentTxId,
  // metaIdTag.toLowerCase(),
  // nodeName,
  // data,
  // encrypt.toString(),
  // version,
  // dataType,
  // encoding,
  return [
    'mvc',
    '',
    '',
    'testmetaid',
    'OpenRedenvelope',
    JSON.stringify({}),
    '0',
    '1.0.1',
    'application/json',
    'UTF-8',
  ]
}
