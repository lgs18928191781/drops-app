<template>
  <Modal :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)">
    <template #title>{{ $t('Buzz.Schedule') }}</template>
    <template #body>
      <div class="tips flex flex-align-center">
        <Icon name="calendar_days" />{{ $t('Will send') }}
        {{ $filters.dateTimeFormat(datetime, $i18n.locale) }}
      </div>
      <div class="flex mt-3">
        <ElDatePicker
          v-model="datetime"
          type="datetime"
          placeholder="Select date and time"
          class="flex1"
          :teleported="false"
          :clearable="false"
        />
      </div>

      <div class="flex flex-align-center mt-7">
        <div class="main-border flex1 mr-4 text-center py-3 cursor-pointer" @click="clear">
          {{ $t('Buzz.Schedule Clear') }}
        </div>
        <div class="main-border flex1 primary text-center py-3 cursor-pointer" @click="confirm">
          {{ $t('Confirm') }}
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue'
import { watch } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const datetime = ref(new Date())
const i18n = useI18n()
const emit = defineEmits<{
  (e: 'confirm', time: any): void
  (e: 'update:modelValue', value: boolean): void
}>()

function clear() {
  emit('confirm', '')
  emit('update:modelValue', false)
}

function confirm() {
  if (new Date(datetime.value).getTime() < new Date().getTime()) {
    return ElMessage.error(
      i18n.t('Buzz.The scheduled release time must be greater than the current time')
    )
  }
  emit('confirm', datetime.value)
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  value => {
    if (value) {
      datetime.value = new Date()
    }
  }
)
</script>

<style lang="scss" scoped src="./PublishSchedule.scss"></style>
