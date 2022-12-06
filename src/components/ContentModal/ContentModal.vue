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
  >
    <template #title> {{ title }} </template>
    <template v-if="content"
      ><pre class="content">{{ content }}</pre></template
    >
    <template v-else><slot name="content"></slot></template>
    <template #footer>
      <div class="flex flex-align-center flex-pack-end">
        <a class="confirm-btn" @click="emit('update:modelValue', !modelValue)">{{
          confirmBtnText ? confirmBtnText : '确认'
        }}</a>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'close'])
interface Props {
  modelValue: boolean
  content?: string
  title?: string
  confirmBtnText?: string
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped src="./ContentModal.scss"></style>
