<template>
  <BaseModal v-model="layout[ShowControl.isShowInviteModal]" :extra-close-event="reset">
    <template v-slot:title>
      {{ $t('Talk.Modals.invite_title') }}
    </template>

    <template v-slot:body>
      <div class="grid space-x-4 items-center grid-cols-4">
        <div
          class="main-border p-3 text-base text-dark-800 dark:text-gray-100 still cursor-text col-span-3 select-text truncate"
          id="inviteLink"
          @click="selectLink"
        >
          {{ talk.inviteLink }}
        </div>

        <button
          class="main-border py-3 text-base text-dark-800 bg-primary font-bold col-span-1 text-center"
          :class="{ 'cursor-default still saturate-50': isCopied }"
          @click="copyInviteLink"
        >
          {{ isCopied ? $t('Talk.Modals.copied') : $t('Talk.Modals.copy') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { ShowControl } from '@/enum'
import BaseModal from './BaseModal.vue'
import { useLayoutStore } from '@/stores/layout'
import { ref } from 'vue'
import { useTalkStore } from '@/stores/talk'

const layout = useLayoutStore()
const talk = useTalkStore()
const isCopied = ref(false)

const reset = () => {
  isCopied.value = false
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
</script>
