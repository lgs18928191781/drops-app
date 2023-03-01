<template>
  <div class="search-warp flex flex-align-center">
    <Icon name="search" />
    <div class="flex1">
      <input
        type="text"
        v-model="value"
        :placeholder="$t('MetaName.RegisterNamesTips')"
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
import { useMetaNameStore } from '@/stores/metaname'
import { EnvMode } from '@/enum'
import { validateMetaName } from '@/utils/metaname'
interface Props {
  metaName?: string
}

const props = withDefaults(defineProps<Props>(), {})
const value = ref(props.metaName ? decodeURIComponent(props.metaName) : '')

const i18n = useI18n()
const emit = defineEmits(['submit', 'error'])
const metaNameStore = useMetaNameStore()

async function submit() {
  const name = await validateMetaName(value.value)
  debugger
  if (name) {
    if (checkInputName(name)) {
      emit('submit', name)
    }
  }
}

function checkInputName(name: string) {
  const testResult = bytesLength(name.trim())
  switch (true) {
    case testResult >= 5 && testResult <= 63:
      return metaNameStore.MetaNameFeePerYear.five
    case testResult == 4:
      return metaNameStore.MetaNameFeePerYear.four
    case testResult == 3:
      return metaNameStore.MetaNameFeePerYear.third
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
</script>

<style lang="scss" scoped src="./SearchWarp.scss"></style>

<style lang="scss" scoped src="./SearchWarp.scss"></style>
