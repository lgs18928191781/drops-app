<template>
  <Teleport to="body" v-if="layout.isShowCreatePublicChannelModal">
    <CreatePublicChannelModal />
  </Teleport>

  <div
    class="bg-white fixed inset-0 h-screen w-screen z-40 lg:static lg:shrink-0 lg:w-auto"
    :class="[layout.isShowLeftNav ? '' : 'hidden lg:block']"
  >
    <div class="w-full h-full flex">
      <div class="shrink-0 bg-white w-22.5 lg:hidden"></div>
      <div class="flex grow">
        <!-- 社区详情栏 -->
        <div class="h-full bg-dark-100 grow lg:w-60 flex flex-col justify-between items-stretch">
          <div class="flex flex-col overflow-y-hidden">
            <!-- 社区封面 -->
            <div class="w-full">
              <Image
                :src="talk.activeCommunity?.cover"
                :customClass="'aspect-[4/3] w-full object-contain object-center'"
                v-if="talk.activeCommunity?.cover"
              />
            </div>

            <!-- 社区信息 -->
            <div class="px-4.5 overflow-y-auto">
              <div
                class="w-full mt-4.5 text-lg text-dark-800 truncate"
                :title="talk.activeCommunity?.name"
              >
                {{ talk.activeCommunity?.name }}
              </div>

              <div class="mt-1.5 text-xs text-dark-400 leading-kinda-loose break-all font-normal">
                {{ talk.activeCommunity?.description || $t('Talk.Community.no_introduction') }}
              </div>

              <div class="mt-3 flex w-full items-center justify-between cursor-pointer">
                <div class="flex items-center justify-between text-xs space-x-2 text-dark-300">
                  <div class="w-1.5 h-1.5 bg-lime-500 rounded-full"></div>
                  <div class="flex space-x-0.5">
                    <div class="">{{ talk.activeCommunity?.memberTotal }}</div>
                    <div class="capitalize">
                      {{ $t('Talk.Community.members', talk.activeCommunity?.memberTotal) }}
                    </div>
                  </div>
                </div>
                <Icon name="chevron_right" class="w-3 h-3 text-dark-800" />
              </div>

              <div
                class="pt-8 pb-4 flex flex-col gap-y-3  border-t border-solid border-dark-200 pt-4.5 mt-4.5"
              >
                <div class="flex justify-between">
                  <div class="uppercase text-dark-400 text-xs">
                    {{ $t('Talk.Community.public_channels') }}
                  </div>
                  <Icon
                    name="plus"
                    class="w-4 h-4 text-black cursor-pointer"
                    v-if="talk.isAdmin(userStore.user!.metaId)"
                    @click="layout.isShowCreatePublicChannelModal = true"
                  />
                </div>
                <div
                  v-for="channel in talk.activeCommunityPublicChannels"
                  class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white relative group"
                  :class="channel.id === talk.activeChannelId || 'faded'"
                  @click="goChannel(channel.id)"
                >
                  <div
                    class="absolute left-0 h-full flex items-center top-0"
                    v-if="talk.hasUnreadMessagesOfChannel(channel.id)"
                  >
                    <span class="w-1.5 h-3 bg-dark-250 rounded-r-md"></span>
                  </div>
                  <div
                    class="text-dark-800 text-base font-medium flex items-center"
                    :title="channel.name"
                  >
                    <Icon name="hashtag" class="w-4 h-4 text-dark-400" />
                    <div class="ml-1 truncate grow">
                      {{ channel.name }}
                    </div>

                    <button
                      class="hover:text-primary text-dark-400 cursor-copy"
                      :class="[
                        channel.id === talk.activeChannelId ? '' : 'hidden group-hover:!block',
                      ]"
                      @click.stop="popInvite(channel.id)"
                    >
                      <Icon name="user_plus" class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div class="flex justify-between mt-4">
                  <div class="uppercase text-dark-400 text-xs">
                    {{ $t('Talk.Community.consensual_channels') }}
                  </div>
                  <Icon
                    name="plus"
                    class="w-4 h-4 text-black cursor-pointer"
                    v-if="talk.isAdmin(userStore.user!.metaId)"
                    @click="layout.isShowCreateConsensualChannelModal = true"
                  />
                </div>

                <div
                  v-for="channel in talk.activeCommunityConsensualChannels"
                  class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white relative group"
                  :class="channel.id === talk.activeChannelId || 'faded'"
                  @click="goChannel(channel.id)"
                >
                  <div
                    class="absolute left-0 h-full flex items-center top-0"
                    v-if="talk.hasUnreadMessagesOfChannel(channel.id)"
                  >
                    <span class="w-1.5 h-3 bg-dark-250 rounded-r-md"></span>
                  </div>
                  <div
                    class="text-dark-800 text-base font-medium flex items-center"
                    :title="channel.name"
                  >
                    <Icon
                      name="lock"
                      class="w-4 h-4 text-dark-400"
                      v-if="talk.channelType(channel) === GroupChannelType.Password"
                    />
                    <div class="ml-1 truncate grow">
                      {{ channel.name }}
                    </div>
                    <button
                      class="hover:text-primary text-dark-400 cursor-copy"
                      :class="[
                        channel.id === talk.activeChannelId ? '' : 'hidden group-hover:!block',
                      ]"
                      @click.stop="popInvite(channel.id)"
                    >
                      <Icon name="user_plus" class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <CreateConsensualChannelModal />
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
import { useUserStore } from '@/stores/user'
import { GroupChannelType } from '@/enum'

const router = useRouter()

const layout = useLayoutStore()
const talk = useTalkStore()
const userStore = useUserStore()

const popInvite = (channelId: string) => {
  talk.inviteLink = `${location.origin}/talk/channels/${talk.activeCommunityId}/${channelId}`
  layout.isShowInviteModal = true
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
  width: 10px;
}

*::-webkit-scrollbar-track {
  background: #edeff2;
}

*::-webkit-scrollbar-thumb {
  background-color: #bfc2cc;
  border-radius: 20px;
}
</style>
