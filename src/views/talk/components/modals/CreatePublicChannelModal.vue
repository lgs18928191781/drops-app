<template>
  <BaseModal v-model="layout[ShowControl.isShowCreatePublicChannelModal]">
    <template v-slot:title>
      {{ $t('Talk.Community.create_public_channel') }}
    </template>

    <template v-slot:body>
      <div class="flex flex-col h-full">
        <p class="mt-4.5 text-base text-dark-400 leading-relaxed text-center">
          {{ $t('Talk.Community.create_public_channel_tip') }}
        </p>

        <div class="mt-7.5 w-full">
          <h4 class="text-lg text-dark-800 capitalize">
            {{ $t('Talk.Community.channel_name') }}
          </h4>

          <div class="mt-3">
            <input
              type="text"
              class="outline-0 main-border faded-switch !bg-white still w-full p-4.5 text-base"
              :placeholder="$t('Talk.Community.channel_name')"
              v-model="form.name"
            />
          </div>
        </div>

        <div class="flex items-end justify-end grow lg:mt-8">
          <button
            class="w-14 h-14 main-border primary flex items-center justify-center text-dark-800"
            :class="{ 'faded still text-dark-300': !form.isFinished }"
            :disabled="!form.isFinished"
            @click="tryCreateChannel"
          >
            <Icon name="arrow_right" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { GroupChannelType } from '@/enum'
import { useChannelFormStore } from '@/stores/forms'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'

import { useUserStore } from '@/stores/user'
import { createChannel } from '@/utils/talk'
import { ShowControl } from '@/enum'
import BaseModal from './BaseModal.vue'

const form = useChannelFormStore()
form.type = GroupChannelType.PublicText

const userStore = useUserStore()
const layout = useLayoutStore()
const talkStore = useTalkStore()

const tryCreateChannel = async () => {
  if (!form.isFinished) return

  const { channelId } = await createChannel(form, talkStore.activeCommunityId, userStore.showWallet)
}
</script>
