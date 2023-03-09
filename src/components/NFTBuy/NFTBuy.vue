<template>
  <ElDialog
    :model-value="modelValue"
    class="sm none-padding"
    :close-on-click-modal="false"
    :title="$t('NFT.Order Information')"
    @close="emit('update:modelValue', false)"
    :show-close="buying ? false : true"
    center
  >
    <ElSkeleton :loading="isSkeleton" animated>
      <div class="nft-buy">
        <div class="msg flex">
          <div class="cover-warp"><NFTCover :cover="[nft.nftIcon]" /></div>
          <div class="content flex1">
            <div class="name">{{ nft.nftName }}</div>
            <div class="user-list">
              <div class="user-item flex flex-align-center">
                <UserAvatar
                  :meta-id="nft.nftIssueMetaId"
                  :name="nft.nftIssuer"
                  :image="nft.nftIssueAvatarImage"
                  :meta-name="nft.nftIssueUserInfo.metaName"
                />
                <span class="username"
                  ><UserName
                    :name="nft.nftIssuer"
                    :meta-name="nft.nftIssueUserInfo.metaName"
                    :no-tag="true"
                /></span>
                <span class="role">({{ $t('NFT.Creater') }})</span>
              </div>
              <div class="user-item flex flex-align-center">
                <UserAvatar
                  :meta-id="nft.nftOwnerMetaId"
                  :name="nft.nftOwnerName"
                  :image="nft.nftOwnerAvatarImage"
                  :meta-name="nft.nftOwnerUserInfo.metaName"
                />
                <span class="username"
                  ><UserName
                    :name="nft.nftOwnerName"
                    :meta-name="nft.nftOwnerUserInfo.metaName"
                    :no-tag="true"
                /></span>
                <span class="role">({{ $t('NFT.Owner') }})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="price-list">
          <div class="price-item flex flex-alian-center">
            <div class="label flex1">{{ $t('NFT.Price') }}</div>
            <div class="value">{{ $filters.space(nft.nftPrice) }} Space</div>
          </div>
          <div class="price-item flex flex-alian-center">
            <div class="label flex1">
              {{ $t('NFT.Platform Fee') }}<span class="rate">({{ platformFeeRate }}%)</span>
            </div>
            <div class="value">{{ platformFee }} Space</div>
          </div>
          <div class="price-item flex flex-alian-center">
            <div class="label flex1">
              {{ $t('NFT.Royalties') }}<span class="rate">({{ royalyFeeRate }}%)</span>
            </div>
            <div class="value">{{ royalyFee }} Space</div>
          </div>
        </div>

        <div class="total-price flex flex-align-center">
          <span class="label flex1">{{ $t('NFT.Total') }}</span>
          <span class="value">{{ totalPrice }} Space</span>
        </div>

        <a
          class="operate main-border primary flex flex-align-center flex-pack-center"
          @click="confirmBuy"
          v-loading="buying"
        >
          {{ $t('NFT.Confirm Payment') }}
        </a>
      </div>

      <StartPayVue
        v-model="isShowPayModal"
        :payPlatform="currentPayPlatform"
        :product_type="product_type"
        :order-id="payMsg.orderId"
        :amount="payMsg.amount"
        :url="payMsg.url"
        @success="onPaySuccess"
      />
    </ElSkeleton>
  </ElDialog>

  <ElDialog
    v-model="isShowSuccess"
    class="sm none-padding"
    :close-on-click-modal="false"
    :title="''"
    @close="emitSuccess"
    :show-close="true"
    center
  >
    <div class="success-result">
      <div class="success-icon flex flex-align-center flex-pack-center">
        <div class="success-icon-warp flex flex-align-center flex-pack-center">
          <Icon name="check" />
        </div>
      </div>
      <div class="title">
        {{ $t('NFT.Payment Succeeded') }}
      </div>
      <div class="tips">
        {{ $t('NFT.Payment Succeeded Tips') }}
      </div>

      <div class="main-border primary" @click="toNFT">
        {{ $t('NFT.View Item') }}
      </div>
      <div class="later">
        <a @click="isShowSuccess = false">{{ $t('NFT.Check later') }}</a>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { NodeName, PayPlatform, PayType, SdkPayType, ToCurrency, NFTSellState } from '@/enum'
