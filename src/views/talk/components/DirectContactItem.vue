<template>
  <div
    class="p-3 flex w-full items-center space-x-3 overflow-x-hidden lg:hover:bg-gray-200 lg:hover:dark:bg-gray-900 cursor-pointer"
    :class="{ 'bg-gray-200 dark:bg-gray-900': isActive }"
    @click="switchChannel"
  >
    <div class="rounded-3xl w-12 h-12 shrink-0 relative">
      <UserAvatar
        :image="session?.avatarImage"
        :meta-id="session?.metaId"
        class="w-12 h-12 shrink-0 select-none"
        :disabled="true"
      />
      <div
        class="absolute top-0 right-0 rounded-full w-2.5 h-2.5 bg-red-500"
        v-if="talk.hasUnreadMessagesOfChannel(session.metaId)"
      ></div>
    </div>

    <div class="flex flex-col items-stretch grow space-y-1 overflow-x-hidden">
      <div class="flex items-baseline justify-between self-stretch">
        <div class="text-base text-dark-800 dark:text-gray-100 truncate max-w-[96PX]">
          {{ session.name }}
        </div>

        <div class="shrink-0 text-dark-250 dark:text-gray-400 text-xs">
          {{
            session.lastMessageTimestamp
              ? formatTimestamp(session.lastMessageTimestamp, i18n, false)
              : ''
          }}
        </div>
      </div>
      <div class="text-xs text-dark-300 dark:text-gray-400 truncate">
        {{ session.lastMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatTimestamp } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'

const i18n = useI18n()
const userStore = useUserStore()
const layout = useLayoutStore()
const router = useRouter()
const talk = useTalkStore()

const props = defineProps(['session'])

const contact = computed<any>(() => {
  let contactSide = 'from'

  if (userStore.user) {
    const selfMetaId = userStore.user.metaId
    if (props.session.from === selfMetaId) {
      contactSide = 'to'
    }
  }

  return {
    name: props.session.name || props.session[`${contactSide}Name`],
    metaId: props.session.id,
    lastMessage: props.session.lastMessage,
    lastMessageTimestamp: props.session.lastMessageTimestamp,
  }
})

const isActive = computed<boolean>(() => {
  const currentChannelId = router.currentRoute.value.params.channelId

  return currentChannelId === contact.value.metaId
})

const switchChannel = () => {
  layout.$patch({
    isShowLeftNav: false,
  })

  if (isActive.value) return

  router.push(`/talk/channels/@me/${contact.value.metaId}`)
}
</script>

<style lang="scss" scoped></style>
