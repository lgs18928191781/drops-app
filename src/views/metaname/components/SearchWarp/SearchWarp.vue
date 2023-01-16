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
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
//@ts-ignore
import namehash from 'eth-ens-namehash'
import { bytesLength } from '@/utils/util'
import { MetaNameFeePerYear } from '@/enum'
interface Props {
  metaName?: string
}

const props = withDefaults(defineProps<Props>(), {})
const value = ref(props.metaName ? encodeURIComponent(props.metaName) : '')
const MetaNameReg = /\./g
const i18n = useI18n()
const emit = defineEmits(['submit', 'error'])

function submit() {
  if (value.value === '') {
    return ElMessage.error(i18n.t('MetaName.MetaName cannot be empty'))
  }

  const name = validateMetaName()
  if (!name) {
    return ElMessage.error(`${i18n.t('inputMetaNameIllgel')}`)
  } else {
    if (checkInputName(name)) {
      emit('submit', name)
    }
  }
}

function checkInputName(name: string) {
  const testResult = bytesLength(name.trim())
  switch (true) {
    case testResult >= 5 && testResult <= 63:
      return MetaNameFeePerYear.five
    case testResult == 4:
      return MetaNameFeePerYear.four
    case testResult == 3:
      return MetaNameFeePerYear.third
    case testResult > 0 && testResult <= 2:
      ElMessage.error(`${i18n.t('metanameNotAllowMin')}`)
      return false
    case testResult > 63:
      ElMessage.error(`${i18n.t('metanameNotAllowOverLenght')}`)
      return false
    default:
      return false
  }
}

const validateMetaName = () => {
  let illgelRes: any

  try {
    illgelRes = namehash.normalize(value.value)
    if (MetaNameReg.test(illgelRes)) return false
    return illgelRes
  } catch {
    const { content } = JSON.parse(`{"content":"${value.value}"}`)
    illgelRes = namehash.normalize(content)
    if (MetaNameReg.test(illgelRes)) return false
    return illgelRes
  }
}
</script>

<style lang="scss" scoped src="./SearchWarp.scss"></style>

<style lang="scss" scoped src="./SearchWarp.scss"></style>
