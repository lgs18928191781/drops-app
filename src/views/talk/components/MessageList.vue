<template>
  <div class="h-full overflow-y-hidden" v-show="loading">
    <LoadingList />
  </div>
  <div class="h-full overflow-y-scroll" ref="messagesScroll" v-show="!loading">
    <div class="overflow-x-hidden py-4 px-4">
      <div class="flex flex-col-reverse space-y-4 space-y-reverse">
        <Message v-for="message in messages" :message="message" :id="message.timestamp" />

        <LoadingListItem v-show="loadingMore" />
        <div class="w-full h-px bg-inherit" id="topAnchor"></div>
      </div>

      <div class="flex flex-col space-y-4 mt-4">
        <Message v-for="message in upcomingMessages" :message="message" :id="message.timestamp" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { io } from 'socket.io-client'
import { getChannelMessages } from '@/api/talk'
import { sleep } from '@/utils/util'
import { onBeforeUnmount, onMounted, Ref, ref } from 'vue'
import LoadingListItem from './LoadingListItem.vue'
import LoadingList from './LoadingList.vue'
import Message from './Message.vue'

type Message = {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  nickName: string
  timestamp: number
}

const loading = ref(false)
const loadingMore = ref(false)
const messages: Ref<Message[]> = ref([])
const upcomingMessages: Ref<Message[]> = ref([])

const messagesScroll = ref<HTMLElement>()

const channelId = 'b73a456789053bd483194e19d56efd469a60eaad100bebaf4fd18a31c0d8d9df'

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
  const earliestMessage = messages.value[messages.value.length - 1]
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

  let {
    data: {
      results: { items },
    },
  } = await getChannelMessages(channelId, params)
  for (const item of items) {
    messages.value.push(item)
  }

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
  const metaId = '261562cd13734c7e9f3809e32d3d7c56f0b27788f88d6738fc95f96ddb89eb01'
  const wsUri = `wss://api.showmoney.app/ws-service?metaId=${metaId}`
  const ws = new WebSocket(wsUri)

  const isGroupMessage = (messageWrapper: any) => messageWrapper.M === 'WS_SERVER_NOTIFY_ROOM'
  const isFromThisGroup = (message: any) => message.groupId === channelId

  const onReceiveMessage = (event: MessageEvent) => {
    const messageWrapper = JSON.parse(event.data)
    if (isGroupMessage(messageWrapper)) {
      const message = messageWrapper.D
      if (!isFromThisGroup(message)) return

      // 将message添加到messages首
      upcomingMessages.value.push(message)

      console.log(message)

      scrollToMessagesBottom()
    }
  }

  ws.addEventListener('message', onReceiveMessage)
}

onMounted(async () => {
  loading.value = true
  const {
    data: {
      results: { items },
    },
  } = await getChannelMessages(channelId)
  messages.value = items
  loading.value = false

  messagesScroll.value?.addEventListener('scroll', handleScroll)

  scrollToMessagesBottom()

  await subscribeChannel()
})

onBeforeUnmount(() => {
  messagesScroll.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style lang=""></style>
