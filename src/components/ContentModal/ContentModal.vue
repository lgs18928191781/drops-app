<template>
  <ElDialog
    :modelValue="modelValue"
    @change="emit('update:modelValue', !modelValue)"
    :close-on-click-modal="false"
    :append-to-body="true"
    :show-close="false"
    class="sm"
    center
    @close="emit('close')"
    :z-index="zIndex"
  >
    <template #title> {{ title }} </template>
    <template v-if="content"
      ><pre class="content">{{ content }}</pre></template
    >
    <template v-else><slot name="content"></slot></template>
    <template #footer>
      <div class="flex flex-align-center flex-pack-end">
        <a class="confirm-btn" @click="emit('update:modelValue', !modelValue)">{{
          confirmBtnText ? confirmBtnText : $t('Confirm')
        }}</a>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update:modelValue', 'close'])
interface Props {
  modelValue: boolean
  content?: string
  title?: string
  confirmBtnText?: string
  i18n?: any
  zIndex?: number
}
const props = withDefaults(defineProps<Props>(), {})

const $t = props.i18n ? props.i18n.t : useI18n().t
</script>

<style lang="scss" scoped src="./ContentModal.scss"></style>
