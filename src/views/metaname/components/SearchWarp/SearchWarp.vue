<template>
  <div class="search-warp flex flex-align-center">
    <Icon name="search" />
    <div class="flex1">
      <input
        type="text"
        v-model="value"
        :placeholder="$t('MetaName.Search your MetaName')"
        @keyup.enter="submit"
      />
    </div>
    <span class="divid"></span>
    <a @click="submit">{{ $t('MetaName.SearchWap.Search') }}</a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  metaName?: string
}

const props = withDefaults(defineProps<Props>(), {})
const value = ref(props.metaName ? props.metaName : '')

const i18n = useI18n()
const emit = defineEmits(['submit'])

function submit() {
  if (value.value === '') {
    return ElMessage.error(i18n.t('MetaName.MetaName cannot be empty'))
  }
  emit('submit', value.value)
}
</script>

<style lang="scss" scoped src="./SearchWarp.scss"></style>
