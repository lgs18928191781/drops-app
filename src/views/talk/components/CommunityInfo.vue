<template>
  <CreatePublicChannelModal v-if="layout.isShowCreatePublicChannelModal" />
  <CreateConsensualChannelModal v-if="layout.isShowCreateConsensualChannelModal" />

  <div
    class="bg-white dark:bg-gray-700 fixed inset-0 h-screen w-screen z-40 lg:static lg:shrink-0 lg:w-auto"
    :class="[layout.isShowLeftNav ? '' : 'hidden lg:block']"
  >
    <div class="w-full h-full flex">
      <div class="shrink-0 bg-white w-22.5 lg:hidden"></div>
      <div class="flex grow">
        <!-- 社区详情栏 -->
        <div
          class="h-full bg-dark-100 dark:bg-gray-800 grow lg:w-60 flex flex-col justify-between items-stretch"
        >
          <div class="flex flex-col overflow-y-hidden">
            <!-- 社区封面 -->
            <div class="w-full aspect-[4/3] mb-1">
              <Image
                :src="talk.activeCommunity?.cover"
                :customClass="'object-cover object-center w-full aspect-[4/3]'"
                v-if="talk.activeCommunity?.cover"
              />
            </div>

            <!-- 社区信息 -->
            <div class="px-4.5 overflow-y-auto">
              <div
                class="w-full mt-4 text-lg text-dark-800 dark:text-white truncate"
                :title="talk.activeCommunity?.name"
              >
                {{ talk.activeCommunity?.name }}
              </div>

              <div
                class="mt-1.5 text-xs text-dark-400 dark:text-gray-200 leading-kinda-loose break-all font-normal"
              >
                {{ talk.activeCommunity?.description || $t('Talk.Community.no_introduction') }}
              </div>

              <div
                class="mt-3 flex w-full items-center justify-between cursor-pointer"
                @click="layout.isShowMemberList = !layout.isShowMemberList"
              >
                <div
                  class="flex items-center justify-between text-xs space-x-2 text-dark-300 dark:text-gray-400"
                >
                  <div class="w-1.5 h-1.5 bg-lime-500 rounded-full"></div>
                  <div class="flex space-x-0.5">
                    <div class="">{{ talk.activeCommunity?.memberTotal }}</div>
                    <div class="capitalize">
                      {{ $t('Talk.Community.members', talk.activeCommunity?.memberTotal) }}
                    </div>
                  </div>
                </div>
                <Icon name="chevron_right" class="w-3 h-3 text-dark-800 dark:text-gray-100" />
              </div>

              <div
                class="py-8 flex flex-col gap-y-3  border-t border-solid border-dark-200 dark:border-gray-600 pt-4.5 mt-4.5"
              >
                <!-- 管理频道 -->
                <!-- <template v-if="talk.isAdmin()"> -->
                <template v-if="false">
                  <div class="uppercase text-dark-400 dark:text-gray-200 text-xs">
                    {{ $t('Talk.Community.settings') }}
                  </div>

                  <div
                    class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white relative group mb-4"
                    :class="'settings' === talk.activeChannelId || 'faded'"
                    @click="goChannel('settings')"
                  >
                    <div
                      class="text-dark-800 dark:text-gray-100 text-base font-medium flex items-center"
                      :title="$t('Talk.Community.settings')"
                    >
                      <Icon name="hashtag" class="w-5 h-4 text-dark-400 dark:text-gray-200" />
                      <div class="ml-1 truncate grow capitalize">
                        {{ $t('Talk.Community.settings_short') }}
                      </div>
                      <Icon
                        name="settings"
                        class="w-4 h-4 text-dark-800 dark:text-gray-100 box-content ml-auto"
                      />
                    </div>
                  </div>
                </template>

                <!-- 公共频道 -->
                <div class="flex justify-between">
                  <div class="uppercase text-dark-400 dark:text-gray-200 text-xs">
                    {{ $t('Talk.Community.public_channels') }}
                  </div>
                  <Icon
                    name="plus"
                    class="w-4 h-4 text-black dark:text-white cursor-pointer"
                    v-if="talk.isAdmin()"
                    @click="layout.isShowCreatePublicChannelModal = true"
                  />
                </div>

                <div
                  v-for="channel in talk.activeCommunityPublicChannels"
                  class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white dark:!bg-gray-700 relative group"
                  :class="channel.id === talk.activeChannelId || 'faded'"
                  @click="goChannel(channel.id)"
                >
                  <!-- <div
                    class="absolute left-0 h-full flex items-center top-0"
                    v-if="talk.hasUnreadMessagesOfChannel(channel.id)"
                  >
                    <span class="w-1.5 h-3 bg-dark-250 rounded-r-md"></span>
                  </div> -->

                  <span
                    class="absolute right-0 top-0 h-full flex items-start top-0 bg-red-500 w-2.5 h-2.5 rounded-full -translate-y-1/3 translate-x-1/3"
                    v-if="talk.hasUnreadMessagesOfChannel(channel.id)"
                  >
                  </span>

                  <div
                    class="text-dark-800 dark:text-gray-100 text-base font-medium flex items-center"
                    :title="channel.name"
                  >
                    <Icon
                      :name="channelSymbol(channel)"
                      class="w-5 h-4 text-dark-400 dark:text-gray-200"
                    />

                    <div class="ml-1 truncate grow">
                      {{ channel.name }}
                    </div>

                    <button
                      class="hover:text-dark-800 dark:text-gray-100 text-dark-300 dark:text-gray-400 cursor-copy"
                      :class="[
                        channel.id === talk.activeChannelId ? '' : 'hidden group-hover:!block',
                      ]"
                      @click.stop="popInvite(channel.id)"
                    >
                      <Icon name="user_plus" class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- 凭证频道 -->
                <div class="flex justify-between mt-4">
                  <div class="uppercase text-dark-400 dark:text-gray-200 text-xs">
                    {{ $t('Talk.Community.consensual_channels') }}
                  </div>
                  <Icon
                    name="plus"
                    class="w-4 h-4 text-black dark:text-white cursor-pointer"
                    v-if="talk.isAdmin()"
                    @click="layout.isShowCreateConsensualChannelModal = true"
                  />
                </div>

                <div
                  v-for="channel in talk.activeCommunityConsensualChannels"
                  class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white dark:!bg-gray-700 relative group"
                  :class="channel.id === talk.activeChannelId || 'faded'"
                  @click="goChannel(channel.id)"
                >
                  <!-- <div
                    class="absolute left-0 h-full flex items-center top-0"
                    v-if="talk.hasUnreadMessagesOfChannel(channel.id)"
                  >
                    <span class="w-1.5 h-3 bg-dark-250 rounded-r-md"></span>
                  </div> -->

                  <span
                    class="absolute right-0 top-0 h-full flex items-start top-0 bg-red-500 w-2.5 h-2.5 rounded-full -translate-y-1/3 translate-x-1/3"
                    v-if="talk.hasUnreadMessagesOfChannel(channel.id)"
                  >
                  </span>
                  <div
                    class="text-dark-800 dark:text-gray-100 text-base font-medium flex items-center"
                    :title="channel.name"
                  >
                    <Icon
                      :name="channelSymbol(channel)"
                      class="w-5 h-4 text-dark-400 dark:text-gray-200"
                      v-if="talk.channelType(channel) === GroupChannelType.Password"
                    />
                    <div
                      class="text-xxs tracking-tighter italic font-bold min-w-[20PX] text-dark-400 dark:text-gray-200 text-center"
                      v-if="talk.channelType(channel) == GroupChannelType.NFT"
                    >
                      NFT
                    </div>
                    <div
                      class="text-xxs tracking-tighter italic font-bold min-w-[20PX] text-dark-400 dark:text-gray-200 text-center"
                      v-if="talk.channelType(channel) == GroupChannelType.FT"
                    >
                      FT
                    </div>
                    <div class="ml-1 truncate grow">
                      {{ channel.name }}
                    </div>
                    <button
                      class="hover:text-dark-800 dark:text-gray-100 text-dark-300 dark:text-gray-400 cursor-copy"
                      :class="[
                        channel.id === talk.activeChannelId ? '' : 'hidden group-hover:!block',
                      ]"
                      @click.stop="popInvite(channel.id)"
                    >
                      <Icon name="user_plus" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户信息设置 -->
          <!-- <UserProfile class="shrink-0" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import CreatePublicChannelModal from './modals/CreatePublicChannelModal.vue'
