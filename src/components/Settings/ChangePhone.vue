<template>
  <ConfirmModal
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    @confirm="emit('confirm')"
    @cancel="isShowCheckPwd = true"
    :cancel-btn-text="$t('LinkAccount.Change Mobile')"
  >
    <template #title>
      <div class="title text-center flex1" :style="{ fontSize: '24px' }">
        {{ $t('LinkAccount.Phone') }}
      </div>
    </template>

    <template #content>
      <div class="tips text-center">{{ $t('LinkAccount.PhoneChangeTips') }}</div>
      <div class="value text-center">
        {{ phone ? phone.slice(0, 3) + '****' + phone.slice(-4) : '--' }}
      </div>
    </template>
  </ConfirmModal>

  <CheckEnterPwdModal v-model="isShowCheckPwd" />
</template>

<script setup lang="ts">
import ConfirmModal from '../ConfirmModal/ConfirmModal.vue'
import CheckEnterPwdModal from '../CheckEnterPwdModal/CheckEnterPwdModal.vue'
import { ref } from 'vue'

interface Props {
  modelValue: boolean
  phone?: string
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])
const isShowCheckPwd = ref(false)
</script>

<style lang="scss" scoped src="./ChangePhone.scss"></style>
