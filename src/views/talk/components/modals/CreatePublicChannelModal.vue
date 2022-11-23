<template>
  <div
    class="fixed inset-0 z-[60] bg-transparent w-screen h-screen flex items-center justify-center lg:bg-black/50"
  >
    <div
      class="w-full h-full bg-white lg:w-114 lg:h-auto lg:h-[600PX] lg:rounded-3xl relative lg:shadow-lg p-8"
    >
      <button class="absolute top-[32PX] right-[32PX] h-6 w-6 flex items-center justify-center">
        <Icon
          name="x_circle"
          class="w-6 h-6 text-dark-400 cursor-pointer"
          @click="layoutStore.isShowCreatePublicChannelModal = false"
        />
      </button>

      <div class="h-full w-full flex flex-col justify-between pt-8 lg:pt-0">
        <div class="flex flex-col w-full h-full items-center justify-start">
          <h3 class="text-2xl text-center font-bold capitalize">
            {{ $t('Talk.Community.create_public_channel') }}
          </h3>

          <p class="mt-4.5 text-base text-dark-400 leading-relaxed text-center">
            {{ $t('Talk.Community.create_public_channel_tip') }}
          </p>

          <div class="mt-12 w-full">
            <h4 class="text-lg text-dark-800 capitalize">
              {{ $t('Talk.Community.channel_name') }}
            </h4>

            <div class="mt-3">
              <input
                type="text"
                class="outline-0 main-border faded-switch !bg-white still w-full p-4.5 text-base"
                :placeholder="$t('Talk.Community.channel_name')"
                v-model="form.name"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="w-1"></div>
          <button
            class="w-14 h-14 main-border primary flex items-center justify-center"
            :class="{ faded: !form.isFinished }"
            :disabled="!form.isFinished"
            @click="tryCreateChannel"
          >
            <Icon name="arrow_right" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { userChannelFormStore, useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { createChannel } from '@/utils/talk'

const form = userChannelFormStore()

const userStore = useUserStore()
const layoutStore = useLayoutStore()
const talkStore = useTalkStore()

const tryCreateChannel = async () => {
  if (!form.isFinished) return

  const { channelId } = await createChannel(form, talkStore.activeCommunityId, userStore.showWallet)
}
</script>
