<template>
  <ElDialog
    :modelValue="modelValue"
    class="sm"
    @close="emit('update:modelValue', false)"
    :closeOnClickModal="false"
    :style="{width:layout.isMobilePhone ? '80vw' : customWidth ? '60vw' : '' , height:customHeight ? '75vh' : '80vh', overflowY: 'auto' }"
    align-center
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot name="content"></slot>
    <div
      v-if="!defiendFooter"
      class="operate flex text-base flex-align-center"
      :style="{ marginTop: operateWarpMarginTop + 'px' }"
    >
      <a
        class="main-border cursor-pointer text-center py-2.5 mr-4 darkGray flex1"
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
        class="main-border cursor-pointer text-center py-2.5 flex1"
        :class="confirmBtnClass"
        @click="
          () => {
            emit('confirm')
          }
        "
        >{{ confirmBtnText || $t('Nfts.launch_OK') }}</a
      >
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {  FormInstance, FormRules } from 'element-plus'
import { useLayoutStore } from '@/stores/layout'
interface Props {
  modelValue: boolean
  confirmBtnText?: string
  confirmBtnClass?: string
  cancelBtnText?: string
  cancelBtnClass?: string
  isHideCancelBtn?: boolean
  operateWarpMarginTop: number
  defiendFooter?:boolean
  customWidth?:boolean
  customHeight?:boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmBtnClass: 'primary',
  operateWarpMarginTop: 60,
  isEdit: false,
  defiendFooter:false,
  customWidth:false
})

const layout = useLayoutStore()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>

<style scoped lang="scss"></style>
