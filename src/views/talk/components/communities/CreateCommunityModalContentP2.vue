<template>
  <button class="absolute top-[32PX] left-[32PX] h-6 w-6 flex items-center justify-center">
    <Icon name="chevron_left" class="w-5 h-5 text-dark-400 cursor-pointer" @click="$emit('back')" />
  </button>

  <button class="absolute top-[32PX] right-[32PX] h-6 w-6 flex items-center justify-center">
    <Icon
      name="x_circle"
      class="w-6 h-6 text-dark-400 cursor-pointer"
      @click="layoutStore.isShowCreateCommunityModal = false"
    />
  </button>

  <div class="h-full w-full flex flex-col justify-between pt-8 lg:pt-0">
    <div class="flex flex-col items-center justify-start">
      <h3 class="text-2xl text-center font-bold">
        {{ $t('Talk.Community.customize_information') }}
      </h3>

      <div class="mt-8">
        <button
          class="border-dashed border-2 border-dark-250 rounded-xl w-60 h-45 flex flex-col items-center justify-center space-y-2"
          :class="[form.coverPreviewUrl ? 'border-transparent' : 'border-gray-250']"
          @click="coverUploader?.click()"
        >
          <img
            :src="form.coverPreviewUrl"
            alt=""
            v-if="form.coverPreviewUrl"
            class="object-contain object-center w-60 h-45 rounded-xl"
          />
          <template v-else>
            <Icon name="photo_add" class="w-6 h-6" />
            <p class="text-sm text-dark-400">{{ $t('Talk.Community.choose_nft_cover') }}</p>
          </template>
        </button>
      </div>

      <div class="mt-8 w-full  sm:w-3/4 lg:w-full">
        <h4 class="text-lg text-dark-800 capitalize">
          {{ $t('Talk.Community.introduction') }}
        </h4>

        <div class="mt-3">
          <textarea
            rows="3"
            class="outline-0 main-border faded-switch !bg-white still w-full p-4 text-base resize-none"
            :placeholder="$t('Talk.Community.introduction_placeholder')"
            v-model="form.description"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <button class="text-sm text-sky-600" @click="$emit('tryCreateCommunity')">
        {{ $t('Talk.Community.skip') }}
      </button>
      <button
        class="w-14 h-14 main-border primary flex items-center justify-center"
        :class="{ faded: !form.isStep2Finished }"
        :disabled="!form.isStep2Finished"
        @click="$emit('tryCreateCommunity')"
      >
        <Icon name="arrow_right" class="w-5 h-5" />
      </button>
    </div>
  </div>

  <input
    type="file"
    class="hidden"
    ref="coverUploader"
    accept="image/*"
    @change="handleCoverChange"
  />
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { useCommunityFormStore, useTalkStore } from '@/stores/talk'
import { isFileTooLarge, isImage } from '@/utils/talk'
import { ref } from 'vue'

const coverUploader = ref<HTMLInputElement | null>(null)

const layoutStore = useLayoutStore()
const talkStore = useTalkStore()
const form = useCommunityFormStore()

const handleCoverChange = (e: Event) => {
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

    form.cover = file
  }
}
</script>
