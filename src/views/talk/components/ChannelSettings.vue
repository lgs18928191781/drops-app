<template>
  <div class="h-full flex flex-col justify-center items-center">
    <h3 class="text-xl lg:text-2xl text-dark-800 capitalize font-thin">
      {{ $t('Talk.Channel.welcome') }}
    </h3>
    <h3 class="text-2xl lg:text-3xl text-dark-800 capitalize mt-1 font-medium text-center">
      {{ talk.activeCommunity?.name }}
    </h3>

    <!-- 功能 -->
    <div class="flex flex-col items-center mt-8 space-y-2">
      <div
        class="p-3 w-[80vw] lg:w-90 bg-white rounded-xl flex items-center justify-between cursor-pointer group"
        v-for="utility in utilities"
        :key="utility.name"
        @click="utility.action"
      >
        <div class="flex items-center space-x-3">
          <Icon
            :name="utility.icon"
            class="w-6 h-6 text-dark-800 rounded-full p-1.5 cursor-pointer box-content"
            :class="utility.bgColor"
          />
          <p class="text-base group-hover:underline">{{ $t(utility.name) }}</p>
        </div>

        <Icon name="chevron_right" class="w-4 h-4 text-dark-800" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { ref } from 'vue'

const talk = useTalkStore()
const layout = useLayoutStore()

const utilities = ref([
  {
    name: 'Talk.Channel.utilities.invite',
    icon: 'user_plus',
    bgColor: 'bg-green-400',
    action: () => {
      talk.inviteLink = `${location.origin}/talk/channels/${talk.activeCommunityId}/the-void`
      talk.invitingChannel = {
        community: talk.activeCommunity,
        channel: null,
      }
      layout.isShowInviteModal = true
    },
  },
  {
    name: 'Talk.Channel.utilities.learn',
    icon: 'rocket',
    bgColor: 'bg-yellow-400',
    action: () => {
      console.log('join')
    },
  },
  {
    name: 'Talk.Channel.utilities.download',
    icon: 'phone',
    bgColor: 'bg-blue-400',
    action: () => {
      console.log('invite')
    },
  },
])
</script>
