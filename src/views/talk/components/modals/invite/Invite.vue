<template>
  <BaseModal v-model="layout[ShowControl.isShowInviteModal]" :extra-close-event="reset">
    <template #title>
      {{ $t('Talk.Modals.invite_title') }}
    </template>

    <template #body>
      <p class="mb-3 text-base">{{ $t('Talk.Modals.share_invite_link_tip') }}</p>
      <div class="grid space-x-4 items-center grid-cols-4">
        <div
          class="main-border p-3 text-base text-dark-800 dark:text-gray-100 still cursor-text col-span-3 select-text truncate"
          id="inviteLink"
          @click="selectLink"
        >
          {{ talk.inviteLink }}
        </div>

        <button
          class="main-border py-3 text-base text-dark-800 primary font-bold col-span-1 text-center"
          :class="{ 'cursor-default still saturate-50': isCopied }"
          @click="copyInviteLink"
        >
          {{ isCopied ? $t('Talk.Modals.copied') : $t('Talk.Modals.copy') }}
        </button>
      </div>

      <div class="mt-8">
        <p class="text-base mb-3">
          {{ $t('Talk.Modals.share_to_buzz_tip') }}
        </p>
        <button
          class="main-border primary flex items-center w-full justify-center space-x-1.5 py-3 font-bold"
          @click="shareToBuzz"
        >
          <Icon name="share_arrow" class="w-6 h-6" />
          <span class="text-base">{{ $t('Talk.Modals.share_to_buzz_button') }}</span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { ShowControl } from '@/enum'
import BaseModal from '../BaseModal.vue'
import { useLayoutStore } from '@/stores/layout'
import { ref } from 'vue'
import { useTalkStore } from '@/stores/talk'

const layout = useLayoutStore()
const talk = useTalkStore()
const isCopied = ref(false)

const reset = () => {
  isCopied.value = false
  talk.inviteLink = ''
}

const selectLink = () => {
  const range = document.createRange()
  const selection = window.getSelection()
  const link = document.getElementById('inviteLink') as HTMLElement

  range.selectNodeContents(link)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

const copyInviteLink = () => {
  navigator.clipboard.writeText(talk.inviteLink)
  isCopied.value = true
}

const shareToBuzz = () => {
  layout[ShowControl.isShowInviteModal] = false
  layout[ShowControl.isShowShareToBuzzModal] = true
}
</script>
