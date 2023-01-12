<template>
  <div
    class="fixed left-0 right-0 top-0 flex items-center px-4 h-12 border-b-2 border-solid border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-700 z-30 lg:h-15 lg:absolute"
  >
    <div class="max-w-[60%] flex items-center">
      <Icon
        name="bars"
        class="w-6 h-6 text-dark-800 dark:text-gray-100 mx-2 shrink-0 lg:hidden"
        @click="layout.isShowLeftNav = true"
      />

      <div class="flex shrink-0 items-center">
        <div class=" hidden lg:block" v-if="talkStore.isActiveChannelReserved">
          <!-- 图标：仅保留频道拥有 -->
          <Image
            v-if="talkStore.activeCommunity?.icon"
            :src="talkStore.activeCommunity.icon"
            :customClass="'!w-8 !h-8 rounded-2xl object-cover object-center mr-2'"
          />
        </div>

        <!-- 功能频道头 -->
        <div class="" v-if="talkStore.isActiveChannelGeneral && talkStore.activeChannel?.nameKey">
          {{ $t(talkStore.activeChannel.nameKey) }}
        </div>

        <template v-else>
          <div
            :class="[
              talkStore.isActiveChannelReserved ? 'meta-name' : 'text-dark-800 dark:text-white',
              'text-base leading-tight no-wrap grow whitespace-nowrap truncate mr-2 max-w-[35vw] lg:max-w-[600PX] capitalize',
            ]"
          >
            {{
              talkStore.isActiveChannelReserved
                ? talkStore.activeCommunity?.name
                : talkStore.activeChannel?.name || talkStore.activeCommunity?.name
            }}
          </div>

          <template v-if="talkStore.activeChannel?.name && !talkStore.isActiveChannelReserved">
            <div
              class="border-r border-solid border-dark-300 dark:border-gray-400 hidden lg:block"
            ></div>
            <div
              class="text-base leading-tight no-wrap grow whitespace-nowrap text-dark-300 dark:text-gray-400 px-2 hidden lg:block capitalize"
            >
              {{
                talkStore.isActiveChannelPublic
                  ? $t('Talk.Channel.public_channel')
                  : $t('Talk.Channel.private_channel')
              }}
            </div>
          </template>
        </template>
      </div>
    </div>
    <div class="flex flex-row-reverse items-center justify-between grow">
      <div class="shrink-0 flex items-center">
        <LoginedUserOperate />
      </div>

      <div
        class="ml-1 hidden lg:flex lg:items-center group"
        v-if="!talkStore.isActiveChannelGeneral && talkStore.activeChannel?.id"
      >
        <div
          class="text-xs text-dark-300 dark:text-gray-400 bg-dark-100 dark:bg-gray-800 px-3 py-1 rounded"
        >
          {{ shortenMetaId(talkStore.activeChannel.id) }}
        </div>
        <Icon
          name="arrow_up_right"
          class="w-3 h-3 p-1 box-content text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hidden group-hover:block cursor-pointer"
          @click="goCheckTxId(talkStore.activeChannel?.txId)"
        />
      </div>

      <div
        class="ml-1 hidden lg:flex lg:items-center group"
        v-else-if="talkStore.isActiveChannelReserved && talkStore.activeCommunityId"
      >
        <div
          class="text-xs text-dark-300 dark:text-gray-400 bg-dark-100 dark:bg-gray-800 px-3 py-1 rounded"
        >
          {{ shortenMetaId(talkStore.activeCommunityId) }}
        </div>
        <Icon
          name="arrow_up_right"
          class="w-3 h-3 p-1 box-content text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hidden group-hover:block cursor-pointer"
          @click="goCheckTxId(talkStore.activeCommunity?.txId)"
        />
      </div>

      <!-- 占位 -->
      <div v-else class="w-1"></div>
      <!-- <div
        class="grow-0 pl-3 pr-2 truncate text-xs leading-tight overflow-x-hidden py-1 text-dark-800"
        @click="showDescModal = true"
      >
        {{ channel.description }}
      </div>
      <Teleport to="body">
        <ScreenModal
          v-if="showDescModal"
          :name="name"
          :description="description"
          @close-modal="showDescModal = false"
        />
      </Teleport> -->

      <!-- <div class="flex gap-x-4">
        <div class="" @click="doNothing()">
          <Icon
            name="share"
            class="w-5 h-5 transition-all ease-in-out duration-300 lg:hover:text-primary cursor-pointer"
          />
        </div>

        <div class="w-5 h-5" @click="$emit('toggleMemberList')">
          <Icon
            name="users"
            class="w-5 h-5 transition-all ease-in-out duration-300 lg:hover:text-primary cursor-pointer"
            :class="[showMembers ? 'text-primary lg:text-dark-800' : 'text-dark-800']"
          />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ScreenModal from './modals/ScreenModal.vue'
import { useLayoutStore } from '@/stores/layout'
import LoginedUserOperate from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import { useTalkStore } from '@/stores/talk'

const talkStore = useTalkStore()
const layout = useLayoutStore()
const channel = talkStore.activeChannel

const showDescModal = ref(false)

const shortenMetaId = (id: string) => {
  return id.substring(0, 6) + '...' + id.substring(id.length - 6)
}

const createCommunity = () => {
  console.log('createCommunity')
}

const goCheckTxId = (txId: string) => {
  window.open(`https://mvcscan.com/tx/${txId}`, '_blank')
}

const doNothing = () => {}
</script>

<style lang=""></style>
