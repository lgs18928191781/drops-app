<template>
  <div
    class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white dark:!bg-gray-700 relative group"
    :class="[
      channel.id === talk.activeChannelId || 'faded',
      channel.isPlaceHolder && 'animate-pulse',
    ]"
    @click="goChannel()"
  >
    <span
      class="absolute right-0 top-0 h-full flex items-start top-0 bg-red-500 w-2.5 h-2.5 rounded-full -translate-y-1/3 translate-x-1/3"
      v-if="talk.hasUnreadMessagesOfChannel(channel.id)"
    >
    </span>

    <div
      class="text-dark-800 dark:text-gray-100 text-sm font-medium flex items-center"
      :title="channel.name"
    >
      <Icon
        :name="channelSymbol(channel)"
        class="w-5 h-4 text-dark-400 dark:text-gray-200"
        :class="talk.channelType(channel) === 'FT' ? 'py-0.75' : ''"
      />

      <div class="ml-1 truncate grow">
        {{ channel.name }}
      </div>

      <button
        class="hover:text-dark-800 dark:hover:text-white text-dark-300 dark:text-gray-400"
        :class="[channel.id === talk.activeChannelId ? '' : 'hidden group-hover:!block']"
        @click.stop="popInvite(channel.id)"
      >
        <Icon name="user_plus" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GroupChannelType, JobStatus } from '@/enum'
import { useJobsStore } from '@/stores/jobs'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { defineProps, watch } from 'vue'
import { useRouter } from 'vue-router'

const talk = useTalkStore()
const router = useRouter()
const layout = useLayoutStore()
const props = defineProps(['channel'])

// 如果是占位符，则使用订阅id来观察ws消息
if (props.channel.isPlaceHolder) {
  const jobsStore = useJobsStore()
  watch(
    () => jobsStore.waitingNotify.find(job => job.id === props.channel.subscribeId)?.status,
    status => {
      if (status === JobStatus.Success) {
        // 删除占位符标识，并写入真正的channelId
        props.channel.isPlaceHolder = false
        props.channel.id = jobsStore.waitingNotify
          .find(job => job.id === props.channel.subscribeId)
          ?.steps.at(-1)?.txId
      } else if (status === JobStatus.Failed) {
        // 从列表中删除
        talk.activeCommunityChannels.splice(
          talk.activeCommunityChannels.findIndex(channel => channel.id === props.channel.id),
          1
        )
      }
    }
  )
}

const goChannel = () => {
  if (props.channel.isPlaceHolder) {
    return
  }

  const currentCommunityId = router.currentRoute.value.params.communityId
  const currentChannelId = router.currentRoute.value.params.channelId

  layout.isShowLeftNav = false

  if (currentChannelId === props.channel.id) {
    return
  }

  router.push(`/talk/channels/${currentCommunityId}/${props.channel.id}`)
}

const channelSymbol = (channel: any) => {
  switch (talk.channelType(channel)) {
    case GroupChannelType.PublicText:
      return 'hashtag'
    case GroupChannelType.Password:
      return 'lock'
    case GroupChannelType.NFT:
    case GroupChannelType.ETH_NFT:
      return 'NFT'
    case GroupChannelType.FT:
      return 'FT'
    default:
      return 'hashtag'
  }
}

const popInvite = (channelId: string) => {
  talk.inviteLink = `${location.origin}/talk/channels/${talk.activeCommunityId}/${channelId}`
  talk.invitingChannel = {
    community: talk.activeCommunity,
    channel: talk.activeCommunityChannels.find(c => c.id === channelId),
  }
  layout.isShowInviteModal = true
}
</script>
