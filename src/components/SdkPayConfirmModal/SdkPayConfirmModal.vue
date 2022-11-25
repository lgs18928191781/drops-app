<template>
  <ElDialog :model-value="isShow" class="none-header none-padding sm">
    <div class="sdk-pay-confirm">
      <div class="header">
        <span class="title">
          {{
            balance >= useAmount ? i18n.t('SDK.payconfirm.Payment') : i18n.t('Insufficient balance')
          }}</span
        >
        <a class="close flex flex-align-center flex-pack-center" @click="cancel">
          <Icon name="x_mark" />
        </a>
      </div>
      <div class="pay-count flex flex-align-end flex-pack-center">
        <div>
          <div class="msg flex flex-align-end flex-pack-center">
            <div class="count">{{ useAmount }}</div>
            <div class="lable">{{ payType }}</div>
          </div>
          <div class="text">{{ i18n.t('SDK.payconfirm.Payment required') }}</div>
        </div>
      </div>

      <div class="balance">
        <span
          >{{ i18n.t('SDK.payconfirm.My')
          }}{{ payType === SdkPayType.ME ? i18n.t('SDK.payconfirm.ME') : 'SPACE' }}：</span
        >{{ balance }}
      </div>

      <div
        class="check flex flex-align-center"
        :class="{ active: !isShowConformCheck }"
        @click="changeConfirmVisible"
        v-if="balance >= useAmount"
      >
        <span class="check-warp  flex flex-align-center flex-pack-center">
          <Icon name="check" v-if="!isShowConformCheck" />
        </span>
        <div class="flex1 cont">
          {{ i18n.t('SDK.payconfirm.tips') }} <a>{{ maxCount }}</a>
          {{ payType === SdkPayType.ME ? i18n.t('SDK.payconfirm.ME') : 'SPACE' }}
          {{ i18n.t('SDK.payconfirm.tips2') }}
        </div>
      </div>

      <div class="operate flex flex-align-center">
        <a class="main-border flex1" @click="cancel">
          {{ i18n.t('Cancel') }}
        </a>
        <a class="main-border flex1 primary" v-if="balance >= useAmount" @click="confirm">
          {{ i18n.t('Confirm') }}
        </a>
        <a class="main-border flex1 primary" v-else @click="toRecharge">
          {{ i18n.t('SDK.payconfirm.Recharge') }}
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
  confirmVisible: boolean
  i18n: any
  useAmount: number
  maxCount: number
  balance: number
  router: Router
  payType: SdkPayType
}
const props = withDefaults(defineProps<Props>(), {
  payType: SdkPayType.ME,
})
const isShow = ref(true)
const isShowConformCheck = ref(props.confirmVisible)
const emit = defineEmits(['changeConfirmVisible', 'confirm', 'cancel'])

function changeConfirmVisible() {
  isShowConformCheck.value = !isShowConformCheck.value
  emit('changeConfirmVisible', isShowConformCheck.value)
}

function confirm() {
  emit('confirm')
  isShow.value = false
}

function cancel() {
  emit('cancel')
  isShow.value = false
}
function toRecharge() {}
</script>

<style lang="scss" scoped src="./SdkPayConfirmModal.scss"></style>
