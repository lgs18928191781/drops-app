<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex flex-col items-center">
      <div class="mt-8">
        <button
          class="border-dashed border-2 border-dark-250 dark:border-gray-400 rounded-xl w-60 h-45 flex flex-col items-center justify-center space-y-2"
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
            <Icon name="photo_add" class="w-6 h-6 text-dark-400 dark:text-gray-100" />
            <p class="text-sm text-dark-400 dark:text-gray-200">
              {{ $t('Talk.Community.choose_nft_cover') }}
            </p>
          </template>
        </button>
      </div>

      <div class="mt-8 w-full sm:w-3/4 lg:w-full">
        <h4 class="text-lg  capitalize">
          {{ $t('Talk.Community.introduction') }}
        </h4>

        <div class="mt-3">
          <textarea
            rows="3"
            class="outline-0 main-border faded-switch !bg-white dark:!bg-gray-700 still w-full p-4 text-base resize-none"
            :placeholder="$t('Talk.Community.introduction_placeholder')"
            v-model="form.description"
          />
        </div>
      </div>
    </div>

    <div class="grow flex items-end lg:mt-8">
      <div class="flex justify-between items-center w-full">
        <button
          class="text-sm text-link dark:text-blue-400 hover:underline"
          @click="$emit('tryCreateCommunity')"
        >
          {{ $t('Talk.Community.skip') }}
        </button>
        <button
          class="w-14 h-14 main-border primary flex items-center justify-center"
          :class="{
            'faded still text-dark-300 dark:!text-gray-400 dark:!bg-gray-700': !form.isStep2Finished,
          }"
          :disabled="!form.isStep2Finished"
          @click="$emit('tryCreateCommunity')"
        >
          <Icon name="arrow_right" class="w-6 h-6" />
        </button>
      </div>
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
import { useCommunityFormStore } from '@/stores/forms'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { isFileTooLarge, isImage } from '@/utils/talk'
import { ref } from 'vue'

const coverUploader = ref<HTMLInputElement | null>(null)

const layout = useLayoutStore()
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
