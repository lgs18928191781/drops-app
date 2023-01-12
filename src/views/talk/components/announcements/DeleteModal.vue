<template>
  <BaseModal v-model="isShow" :extra-close-event="onClose">
    <template #title>
      {{ $t('Talk.General.delete_announcement') }}
    </template>

    <template #body>
      <div class="flex flex-col items-center justify-center w-full h-full text-sm">
        <div class="grow flex flex-col items-center justify-center">
          <img :src="TrashImg" class="w-48 h-48" alt="" />
          <p class="text-center text-dark-400 dark:text-gray-200">
            {{ $t('Talk.General.delete_announcement_tip') }}
          </p>
          <div class="mt-4">
            <span class="text-dark-300 dark:text-gray-400">title: </span>
            <span class="bg-dark-200 dark:bg-gray-900 text-base font-medium py-1 px-3 rounded-md">
              {{ deleteForm.title }}
            </span>
          </div>
        </div>

        <!-- buttons -->
        <div class="flex gap-x-4 mt-8">
          <Button class="main-border py-3 px-12 text-base font-bold" @click="onClose">
            {{ $t('Talk.General.cancel') }}
          </Button>
          <Button class="main-border primary py-3 px-12 text-base font-bold" @click="confirmDelete">
            {{ $t('Talk.General.delete') }}
          </Button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { useDeleteAnnouncementFormStore } from '@/stores/forms'
import BaseModal from '../modals/BaseModal.vue'
import TrashImg from '@/assets/images/throw_away.svg?url'
import { ref, watch } from 'vue'

const deleteForm = useDeleteAnnouncementFormStore()
const emit = defineEmits(['close', 'submit'])

const props = defineProps<{
  show: boolean
}>()
const isShow = ref(props.show)

const onClose = () => {
  deleteForm.reset()
  emit('close')
}

const confirmDelete = async () => {
  await deleteForm.submit()
  emit('submit')
}

watch(
  () => props.show,
  (val: boolean) => {
    isShow.value = val
  }
)
</script>
