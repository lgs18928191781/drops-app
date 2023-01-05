<template>
  <div
    class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white dark:!bg-gray-700 relative group"
    :class="[
      channel.id === talk.activeChannelId || 'faded',
      channel.isPlaceHolder && 'animate-pulse',
    ]"
    @click="goChannel()"
    v-loading="loading"
    :element-loading-svg="LoadingTEXT"
  >
    <span
      class="absolute right-0 top-0 flex items-start bg-red-500 w-2.5 h-2.5 rounded-full -translate-y-1/3 translate-x-1/3"
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
        class="hover:text-dark-800 dark:hover:text-white text-dark-300 dark:text-gray-400 mr-2"
        :class="[channel.id === talk.activeChannelId ? '' : 'hidden group-hover:!block']"
        @click.stop="editChannel"
        v-if="talk.isAdmin()"
      >
        <Icon name="edit" class="w-3 h-3" />
      </button>

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
import { Channel } from '@/@types/talk'
import { ChannelRoomType, GroupChannelType, JobStatus } from '@/enum'
import { useChannelFormStore } from '@/stores/forms'
import { useJobsStore } from '@/stores/jobs'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { defineProps, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { GetFT, GetGenesis } from '@/api/aggregation'

const talk = useTalkStore()
const router = useRouter()
const layout = useLayoutStore()
interface Props {
  channel: any
}
const props = withDefaults(defineProps<Props>(), {})
const loading = ref(false)

// 如果是占位符，则使用订阅id来观察ws消息
const jobsStore = useJobsStore()
watch(
  () => jobsStore.waitingNotify.find(job => job.id === props.channel.uuid)?.status,
  status => {
    if (status === JobStatus.Success) {
      const job = jobsStore.waitingNotify.find(job => job.id === props.channel.uuid)
      props.channel.id = job!.steps.at(-1)?.metanetId
      // 删除占位符标识，并写入真正的channelId
      props.channel.isPlaceHolder = false
    } else if (status === JobStatus.Failed) {
      // 从列表中删除
      talk.activeCommunityChannels.splice(
        talk.activeCommunityChannels.findIndex(channel => channel.id === props.channel.uuid),
        1
      )
    }
  }
)

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

async function editChannel() {
  loading.value = true
  // const channel = props.channel as Channel
  // const chanin =
  //   channel.roomType === ChannelRoomType.Publice || channel.roomType === ChannelRoomType.Private
  //     ? null
  //     : channel.roomType === ChannelRoomType.NFT || channel.roomType === ChannelRoomType.FT
  //     ? 'mvc'
  //     : import.meta.env.VITE_ETH_CHAIN
  // let nft: null | UserNFTItem = null
  // let ft: null | FungibleToken = null

  // if (channel.roomType === ChannelRoomType.NFT || channel.roomType === ChannelRoomType.ETHNFT) {
  //   const res = await GetGenesis({
  //     chain: chanin!,
  //     codehash: channel.roomCodeHash!,
  //     genesis: channel.roomGenesis!,
  //   })
  //   if (res.code === 0) {
  //     nft = res.data.results.items[0]
  //   }
  // } else if (channel.roomType === ChannelRoomType.FT) {
  //   const res = await GetFT({
  //     chain: chanin,
  //     codehash: channel.roomCodeHash,
  //     genesis: channel.roomGenesis,
  //   })
  //   if (res.code === 0) {
  //     ft = res.data.results.items[0]
  //   }
  // }

  // const form = useChannelFormStore()
  // form.type = GroupChannelType.PublicText
  // form.name = channel.name
  // form.password = ''
  // form.chain = chanin
  // form.nft = nft
  // form.ft = ft
  // form.amount = 1
  // form.adminOnly = channel.chatSettingType ? true : false // 发言设置，0：所有人，1：管理员
  // form.publicKey = channel.roomPublicKey
  // form.uuid = channel.uuid

  const form = useChannelFormStore()
  await form.recover(props.channel)
  if (props.channel.roomType === '1') {
    layout.isShowCreatePublicChannelModal = true
  } else {
    layout.isShowCreateConsensualChannelModal = true
  }

  loading.value = false
}
</script>
