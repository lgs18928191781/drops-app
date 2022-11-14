<template>
  <div
    class="bg-white fixed inset-0 h-screen w-screen z-50 lg:static lg:shrink-0 lg:w-auto"
    :class="[showCommunitySection ? '' : 'hidden lg:block']"
  >
    <div class="h-full flex">
      <!-- 社区详情栏 -->
      <div class="h-full bg-dark-100 grow lg:w-60 flex flex-col justify-between items-stretch">
        <div class="flex flex-col overflow-y-hidden">
          <!-- 社区封面 -->
          <div class="w-full">
            <img
              :src="MetabotBanner"
              alt=""
              class="aspect-[4/3] w-full object-cover object-center"
            />
          </div>

          <!-- 社区信息 -->
          <div class="px-4.5 overflow-y-auto">
            <div class="w-full mt-4.5 text-lg text-dark-800">
              {{ community.name }}
            </div>

            <div class="mt-1.5 text-xs text-dark-400 leading-kinda-loose break-all font-normal">
              {{ community.description }}
            </div>

            <div class="pt-8 pb-4 flex flex-col gap-y-3">
              <div
                v-for="channel in community.channels"
                class="p-3 main-border only-bottom cursor-pointer"
                :class="channel.in || 'faded'"
              >
                <div
                  class="text-dark-800 text-base font-medium flex items-center"
                  @click="goChannel(channel.id)"
                >
                  <Icon name="hashtag" class="w-4 h-4 text-dark-400" />
                  <div class="ml-2">
                    {{ channel.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户信息设置 -->
        <UserProfile class="shrink-0" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import MetabotBanner from '@/assets/images/metabot_banner.png?url'
import UserProfile from './UserProfile.vue'
const router = useRouter()

const props = defineProps(['community', 'showCommunitySection'])

const emit = defineEmits(['closeCommunitySection'])

const goChannel = (channelId: string) => {
  const { community } = props
  const currentCommunityId = router.currentRoute.value.params.communityId
  const currentChannelId = router.currentRoute.value.params.channelId

  if (currentCommunityId === community.id && currentChannelId === channelId) {
    emit('closeCommunitySection')
  }

  router.push(`/talk/channels/${community.id}/${channelId}`)
}
</script>
<style lang=""></style>
