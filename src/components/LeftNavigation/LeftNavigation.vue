<template>
  <!-- 社区列表 -->
  <div
    class="w-22.5 bg-white space-y-4.5 left-navigation z-50"
    :class="[layoutStore.isShowLeftNav ? '' : 'hidden lg:block']"
  >
    <div class="space-y-4.5">
      <router-link
        :to="item.path"
        class="flex items-center justify-center left-navigation-item"
        v-for="(item, index) in apps"
        :key="index"
      >
        <span class="bg-primary w-13.5 h-13.5 flex items-center justify-center rounded-3xl">
          <Icon :name="item.icon" class="w-[22PX] h-[19PX] rounded-3xl" />
        </span>
      </router-link>
      <!-- <div class="rounded-3xl bg-primary w-13.5 h-13.5 flex items-center justify-center">
        <Icon name="talk" class="w-[22PX] h-[19PX]" />
      </div> -->
    </div>

    <div class="divide flex items-center justify-center">
      <div class="w-7.5 border-b-2 border-solid border-dark-100"></div>
    </div>

    <div class="space-y-4.5 flex flex-col items-center justify-center">
      <router-link
        :to="'/talk/channels/' + community.id"
        class="flex items-center justify-center left-navigation-item relative"
        v-for="(community, index) in talkStore.realCommunities"
        :key="index"
      >
        <span
          class="absolute left-0 bg-dark-800 w-1.5 h-6 rounded-r-md"
          v-if="talkStore.activeCommunityId === community.id"
        ></span>
        <span class="bg-sky-200 w-13.5 h-13.5 flex items-center justify-center rounded-3xl">
          <Icon :name="community.icon" class="w-[22PX] h-[19PX] rounded-3xl" />
        </span>
      </router-link>

      <div
        class="border-dashed border-2 border-gray-200 w-13.5 h-13.5 flex items-center justify-center rounded-3xl text-dark-400 cursor-pointer hover:text-dark-800 hover:border-solid hover:border-dark-300 hover:bg-primary transition-all duration-300"
        @click="layoutStore.isShowCreateCommunityModal = true"
      >
        <Icon name="plus" class="w-[24PX] h-[24PX]" />
      </div>
    </div>

    <!-- modals -->
    <Teleport to="body" v-if="layoutStore.isShowCreateCommunityModal">
      <CreateCommunityModal />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { getCommunities } from '@/api/talk'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import CreateCommunityModal from '@/views/talk/components/modals/CreateCommunityModal.vue'
const layoutStore = useLayoutStore()
const talkStore = useTalkStore()
const userStore = useUserStore()

const fetchCommunities = async () => {
  const selfMetaId = userStore.user?.metaId
  if (!selfMetaId) return
  const communities = await getCommunities({ metaId: selfMetaId })
  talkStore.$patch(state => {
    state.communities = [...communities, talkStore.atMeCommunity]
  })
}

const apps = [
  {
    icon: 'feed',
    path: '/buzz',
  },
  {
    icon: 'talk',
    path: '/talk/channels/@me',
  },
]

if (userStore.isAuthorized) {
  fetchCommunities()
}
</script>

<style lang="scss" scoped src="./LeftNavigation.scss"></style>
