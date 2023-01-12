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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
//@ts-ignore
import namehash from 'eth-ens-namehash'
interface Props {
  metaName?: string
}

const props = withDefaults(defineProps<Props>(), {})
const value = ref(props.metaName ? props.metaName : '')

const i18n = useI18n()
const emit = defineEmits(['submit', 'error'])

function submit() {
  if (value.value === '') {
    return ElMessage.error(i18n.t('MetaName.MetaName cannot be empty'))
  }
  // const name = validateMetaName()
  // if (!name) {
  //   // emit('error',MetaNameNotIllgel.value)
  // } else {
  //   emit('submit', name)
  // }
  emit('submit', value.value)
}

// const validateMetaName = () => {
//   try {
//     const illgelRes = namehash.normalize(value.value)
//     console.log('illgelRes', illgelRes)
//     MetaNameNotIllgel.value = false
//     return illgelRes
//   } catch {
//     MetaNameNotIllgel.value = true
//     return ''
//   }
// }
</script>

<style lang="scss" scoped src="./SearchWarp.scss"></style>

<style lang="scss" scoped src="./SearchWarp.scss"></style>