import { isAndroid, isApp, isIOS, isIosApp, useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { computed, reactive, Ref, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTMsgVue from '../NFTMsg/NFTMsg.vue'
import { PayPlatformItem, payPlatformList } from '@/config'
import PayTypeDropdownVue from '../PayTypeDropdown/PayTypeDropdown.vue'
import { CreatePayOrder, setPayQuitUrl } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import StartPayVue from '../StartPay/StartPay.vue'
import { ElMessage } from 'element-plus'
import Decimal from 'decimal.js-light'
import { GetGenesisFee, GetNFTFee, NFTFeeInfo } from '@/api/strapi'
import NFTCover from '../NFTCover/NFTCover.vue'

const props = defineProps<{
  modelValue: boolean
  nft: GenesisNFTItem
  isHideDetail?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'success'])
const route = useRoute()
const router = useRouter()
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const isShowPayTypes = ref(false)
const currentPayPlatform = ref(PayPlatform.SPACE)
const toCurrency: Ref<undefined | ToCurrency> = ref(
  currentPayPlatform.value === PayPlatform.ETH ? ToCurrency.ETH : undefined
)
const isShowPayModal = ref(false)
const product_type = 200 // 100-ME, 200-Legal_NFT
const payMsg = reactive({
  url: '',
  orderId: '',
  amount: '',
})
const nftFee: { val: NFTFeeInfo | null } = reactive({ val: null })
const isSkeleton = ref(true)
const buying = ref(false)
const isShowSuccess = ref(false)

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
  //  法币购买
  // const res = await CreatePayOrder({
  //   platform: currentPayPlatform.value,
  //   fullPath: setPayQuitUrl({
  //     payPlatform: currentPayPlatform.value,
  //     fullPath: route.fullPath,
  //     isBlindbox: false,
  //   }),
  //   goods_name: props.nft.nftName,
  //   count: 1,
  //   product_type: product_type,
  //   uuid: props.nft.nftLegalUuid,
  // }).catch(error => {
  //   ElMessage.error(error.message)
  // })
  // if (res) {
  //   payMsg.amount = res.pay_amount!.toString()
  //   payMsg.orderId = res.wxCoreOrderId
  //   payMsg.url = res.url
  //   isShowPayModal.value = true
  // }

  buying.value = true
  // Space 购买
  try {
    const params: any = {
      genesis: props.nft.nftGenesis,
      codehash: props.nft.nftCodehash,
      tokenIndex: props.nft.nftTokenIndex,
      sellTxId: props.nft.nftSellTxId,
      sellContractTxId: props.nft.nftSellContractTxId,
      sellUtxo: {
        txId: props.nft.nftSellContractTxId,
        outputIndex: 0,
        sellerAddress: props.nft.nftOwnerAddress,
        price: props.nft.nftPrice,
      },
    }
    const publisherFeeRate = platformFeeRate.value / 100
    const creatorFeeRate = royalyFeeRate.value / 100
    if (publisherFeeRate) {
      params.publisherFeeRate = publisherFeeRate
      params.publisherAddress = nftFee.val!.platformAddress
    }
    if (creatorFeeRate) {
      params.creatorFeeRate = creatorFeeRate
      params.creatorAddress = props.nft.nftIssueAddress
    }
    const res = await userStore.showWallet.createBrfcChildNode(
      {
        nodeName: NodeName.nftBuy,
        data: JSON.stringify(params),
      },
      {
        payType: SdkPayType.SPACE,
      }
    )
    if (res) {
      ElMessage.success(i18n.t('NFT.Buy Success'))
      emit('update:modelValue', false)
      buying.value = false
      isShowSuccess.value = true
    } else if (res === null) {
      buying.value = false
    }
  } catch (error) {
    ElMessage.error((error as any).message)
    buying.value = false
  }
}

