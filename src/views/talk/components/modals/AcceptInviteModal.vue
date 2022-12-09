<template>
  <BaseModal
    v-model="layout[ShowControl.isShowAcceptInviteModal]"
    :no-close="true"
    :full-screen="true"
  >
    <template #title>
      {{ $t('Talk.Modals.accept_invite') }}
    </template>

    <template #body>
      <div class="flex flex-col items-center justify-center">
        <p class="text-base text-dark-400 font-medium">
          {{ $t('Talk.Modals.you_have_been_invited') }}
        </p>

        <div class="flex items-center gap-x-3 mt-6">
          <Image
            :src="talk.activeCommunity?.icon"
            :customClass="
              '!w-13.5 !h-13.5 rounded-3xl object-cover object-center lg:group-hover:scale-110 transition-all duration-200'
            "
          />
          <div class="flex flex-col">
            <h4 class="text-2xl font-bold text-dark-800 tracking-wider">
              {{ talk.activeCommunity?.name }}
            </h4>

            <div class="flex space-x-2 items-center">
              <div class="w-2.5 h-2.5 bg-lime-500 rounded-full"></div>
              <div class="text-dark-400 text-sm">
                {{ talk.activeCommunity?.memberTotal }}
                {{ $t('Talk.Community.members', talk.activeCommunity?.memberTotal) }}
              </div>
            </div>
          </div>
        </div>

        <div class="mt-11 w-full">
          <Button
            class="w-full main-border bg-primary font-medium text-base py-3 outline-0"
            @click="tryJoinCommunity"
          >
            {{ $t('Talk.Modals.accept_invite') }}
          </Button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { ShowControl } from '@/enum'
import BaseModal from './BaseModal.vue'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { joinCommunity } from '@/utils/talk'
import { useUserStore } from '@/stores/user'

const layout = useLayoutStore()
const talk = useTalkStore()
const user = useUserStore()

const tryJoinCommunity = async () => {
  layout[ShowControl.isShowAcceptInviteModal] = false
  layout.isShowLoading = true
  await joinCommunity(talk.activeCommunityId, user.showWallet)
  layout.isShowLoading = false

  await talk.initChannelMessages(talk.selfMetaId)
  await talk.initWebSocket()
}
</script>
