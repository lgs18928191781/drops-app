<template>
  <BaseModal v-model="layout[ShowControl.isShowShareToBuzzModal]" :extra-close-event="reset">
    <template #title>
      {{ $t('Talk.Modals.share_to_buzz_title') }}
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <textarea
          class="main-border !outline-none resize-none still faded-switch px-3 py-4.5 text-base dark:bg-gray-600"
          placeholder="Come Chat!"
          rows="3"
          v-model="inviteText"
        ></textarea>

        <Card :color="'#FF8E68'" class="mt-4.5">
          <div class="flex space-x-3 p-3 dark:!bg-gray-600 rounded-lg">
            <Image
              :src="talk.invitingChannel.community?.icon"
              :customClass="'!w-15 !h-15 rounded-md object-cover object-center'"
            />

            <div class="flex flex-col justify-center space-y-1">
              <div class="flex space-x-1 items-center">
                <span class="text-base meta-name truncate">{{
                  talk.invitingChannel.community?.name
                }}</span>
                <div
                  class="p-1 bg-gradient-to-tr from-[#F700FB] to-[#FFC051] rounded-sm leading-none text-center flex items-center justify-center shrink-0"
                >
                  <Icon name="N" class="w-2 h-2" />
                </div>
              </div>
              <p class="text-dark-400 dark:text-gray-200 text-xs">
                {{ `# ${talk.invitingChannel.channel.name}` }}
              </p>
            </div>
          </div>
        </Card>

        <div class="grow flex items-end justify-end lg:mt-8">
          <button
            class="w-14 h-14 main-border primary flex items-center justify-center"
            :disabled="!isFinished"
            :class="{
              'faded still text-dark-300 dark:!text-gray-400 dark:!bg-gray-700': !isFinished,
            }"
            @click="trySendInviteBuzz"
          >
            <Icon name="arrow_right" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import Card from '@/components/Card/Card.vue'
import { ShowControl } from '@/enum'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { sendInviteBuzz } from '@/utils/talk'
import { ref, computed } from 'vue'
import BaseModal from '../BaseModal.vue'

const layout = useLayoutStore()
const talk = useTalkStore()
const user = useUserStore()
const isFinished = computed(() => inviteText.value.length > 0 && talk.invitingChannel !== null)

const reset = () => {
  talk.invitingChannel = null
}

const inviteText = ref('Come join this community and chat with us!')

const trySendInviteBuzz = async () => {
  if (!isFinished) return

  layout.isShowShareToBuzzModal = false
  layout.isShowLoading = true

  const form = {
    channel: talk.invitingChannel.channel,
    community: talk.invitingChannel.community,
    text: inviteText.value,
  }

  const { txId } = await sendInviteBuzz(form, user.showWallet)
  if (txId) {
    talk.shareToBuzzTxId = txId
  }

  layout.isShowLoading = false
  reset()
  layout[ShowControl.isShowShareSuccessModal] = true

  return
}
</script>
