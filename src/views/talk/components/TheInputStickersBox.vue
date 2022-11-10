<template>
  <div
    v-show="true"
    class="fixed z-40 inset-0 h-screen w-screen"
    @click="$emit('hideStickersBox')"
  >
    <div class="relative h-full w-full">
      <div
        class="absolute bottom-[68PX] right-[16PX] lg:bottom-[78PX] lg:right-[256PX] bg-white pb-1.5 pt-4 rounded-lg text-xs flex flex-col text-dark-400 font-medium space-y-0.5 shadow-lg w-3/4 lg:w-96 z-50"
        @click.stop="doNothing"
      >
        <div class="flex shadow-md px-2 text-sm font-medium pb-2 space-x-1">
          <div
            class="py-0.5 px-2 rounded cursor-pointer"
            :class="{ 'bg-dark-300 text-white': activeTab === 'nft' }"
            @click="activeTab = 'nft'"
          >
            {{ $t('Talk.Input.nft_stickers') }}
          </div>
          <div
            class="py-0.5 px-2 rounded cursor-pointer"
            :class="{ 'bg-dark-300 text-white': activeTab === 'emoji' }"
            @click="activeTab = 'emoji'"
          >
            {{ $t('Talk.Input.emoji') }}
          </div>
        </div>
        <div class="p-2 h-64 overflow-y-auto">
          <div v-if="activeTab === 'nft'" class="h-full flex items-center justify-center">
            <div class="flex flex-col items-center space-y-4">
              <img :src="Cat" class="w-32 h-32" alt="" />
              <div class="text-dark-400 text-sm font-medium">
                {{ $t('Talk.Input.no_nft_stickers') }}
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'emoji'">
            <span class="text-3xl p-0.5" @click="addEmoji('😃')">😃</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😁')">😁</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😂')">😂</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😄')">😄</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😅')">😅</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😆')">😆</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😇')">😇</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😈')">😈</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😉')">😉</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😊')">😊</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😋')">😋</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😌')">😌</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😍')">😍</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😎')">😎</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😏')">😏</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😐')">😐</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😒')">😒</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😓')">😓</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😔')">😔</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😕')">😕</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😖')">😖</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😗')">😗</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😘')">😘</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😙')">😙</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😚')">😚</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😜')">😜</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😝')">😝</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😞')">😞</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😟')">😟</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😠')">😠</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😡')">😡</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😢')">😢</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😣')">😣</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😤')">😤</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😥')">😥</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😦')">😦</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😨')">😨</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😩')">😩</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😪')">😪</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😫')">😫</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😬')">😬</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😭')">😭</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😮')">😮</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😯')">😯</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😰')">😰</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😲')">😲</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😳')">😳</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😴')">😴</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😵')">😵</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🧐')">🧐</span>
            <span class="text-3xl p-0.5" @click="addEmoji('😷')">😷</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🙁')">🙁</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🙂')">🙂</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🙃')">🙃</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤐')">🤐</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤑')">🤑</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤒')">🤒</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤓')">🤓</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤔')">🤔</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤕')">🤕</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤠')">🤠</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤡')">🤡</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤢')">🤢</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤤')">🤤</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤥')">🤥</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤧')">🤧</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤨')">🤨</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤩')">🤩</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤪')">🤪</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤫')">🤫</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤬')">🤬</span>
            <span class="text-3xl p-0.5" @click="addEmoji('🤭')">🤭</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Cat from '@/assets/images/cat.svg?url'

const props = defineProps(['showStickersBox'])
const emit = defineEmits(['inputEmoji'])

const activeTab = ref('nft')
const addEmoji = (emoji: string) => {
  emit('inputEmoji', emoji)
}

const doNothing = () => {}
</script>

<style lang="scss" scoped></style>
