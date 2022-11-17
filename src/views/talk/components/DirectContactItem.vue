<template>
  <div
    class="p-3 flex w-full items-center space-x-3 overflow-x-hidden lg:hover:bg-gray-200 cursor-pointer"
    :class="{ 'bg-gray-200': isActive }"
    @click="switchChannel"
  >
    <div class="rounded-3xl w-12 h-12 bg-indigo-200 shrink-0">
      <UserAvatar
        :metaId="contact.metaId || 'undefined'"
        class="w-12 h-12 shrink-0 select-none"
        :disabled="true"
      />
    </div>

    <div class="flex flex-col items-stretch grow space-y-1 overflow-x-hidden">
      <div class="flex items-baseline justify-between self-stretch">
        <div class="text-base text-dark-800 truncate max-w-[96PX]">
          {{ contact.name }}
        </div>

        <div class="shrink-0 text-dark-250 text-xs">
          {{
            contact.lastMessageTimestamp
              ? formatTimestamp(contact.lastMessageTimestamp, i18n, false)
              : ''
          }}
        </div>
      </div>
      <div class="text-xs text-dark-300 truncate">
        {{ contact.lastMessage }}
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

const i18n = useI18n()
const userStore = useUserStore()
const layoutStore = useLayoutStore()
const router = useRouter()

const props = defineProps(['session'])

const contact = computed<Contact>(() => {
  let contactSide = 'from'

  if (userStore.user) {
    const selfMetaId = userStore.user.metaId
    if (props.session.from === selfMetaId) {
      contactSide = 'to'
    }
  }

  return {
    name: props.session[`${contactSide}Name`],
    metaId: props.session[`${contactSide}`],
    lastMessage: '你收到了一条信息', // TODO
    lastMessageTimestamp: props.session.timestamp,
  }
})

const isActive = computed<boolean>(() => {
  const currentChannelId = router.currentRoute.value.params.channelId

  return currentChannelId === contact.value.metaId
})

const switchChannel = () => {
  layoutStore.$patch({
    showLeftNav: false,
  })

  if (isActive.value) return

  router.push(`/talk/channels/@me/${contact.value.metaId}`)
}
</script>

<style lang="scss" scoped></style>
