<template>
  <div
    class="p-3 flex w-full items-center space-x-3 overflow-x-hidden lg:hover:bg-gray-200 lg:cursor-pointer"
  >
    <div class="rounded-3xl w-12 h-12 bg-indigo-200 shrink-0">
      <UserAvatar
        type="metafile"
        :metaId="session.fromAvatarTxId || 'undefined'"
        class="w-13.5 h-13.5 shrink-0 select-none"
        :disabled="true"
      />
    </div>

    <div class="flex flex-col items-stretch grow space-y-0.5 overflow-x-hidden">
      <div class="flex items-baseline justify-between self-stretch">
        <div class="text-base text-dark-800 truncate max-w-[96PX]">
          {{ session.fromName }}
        </div>

        <div class="shrink-0">
          {{ session.timestamp ? formatTimestamp(session.timestamp, i18n, false) : '' }}
        </div>
      </div>
      <div class="text-xs text-dark-300 truncate">
        {{ session.lastMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatTimestamp } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const userStore = useUserStore()
console.log({ user: userStore.user })

const props = defineProps(['session'])
</script>

<style lang="scss" scoped></style>
