import { getAtMeChannels, getChannelMessages, getChannels, getCommunityMembers } from '@/api/talk'
import { ChannelPublicityType, ChannelType, GroupChannelType } from '@/enum'
import { defineStore } from 'pinia'
import { router } from '@/router'
import { useLayoutStore } from './layout'
import { Message, TalkError } from '@/@types/talk'
import { sleep } from '@/utils/util'
import { useUserStore } from './user'

export const useTalkStore = defineStore('talk', {
  state: () => {
    return {
      communities: [{ id: '@me' }] as any[],
      members: [] as any,

      activeCommunityId: '' as string,
      activeChannelId: '' as string,

      error: {} as TalkError,

      ws: null as WebSocket | null,
      wsHeartBeatTimer: null as NodeJS.Timeout | null,

      channelsReadPointers: {} as any, // 频道已读指针
      saveReadPointerTimer: null as NodeJS.Timeout | null,

      communityChannelIds: {} as any, // 社区频道列表

      hasActiveChannelConsent: false, // 是否持有当前频道的共识

      inviteLink: '', // 邀请链接
    }
  },

  getters: {
    selfMetaId(): string {
      const userStore = useUserStore()
      return userStore.user?.metaId || ''
    },

    realCommunities(state) {
      return state.communities.filter(community => community.id !== '@me')
    },

    atMeCommunity(state) {
      return state.communities.find(community => community.id === '@me')
    },

    activeCommunity(state) {
      return state.communities.find(community => community.id === state.activeCommunityId)
    },

    activeChannel(state): any {
      if (!this.activeCommunity) return null

      return this.activeCommunity.channels?.find((channel: any) => {
        return channel.id === state.activeChannelId
      })
    },

    channelType(channel) {
      return (channel: any) => {
        if (channel.roomType === ChannelPublicityType.Public) return GroupChannelType.PublicText

        if (channel.roomJoinType === '1') return GroupChannelType.Password
        if (channel.roomJoinType === '2') return GroupChannelType.NFT
        if (channel.roomJoinType === '3') return GroupChannelType.FT

        return null
      }
    },

    canAccessActiveChannel(): boolean {
      if (!this.activeChannel) return true

      return this.isActiveChannelPublic || this.hasActiveChannelConsent
    },

    activeGroupChannelType(): GroupChannelType | null {
      if (!this.activeChannel) return null

      return this.channelType(this.activeChannel)
    },

    activeCommunityChannels(): any[] {
      if (!this.activeCommunity) return []

      return this.activeCommunity.channels || []
    },

    activeCommunityPublicChannels(): any[] {
      return this.activeCommunityChannels.filter(
        (channel: any) => channel.roomType === ChannelPublicityType.Public
      )
    },

    activeCommunityConsensualChannels(): any[] {
      return this.activeCommunityChannels.filter(
        (channel: any) => channel.roomType === ChannelPublicityType.Private
      )
    },

    isAdmin(): () => boolean {
      const selfMetaId = this.selfMetaId

      return () => {
        if (!this.activeCommunity) return false
        if (!this.activeCommunity.admins) return false

        return this.activeCommunity.admins.includes(selfMetaId)
      }
    },

    hasUnreadMessagesOfChannel(): (channelId: string) => boolean {
      return (channelId: string) => {
        if (channelId === this.activeChannelId) return false

        // 如果频道已读指针不存在，则说明没有未读消息
        if (!this.channelsReadPointers[channelId]) return false

        // 如果频道已读指针存在，则判断lastRead和latest
        const pointer = this.channelsReadPointers[channelId]
        return pointer.lastRead < pointer.latest
      }
    },

    hasUnreadMessagesOfCommunity(): (communityId: string) => boolean {
      return (communityId: string) => {
        // 从本地存储中获取社区频道列表和已读指针
        const channels = this.communityChannelIds[communityId] || []

        if (channels.length === 0) return false

        return channels.some((channelId: string) => {
          return this.hasUnreadMessagesOfChannel(channelId)
        })
      }
    },

    isActiveChannelPublic(): boolean {
      if (!this.activeChannel) return true

      return this.activeChannel.roomType === ChannelPublicityType.Public
    },

    isActiveChannelTheVoid(): boolean {
      return this.activeChannelId === 'the-void'
    },

    isActiveChannelSettings(): boolean {
      return this.activeChannelId === 'settings'
    },

    isActiveChannelReserved(): boolean {
      return this.isActiveChannelTheVoid || this.isActiveChannelSettings
    },

    newMessages(): any {
      if (!this.activeChannel) return []

      return this.activeChannel.newMessages
    },

    activeChannelType: state =>
      state.activeCommunityId === '@me' ? ChannelType.Session : ChannelType.Group,

    activeChannelSymbol: state => (state.activeCommunityId === '@me' ? '@' : '#'),

    communityLastReadChannelId(): (communityId: string) => string {
      const selfMetaId = this.selfMetaId
      return (communityId: string) => {
        const latestChannelsRecords =
          localStorage.getItem('latestChannels-' + selfMetaId) || JSON.stringify({})
        const latestChannels = JSON.parse(latestChannelsRecords)

        return latestChannels[communityId] || 'the-void'
      }
    },
  },

  actions: {
    async initChannel(routeCommunityId: string, routeChannelId: string) {
      const selfMetaId = this.selfMetaId
      const isAtMe = routeCommunityId === '@me'

      // 如果没有指定频道，则先从存储中尝试读取该社区的最后阅读频道
      const latestChannelsRecords =
        localStorage.getItem('latestChannels-' + selfMetaId) || JSON.stringify({})
      const latestChannels = JSON.parse(latestChannelsRecords)
      if (!routeChannelId) {
        const channelId = latestChannels[routeCommunityId] || 'the-void'

        router.push(`/talk/channels/${routeCommunityId}/${channelId}`)
        return 'redirect'
      }

      const fetchChannels = async () => {
        const channels = isAtMe
          ? await getAtMeChannels({ metaId: selfMetaId })
          : await getChannels({ communityId: routeCommunityId })

        this.activeCommunityId = routeCommunityId
        if (routeChannelId) {
          this.activeChannelId = routeChannelId
        }
        this.activeCommunity.channels = channels

        // 写入存储
        const communityChannels =
          localStorage.getItem('communityChannels-' + selfMetaId) || JSON.stringify({})
        const parsedCommunityChannels = JSON.parse(communityChannels)
        // 只保存频道id
        const channelIds = channels.map((channel: any) => channel.id)
        parsedCommunityChannels[routeCommunityId] = channelIds
        this.communityChannelIds = parsedCommunityChannels
        localStorage.setItem(
          'communityChannels-' + selfMetaId,
          JSON.stringify(parsedCommunityChannels)
        )
      }
      await fetchChannels()

      // 将最后阅读频道存储到本地
      latestChannels[routeCommunityId] = routeChannelId
      localStorage.setItem('latestChannels-' + selfMetaId, JSON.stringify(latestChannels))

      this.initReadPointers()

      if (!isAtMe) {
        const fetchMembers = async () => {
          this.members = await getCommunityMembers(routeCommunityId)
        }
        await fetchMembers()

        // 判断是否已是社区成员，如果不是，则尝试加入
        const isMember = this.members.some((member: any) => member.metaId === selfMetaId)
        if (!isMember) {
          // TODO:
          const layout = useLayoutStore()
          layout.isShowAcceptInviteModal = true

          return 'pending'
        }
      }

      return 'success'
    },

    initReadPointers() {
      const selfMetaId = this.selfMetaId
      // 先从本地读取
      const readPointers = localStorage.getItem('readPointers-' + selfMetaId)
      if (readPointers) {
        this.channelsReadPointers = JSON.parse(readPointers)
        // 比照确认有无新频道，有的话添加
        this.activeCommunity.channels.forEach((channel: any) => {
          if (!this.channelsReadPointers[channel.id]) {
            this.channelsReadPointers[channel.id] = {
              lastRead: 0,
              latest: 0,
            }
          }
        })
      } else {
        this.activeCommunity.channels.forEach((channel: any) => {
          this.channelsReadPointers[channel.id] = {
            lastRead: 0,
            latest: 0,
          }
        })
      }

      // 设置定时器，每隔一段时间保存一次
      this.saveReadPointerTimer = setInterval(() => {
        this.saveReadPointers()
      }, 1000 * 60)
    },

    closeReadPointerTimer() {
      if (this.saveReadPointerTimer) {
        clearInterval(this.saveReadPointerTimer)
        this.saveReadPointerTimer = null
      }
    },

    saveReadPointers() {
      const selfMetaId = this.selfMetaId
      localStorage.setItem('readPointers-' + selfMetaId, JSON.stringify(this.channelsReadPointers))
    },

    async initChannelMessages(selfMetaId: string) {
      if (!this.activeChannel) return

      const layoutStore = useLayoutStore()
      layoutStore.isShowMessagesLoading = true

      // 最少1秒，防止闪烁
      const currentTimestamp = new Date().getTime()

      const messages = await getChannelMessages(
        this.activeChannelId,
        { metaId: selfMetaId },
        this.activeChannelType
      )

      this.activeChannel.pastMessages = messages
      this.activeChannel.newMessages = []

      // 设置已读指针
      const latestTimestamp = messages.length ? messages[0].timestamp : 0
      if (latestTimestamp) {
        if (
          this.channelsReadPointers[this.activeChannelId] &&
          latestTimestamp > this.channelsReadPointers[this.activeChannelId].latest
        ) {
          this.channelsReadPointers[this.activeChannelId].latest = latestTimestamp
          this.channelsReadPointers[this.activeChannelId].lastRead = latestTimestamp
        } else {
          this.channelsReadPointers[this.activeChannelId] = {
            latest: latestTimestamp,
            lastRead: latestTimestamp,
          }
        }
      }

      // 保证至少1秒
      const delay = Math.max(1000 - (new Date().getTime() - currentTimestamp), 0)
      if (delay) await sleep(delay)

      layoutStore.isShowMessagesLoading = false

      // 滚动到底部
      await sleep(1)
      const messagesContainer = document.getElementById('messagesScroll')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    },

    async initWebSocket() {
      const selfMetaId = this.selfMetaId
      if (!selfMetaId) return
      const wsUri = `wss://testmvc.showmoney.app/ws-service?metaId=${selfMetaId}`
      this.ws = new WebSocket(wsUri)

      this.wsHeartBeatTimer = setInterval(() => {
        if (this.ws?.readyState === WebSocket.CONNECTING) {
          return
        }

        if (this.ws?.readyState === WebSocket.CLOSING || this.ws?.readyState === WebSocket.CLOSED) {
          this.ws = new WebSocket(wsUri)
        }

        const heartBeat = {
          M: 'HEART_BEAT',
          C: 0,
        }
        this.ws?.send(JSON.stringify(heartBeat))
      }, 10000)

      const isGroupMessage = (messageWrapper: any) => messageWrapper.M === 'WS_SERVER_NOTIFY_ROOM'
      const isSessionMessage = (messageWrapper: any) => messageWrapper.M === 'WS_SERVER_NOTIFY_CHAT'
      const messageMetaId = (messageWrapper: any) => {
        if (isGroupMessage(messageWrapper)) return messageWrapper.D.groupId
        if (isSessionMessage(messageWrapper)) {
          const { from, to } = messageWrapper.D
          return from === selfMetaId ? to : from
        }
      }
      const isFromActiveChannel = (messageWrapper: any) =>
        messageMetaId(messageWrapper) === this.activeChannelId

      const onReceiveMessage = (event: MessageEvent) => {
        const messageWrapper = JSON.parse(event.data)
        if (isGroupMessage(messageWrapper)) {
          console.log('wait what')
          const message = messageWrapper.D

          // 如果不是当前频道的消息，则更新未读指针
          if (!isFromActiveChannel(messageWrapper)) {
            if (
              this.channelsReadPointers[message.groupId] &&
              message.timestamp > this.channelsReadPointers[message.groupId].latest
            ) {
              this.channelsReadPointers[message.groupId].latest = message.timestamp
            } else {
              this.channelsReadPointers[message.groupId] = {
                latest: message.timestamp,
                lastRead: 0,
              }
            }

            return
          }
          console.log('duping')
          // 去重
          const isDuplicate =
            this.activeChannel.newMessages.some((item: Message) => item.txId === message.txId) ||
            this.activeChannel.pastMessages.some((item: Message) => item.txId === message.txId)

          if (isDuplicate) return

          // 更新当前频道的已读指针
          if (this.channelsReadPointers[this.activeChannelId]) {
            this.channelsReadPointers[this.activeChannelId].latest = message.timestamp
            this.channelsReadPointers[this.activeChannelId].lastRead = message.timestamp
          } else {
            this.channelsReadPointers[this.activeChannelId] = {
              lastRead: message.timestamp,
              latest: message.timestamp,
            }
          }

          // 优先查找替代mock数据
          let mockMessage: any
          if (message.protocol === 'simpleGroupChat') {
            console.log('here')
            mockMessage = this.activeChannel.newMessages.find(
              (item: Message) =>
                item.txId === '' &&
                item.isMock === true &&
                item.content === message.content &&
                item.metaId === message.metaId &&
                item.protocol === message.protocol
            )
            console.log({ message, new: this.activeChannel.newMessages })
          } else if (message.protocol === 'SimpleFileGroupChat') {
            mockMessage = this.activeChannel.newMessages.find(
              (item: Message) =>
                item.txId === '' &&
                item.isMock === true &&
                item.metaId === message.metaId &&
                item.protocol === message.protocol
            )
          }

          if (mockMessage) {
            console.log('替换中')
            this.$patch(state => {
              mockMessage.txId = message.txId
              mockMessage.timestamp = message.timestamp
              mockMessage.content = message.content
              delete mockMessage.isMock
            })

            return
          }

          // 如果没有替代mock数据，就直接添加到新消息队列首
          this.activeChannel.newMessages.push(message)
        }

        if (isSessionMessage(messageWrapper)) {
          console.log('here')
          const message = messageWrapper.D

          // 如果不是当前频道的消息，则更新未读指针
          if (!isFromActiveChannel(messageWrapper)) {
            if (
              this.channelsReadPointers[messageMetaId(messageWrapper)] &&
              message.timestamp > this.channelsReadPointers[message.groupId].latest
            ) {
              this.channelsReadPointers[messageMetaId(messageWrapper)].latest = message.timestamp
            } else {
              this.channelsReadPointers[messageMetaId(messageWrapper)] = {
                latest: message.timestamp,
                lastRead: 0,
              }
            }

            return
          }

          // 去重
          const isDuplicate =
            this.activeChannel.newMessages.some((item: Message) => item.txId === message.txId) ||
            this.activeChannel.pastMessages.some((item: Message) => item.txId === message.txId)

          if (isDuplicate) return

          // 更新当前频道的已读指针
          if (this.channelsReadPointers[this.activeChannelId]) {
            this.channelsReadPointers[this.activeChannelId].latest = message.timestamp
            this.channelsReadPointers[this.activeChannelId].lastRead = message.timestamp
          } else {
            this.channelsReadPointers[this.activeChannelId] = {
              lastRead: message.timestamp,
              latest: message.timestamp,
            }
          }

          // 优先查找替代mock数据
          let mockMessage: any
          if (message.protocol === 'simpleGroupChat') {
            mockMessage = this.activeChannel.newMessages.find(
              (item: Message) =>
                item.txId === '' &&
                item.isMock === true &&
                item.content === message.content &&
                item.metaId === message.metaId &&
                item.protocol === message.protocol
            )
          } else if (message.protocol === 'SimpleFileGroupChat') {
            mockMessage = this.activeChannel.newMessages.find(
              (item: Message) =>
                item.txId === '' &&
                item.isMock === true &&
                item.metaId === message.metaId &&
                item.protocol === message.protocol
            )
          } else if (message.nodeName === 'ShowMsg') {
            console.log('trying to find')
            mockMessage = this.activeChannel.newMessages.find(
              (item: Message) =>
                item.txId === '' && item.isMock === true && item.nodeName === message.nodeName
            )
          }

          if (mockMessage) {
            console.log('found')
            this.$patch(state => {
              mockMessage.txId = message.txId
              mockMessage.timestamp = message.timestamp
              mockMessage.data.content = message.data.content
              delete mockMessage.isMock
            })

            return
          }

          // 如果没有替代mock数据，就直接添加到新消息队列首
          this.activeChannel.newMessages.push(message)
        }
      }

      console.log('initing')
      this.ws.addEventListener('message', onReceiveMessage)
    },

    closeWebSocket() {
      if (this.wsHeartBeatTimer) {
        clearInterval(this.wsHeartBeatTimer)
        this.wsHeartBeatTimer = null
      }
      this.ws?.close()
      this.ws = null
    },

    addMessage(message: any) {
      if (!this.activeChannel) return
      if (!this.activeChannel.newMessages) {
        this.activeChannel.newMessages = []
      }

      this.activeChannel.newMessages.push(message)
    },
  },
})
