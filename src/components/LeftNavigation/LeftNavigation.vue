<template>
  <!-- 社区列表 -->
  <div
    class="w-22.5 bg-white dark:bg-gray-700 space-y-4.5 left-navigation z-50"
    :class="[layout.isShowLeftNav ? '' : 'hidden lg:block']"
  >
    <div class="space-y-4.5">
      <el-tooltip
        effect="light"
        popper-class="text-dark-800 dark:text-dark-200 text-base font-medium py-2 px-4 shadow-md rounded-lg"
        :content="item.title"
        offset="5"
        placement="right"
        :disabled="isMobile"
        v-for="(item, index) in apps"
      >
        <router-link
          :to="item.path"
          class="flex items-center justify-center group relative"
          :class="item.extraClass"
          :key="index"
        >
          <div
            class="absolute left-0 h-full flex items-center top-0"
            v-if="item.icon === 'talk' && talk.hasUnreadMessagesOfCommunity('@me')"
          >
            <span
              class="w-1.5 h-3 bg-dark-800 dark:bg-gray-200 rounded-r-md lg:group-hover:h-6 transition-all duration-150"
            ></span>
          </div>
          <span
            class="absolute left-0 bg-dark-800 dark:bg-gray-200 w-1.5 h-7 rounded-r-md"
            v-if="route.path.includes(item.symbol)"
          ></span>
          <span
            class="bg-primary w-13.5 h-13.5 flex items-center justify-center rounded-3xl group-hover:scale-110 transition-all duration-200"
          >
            <Icon
              :name="item.icon"
              class="w-[22PX] h-[19PX] rounded-3xl lg:group-hover:scale-110 transition-all duration-200"
            />
          </span>
        </router-link>
      </el-tooltip>
    </div>

    <div class="divide flex items-center justify-center">
      <div class="w-7.5 border-b-2 border-solid border-dark-100 dark:border-gray-600"></div>
    </div>

    <div class="space-y-4.5 flex flex-col items-center justify-center">
      <el-tooltip
        effect="light"
        popper-class="text-dark-800 dark:text-dark-200 text-base font-medium py-2 px-4 shadow-md rounded-lg"
        :content="community.name"
        offset="5"
        placement="right"
        :disabled="isMobile"
        v-for="(community, index) in talk.realCommunities"
      >
        <router-link
          :to="
            '/talk/channels/' + community.id + '/' + talk.communityLastReadChannelId(community.id)
          "
          class="flex items-center justify-center relative w-full group"
          :key="index"
        >
          <div
            class="absolute left-0 h-full flex items-center top-0"
            v-if="talk.hasUnreadMessagesOfCommunity(community.id)"
          >
            <span
              class="w-1.5 h-3 bg-dark-800 dark:bg-gray-200 rounded-r-md lg:group-hover:h-6 transition-all duration-150"
            ></span>
          </div>
          <span
            class="absolute left-0 bg-dark-800 dark:bg-gray-200 w-1.5 h-8 rounded-r-md"
            v-if="talk.activeCommunityId === community.id && route.path.includes('talk')"
          ></span>

          <Image
            :src="community.icon"
            :customClass="
              '!w-13.5 !h-13.5 rounded-3xl object-cover object-center lg:group-hover:scale-110 transition-all duration-200'
            "
          />
        </router-link>
      </el-tooltip>

      <div
        class="border-dashed border-2 border-gray-200 dark:border-gray-600 w-13.5 h-13.5 flex items-center justify-center rounded-3xl text-dark-400 cursor-pointer hover:text-dark-800 hover:border-solid hover:border-dark-300 hover:bg-primary transition-all duration-300"
        @click="layout.isShowCreateCommunityModal = true"
      >
        <Icon name="plus" class="w-[24PX] h-[24PX]" />
      </div>
    </div>

    <!-- modals -->
    <Teleport to="body" v-if="layout.isShowCreateCommunityModal">
      <CreateCommunityModal />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { getCommunities } from '@/api/talk'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { isMobile } from '@/stores/root'
import CreateCommunityModal from '@/views/talk/components/modals/CreateCommunityModal.vue'
import { onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
const layout = useLayoutStore()
const talk = useTalkStore()
const userStore = useUserStore()
const route = useRoute()
const i18n = useI18n()

const fetchCommunities = async () => {
  const selfMetaId = userStore.user?.metaId
  if (!selfMetaId) return
  const communities = await getCommunities({ metaId: selfMetaId })
  talk.$patch(state => {
    state.communities = [...communities, talk.atMeCommunity]
  })
}

const apps = [
  {
    icon: 'feed',
    path: '/buzz',
    extraClass: 'left-navigation-item',
    title: i18n.t('Talk.Community.feed'),
    symbol: 'buzz',
  },
  {
    icon: 'talk',
    path: '/talk/channels/@me',
    title: i18n.t('Talk.Community.atme'),
    symbol: '@me',
  },
]

if (userStore.isAuthorized) {
  fetchCommunities()
  talk.initCommunityChannelIds()
  talk.initReadPointers()
  talk.initWebSocket()
}

watch(
  () => userStore.isAuthorized,
  isAuthorized => {
    if (isAuthorized) {
      fetchCommunities()
      talk.initCommunityChannelIds()
      talk.initReadPointers()
      talk.initWebSocket()
    } else {
      talk.reset()
      talk.closeWebSocket()
      talk.saveReadPointers()
      talk.closeReadPointerTimer()
    }
  }
)

onBeforeUnmount(() => {
  talk.closeWebSocket()
  talk.saveReadPointers()
  talk.closeReadPointerTimer()
})
</script>

<style lang="scss" scoped src="./LeftNavigation.scss"></style>
