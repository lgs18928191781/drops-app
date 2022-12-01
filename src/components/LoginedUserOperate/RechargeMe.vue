<template>
  <ElDrawer
    :model-value="modelValue"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    custom-class="none-padding"
    @close="emit('close')"
  >
    <header class="flex flex-align-center">
      <Icon name="down" @click="emit('update:modelValue', false)" />
      <div class="title">{{ $t('Wallet.Add Funds') }}</div>
    </header>

    <div class="content">
      <div class="form">
        <div class="form-section">
          <div class="form_item flex flex-align-center">
            <div class="label flex1">{{ $t('Wallet.Payment') }}</div>
            <div class="value" :class="{ active: isShowPayTypes }">
              <ElDropdown trigger="click" @visible-change="value => (isShowPayTypes = value)">
                <a class="flex flex-align-center pay-item" :class="{ active: isShowPayTypes }">
                  <div class="icon-warp flex flex-align-center flex-pack-center">
                    <img
                      :src="
                        payPlatformList.find(item => item.platform === currentPayPlatform)?.icon
                      "
                    />
                  </div>
                  <div class="name">
                    {{ payPlatformList.find(item => item.platform === currentPayPlatform)?.name() }}
                  </div>
                  <Icon name="down" class="down" />
                </a>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem
                      v-for="(item, index) in payPlatformList"
                      :key="index"
                      @click="currentPayPlatform = item.platform"
                    >
                      <a
                        class="flex flex-align-center pay-item"
                        :class="{ active: currentPayPlatform === item.platform }"
                      >
                        <div class="flex1 flex flex-align-center">
                          <div class="icon-warp flex flex-align-center flex-pack-center">
                            <img :src="item.icon" />
                          </div>
                          <span class="name">{{ item.name() }}</span>
                        </div>
                        <div class="check-warp flex flex-align-center flex-pack-center">
                          <Icon name="check" v-if="currentPayPlatform === item.platform" />
                        </div>
                      </a>
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form_item flex flex-align-center">
            <div class="label flex1">{{ $t('Wallet.Add Quantity') }}</div>
            <div
              class="value input flex flex-align-center"
              @click="getFoucus(CountRef)"
              :class="{ active: activeElement === CountRef }"
            >
              <input
                type="number"
                v-model="count"
                ref="CountRef"
                @focus="getActiveElement"
                @blur="getActiveElement"
              />
              <span class="sufix">ME</span>
            </div>
          </div>

          <div class="form_item flex flex-align-center">
            <div class="label flex1">{{ $t('Wallet.Add Amount') }}</div>
            <div
              class="value input flex flex-align-center"
              @click="getFoucus(AmountRef)"
              :class="{ active: activeElement === AmountRef }"
            >
              <span class="sufix">$</span>
              <input
                type="number"
                v-model="amount"
                ref="AmountRef"
                @focus="getActiveElement"
                @blur="getActiveElement"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="operate main-border primary" :class="{ faded: isDisabled }">
        {{ $t('Wallet.Add') }}
      </div>
      <div class="rate">1ME = 0.01 USD</div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { payPlatformList } from '@/config'
import { PayPlatform } from '@/enum'
import Decimal from 'decimal.js-light'

const props = defineProps<{
  modelValue: boolean
}>()

const AmountRef = ref()
const CountRef = ref()

const count = ref('0')
const amount = ref('0')
const emit = defineEmits(['close', 'update:modelValue'])

const isShowPayTypes = ref(false)
const currentPayPlatform = PayPlatform.UnionPay

const isDisabled = computed(() => {
  let result = true
  if (new Decimal(amount.value).toNumber() && new Decimal(amount.value).toNumber()) {
    result = false
  }
  return result
})

const activeElement = ref(document.activeElement)

function getActiveElement() {
  activeElement.value = document.activeElement
}

function getFoucus(element: HTMLElement) {
  element.focus()
}
</script>

<style lang="scss" scoped src="./RechargeMe.scss"></style>