import CreateConsensualChannelModal from './modals/CreateConsensualChannelModal.vue'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { GroupChannelType } from '@/enum'

const router = useRouter()

const layout = useLayoutStore()
const talk = useTalkStore()

const popInvite = (channelId: string) => {
  talk.inviteLink = `${location.origin}/talk/channels/${talk.activeCommunityId}/${channelId}`
  layout.isShowInviteModal = true
}

const channelSymbol = (channel: any) => {
  switch (talk.channelType(channel)) {
    case GroupChannelType.PublicText:
      return 'hashtag'
    case GroupChannelType.Password:
      return 'lock'
    case GroupChannelType.NFT:
      return ''
    case GroupChannelType.FT:
      return ''
    default:
      return 'hashtag'
  }
}

const goChannel = (channelId: string) => {
  const currentCommunityId = router.currentRoute.value.params.communityId
  const currentChannelId = router.currentRoute.value.params.channelId

  layout.isShowLeftNav = false

  if (currentChannelId === channelId) {
    return
  }

  router.push(`/talk/channels/${currentCommunityId}/${channelId}`)
}
</script>
<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 0px;
}

*::-webkit-scrollbar-track {
  background: #f5f7fa;
}

*::-webkit-scrollbar-thumb {
  background-color: #f5f7fa;
  border-radius: 20px;
}
</style>
