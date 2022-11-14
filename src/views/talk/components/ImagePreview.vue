<template>
  <div class="fixed inset-0 bg-black/80 h-screen w-screen z-[60]" @click="$emit('close')">
    <div class="relative h-full w-full flex items-center justify-center">
      <div class="text-white absolute right-[16PX] top-[16PX]" @click="$emit('close')">
        <Icon name="x_circle" class="w-10 h-10 text-dark-300 hover:text-dark-100 cursor-pointer" />
      </div>
      <div class="!w-[90%] !max-h-[80%] overflow-y-auto pr-3 -mr-3 lg:!w-[480PX]" @click.stop="">
        <Image :src="src" customClass="w-full rounded-md object-scale-down" :width="-1" />
        <div class="mt-2">
          <span
            class="text-white text-sm opacity-50 lg:hover:opacity-100 lg:hover:underline lg:cursor-pointer"
            @click="openOriginal"
          >
            {{ $t('Talk.Channel.view_original') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { metafile } from '@/utils/filters'

const props = defineProps(['src'])

const openOriginal = () => {
  const src = metafile(props.src, -1)
  window.open(src, '_blank')
}
</script>

<style lang=""></style>
