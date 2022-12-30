<template>
  <ElDialog
    :model-value="modelValue"
    class="sm none-padding"
    :close-on-click-modal="false"
    :title="$t('NFT.Order Information')"
    @close="emit('update:modelValue', false)"
  >
    <div class="nft-buy">
      <NFTMsgVue :nft="nft" :to-currency="toCurrency" />

      <div class="nft-msg-list">
        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Creater') }}：</div>
          <div class="value flex flex-align-center">
            <UserAvatar
              :meta-id="nft.nftIssueMetaId"
              :image="nft.nftIssueAvatarImage"
              :disabled="true"
            />{{ nft.nftIssuer }}
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Create Time') }}：</div>
          <div class="value flex flex-align-center">
            {{ $filters.dateTimeFormat(nft.nftTimestamp) }}
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center" v-if="!isHideDetail">
          <div class="key flex1">{{ $t('NFT.NFT Details') }}：</div>
          <div class="value flex flex-align-center">
            <Icon name="down" />
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Payment Method') }}：</div>
          <div class="value flex flex-align-center">
            <PayTypeDropdownVue
              v-model="isShowPayTypes"
              v-model:current-pay-platform="currentPayPlatform"
              @change="onPayPlatformChange"
            />
          </div>
        </div>
      </div>

      <a
        class="operate main-border primary flex flex-align-center flex-pack-center"
        @click="confirmBuy"
      >
        {{ $t('NFT.Buy Now') }}
      </a>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { PayPlatform, PayType, ToCurrency } from '@/enum'
import { isAndroid, isApp, isIOS, isIosApp, useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTMsgVue from '../NFTMsg/NFTMsg.vue'
import { PayPlatformItem, payPlatformList } from '@/config'
import PayTypeDropdownVue from '../PayTypeDropdown/PayTypeDropdown.vue'
import { CreatePayOrder, setPayQuitUrl } from '@/utils/util'
import { useRoute } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
  nft: GenesisNFTItem
  isHideDetail?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'success'])
const route = useRoute()
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const isShowPayTypes = ref(false)
const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)
const toCurrency: Ref<undefined | ToCurrency> = ref(
  currentPayPlatform.value === PayPlatform.ETH ? ToCurrency.ETH : undefined
)

function choosePayPlatform(item: PayPlatformItem) {
  if (item.disabled()) return
  currentPayPlatform.value = item.platform
}

function onPayPlatformChange() {
  if (currentPayPlatform.value === PayPlatform.ETH) {
    toCurrency.value = ToCurrency.ETH
  } else {
    toCurrency.value = undefined
  }
}

async function confirmBuy() {
  // return ElMessage.info(i18n.t('Comming Soon'))
  const res = await CreatePayOrder({
    platform: currentPayPlatform.value,
    fullPath: setPayQuitUrl({
      payPlatform: currentPayPlatform.value,
      fullPath: route.fullPath,
      isBlindbox: false,
    }),
    goods_name: props.nft.nftName,
    count: 1,
    product_type: 200, // 100-ME, 200-Legal_NFT,
    uuid: props.nft.nftLegalUuid,
  })
  if (res) {
    debugger
  }
}
</script>

<style lang="scss" scoped src="./NFTBuy.scss"></style>
