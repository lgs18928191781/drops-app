<template>
  <div class="h-full overflow-y-hidden" v-show="loading">
    <LoadingList />
  </div>
  <div class="h-full overflow-y-auto" ref="messagesScroll" v-show="!loading">
    <div class="overflow-x-hidden pt-4 px-4">
      <div class="flex flex-col-reverse space-y-4 space-y-reverse">
        <template v-if="talkStore.activeChannelType === 'group'">
          <MessageItem
            v-for="message in talkStore.activeChannel?.pastMessages"
            :message="message"
            :id="message.timestamp"
          />
        </template>

        <template v-else>
          <MessageItemForSession
            v-for="message in talkStore.activeChannel?.pastMessages"
            :message="message"
            :id="message.timestamp"
          />
        </template>

        <LoadingItem v-show="loadingMore && !isAtTop" />
        <div class="w-full h-px bg-inherit" id="topAnchor"></div>
      </div>

      <div class="flex flex-col space-y-4 mt-4">
        <template v-if="talkStore.activeChannelType === 'group'">
          <MessageItem
            v-for="message in talkStore.newMessages"
            :message="message"
            :id="message.timestamp"
          />
        </template>
        <template v-else>
          <MessageItemForSession
            v-for="message in talkStore.newMessages"
            :message="message"
            :id="message.timestamp"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getChannelMessages } from '@/api/talk'
import { useTalkStore } from '@/stores/talk'
import { ChannelType } from '@/utils/talk'
import { sleep } from '@/utils/util'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingItem from './LoadingItem.vue'
import LoadingList from './LoadingList.vue'
import MessageItem from './MessageItem.vue'
import MessageItemForSession from './MessageItemForSession.vue'

const talkStore = useTalkStore()
const route = useRoute()

watch(talkStore.newMessages, async () => {
  await scrollToMessagesBottom()
})

const loading = ref(false)
const loadingMore = ref(false)
const isAtTop = ref(false)

const messagesScroll = ref<HTMLElement>()
let ws: WebSocket | null

const handleScroll = async () => {
  const topAnchor = document.getElementById('topAnchor')
  if (topAnchor) {
    const topAnchorRect = topAnchor.getBoundingClientRect()
    if (topAnchorRect.bottom > -100 && !loadingMore.value && !loading.value) {
      loadingMore.value = true
      await loadMore()
      loadingMore.value = false
    }
  }
}

const loadMore = async () => {
  const earliestMessage =
    talkStore.activeChannel?.pastMessages[talkStore.activeChannel?.pastMessages.length - 1]
  const earliestMessageTimestamp = earliestMessage?.timestamp
  const earliestMessageElement = document.getElementById(earliestMessageTimestamp?.toString() || '')
  const earliestMessagePosition = earliestMessageElement?.getBoundingClientRect().bottom

  let params
  if (earliestMessageTimestamp) {
    params = {
      timestamp: earliestMessageTimestamp,
      timestampType: 0,
    }
  }

  let items = await getChannelMessages(
    talkStore.activeChannelId,
    params,
    talkStore.activeChannelType
  )

  // 如果没有更多消息了，就不再加载
  if (items.length === 0) {
    isAtTop.value = true
    return
  }

  talkStore.$patch(state => {
    for (const item of items) {
      state.pastMessages.push(item)
    }
  })

  // 滚动到原来的位置
  if (earliestMessagePosition) {
    const newEarliestMessageElement = document.getElementById(
      earliestMessageTimestamp?.toString() || ''
    )
    const newEarliestMessagePosition = newEarliestMessageElement?.getBoundingClientRect().bottom
    if (newEarliestMessagePosition) {
      messagesScroll.value?.scrollBy(0, newEarliestMessagePosition - earliestMessagePosition)
    }
  }
}

const scrollToMessagesBottom = async (retryCount = 0) => {
  await sleep(1)
  const mse: HTMLElement = messagesScroll.value as HTMLElement
  if (mse) {
    mse.scrollTop = mse.scrollHeight
  } else {
    if (retryCount < 5) {
      await sleep(1)
      await scrollToMessagesBottom(retryCount + 1)
    }
  }
}

