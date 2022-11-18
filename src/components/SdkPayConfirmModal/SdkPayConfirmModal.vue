<template>
  <ElDialog :model-value="isShow" class="none-header none-padding sm">
    <div class="sdk-pay-confirm">
      <div class="header">
        <span class="title">{{ i18n.t('SDK.payconfirm.Payment') }}</span>
        <a class="close flex flex-align-center flex-pack-center">
          <Icon name="x_mark" />
        </a>
      </div>
      <div class="pay-count flex flex-align-end flex-pack-center">
        <div class="count">{{ useAmount }}</div>
        <div class="lable">{{ payType }}</div>
      </div>

      <div
        class="check flex flex-align-center"
        :class="{ active: isShowConformCheck }"
        @click="changeConfirmVisible"
      >
        <span class="check-warp  flex flex-align-center flex-pack-center">
          <Icon name="check" v-if="isShowConformCheck" />
        </span>
        <div class="flex1 cont">
          {{ i18n.t('SDK.payconfirm.tips') }} <a>{{ maxCount }}</a>
          {{ payType === SdkPayType.ME ? i18n.t('SDK.payconfirm.ME') : 'SPACE' }}
          {{ i18n.t('SDK.payconfirm.tips2') }}
        </div>
      </div>

      <div class="operate flex flex-align-center">
        <a class="main-border flex1">
          {{ i18n.t('Cancel') }}
        </a>
        <a class="main-border flex1 primary">
          {{ i18n.t('Confirm') }}
        </a>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { SdkPayType } from '@/enum'
import { ref } from 'vue'
import { Router } from 'vue-router'

interface Props {
  isShowConfirm: boolean
  i18n: any
  useAmount: number
  maxCount: number
  isEnough: boolean
  router: Router
  payType?: SdkPayType
}
const props = withDefaults(defineProps<Props>(), {
  payType: SdkPayType.ME,
})
const isShow = ref(true)
const isShowConformCheck = ref(props.isShowConfirm)
const emit = defineEmits(['changeConfirmVisible'])

function changeConfirmVisible() {
  isShowConformCheck.value = !isShowConformCheck.value
  emit('changeConfirmVisible', isShowConformCheck.value)
}
</script>

<style lang="scss" scoped src="./SdkPayConfirmModal.scss"></style>
