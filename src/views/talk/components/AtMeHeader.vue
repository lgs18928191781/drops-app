<template>
  <div
    class="fixed left-0 right-0 top-0 flex items-center px-4 h-12 border-b-2 border-solid border-gray-100 bg-white z-30 lg:h-15 lg:absolute"
  >
    <div class="max-w-[60%] flex items-center">
      <Icon
        name="bars"
        class="w-6 h-6 text-dark-800 mx-2 shrink-0 lg:hidden"
        @click="layout.isShowLeftNav = true"
      />

      <div class="flex shrink-0">
        <div
          class="text-base leading-tight no-wrap grow whitespace-nowrap truncate text-dark-800 pr-2 max-w-[35vw] lg:max-w-[600PX]"
        >
          {{ activeChannel?.name }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between grow">
      <div class="text-xs text-dark-300 bg-dark-100 px-3 py-1 rounded" v-if="activeChannel?.metaId">
        {{ shortenMetaId(activeChannel?.metaId) }}
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

      <LoginedUserOperate />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ScreenModal from './modals/ScreenModal.vue'
import { useLayoutStore } from '@/stores/layout'
import LoginedUserOperate from '@/components/LoginedUserOperate/LoginedUserOperate.vue'
import { useTalkStore } from '@/stores/talk'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const talkStore = useTalkStore()
const userStore = useUserStore()
const layout = useLayoutStore()
const selfMetaId = userStore.user!.metaId
const activeChannel = computed(() => talkStore.activeChannel)

const shortenMetaId = (id: string) => {
  return id.substring(0, 6) + '...' + id.substring(id.length - 6)
}

const doNothing = () => {}
</script>

<style lang=""></style>
