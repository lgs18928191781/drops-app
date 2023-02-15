<template>
  <div class="h-full overflow-y-hidden" v-show="layout.isShowMessagesLoading">
    <LoadingList />
  </div>

  <div
    class="h-full overflow-y-auto"
    ref="messagesScroll"
    id="messagesScroll"
    v-show="!layout.isShowMessagesLoading"
  >
    <div class="">
      <div class="flex flex-col-reverse space-y-2 space-y-reverse">
        <template v-if="talk.activeChannelType === 'group'">
          <MessageItem
            v-for="message in talk.activeChannel?.pastMessages"
            :message="message"
            :id="message.timestamp"
          />
          <div
            class="border-b border-solid border-gray-300 dark:border-gray-600 mb-6 pb-6 pt-2 mx-4"
            v-if="hasTooFewMessages"
          >
            <h3 class="text-2xl font-medium text-dark-400 dark:text-gray-200">
              {{
                '😊 ' + $t('Talk.Channel.welcome_message', { channel: talk.activeChannel?.name })
              }}
            </h3>
            <div class="flex space-x-2 items-center mt-4">
              <p class="text-sm font-thin text-dark-400 dark:text-gray-200 italic">
                {{ $t('Talk.Channel.welcome_start', { channel: talk.activeChannel?.name }) }}
              </p>
              <p>🎉</p>
            </div>

            <div class="flex mt-1 items-center space-x-2">
              <p class="text-sm font-thin text-dark-400 dark:text-gray-200 mt-1 italic">
                {{ $t('Talk.Channel.welcome_invite') }}
              </p>
              <Icon
                name="user_plus"
                class="box-content w-4 h-4 p-1.5 text-dark-400 dark:text-gray-200 mt-1 ml-1 border-2 border-dashed border-dark-250 dark:border-dark-400 rounded-lg cursor-pointer hover:border-solid hover:text-dark-800 hover:dark:text-primary transition-all duration-300"
                @click="popInvite"
              />
            </div>
          </div>
        </template>

        <template v-else>
          <MessageItemForSession
            v-for="message in talk.activeChannel?.pastMessages"
            :message="message"
            :id="message.timestamp"
          />
        </template>

        <LoadingItem v-show="loadingMore && !isAtTop" />
        <div class="w-full h-px bg-inherit" id="topAnchor"></div>
      </div>

      <div class="flex flex-col space-y-4 mt-2">
        <template v-if="talk.activeChannelType === 'group'">
          <MessageItem
            v-for="message in talk.activeChannel?.newMessages"
            :message="message"
            :id="message.timestamp"
          />
        </template>
        <template v-else>
          <MessageItemForSession
            v-for="message in talk.activeChannel?.newMessages"
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
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import LoadingItem from './LoadingItem.vue'
import LoadingList from './LoadingList.vue'
import MessageItem from './MessageItem.vue'
import MessageItemForSession from './MessageItemForSession.vue'
import { sleep } from '@/utils/util'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const talk = useTalkStore()
const layout = useLayoutStore()

const loadingMore = ref(false)
const isAtTop = ref(false)

const messagesScroll = ref<HTMLElement>()

const handleScroll = async () => {
  if (!user.isAuthorized) return

  const topAnchor = document.getElementById('topAnchor')
  if (topAnchor) {
    const topAnchorRect = topAnchor.getBoundingClientRect()
    if (topAnchorRect.bottom > -100 && !loadingMore.value && !layout.isShowMessagesLoading) {
      loadingMore.value = true
      await loadMore()
      loadingMore.value = false
    }
  }
}

watch(
  messagesScroll,
  async () => {
    if (messagesScroll.value) {
      await nextTick()
      messagesScroll.value?.addEventListener('scroll', handleScroll)
    }
  },
  { immediate: true }
)

const popInvite = () => {
  talk.inviteLink = `${location.origin}/talk/channels/${talk.activeCommunitySymbol}/${talk.activeChannelId}`
  talk.invitingChannel = {
    community: talk.activeCommunity,
    channel: talk.activeChannel,
  }
  layout.isShowInviteModal = true
}

const loadMore = async () => {
  if (!talk.activeChannelId || !talk.selfMetaId) return

  const earliestMessage =
    talk.activeChannel?.pastMessages[talk.activeChannel?.pastMessages.length - 1]
  const earliestMessageTimestamp = earliestMessage?.timestamp
  const earliestMessageElement = document.getElementById(earliestMessageTimestamp?.toString() || '')
  const earliestMessagePosition = earliestMessageElement?.getBoundingClientRect().bottom

  let params

  if (earliestMessageTimestamp) {
    params = {
      timestamp: earliestMessageTimestamp,
      timestampType: 0,
      metaId: talk.selfMetaId,
    }
  } else {
    params = {
      metaId: talk.selfMetaId,
    }
  }

  let items = await getChannelMessages(talk.activeChannelId, params, talk.activeChannelType)

  // 如果没有更多消息了，就不再加载
  if (items.length === 0) {
    isAtTop.value = true
    return
  }

  for (const item of items) {
    talk.activeChannel?.pastMessages.push(item)
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

const hasTooFewMessages = computed(() => {
  if (!talk.activeChannel) {
    return false
  }

  if (!talk.activeChannel.pastMessages) {
    return false
  }

  return talk.activeChannel?.pastMessages.length < 10
})

const scrollToMessagesBottom = async (retryCount = 0) => {
  await nextTick()
  const mse: HTMLElement = messagesScroll.value as HTMLElement
  if (mse) {
    mse.scrollTop = mse.scrollHeight
    await sleep(2000)
    mse.scrollTop = mse.scrollHeight
  } else {
    if (retryCount < 5) {
      console.log({ retryCount })
      await nextTick()
      await scrollToMessagesBottom(retryCount + 1)
    }
  }
}

watch(
  () => talk.newMessages,
  async () => {
    // 依据滚动状态，如果当前距离底部的距离超过一屏，则说明在阅读历史消息，不需要滚动到底部
    if (messagesScroll.value) {
      const mse: HTMLElement = messagesScroll.value as HTMLElement
      const disFromBottom = mse.scrollHeight - mse.scrollTop - mse.clientHeight // 滚动元素的总高度 - 滚动元素的离顶部距离 - 滚动元素的可视高度

      // 还要判断是不是用户自己发的消息
      const lastMessage =
        talk.activeChannel?.newMessages[talk.activeChannel?.newMessages.length - 1]
      const isMyMessage = lastMessage?.metaId === talk.selfMetaId

      if (disFromBottom > mse.clientHeight && !isMyMessage) {
        return
      }
    }

    await scrollToMessagesBottom()
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(() => {
  messagesScroll.value?.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #edeff2;
}

.dark *::-webkit-scrollbar-track {
  background: #111827;
}

*::-webkit-scrollbar-thumb {
  background-color: #bfc2cc;
  border-radius: 20px;
}

.dark *::-webkit-scrollbar-thumb {
  background-color: #374151;
}
</style>
