<template>
  <ElIcon class="is-loading" v-if="loading">
    <Loading />
  </ElIcon>
  <span v-else class="amount">
    {{ toCurrency ? toCurrency : rootStore.currentPriceSymbol }}&nbsp;&nbsp;{{
      amount.toFixed(toCurrency === ToCurrency.ETH ? 5 : 2)
    }}
  </span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { getCurrencyAmount } from '@/utils/util'
import { useRootStore } from '@/stores/root'
import { ToCurrency } from '@/enum'

interface Props {
  price: string | number
  currency: ToCurrency
  toCurrency?: ToCurrency
}
const props = withDefaults(defineProps<Props>(), {})
const loading = ref(true)
const rootStore = useRootStore()

const ETHName = import.meta.env.VITE_ETH_CHAIN.toUpperCase()
const amount = ref(0)

amount.value = getCurrencyAmount(props.price, props.currency, props.toCurrency)
loading.value = false

watch(
  () => [props.price, props.currency, props.toCurrency, rootStore.currentPrice],
  () => {
    loading.value = true
    amount.value = getCurrencyAmount(props.price, props.currency, props.toCurrency)
    loading.value = false
  }
)
</script>

<style lang="scss" scoped></style>
