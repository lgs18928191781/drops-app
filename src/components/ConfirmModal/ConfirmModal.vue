<template>
  <ElDialog :modelValue="modelValue" class="sm" @close="emit('update:modelValue', false)">
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot name="content"></slot>

    <div class="operate flex flex-align-center" :style="{ marginTop: operateWarpMarginTop + 'px' }">
      <a
        class="main-border flex1"
        :class="cancelBtnClass"
        @click="
          () => {
            emit('cancel')
            emit('update:modelValue', false)
          }
        "
        v-if="!isHideCancelBtn"
        >{{ cancelBtnText || $t('Cancel') }}</a
      >
      <a
        class="main-border flex1"
        :class="confirmBtnClass"
        @click="
          () => {
            emit('confirm')
          }
        "
        >{{ confirmBtnText || $t('OK') }}</a
      >
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  confirmBtnText?: string
  confirmBtnClass?: string
  cancelBtnText?: string
  cancelBtnClass?: string
  isHideCancelBtn?: boolean
  operateWarpMarginTop: number
}
const props = withDefaults(defineProps<Props>(), {
  confirmBtnClass: 'primary',
  operateWarpMarginTop: 60,
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>

<style lang="scss" scoped src="./ConfirmModal.scss"></style>
