<template>
  <button class="absolute top-[32PX] right-[32PX] h-6 w-6 flex items-center justify-center">
    <Icon
      name="x_circle"
      class="w-6 h-6 text-dark-400 cursor-pointer"
      @click="layoutStore.isShowCreateCommunityModal = false"
    />
  </button>

  <div class="h-full w-full flex flex-col justify-between pt-8 lg:pt-0">
    <div class="flex flex-col w-full h-full items-center justify-start">
      <h3 class="text-2xl text-center font-bold">{{ $t('Talk.Community.create') }}</h3>

      <p class="mt-4.5 text-base text-dark-400 leading-relaxed text-center">
        {{ $t('Talk.Community.create_fist_step_tip') }}
      </p>

      <div class="mt-12">
        <div
          class="w-30 h-30 rounded-full border-dashed border-2 flex items-center justify-center relative cursor-pointer"
          :class="[form.iconPreviewUrl ? 'border-transparent' : 'border-gray-250']"
          @click="iconUploader?.click()"
        >
          <img
            :src="form.iconPreviewUrl"
            alt=""
            v-if="form.iconPreviewUrl"
            class="rounded-full w-30 h-30 object-cover object-center"
          />
          <Icon name="photo_2" class="w-9 h-9" v-else />

          <div class="absolute right-0 bottom-0 z-10">
            <div
              class="flex items-center justify-center w-10 h-10 bg-primary border-2 border-solid border-dark-800 rounded-full"
            >
              <Icon name="plus_2" class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 w-full">
        <h4 class="text-lg text-dark-800 capitalize">
          {{ $t('Talk.Community.community_name') }}
        </h4>

        <div class="mt-3">
          <input
            type="text"
            class="outline-0 main-border faded-switch !bg-white still w-full p-4.5 text-base"
            :placeholder="$t('Talk.Community.community_name')"
            v-model="form.name"
          />

          <p class="mt-1.5 text-xs text-dark-300">
            <span class="">
              {{ $t('Talk.Community.agree_tip') }}
            </span>
            <a href="#" class="text-sky-600 ml-1 font-medium" target="_blank">
              {{ $t('Talk.Community.agree_guidelines') }}
            </a>
            <span>
              {{ $t('Talk.period') }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="w-1"></div>
      <button
        class="w-14 h-14 main-border primary flex items-center justify-center"
        :class="{ faded: !form.isStep1Finished }"
        :disabled="!form.isStep1Finished"
        @click="$emit('forward')"
      >
        <Icon name="arrow_right" class="w-5 h-5" />
      </button>
    </div>
  </div>

  <input
    type="file"
    class="hidden"
    ref="iconUploader"
    accept="image/*"
    @change="handleIconChange"
  />
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { useCommunityFormStore, useTalkStore } from '@/stores/talk'
import { isFileTooLarge, isImage } from '@/utils/talk'
import { ref } from 'vue'
const layoutStore = useLayoutStore()
const talkStore = useTalkStore()
const form = useCommunityFormStore()

const iconUploader = ref<HTMLInputElement | null>(null)

const handleIconChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    if (!isImage(file)) {
      talkStore.$patch({
        error: {
          type: 'image_only',
          message: 'image_only',
          timestamp: Date.now(),
        },
      })
      return
    }

    if (isFileTooLarge(file)) {
      talkStore.$patch({
        error: {
          type: 'image_too_large',
          message: 'image_too_large',
          timestamp: Date.now(),
        },
      })
      return
    }

    form.icon = file
  }
}
</script>
