<template>
  <ElIcon class="is-loading" v-if="loading">
    <Loading />
  </ElIcon>
  <span v-else> {{ rootStore.currentPriceSymbol }}{{ amount.toFixed(2) }} </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { getCurrencyAmount } from '@/utils/util'
import { useRootStore } from '@/stores/root'

interface Props {
  price: string | number
  currency: 'CNY'
}
const props = withDefaults(defineProps<Props>(), {})
const loading = ref(true)
const rootStore = useRootStore()

const amount = ref(0)

amount.value = getCurrencyAmount(props.price, props.currency)
loading.value = false
</script>

<style lang="scss" scoped></style>
