<template>
  <ElDrawer
    :model-value="modelValue"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    custom-class="none-padding"
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <div v-loading="loading">
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
                      {{
                        payPlatformList.find(item => item.platform === currentPayPlatform)?.name()
                      }}
                    </div>
                    <Icon name="down" class="down" />
                  </a>
                  <template #dropdown>
                    <ElDropdownMenu>
                      <ElDropdownItem
                        v-for="(item, index) in payPlatformList"
                        :key="index"
                        @click="choosePayPlatform(item)"
                        :disabled="item.disabled()"
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
                  @change="onMeInput"
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
                <span class="sufix">{{
                  currentPayPlatform === PayPlatform.ETH
                    ? ETHName
                    : priceSymbol[rootStore.currentPrice]
                }}</span>
                <input
                  type="number"
                  v-model="amount"
                  ref="AmountRef"
                  @focus="getActiveElement"
                  @blur="getActiveElement"
                  @change="onRmbChange"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="operate main-border primary" :class="{ faded: isDisabled }" @click="recharge">
          {{ $t('Wallet.Add') }}
        </div>
        <div class="rate">
          1ME = {{ rate }}
          {{ currentPayPlatform === PayPlatform.ETH ? ETHName : rootStore.currentPrice }}
        </div>

        <div class="discount flex flex-align-center" v-if="coupon.val">
          <Icon name="discount" />
          <div class="cont flex1">
            <div class="name">{{ coupon.val?.name }}</div>
            <div class="time">截止{{ $filters.dateTimeFormat(coupon.val!.active_end_time) }}</div>
          </div>
          <a @click="isShowCouponMsg = true">详情</a>
        </div>
      </div>
    </div>

    <ContentModalVue v-model="isShowCouponMsg" :title="coupon.val?.name" confirmBtnText="我知道了">
      <template #content>
        <div class="coupon-msg">
          <div class="item">
            <div class="lable">活动时间</div>
            <div class="value">
              {{ $filters.dateTimeFormat(coupon.val!.active_start_time) }}
              &nbsp;--&nbsp;
              {{ $filters.dateTimeFormat(coupon.val!.active_end_time) }}
            </div>
          </div>
          <div class="item">
            <div class="lable">活动内容</div>
            <div class="value">{{ coupon.val!.description }}</div>
          </div>
        </div>
      </template>
    </ContentModalVue>
  </ElDrawer>

  <!-- 开始支付 -->
  <StartPayVue
    v-model="isStartPay"
    :url="payUrl"
    :payPlatform="payPlatformList.find(item => item.platform === currentPayPlatform)!.platform"
    :orderId="orderId"
    :product_type="product_type"
    :amount="orderAmount"
    @success="onPaySuceess"
  />
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { PayPlatformItem, payPlatformList } from '@/config'
import { PayPlatform, PayType } from '@/enum'
import Decimal from 'decimal.js-light'
import { CreateMeOrder, GetMeRate } from '@/api/v3'
import { useUserStore } from '@/stores/user'
import { CreatOrder, GetCouponInfo } from '@/api/wxcore'
import StartPayVue from '../StartPay/StartPay.vue'
import { isAndroid, isApp, isIOS, isIosApp, useRootStore } from '@/stores/root'
import { setPayQuitUrl } from '@/utils/util'
import { useRoute } from 'vue-router'
import ContentModalVue from '@/components/ContentModal/ContentModal.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const route = useRoute()
const rootStore = useRootStore()

const AmountRef = ref()
const CountRef = ref()

const count = ref('0')
const amount = ref('0')
const userStore = useUserStore()
const coupon: { val: null | CouponInfo } = reactive({ val: null })
const emit = defineEmits(['close', 'update:modelValue'])
const rate = ref(0)

const isShowPayTypes = ref(false)
const currentPayPlatform = ref(PayPlatform.UnionPay)
const isShowCouponMsg = ref(false)

const isStartPay = ref(false)
const payUrl = ref('')
const orderId = ref('')
const orderAmount = ref('')
const product_type = 100
const loading = ref(false)
const ETHName = import.meta.env.VITE_ETH_CHAIN
const priceSymbol = {
  CNY: '￥',
  USD: '$',
}

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

function getRate() {
  return new Promise<void>(async resolve => {
    const res = await GetMeRate({
      meta_id: userStore.user!.metaId,
      coin:
        currentPayPlatform.value === PayPlatform.ETH
          ? ETHName
          : rootStore.currentPrice.toLocaleLowerCase(),
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      rate.value = res.data.rate
      resolve()
    }
  })
}

function onMeInput() {
  if (count.value) {
    count.value = new Decimal(count.value).toFixed(2)
    amount.value = new Decimal(count.value ? count.value : 0)
      .mul(rate.value)
      .mul(coupon.val ? coupon.val.coupon_value : 1)
      .toFixed(currentPayPlatform.value === PayPlatform.ETH ? 10 : 2)
  } else {
    amount.value = ''
  }
}

function onRmbChange() {
  if (amount.value) {
    amount.value = new Decimal(amount.value).toFixed(2)
    count.value = new Decimal(amount.value)
      .div(rate.value)
      .div(coupon.val ? coupon.val.coupon_value : 1)
      .toFixed(2)
  } else {
    count.value = ''
  }
}

function getCouponInfo() {
  return new Promise<void>(async resolve => {
    const res = await GetCouponInfo('ME').catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      if (
        new Date().getTime() < res.data.active_end_time &&
        new Date().getTime() > res.data.active_start_time
      ) {
        coupon.val = res.data
      } else {
        coupon.val = null
      }
    } else {
      coupon.val = null
    }
    resolve()
  })
}

async function recharge() {
  if (isDisabled.value) return
  loading.value = true
  let from = !isApp ? 'web' : isAndroid ? 'android' : isIOS ? 'ios' : ''
  from += `:${import.meta.env.VITE_AppName}`
  // 支付回调地址
  const quitUrl = setPayQuitUrl({
    payPlatform: currentPayPlatform.value,
    fullPath: route.fullPath,
    isBlindbox: false,
  })
  const type = isIosApp
    ? PayType.H5
    : isApp
    ? PayType.App
    : isAndroid && isIOS
    ? PayType.H5
    : PayType.H5
  const res = await CreatOrder({
    address: userStore.user!.address!,
    count: new Decimal(count.value).mul(100).toNumber(),
    description: '充值能量点',
    from,
    goods_name: '能量点',
    metaid: userStore.user!.metaId,
    pay_type: currentPayPlatform.value,
    quit_url: quitUrl,
    types: type,
    from_coin_address: userStore.user?.ethAddress,
    product_type,
  }).catch(error => {
    ElMessage.error(error.message)
    loading.value = false
  })
  if (res?.code === 0) {
    payUrl.value = res.data.url
    orderId.value = res.data.outside_order_id
    orderAmount.value = res.data.amount
    loading.value = false
    isStartPay.value = true
  }
}

function onPaySuceess() {
  count.value = ''
  amount.value = ''
}

function lockScroller() {
  document.body.classList.add('el-popup-parent--hidden')
}

function choosePayPlatform(item: PayPlatformItem) {
  if (item.disabled()) return
  currentPayPlatform.value = item.platform
  getRate().then(() => {
    onMeInput()
  })
}

watch(
  () => props.modelValue,
  async () => {
    if (props.modelValue) {
      await getRate()
      await getCouponInfo()
    }
  }
)
</script>

<style lang="scss" scoped src="./RechargeMe.scss"></style>
