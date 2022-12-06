<template>
  <div class="relative h-screen lg:flex text-base">
    <DirectContactList />

    <div class="lg:grow lg:h-screen lg:relative lg:flex">
      <AtMeHeader />

      <div class="pt-12 pb-17.5 h-screen lg:relative w-full bg-dark-200 lg:pt-15 lg:pb-20">
        <div class="h-full">
          <MessageList />
        </div>

        <div class="fixed bottom-0 left-0 right-0 px-4 lg:absolute">
          <TheInput />
          <TheErrorBox />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTalkStore } from '@/stores/talk'
import { defineAsyncComponent, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DirectContactList from './components/DirectContactList.vue'
import AtMeHeader from './components/AtMeHeader.vue'
import TheInput from './components/TheInput.vue'
import TheErrorBox from './components/TheErrorBox.vue'

const MessageList = defineAsyncComponent({
  loader: () => import('./components/MessageList.vue'),
})

const route = useRoute()
const talk = useTalkStore()

const { channelId } = route.params

onMounted(async () => {
  await talk.initCommunity('@me')
  await talk.initChannel('@me', channelId as string)
  await talk.initChannelMessages(talk.selfMetaId)
})

onBeforeUnmount(() => {
  talk.resetCurrentChannel()
  talk.saveReadPointers()
  talk.closeReadPointerTimer()
})
</script>

<style lang="scss" scoped></style>
