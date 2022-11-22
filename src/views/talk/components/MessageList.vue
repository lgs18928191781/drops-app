<template>
  <div class="h-full overflow-y-hidden" v-show="layoutStore.isShowMessagesLoading">
    <LoadingList />
  </div>
  <div
    class="h-full overflow-y-auto"
    ref="messagesScroll"
    v-show="!layoutStore.isShowMessagesLoading"
  >
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
            v-for="message in talkStore.activeChannel?.newMessages"
            :message="message"
            :id="message.timestamp"
          />
        </template>
        <template v-else>
          <MessageItemForSession
            v-for="message in talkStore.activeChannel?.newMessages"
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
import { useLayoutStore } from '@/stores/layout'
import { sleep } from '@/utils/util'
import { onBeforeUnmount, ref, watch } from 'vue'
import LoadingItem from './LoadingItem.vue'
import LoadingList from './LoadingList.vue'
import MessageItem from './MessageItem.vue'
import MessageItemForSession from './MessageItemForSession.vue'

const talkStore = useTalkStore()
const layoutStore = useLayoutStore()

watch(
  () => talkStore.newMessages,
  async () => {
    await scrollToMessagesBottom()
  },
  { deep: true }
)

const loadingMore = ref(false)
const isAtTop = ref(false)

const messagesScroll = ref<HTMLElement>()

const handleScroll = async () => {
  const topAnchor = document.getElementById('topAnchor')
  if (topAnchor) {
    const topAnchorRect = topAnchor.getBoundingClientRect()
    if (topAnchorRect.bottom > -100 && !loadingMore.value && !layoutStore.isShowMessagesLoading) {
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

  for (const item of items) {
    talkStore.activeChannel.postMessages.push(item)
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

messagesScroll.value?.addEventListener('scroll', handleScroll)

onBeforeUnmount(() => {
  messagesScroll.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style lang=""></style>
