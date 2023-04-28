<template>
  <Modal :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)">
    <template #title>{{ $t('Buzz.Schedule') }}</template>
    <template #body>
      <div class="tips flex flex-align-center">
        <Icon name="calendar_days" />{{ $t('Will send') }}
        {{ $filters.dateTimeFormat(form.date + ' ' + form.time, $i18n.locale, 'YYYY-MM-DD HH:mm') }}
      </div>
      <div class="flex mt-3">
        <ElForm :label-position="'top'">
          <ElFormItem :label="$t('Buzz.Schedule Date')">
            <ElDatePicker
              v-model="form.date"
              type="date"
              placeholder="Select Date"
              class="flex1"
              :value-format="'YYYY-MM-DD'"
              :teleported="false"
              :clearable="false"
            />
          </ElFormItem>

          <ElFormItem :label="$t('Buzz.Schedule Time')">
            <ElTimeSelect
              v-model="form.time"
              start="00:00"
              step="00:01"
              end="23:59"
              placeholder="Select time"
              class="flex1"
              :teleported="false"
              :clearable="false"
            />
          </ElFormItem>
        </ElForm>
      </div>

      <div class="my">
        <a @click="isShowList = true">{{ $t('Buzz.My Schedule Buzzs') }}</a>
      </div>

      <div class="flex flex-align-center mt-7">
        <div class="main-border flex1 mr-4 text-center py-3 cursor-pointer" @click="clear">
          {{ $t('Buzz.Schedule Clear') }}
        </div>
        <div class="main-border flex1 primary text-center py-3 cursor-pointer" @click="confirm">
          {{ $t('Confirm') }}
        </div>
      </div>

      <PublishScheduleList v-model="isShowList" />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue'
import { ElTimeSelect } from 'element-plus'
import { reactive } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import PublishScheduleList from './PublishScheduleList.vue'

interface Props {
  modelValue: boolean
}
const now = dayjs()
  .add(1, 'minute')
  .format('HH:mm')
const props = withDefaults(defineProps<Props>(), {})
const i18n = useI18n()
const emit = defineEmits<{
  (e: 'confirm', time: any): void
  (e: 'update:modelValue', value: boolean): void
}>()

const form = reactive({
  date: dayjs().format('YYYY-MM-DD'),
  time: dayjs().format('HH:mm'),
})
const isShowList = ref(false)

function clear() {
  emit('confirm', '')
  emit('update:modelValue', false)
}

function confirm() {
  console.log(form)
  const time = `${form.date} ${form.time}`
  if (new Date(time).getTime() < new Date().getTime()) {
    return ElMessage.error(
      i18n.t('Buzz.The scheduled release time must be greater than the current time')
    )
  }
  emit('confirm', time)
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  value => {
    if (value) {
      form.date = dayjs().format('YYYY-MM-DD')
      form.time = dayjs().format('HH:mm')
    }
  }
)
</script>

<style lang="scss" scoped src="./PublishSchedule.scss"></style>
