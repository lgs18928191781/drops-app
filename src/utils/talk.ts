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
  SdkPayType,
} from '@/enum'
import { useUserStore } from '@/stores/user'
import { useTalkStore } from '@/stores/talk'
import { getCommunityAuth } from '@/api/talk'
import { SDK } from './sdk'
import { FileToAttachmentItem, randomString, realRandomString, sleep } from './util'
import { Message, MessageDto } from '@/@types/talk'
import { buildCryptoInfo, decrypt, encrypt, MD5Hash } from './crypto'
import { UtxoItem } from '@/@types/sdk'
import Decimal from 'decimal.js-light'
import { TxComposer } from 'meta-contract/dist/tx-composer'
import { Address, Script, Transaction } from 'meta-contract/dist/mvc'
import { DEFAULTS } from './wallet/hd-wallet'
import { useJobsStore } from '@/stores/jobs'

export const createCommunity = async (form: any, userStore: any, sdk: SDK) => {
  console.log('start')
  // communityId, name, description, cover, metaName, mateNameNft, admins, reserved, icon
  // const communityId = '274628147706127fc9cc8da5285081f52e6dd4436fd97bc7321daca2064db385'
  const communityId = '70637fba2fcadfe5ea89cc845ecb9eef86195672de4ce56a703e1ff08e6f1228'
  const { metaName, signature: reserved } = await getCommunityAuth(communityId)
  const { icon, name, description, cover } = form

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
    metaName,
    reserved,
    icon: iconPlaceholder,
    admins,
    name,
    description,
    cover: coverPlaceholder || '',
  }

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

const _putIntoRedPackets = (amount: number, quantity: number, address: string): any[] => {
  // 构建🧧数量：随机将红包金额分成指定数量个小红包；指定最小系数为平均值的0.2倍，最大系数为平均值的1.8倍
  const minFactor = 0.2
  const maxFactor = 1.8
  const redPackets = []
  let remainsAmount = amount
  let remainsCount = quantity
  for (let i = 0; i < quantity - 1; i++) {
    let avgAmount = Math.round(remainsAmount / remainsCount)
    const randomFactor = Math.random() * (maxFactor - minFactor) + minFactor
    const randomAmount = Math.round(avgAmount * randomFactor)
    redPackets.push({
      amount: randomAmount,
      address,
      index: i,
    })
    remainsAmount -= randomAmount
    remainsCount -= 1
  }
  redPackets.push({
    amount: Math.floor(remainsAmount),
    address,
    index: quantity - 1,
  }) // 最后一个红包，使用剩余金额

  return redPackets
}

export const giveRedPacket = async (form: any, channelId: string, selfMetaId: string, sdk: SDK) => {
  // 1.1 构建红包地址
  const code = realRandomString(6)
  const subId = channelId.substring(0, 12)
  const createTime = new Date().getTime()
  const key = `${subId.toLocaleLowerCase()}${code.toLocaleLowerCase()}${createTime}`
  const net = import.meta.env.VITE_NET_WORK || 'mainnet'
  const { addressStr: address } = buildCryptoInfo(key, net)

  // 1.2 构建红包数据
  const { amount, quantity } = form
  const amountInSat = amount * 100000000
  const redPackets = _putIntoRedPackets(amountInSat, quantity, address)
  console.table(redPackets)

  // 2. 构建数据载体
  const dataCarrier = {
    createTime,
    subId,
    content: form.message,
    code,
    amount: form.amount,
    count: form.quantity,
    metaid: selfMetaId,
    payList: redPackets,
  }

  // 2. 构建节点参数
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
  selfMetaId?: string
) => {
  // communityId, groupName, groupNote, timestamp, groupType, status, type, codehash, genesis, limitAmount
  const { name: groupName } = form

  const { groupType, status, type, codehash, genesis, limitAmount } = _getChannelTypeInfo(
    form,
    selfMetaId!
  )

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
    timestamp: new Date().getSeconds(),
  }

  // 2. 构建节点参数
  const node = {
    nodeName: NodeName.SimpleGroupCreate,
    encrypt: IsEncrypt.No,
    dataType: 'application/json',
    data: JSON.stringify(dataCarrier),
  }

  // 3. 发送节点
  await sdk.createBrfcChildNode(node)

  return 'success'
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
      } else {
        type = '2'
      }
      break

    case GroupChannelType.FT:
      groupType = '2'
      status = encrypt(selfMetaId.substring(0, 16), MD5Hash(form.ft.ftGenesis).substring(0, 16))
      codehash = form.ft.ftCodehash
      genesis = form.ft.ftGenesis
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
  await sdk.createBrfcChildNode(node)

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
  // 1.1 groupID: done
  // 1.2 timestamp
  const timestamp = new Date().getSeconds()
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
    data: JSON.stringify(dataCarrier),
    timestamp: new Date().getTime(), // 服务端返回的是毫秒，所以模拟需要乘以1000
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
    timestamp: new Date().getTime(), // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption,
    isMock: true,
  }
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await tryCreateNode(node, sdk)

  return '1'
}

export const tryCreateNode = async (node: any, sdk: SDK) => {
  const jobs = useJobsStore()
  const talk = useTalkStore()
  try {
    await sdk.createBrfcChildNode(node)
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
  const timestamp = new Date().getSeconds()
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
    timestamp: new Date().getTime(), // 服务端返回的是毫秒，所以模拟需要乘以1000
  }

  // 2.5. mock发送
  const mockMessage = {
    nodeName: NodeName.ShowMsg,
    dataType: 'application/json',
    data: dataCarrier,
    avatarType: userStore.user?.avatarType || 'undefined',
    avatarTxId: userStore.user?.avatarTxId || 'undefined',
    metaId: userStore.user?.metaId || 'undefined',
    from: userStore.user?.metaId,
    nickName: userStore.user?.name || '',
    timestamp: new Date().getTime(), // 服务端返回的是毫秒，所以模拟需要乘以1000
    txId: '',
    encryption: encrypt,
    isMock: true,
    to,
  }
  console.log('mockMessage', mockMessage)

  // 查找store中的位置
  talkStore.addMessage(mockMessage)

  // 3. 发送节点
  const sdk = userStore.showWallet
  await tryCreateNode(node, sdk)

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
  const timestamp = new Date().getSeconds()
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
    timestamp: timestamp * 1000, // 服务端返回的是毫秒，所以模拟需要乘以1000
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
  await tryCreateNode(node, sdk)

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
  const userAddress = userStore.user!.address as any
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
  console.log({
    script1: redPacket.iTake.scriptPubKey,
    script2: redPacketCrypto.scriptStr,
  })

  const iTakeUtxo = {
    address: redPacketCrypto.addressStr as any,
    satoshis: satoshis.toNumber(),
    txId: redPacket.id,
    outputIndex: redPacket.iTake.index,
  }
  console.log('iTakeUtxo', iTakeUtxo)
  const txComposer = new TxComposer()
  // const script = Script.buildPublicKeyHashOut(redPacketCrypto.addressStr)
  // const output = new Transaction.Output({
  //   script: Script.buildPublicKeyHashOut(iTakeUtxo.address),
  //   satoshis: iTakeUtxo.satoshis,
  // })

  // console.log({ output })
  txComposer.appendP2PKHInput(iTakeUtxo)
  const opReturn = _buildOpReturn()
  txComposer.appendOpReturnOutput(opReturn)
  // txComposer.appendChangeOutput(userAddress, DEFAULTS.feeb)
  // txComposer.unlockP2PKHInput(redPacketCrypto.privateKey, 0)

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
    {},
    '0',
    '1.0.1',
    'application/json',
    'UTF-8',
  ]
}
