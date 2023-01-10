<template>
  <div class="order-msg">
    <div class="pay-amount flex flex-align-center order-msg-item">
      <div class="label flex1">{{ $t('MetaName.Pay Amount') }}</div>
      <div class="amount">$5</div>
    </div>

    <div class="pay-type order-msg-item">
      <div class="title">{{ $t('MetaName.Choose Pay Type') }}</div>
      <div class="pay-type-list">
        <div
          class="pay-type-item flex flex-align-center"
          v-for="(item, index) in payPlatformList"
          :key="index"
          @click="changePayType(item.platform)"
        >
          <div class="logo flex flex-align-center flex-pack-center">
            <img :src="item.icon" />
          </div>
          <div class="name flex1">{{ item.name() }}</div>
          <span
            class="check-warp flex flex-align-center flex-pack-center"
            v-if="currentPayPlatform === item.platform"
          >
            <Icon name="check" />
          </span>
        </div>
      </div>
    </div>

    <div class="result-amount">
      <div class="amount">0.000126 ETH</div>
      <div class="usd">5 USD</div>
    </div>

    <div class="btn primary">
      {{ $t('MetaName.Pay') }}
    </div>
    <div class="back">
      <a>{{ $t('back') }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { payPlatformList } from '@/config'
import { PayPlatform } from '@/enum'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'

const userStore = useUserStore()
const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)

function changePayType(platform: PayPlatform) {
  if (currentPayPlatform.value === platform) return
  currentPayPlatform.value = platform
}
</script>

<style lang="scss" scoped src="./PayMsg.scss"></style>
