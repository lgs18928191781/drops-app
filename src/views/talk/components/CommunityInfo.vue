<template>
  <Teleport to="body" v-if="layoutStore.isShowCreateChannelModal">
    <CreateChannelModal />
  </Teleport>

  <div
    class="bg-white fixed inset-0 h-screen w-screen z-40 lg:static lg:shrink-0 lg:w-auto"
    :class="[layoutStore.isShowLeftNav ? '' : 'hidden lg:block']"
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
                :src="talkStore.activeCommunity?.cover"
                class="aspect-[4/3] w-full object-cover object-center"
                v-if="talkStore.activeCommunity?.cover"
              />
            </div>

            <!-- 社区信息 -->
            <div class="px-4.5 overflow-y-auto">
              <div class="w-full mt-4.5 text-lg text-dark-800">
                {{ talkStore.activeCommunity?.name }}
              </div>

              <div class="mt-1.5 text-xs text-dark-400 leading-kinda-loose break-all font-normal">
                {{ talkStore.activeCommunity?.description || $t('Talk.Community.no_introduction') }}
              </div>

              <div class="mt-3 flex w-full items-center justify-between cursor-pointer">
                <div class="flex items-center justify-between text-xs space-x-2 text-dark-300">
                  <div class="w-1.5 h-1.5 bg-lime-500 rounded-full"></div>
                  <div class="flex space-x-0.5">
                    <div class="">{{ talkStore.members?.length }}</div>
                    <div class="capitalize">
                      {{ $t('Talk.Community.members', talkStore.members?.length) }}
                    </div>
                  </div>
                </div>
                <Icon name="chevron_right" class="w-3 h-3 text-dark-800" />
              </div>

              <div
                class="pt-8 pb-4 flex flex-col gap-y-3  border-t border-solid border-dark-200 pt-4.5 mt-4.5"
              >
                <div class="flex items-center justify-between">
                  <div class="uppercase text-dark-400 text-xs">
                    {{ $t('Talk.Community.public_channels') }}
                  </div>
                  <Icon
                    name="plus"
                    class="w-4 h-4 text-black cursor-pointer"
                    v-if="talkStore.isAdmin(userStore.user!.metaId)"
                    @click="layoutStore.isShowCreateChannelModal = true"
                  />
                </div>
                <div
                  v-for="channel in talkStore.activeCommunity?.channels"
                  class="p-3 main-border only-bottom cursor-pointer bg-white"
                  :class="channel.id === talkStore.activeChannelId || 'faded'"
                  @click="goChannel(channel.id)"
                >
                  <div
                    class="text-dark-800 text-base font-medium flex items-center"
                    :title="channel.name"
                  >
                    <Icon name="hashtag" class="w-4 h-4 text-dark-400" />
                    <div class="ml-2 truncate">
                      {{ channel.name }}
                    </div>
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
import MetabotBanner from '@/assets/images/metabot_banner.png?url'
import CreateChannelModal from './modals/CreateChannelModal.vue'
import UserProfile from './UserProfile.vue'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'

const router = useRouter()

const layoutStore = useLayoutStore()
const talkStore = useTalkStore()
const userStore = useUserStore()

const goChannel = (channelId: string) => {
  const currentCommunityId = router.currentRoute.value.params.communityId
  const currentChannelId = router.currentRoute.value.params.channelId

  layoutStore.isShowLeftNav = false

  if (currentChannelId === channelId) {
    return
  }

  router.push(`/talk/channels/${currentCommunityId}/${channelId}`)
}
</script>
<style lang=""></style>
