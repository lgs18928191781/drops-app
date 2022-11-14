<template>
  <div
    class="fixed left-0 right-0 top-0 flex items-center px-4 h-12 border-b-2 border-solid border-gray-100 bg-white z-30 lg:absolute"
  >
    <div class="max-w-[60%] flex items-center">
      <Icon
        name="bars"
        class="w-6 h-6 text-dark-800 mx-2 shrink-0 lg:hidden"
        @click="layoutStore.showLeftNav = true"
      />

      <div class="flex shrink-0">
        <div
          class="text-base leading-tight no-wrap grow whitespace-nowrap truncate text-dark-800 pr-2 max-w-[35vw] lg:max-w-[600PX]"
        >
          {{ channel.name }}
        </div>

        <div class="border-r border-solid border-dark-300 hidden lg:block"></div>
        <div
          class="text-base leading-tight no-wrap grow whitespace-nowrap text-dark-300 px-2 hidden lg:block capitalize"
        >
          {{
            channel.isPublic
              ? $t('Talk.Channel.public_channel')
              : $t('Talk.Channel.private_channel')
          }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between grow">
      <div class="text-xs text-dark-300 bg-dark-100 px-3 py-1 ml-1 rounded" v-if="channel?.groupId">
        {{ shortenMetaId(channel.groupId) }}
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

      <div class="flex gap-x-4">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ScreenModal from './ScreenModal.vue'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

const props = defineProps(['channel', 'showMembers'])
const showDescModal = ref(false)

const shortenMetaId = (id: string) => {
  return id.substring(0, 6) + '...' + id.substring(id.length - 6)
}

const createCommunity = () => {
  console.log('createCommunity')
}

const doNothing = () => {}
</script>

<style lang=""></style>
