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
          class="h-full bg-dark-100 dark:bg-gray-800 grow w-60 flex flex-col justify-between items-stretch relative"
        >
          <button
            class="absolute top-[16PX] right-[16PX] flex items-center justify-center outline-0 z-[90] lg:!hidden"
            @click="layout.isShowLeftNav = false"
          >
            <Icon
              name="x_mark"
              class="w-4 h-4 text-dark-400 dark:text-gray-200 cursor-pointer rounded-full bg-gray-200/40 dark:bg-gray-900/40 p-2 box-content"
            />
          </button>

          <div class="flex flex-col overflow-x-hidden">
            <!-- 社区封面 -->
            <div class="w-full aspect-[4/3] mb-1" v-if="talk.activeCommunity?.cover">
              <Image
                :src="talk.activeCommunity?.cover"
                :customClass="'object-cover object-center w-full aspect-[4/3]'"
              />
            </div>

            <!-- 社区信息 -->
            <div class="px-4.5 overflow-y-auto">
              <!-- 社区名 -->
              <div
                class="w-full mt-4 flex items-center space-x-2"
                :title="talk.activeCommunity?.name"
              >
                <span class="text-lg meta-name truncate">{{ talk.activeCommunity?.name }}</span>
                <div
                  class="p-1 bg-gradient-to-tr from-[#F700FB] to-[#FFC051] rounded-sm leading-none text-center flex items-center justify-center shrink-0"
                >
                  <Icon name="N" class="w-2 h-2" />
                </div>
              </div>

              <div
                class="mt-1.5 text-xs text-dark-400 dark:text-gray-200 leading-kinda-loose break-all font-normal"
              >
                {{ talk.activeCommunity?.description || $t('Talk.Community.no_introduction') }}
              </div>

              <!-- 社区介绍 -->
              <div
                class="mt-3 flex w-full items-center justify-between cursor-pointer"
                @click="layout.isShowMemberList = !layout.isShowMemberList"
              >
                <div
                  class="flex items-center justify-between text-xs space-x-2 text-dark-300 dark:text-gray-400"
                >
                  <div class="w-1.5 h-1.5 bg-lime-500 rounded-full"></div>
                  <div class="flex space-x-0.5">
                    <div class="">{{ talk.activeCommunity?.memberTotal || 0 }}</div>
                    <div class="capitalize">
                      {{ $t('Talk.Community.members', talk.activeCommunity?.memberTotal || 0) }}
                    </div>
                  </div>
                </div>
                <Icon name="chevron_right" class="w-3 h-3 text-dark-800 dark:text-gray-100" />
              </div>

              <div
                class="py-8 flex flex-col gap-y-3  border-t border-solid border-dark-200 dark:border-gray-600 pt-4.5 mt-4.5"
              >
                <!-- 管理频道 -->
                <template v-if="talk.isAdmin()">
                  <div class="uppercase text-dark-400 dark:text-gray-200 text-xs">
                    {{ $t('Talk.Community.settings') }}
                  </div>

                  <div
                    class="py-3 px-2 main-border only-bottom cursor-pointer !bg-white dark:!bg-gray-700 relative group mb-4"
                    :class="'settings' === talk.activeChannelId || 'faded'"
                    @click="popSettingsModal()"
                  >
                    <div
                      class="text-dark-800 dark:text-gray-100 text-sm font-medium flex items-center"
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

                <TransitionGroup name="list" tag="div" class="flex flex-col gap-y-3 relative">
                  <CommunityChannelItem
                    v-for="channel in talk.activeCommunityPublicChannels"
                    :key="channel.id"
                    :channel="channel"
                  />
                </TransitionGroup>

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

                <TransitionGroup name="list">
                  <CommunityChannelItem
                    v-for="channel in talk.activeCommunityConsensualChannels"
                    :key="channel.id"
                    :channel="channel"
                  />
                </TransitionGroup>
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
import CreatePublicChannelModal from './modals/CreatePublicChannelModal.vue'
import CreateConsensualChannelModal from './modals/CreateConsensualChannelModal.vue'
import { useLayoutStore } from '@/stores/layout'
import CommunityChannelItem from './CommunityChannelItem.vue'
import { useTalkStore } from '@/stores/talk'
import { useCommunityUpdateFormStore } from '@/stores/forms'

const layout = useLayoutStore()
const talk = useTalkStore()

const popSettingsModal = () => {
  const form = useCommunityUpdateFormStore()
  form.original = talk.activeCommunity
  form.description = talk.activeCommunity.description
  layout.isShowCommunitySettingsModal = true
}
</script>

<style lang="scss" scoped>
*::-webkit-scrollbar {
  width: 0px !important;
}

// .list-leave-active,
.list-move, /* apply transition to moving elements */
.list-enter-active {
  transition: all 0.5s ease !important;
}

// .list-leave-to,
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

// /* ensure leaving items are taken out of layout flow so that moving
//    animations can be calculated correctly. */
// .list-leave-active {
//   position: absolute;
//   width: 100%;
// }
</style>
