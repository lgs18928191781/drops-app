<template>
  <ElDialog
    custom-class="payModeDialog"
    v-model="props.visible"
    @close="closeDialog"
    center
    :close-on-click-modal="false"
  >
    <template #title>
      <div class="payModeDialogTitle">
        <span>{{ $t('selectPay') }}</span>
      </div>
    </template>
    <div class="payModeDialogBody">
      <div class="radioGroud">
        <div class="bsvMode">
          <span>BSV</span>
          <el-radio v-model="currentPayMode" label="1" size="large"></el-radio>
        </div>
        <div class="cnyMode">
          <span>CNY</span>
          <el-radio v-model="currentPayMode" label="2" size="large"></el-radio>
        </div>
      </div>
      <div @click="confirmMode" class="btn btn-block">
        {{ $t('confirm') }}
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { useRootStore } from '@/stores/root'
import { ref, computed, watch } from 'vue'
import { UnitName } from '@/config'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['payModeclose'])
interface Props {
  visible: boolean
  isLegal: boolean
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isLegal: false,
})
const i18n = useI18n()
const rootStore = useRootStore()
const currentPayMode = ref('1')
watch(
  () => props.visible,
  value => {
    if (value) {
      currentPayMode.value = rootStore.currentPrice === UnitName.BSV ? '1' : '2'
    }
  }
)
function confirmMode() {
  if (currentPayMode.value === '1') {
    if (props.isLegal) {
      return ElMessage.error(`${i18n.t('notSupportBsvBuyLegal')}`)
    }
    rootStore.changePrices(UnitName.BSV)
    window.localStorage.setItem('currentPrice', UnitName.BSV)
  } else {
    rootStore.changePrices(UnitName.RMB)
    window.localStorage.setItem('currentPrice', UnitName.RMB)
  }
  rootStore.getExchangeRate()
  closeDialog()
}

function closeDialog() {
  emit('payModeclose')
}
</script>

<style lang="scss" scoped src="./payModeDialog.scss"></style>
