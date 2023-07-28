<template>
  <ElDialog
    :modelValue="modelValue"
    @change="emit('update:modelValue', !modelValue)"
    :close-on-click-modal="false"
    :append-to-body="true"
    :show-close="false"
    :class="['sm']"
    center
    @close="close"
    :z-index="zIndex"
  >
    <template #title>
      <span :class="[extrafooter ? 'center' : '']">{{ title }}</span>
    </template>
    <template v-if="content"
      ><pre class="content">{{ content }}</pre></template
    >
    <template v-else><slot name="content"></slot></template>
    <template v-if="!extrafooter">
      <div class="flex flex-align-center flex-pack-end">
        <a class="confirm-btn" @click="emit('update:modelValue', !modelValue)">{{
          confirmBtnText ? confirmBtnText : $t('Confirm')
        }}</a>
      </div>
    </template>
    <template v-else>
      <div class="btn-wrap">
        <div class="item main-border" @click="emit('update:modelValue', !modelValue)">
          {{ showMnemonic ? $t('backup_later') : $t('cancel') }}
        </div>
        <div
          class="item main-border"
          @click="
            showMnemonic ? emit('update:modelValue', !modelValue) : emit('updateShowMnemonic', true)
          "
        >
          {{ showMnemonic ? $t('already_backup') : $t('Generate') }}
        </div>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['update:modelValue', 'close', 'updateShowMnemonic'])
interface Props {
  modelValue: boolean
  content?: string
  title?: string
  confirmBtnText?: string
  i18n?: any
  zIndex?: number
  extrafooter?: boolean
  showMnemonic?: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const $t = props.i18n ? props.i18n.t : useI18n().t

function close() {
  emit('close')
  if (props.showMnemonic) {
    emit('updateShowMnemonic', false)
  }
}
</script>

<style lang="scss" scoped src="./ContentModal.scss"></style>
