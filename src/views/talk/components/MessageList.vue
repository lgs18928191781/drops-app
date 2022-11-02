<template>
  <div class="h-full" v-show="loading">
    <LoadingList />
  </div>
  <div class="h-full overflow-y-scroll" ref="messagesScroll" v-show="!loading">
    <div class="overflow-x-hidden py-4 space-y-4 px-4 flex flex-col-reverse">
      <div class="w-full h-px bg-inherit" id="bottomAnchor"></div>

      <Message v-for="message in messages" :message="message" :id="message.timestamp" />

      <LoadingListItem v-show="loadingMore" />
      <div class="w-full h-px bg-inherit" id="topAnchor"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const messagesScroll = ref<HTMLElement>()

const channelId = 'b671caca627219c214f433497f9aba530a29a927bb5e32f242e36f8cbc26ba3b'

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

const scrollToMessagesBottom = async () => {
  await sleep(1000)
  const mse: HTMLElement = messagesScroll.value as HTMLElement
  mse.scrollTop = mse.scrollHeight
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
})

onBeforeUnmount(() => {
  messagesScroll.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style lang=""></style>