// 订阅消息
const subscribeChannel = async () => {
  const metaId = '74cc371c55d9fa38fc98467396c22fe6b20bfc3459a11530362fcdb1b6c07c5c'
  const wsUri = `wss://testmvc.showmoney.app/ws-service?metaId=${metaId}`
  ws = new WebSocket(wsUri)

  setInterval(() => {
    if (ws?.readyState === WebSocket.CONNECTING) {
      return
    }

    if (ws?.readyState === WebSocket.CLOSING || ws?.readyState === WebSocket.CLOSED) {
      ws = new WebSocket(wsUri)
    }

    const heartBeat = {
      M: 'HEART_BEAT',
      C: 0,
    }
    ws!.send(JSON.stringify(heartBeat))
  }, 10000)

  const isGroupMessage = (messageWrapper: any) => messageWrapper.M === 'WS_SERVER_NOTIFY_ROOM'
  const isFromThisGroup = (message: any) => message.groupId === talkStore.activeChannelId

  const onReceiveMessage = (event: MessageEvent) => {
    const messageWrapper = JSON.parse(event.data)
    if (isGroupMessage(messageWrapper)) {
      const message = messageWrapper.D

      if (!isFromThisGroup(message)) return

      // 去重
      const isDuplicate =
        talkStore.newMessages.some(item => item.txId === message.txId) ||
        talkStore.pastMessages.some(item => item.txId === message.txId)

      if (isDuplicate) return

      // 优先查找替代mock数据
      let mockMessage: any
      if (message.protocol === 'simpleGroupChat') {
        mockMessage = talkStore.newMessages.find(
          item =>
            item.txId === '' &&
            item.isMock === true &&
            item.content === message.content &&
            item.metaId === message.metaId &&
            item.protocol === message.protocol
        )
      } else if (message.protocol === 'SimpleFileGroupChat') {
        mockMessage = talkStore.newMessages.find(
          item =>
            item.txId === '' &&
            item.isMock === true &&
            item.metaId === message.metaId &&
            item.protocol === message.protocol
        )
      }

      if (mockMessage) {
        talkStore.$patch(state => {
          mockMessage.txId = message.txId
          mockMessage.timestamp = message.timestamp
          mockMessage.content = message.content
          delete mockMessage.isMock
        })

        return
      }

      // 如果没有替代mock数据，就直接添加到新消息队列首
      talkStore.$patch(state => {
        state.newMessages.push(message)
      })
    }
  }

  ws.addEventListener('message', onReceiveMessage)
}

watch(
  () => route.params.channelId,
  async () => {
    await fetchMessages()
  }
)
watch(
  () => talkStore.activeChannelId,
  async () => {
    await fetchMessages()
  }
)

const fetchMessages = async () => {
  if (!talkStore.activeChannel) {
    return
  }

  const messages = await getChannelMessages(
    route.params.channelId as string,
    {},
    talkStore.activeChannelType
  )

  talkStore.initChannelMessages(messages)

  // talkStore.$patch(state => {
  //   const activeCommunity = state.communities.find(
  //     community => community.id === talkStore.activeCommunityId
  //   )
  //   const activeChannel = activeCommunity.channels.find(
  //     (channel: any) => channel.id === talkStore.activeChannelId
  //   )

  //   activeChannel.newMessages = []
  //   activeChannel.pastMessages = messages
  // })
}
defineExpose({ fetchMessages })

onMounted(async () => {
  loading.value = true
  // await fetchMessages()
  loading.value = false

  messagesScroll.value?.addEventListener('scroll', handleScroll)

  scrollToMessagesBottom()

  await subscribeChannel()
})

onBeforeUnmount(() => {
  messagesScroll.value?.removeEventListener('scroll', handleScroll)
  ws?.close()
})
</script>

<style lang=""></style>
