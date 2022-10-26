<template>
  <div
    class="fixed left-0 right-0 top-0 flex items-center px-4 divide-x h-12 border-b-2 border-solid border-gray-100 bg-white z-50">
    <div class="max-w-[60%] flex items-center">
      <Icon name="bars" class="w-6 h-6 text-gray-800 mx-2" />

      <div class="text-base leading-tight no-wrap grow whitespace-nowrap pl-2 pr-3 py-1 truncate">{{ props.title }}
      </div>
    </div>
    <div class="flex items-center justify-between grow">

      <div class="grow-0 pl-3 pr-2 truncate text-xs leading-tight overflow-x-hidden py-1 text-gray-600"
        @click="showDescModal = true">
        {{ props.description }}
      </div>
      <Teleport to="body">
        <ScreenModal v-if="showDescModal" :title="props.title" :description="props.description"
          @close-modal="showDescModal = false" />
      </Teleport>

      <Icon name="users" class="w-6 h-6 mx-1 ransition-all ease-in-out duration-300"
        :class="[props.showMembers ? 'text-indigo-600' : 'text-gray-600']" @click="$emit('toggleMemberList')" />

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ScreenModal from './ScreenModal.vue'

const props = defineProps(['title', 'description', 'showMembers'])
const showDescModal = ref(false)
</script>

<style lang="">
  
</style>