const platformFeeRate = computed(() => {
  let rate = 0
  if (nftFee.val) {
    rate = props.nft.nftIsFirstSell
      ? nftFee.val.firstSellPlatformFeeRate
      : nftFee.val.platformFeeRate
  }
  return new Decimal(new Decimal(rate).mul(100).toFixed(2)).toNumber()
})

const royalyFeeRate = computed(() => {
  let rate = 0
  if (nftFee.val) {
    rate = props.nft.nftIsFirstSell ? nftFee.val.firstSellRoyaltyFeeRate : nftFee.val.royaltyFeeRate
  }
  return new Decimal(new Decimal(rate).mul(100).toFixed(2)).toNumber()
})

const platformFee = computed(() => {
  let fee = 0
  if (nftFee.val) {
    fee = new Decimal(props.nft.nftPrice)
      .mul(platformFeeRate.value / 100)
      .toInteger()
      .div(Math.pow(10, 8))
      .toNumber()
  }
  return fee
})

const royalyFee = computed(() => {
  let fee = 0
  if (nftFee.val) {
    fee = new Decimal(props.nft.nftPrice)
      .mul(royalyFeeRate.value / 100)
      .toInteger()
      .div(Math.pow(10, 8))
      .toNumber()
  }
  return fee
})

const totalPrice = computed(() => {
  return new Decimal(props.nft.nftPrice)
    .div(Math.pow(10, 8))
    .add(platformFee.value)
    .add(royalyFee.value)
    .toNumber()
})

function toNFT() {
  if (
    route.name === 'nftDetail' &&
    route.params.chain === props.nft.nftChain &&
    route.params.genesis === props.nft.nftGenesis &&
    route.params.codehash === props.nft.nftCodehash &&
    route.params.tokenIndex === props.nft.nftTokenIndex
  ) {
    isShowSuccess.value = false
    return
  }
  router.push({
    name: 'nftDetail',
    params: {
      chain: props.nft.nftChain,
      genesis: props.nft.nftGenesis,
      tokenIndex: props.nft.nftTokenIndex,
      codehash: props.nft.nftCodehash ? props.nft.nftCodehash : props.nft.nftChain,
    },
  })
  isShowSuccess.value = false
}

function onPaySuccess() {
  emit('update:modelValue', false)
  isShowSuccess.value = true
}

function emitSuccess() {
  emit('success', {
    ...props.nft,
    nftSellState: NFTSellState.OffSale,
    nftOwnerUserInfo: {
      address: userStore.user!.address,
      avatarTxId: userStore.user!.avatarTxId,
      avatarType: userStore.user!.avatarType,
      avatarImage: userStore.user!.avatarImage,
      coverPublicKey: '',
      coverType: userStore.user!.avatarType,
      coverUrl: '',
      metaIdTimestamp: '',
      name: userStore.user!.name,
      nameType: '',
      metaName: userStore.user!.metaName,
      nftNamePublicKey: '',
      publicKey: '',
    },
    nftOwnerAddress: userStore.user!.address,
    nftOwnerAvatarTxId: userStore.user!.avatarTxId,
    nftOwnerAvatarType: userStore.user!.avatarType,
    nftOwnerAvatarImage: userStore.user!.avatarImage,
    nftOwnerMetaId: userStore.user!.metaId,
    nftOwnerName: userStore.user!.name,
  })
}

watch(
  () => props.modelValue,
  val => {
    if (val) {
      isSkeleton.value = true
      GetNFTFee().then(async res => {
        if (res) {
          const response = await GetGenesisFee(props.nft.nftGenesis)
          nftFee.val = {
            ...res,
            ...response,
          }
          isSkeleton.value = false
        }
      })
    }
  }
)
</script>

<style lang="scss" scoped src="./NFTBuy.scss"></style>
