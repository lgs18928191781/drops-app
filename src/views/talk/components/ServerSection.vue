<template>
  <div class="bg-white fixed inset-0 h-screen w-screen z-50 lg:static lg:w-78"
    :class="[showServerSection ? '' : 'hidden lg:block']">
    <div class="h-full w-full flex">
      <div class="w-18 h-full bg-gray-100 p-3">
        <div class=" pb-3 mb-3 border-b-2 broder-solid border-gray-300">
          <div class="rounded-full bg-blue-200 w-12 h-12"></div>
        </div>
        <div class=" space-y-3">
          <div class="rounded-full bg-amber-200 w-12 h-12"></div>
          <div class="rounded-full bg-red-200 w-12 h-12"></div>
          <div class="rounded-full bg-indigo-200 w-12 h-12"></div>
        </div>

      </div>
      <div class="h-full grow bg-gray-50">
        <div class="w-full px-4 py-3 text-base font-semibold text-gray-800">{{ props.server.name }}</div>

        <div class="pt-8">
          <div v-for="channel in props.server.channels" class="px-4 ">
            <div class="text-gray-800 text-sm font-medium flex items-center" @click="goChannel(channel.id)">
              <Icon name="hashtag" class="w-4 h-4 text-gray-400" />
              <div class="ml-2">
                {{ channel.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter()

const props = defineProps(['server', 'showServerSection'])

const emit = defineEmits(['closeServerSection'])

const goChannel = (channelId: string) => {
  const { server } = props
  const currentServerId = router.currentRoute.value.params.serverId
  const currentChannelId = router.currentRoute.value.params.channelId

  if (currentServerId === server.id && currentChannelId === channelId) {
    console.log(123)
    emit('closeServerSection')
  }

  router.push(`/talk/channels/${server.id}/${channelId}`)
}
</script>
<style lang="">
  
</style>