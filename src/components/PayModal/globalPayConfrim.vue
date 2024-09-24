<template>
  <ElDialog
    :model-value="isShow"
    class="none-header none-padding sm"
    :close-on-click-modal="false"
    :z-index="9999"
  >
    <div class="global-pay-confirm">
      <div class="header">
        <span class="title"> {{ i18n.t('SDK.payconfirm.Payment') }}</span>

        <a class="close flex flex-align-center flex-pack-center" @click="cancel">
          <Icon name="x_mark" />
        </a>
      </div>
      <div class="pay-count flex flex-align-end flex-pack-center">
        <div>
          <div class="msg flex flex-align-end flex-pack-center">
            <div class="count">
              {{ space(useAmount) }}
            </div>
            <div class="lable">{{ payType }}</div>
          </div>
          <div class="text">
            {{ i18n.t('SDK.payconfirm.Payment required') }}
          </div>
        </div>
      </div>

      <div class="text-sm">
        <div class="py-4 flex flex-col">
          <div class="py-2 flex flex-row items-center justify-between">
            <div class="text-[#909399]">{{basicType == 'basic' ? i18n.t('Nfts.lanuch_baseFee') : basicType == 'mint' ? i18n.t('Nfts.lanuch_MintFee') : i18n.t('Nfts.lanuch_saleFee') }}</div>
            <div>
              <span class="mr-1">{{ space(feeInfo.basic) }}</span>
            
              <span>{{ payType }}</span>
            </div>
          </div>
          <div class="py-2 flex flex-row items-center justify-between">
            <div class="text-[#909399]">{{ i18n.t('Nfts.service_fee') }}({{ feeInfo.platformRate }}%)</div>
            <div>
              <span class="mr-1">{{ space(feeInfo.service) }}</span>
              <span class="mr-1" v-if="feeInfo.platformRate"></span>
              <span>{{ payType }}</span>
            </div>
          </div>

          <div class="py-2 flex flex-row items-center justify-between" v-if="feeInfo.royaltyRate">
            <div class="text-[#909399]">{{ i18n.t('Nfts.service_royalty_fee') }}({{ feeInfo.royaltyRate }}%) </div>
            <div>
              <span class="mr-1">{{ space(feeInfo.royalty) }}</span>
              <span class="mr-1" v-if="feeInfo.royaltyRate"></span>
              <span>{{ payType }}</span>
            </div>
          </div>

          <div class="py-2 flex flex-row items-center justify-between">
            <div class="text-[#909399]">{{ i18n.t('Nfts.miner_fee') }}</div>
            <div>
              <span class="mr-1">{{ space(feeInfo.miner) }}</span>
              <span>{{ payType }}</span>
            </div>
          </div>

          <div class="py-2 flex flex-row items-center justify-between" v-if="extractFee > 0">
            <div class="text-[#909399]">{{ i18n.t('Nfts.space_fee') }}</div>
            <div>
              <span class="mr-1">{{ space(extractFee) }}</span>
              <span>Space</span>
            </div>
          </div>

          <div class="py-2 flex flex-row items-center justify-between">
            <div class="text-[#909399]">{{ i18n.t('Nfts.feebs') }}</div>
            <div>
              <span class="mr-1">{{ feeInfo.feeb }}</span>
              <span>sat/vB</span>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between">
          <div class="text-[#909399]">{{ i18n.t('Nfts.total_fee') }}</div>
          <div>
            <span class="mr-1">{{ space(feeInfo.total) }}  </span>
            <span>{{ payType }}</span>
            <div v-if="extractFee > 0">
              <span>+</span>
            <span class="mr-1">{{ space(extractFee) }}  </span>
            <span>Space</span>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="balance">
        <span>{{ i18n.t('SDK.payconfirm.My') }}{{ payType }}：</span>{{ space(balance) }}
      </div> -->

      <!-- <div
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
          {{ 'Satoshi' }}
          {{ i18n.t('SDK.payconfirm.tips2') }}
        </div>
      </div> -->

      <div class="operate flex flex-align-center">
        <a class="main-border flex1" @click="cancel">
          {{ i18n.t('Cancel') }}
        </a>
        <a class="main-border flex1 primary" @click="confirm">
          {{ i18n.t('SDK.payconfirm.Confirm') }}
        </a>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { SdkPayType } from '@/enum'
import { ref } from 'vue'
import { Router } from 'vue-router'
import { space } from '@/utils/filters'
import {type feeInfoType} from '@/hooks/use-pay-modal-entity'
import { ElMessage } from 'element-plus'
//import i18n from '@/utils/i18n'


interface Props {
  confirmVisible: boolean
  i18n: any
  useAmount: number
  maxCount: number
  //balance: number
  router: Router
  payType: SdkPayType
  feeInfo: feeInfoType
  basicType:'basic' | 'mint' | 'buy'
  extractFee:number
}

const props = withDefaults(defineProps<Props>(), {
  payType: SdkPayType.BTC,
})

console.log("props",props.i18n)

const isShow = ref(true)

const emit = defineEmits(['changeConfirmVisible', 'confirm', 'cancel', 'recharge'])

async function confirm() {

    emit('confirm')
    isShow.value = false
  
}

function cancel() {
  emit('cancel')
  isShow.value = false
}
</script>

<style lang="scss" scoped src="./globalPayConfrim.scss"></style>
