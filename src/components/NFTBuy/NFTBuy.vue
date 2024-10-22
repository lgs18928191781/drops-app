<template>
  <Modal
    :model-value="modelValue"
    v-model:show-second-control="isShowPayList"
    :width="'456px'"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <template #title>
      {{ $t('NFT.Order Information') }}
    </template>
    <template #body>
      <ElSkeleton :loading="isSkeleton" animated>
        <div class="nft-buy">
          <div class="msg flex">
            <div class="cover-warp"><NFTCover :cover="[nft.pic_path || nft.item_cover]" /></div>
            <div class="content flex1">
              <div class="name">{{ nft.nft_name }}</div>
              <div class="user-list">
                <div class="user-item flex flex-align-center">
                  <UserAvatar
                  :address="nft.creator_info.address"
                    :meta-id="nft.creator_info.metaid"
                    :name="nft.creator_info.name"
                    :image="nft.creator_info.avatarId"
                    :meta-name="''"
                  />
                  <span class="username"
                    ><UserName
                      :name="nft.creator_info.name"
                      :meta-name="''"
                      :no-tag="true"
                  /></span>
                  <span class="role">({{ $t('NFT.Creater') }})</span>
                </div>
                <div class="user-item flex flex-align-center">
                  <UserAvatar
                   :address="nft.owner_info.address"
                    :meta-id="nft.owner_info.metaid"
                    :name="nft.owner_info.name"
                    :image="nft.owner_info.avatarId"
                    :meta-name="''"
                  />
                  <span class="username"
                    ><UserName
                      :name="nft.owner_info.name"
                      :meta-name="''"
                      :no-tag="true"
                  /></span>
                  <span class="role">({{ $t('NFT.Owner') }})</span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="choose-pay flex flex-align-center flex-pack-center"
            
           
          >
            <!-- <Icon name="wallet_fill" class="wallet" />
            <span>{{ $t('NFT.Chosse PayType') }}</span>
            <Icon name="down" class="right" /> -->
          </div>

          <div class="price-list" :class="{ 'mt-7': mode === EnvMode.Mainnet }">
            <div class="price-item flex flex-alian-center">
              <div class="label flex1">{{ $t('NFT.Price') }}</div>
              <div class="value">{{$filters.space(realSalePrice.salePrice) }} {{ amountSymbol }}</div>
            </div>
            <div class="price-item flex flex-alian-center">
              <div class="label flex1">
                {{ $t('NFT.Platform Fee') }}<span class="rate">({{ platformFeeRate }}%)</span>
              </div>
              <div class="value">
                {{$filters.space(realSalePrice.platformFee)  }}
                {{ amountSymbol }}
              </div>
            </div>
            <div class="price-item flex flex-alian-center">
              <div class="label flex1">
                {{ $t('NFT.Royalties') }}<span class="rate">({{ royalyFeeRate }}%)</span>
              </div>
              <div class="value">
               {{$filters.space(realSalePrice.royaltyFee)  }} {{ amountSymbol }}
              </div>
            </div>
          </div>

          <div class="total-price flex flex-align-center">
            <span class="label flex1">{{ $t('NFT.Total') }}</span>
            <span class="value">  {{$filters.space(realSalePrice.total)  }}  {{ amountSymbol }}</span>
          </div>

          <a
            class="operate main-border  flex flex-align-center flex-pack-center"
            @click="confirmBuy"
            v-loading="buying"
            :class="[isGetBalanceing || !isEnough ? 'faded' : 'primary']"
          >
            <template v-if="isGetBalanceing">
              <ElIcon class="is-loading">
                <Loading />
              </ElIcon>
            </template>
            <template v-else-if="isEnough">
              {{ $t('NFT.Confirm Payment') }}
            </template>
            <template v-else>
              <span v-html="$t('NFT.BuyNFTNoteEnough')"></span>
            </template>
          </a>
        </div>
      </ElSkeleton>
    </template>

    <template #secondTitle>
      {{ $t('NFT.Select Payment Method') }}
    </template>
    <template #secondBody>
      <div class="pay-list">
        <div
          class="pay-item flex flex-align-center"
          v-for="(item, index) in payPlatformList"
          :key="index"
         
        >
          <div class="flex1 flex flex-align-center">
            <img class="logo" :src="item.icon" />
            <span class="name">{{ item.name() }}</span>
          </div>
          <span
            class="check flex flex-align-center flex-pack-center"
            v-if="item.platform === currentPayPlatform"
          >
            <Icon name="check" />
          </span>
        </div>
      </div>
    </template>
  </Modal>

  <!-- <ElDialog
    :model-value="modelValue"
    class="sm none-padding"
    :close-on-click-modal="false"
    :title="$t('NFT.Order Information')"
    @close="emit('update:modelValue', false)"
    :show-close="buying ? false : true"
    center
  >
  </ElDialog> -->

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

  <StartPayVue
    v-model="isShowPayModal"
    :payPlatform="currentPayPlatform"
    :product_type="product_type"
    :order-id="payMsg.orderId"
    :amount="payMsg.amount"
    :pay_decimal_num="payMsg.pay_decimal_num"
    :url="payMsg.url"
    @success="onPaySuccess"
  />
</template>

<script setup lang="ts">
import {
  NodeName,
  PayPlatform,
  PayType,
  SdkPayType,
  ToCurrency,
  NFTSellState,
  Chains,
  ProductType,
  EnvMode,
  BuyNFTStatus,
} from '@/enum'
import { isAndroid, isApp, isIOS, isIosApp, useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { computed, nextTick, reactive, Ref, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTMsgVue from '../NFTMsg/NFTMsg.vue'
import {
  payPlatformAmountRate,
  PayPlatformItem,
  payPlatformList,
  payPlatformAmountFix,
  payPlatformToCurrency,
} from '@/config'
import PayTypeDropdownVue from '../PayTypeDropdown/PayTypeDropdown.vue'
import {
  CreatePayOrder,
  getBalance,
  getCurrencyAmount,
  setPayQuitUrl,
  getPlatformSymbol,
  calcNftRealSalePrice
} from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import StartPayVue from '../StartPay/StartPay.vue'
import { ElMessage, useZIndex } from 'element-plus'
import Decimal from 'decimal.js-light'
import { GetGenesisFee, GetNFTFee, NFTFeeInfo } from '@/api/strapi'
import NFTCover from '../NFTCover/NFTCover.vue'
import Modal from '@/components/Modal/Modal.vue'
import { space } from '@/utils/filters'
import { Loading } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import { CheckNFTStatus } from '@/api/wxcore'
import { isNFTCanOperate } from '@/utils/nft'
import {useNFTEntity} from '@/hooks/use-nft-entity'
import {NftsLaunchPadChainSymbol,PlatformRate} from '@/data/constants'
import { useConnectionStore } from '@/stores/connection'

const props = defineProps<{
  modelValue: boolean
  nft: NftOrderType
  isHideDetail?: boolean
}>()

console.log("propsprops",props.nft)


const emit = defineEmits(['update:modelValue', 'success'])
const route = useRoute()
const router = useRouter()
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const isShowPayTypes = ref(false)
const nftEntity=useNFTEntity()
const connectionStore=useConnectionStore()
const currentPayPlatform = ref(PayPlatform.BTC)
const isGetBalanceing = ref(false)
const toCurrency: Ref<undefined | ToCurrency> = ref(
  currentPayPlatform.value === PayPlatform.ETH ? ToCurrency.ETH : undefined
)
const isShowPayModal = ref(false)
const product_type = 200 // 100-ME, 200-Legal_NFT
const payMsg = reactive({
  url: '',
  orderId: '',
  amount: '',
  pay_decimal_num: 0,
})
const nftFee: { val: NFTFeeInfo | null } = reactive({ val: null })
const isSkeleton = ref(false)
const buying = ref(false)
const isShowSuccess = ref(false)
const isShowPayList = ref(false)
const isEnough = ref(true)
const payPlatformChain = {
  //[PayPlatform.BSV]: Chains.BSV,
  [PayPlatform.ETH]: Chains.ETH,
  [PayPlatform.POLYGON]: Chains.POLYGON,
}
const ToCurrencyAmounMin = {
  //[ToCurrency.BSV]: 0.00000001,
  [ToCurrency.CNY]: 0.01,
  [ToCurrency.ETH]: 0.000000001,
  [ToCurrency.MVC]: 0.00000001,
  [ToCurrency.POLYGON]: 0.000000001,
  [ToCurrency.USD]: 0.01,
  [ToCurrency.BTC]: 0.00001,
}
const mode = import.meta.env.MODE
const layout = useLayoutStore()

const realSalePrice=computed(()=>{
  return calcNftRealSalePrice(props.nft.sale_price,props.nft.total_sale_price,props.nft.royalty_rate)

})


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
  if (isGetBalanceing.value) return
  if (isEnough.value) {
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

    try {
      const result = await isNFTCanOperate({
        nftPinid:props.nft.item_pinid
      })
      if (result) {
        console.log("props.nft",props.nft)
        
        const buyRes= await nftEntity.buyNft({
          nftItem:props.nft,
          psbtHex:props.nft.order_id,
          buyerAddress:connectionStore.last.user.address,
          nftPinid:props.nft.item_pinid,
          chain:NftsLaunchPadChainSymbol.btc,
          extraFee:{
            salePrice:realSalePrice.value.salePrice,
            platformFee:realSalePrice.value.platformFee,
            royalFee:realSalePrice.value.royaltyFee,
            platformRate:PlatformRate,
            royaltyRate:realSalePrice.value.royaltyRate
          }
        })
        
            if(buyRes){
              ElMessage.success(i18n.t('NFT.Buy Success'))
            emit('update:modelValue', false)
            buying.value = false
            //isShowSuccess.value = true
            emit('success')
            }else{
              buying.value = false
            }

          
       


        // if (currentPayPlatform.value === PayPlatform.SPACE) {
        //   const params: any = {
        //     genesis: props.nft.nftGenesis,
        //     codehash: props.nft.nftCodehash,
        //     tokenIndex: props.nft.nftTokenIndex,
        //     sellTxId: props.nft.nftSellTxId,
        //     sellContractTxId: props.nft.nftSellContractTxId,
        //     sellUtxo: {
        //       txId: props.nft.nftSellContractTxId,
        //       outputIndex: 0,
        //       sellerAddress: props.nft.nftOwnerAddress,
        //       price: props.nft.nftPrice,
        //     },
        //   }
        //   const publisherFeeRate = platformFeeRate.value / 100
        //   const creatorFeeRate = royalyFeeRate.value / 100
        //   if (publisherFeeRate) {
        //     params.publisherFeeRate = publisherFeeRate
        //     params.publisherAddress = nftFee.val!.platformAddress
        //   }
        //   if (creatorFeeRate) {
        //     params.creatorFeeRate = creatorFeeRate
        //     params.creatorAddress = props.nft.nftIssueAddress
        //   }
        //   const res = await userStore.showWallet.createBrfcChildNode(
        //     {
        //       nodeName: NodeName.nftBuy,
        //       data: JSON.stringify(params),
        //     },
        //     {
        //       payType: SdkPayType.SPACE,
        //     }
        //   )
        //   if (res) {
        //     ElMessage.success(i18n.t('NFT.Buy Success'))
        //     emit('update:modelValue', false)
        //     buying.value = false
        //     isShowSuccess.value = true
        //   } else if (res === null) {
        //     buying.value = false
        //   }
        // } else {
        //   const res = await CreatePayOrder({
        //     platform: currentPayPlatform.value,
        //     fullPath: setPayQuitUrl({
        //       payPlatform: currentPayPlatform.value!,
        //       fullPath: route.fullPath,
        //       isBlindbox: false,
        //     }),
        //     goods_name: props.nft!.nftName,
        //     count: 1,
        //     product_type: ProductType.LegalNft, // 100-ME, 200-Legal_NFT,

        //     // 购买合约 NFT
        //     genesis: props.nft.nftGenesis,
        //     codehash: props.nft.nftCodehash,
        //     contract: props.nft.nftSellContractTxId,
        //     tokenIndex: props.nft.nftTokenIndex,
        //   })
        //   if (res) {
        //     payMsg.amount = res.pay_amount!.toString()
        //     payMsg.orderId = res.order_id
        //     payMsg.pay_decimal_num = res.pay_decimal_num
        //     payMsg.url = res.url
        //     buying.value = false
        //     emit('update:modelValue', false)
        //     nextTick(() => {
        //       isShowPayModal.value = true
        //     })
        //   }
        // }
      }
    } catch (error) {
      ElMessage.error((error as any).message)
      buying.value = false
    }
  } else {
    emit('update:modelValue', false)
    layout.isShowWallet = true
  }
}

const nftPrice = computed(() => {
 
  return getCurrencyAmount(
    props.nft.sale_price,
    ToCurrency.BTC,
    payPlatformToCurrency[currentPayPlatform.value]
  )
})

const amountSymbol = computed(() => {
  return getPlatformSymbol(currentPayPlatform.value)
})

const platformFeeRate = computed(() => {
  let rate = 0.06
  
  // if (nftFee.val) {
  //   rate = props.nft.nftIsFirstSell
  //     ? nftFee.val.firstSellPlatformFeeRate
  //     : nftFee.val.platformFeeRate
  // }
  return new Decimal(new Decimal(rate).mul(100).toFixed(2)).toNumber()
})

const royalyFeeRate = computed(() => {
  
  // if (nftFee.val) {
  //   rate = props.nft.nftIsFirstSell ? nftFee.val.firstSellRoyaltyFeeRate : nftFee.val.royaltyFeeRate
  // }
  return new Decimal(new Decimal(props.nft.royalty_rate)).toNumber()
})

const platformFee = computed(() => {
  let fee = 0
  const btcFee = new Decimal(props.nft.sale_price)
      .mul(platformFeeRate.value / 100)
      .toInteger()
      .toNumber()
   
    fee = getCurrencyAmount(
      btcFee,
      ToCurrency.BTC,
      payPlatformToCurrency[currentPayPlatform.value]
    )

  if (fee < ToCurrencyAmounMin[payPlatformToCurrency[currentPayPlatform.value]]) {
    fee = ToCurrencyAmounMin[payPlatformToCurrency[currentPayPlatform.value]]
  }
  return fee
})

const royalyFee = computed(() => {
  let fee = 0
  
    const BTCfee = new Decimal(props.nft.sale_price)
      .mul(royalyFeeRate.value / 100)
      .toInteger()
      .toNumber()

    

    fee = getCurrencyAmount(
      BTCfee,
      ToCurrency.BTC,
      payPlatformToCurrency[currentPayPlatform.value]
    )
   
  

  if (fee < ToCurrencyAmounMin[payPlatformToCurrency[currentPayPlatform.value]]) {
    fee = ToCurrencyAmounMin[payPlatformToCurrency[currentPayPlatform.value]]
  }
  return fee
})

const totalPrice = computed(() => {
  return new Decimal(nftPrice.value)
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
  const params =
    currentPayPlatform.value === PayPlatform.SPACE
      ? {
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
        }
      : {
          nftIsOrderLock: true,
        }
  emit('success', {
    ...props.nft,
    ...params,
  })
}

// function checkIsEnough() {
//   return new Promise<void>(async (resolve, reject) => {
//     // @ts-ignore
//     if (payPlatformChain[currentPayPlatform.value]) {
//       // @ts-ignore
//       const res = await getBalance({ chain: payPlatformChain[currentPayPlatform.value] }).catch(
//         error => {
//           ElMessage.error(error.message)
//         }
//       )
//       if (typeof res === 'number') {
//         if (
//           res <
//           new Decimal(totalPrice.value)
//             .mul(payPlatformAmountRate[currentPayPlatform.value])
//             .toNumber()
//         ) {
//           isEnough.value = false
//           resolve()
//         } else {
//           isEnough.value = true
//           resolve()
//         }
//       }
//     } else {
//       isEnough.value = true
//       resolve()
//     }
//   })
// }

// function changePlatform(platform: PayPlatform) {
//   if (currentPayPlatform.value === platform) return
//   currentPayPlatform.value = platform
//   isGetBalanceing.value = true
//   nextTick(() => {
//     checkIsEnough().then(() => {
//       isGetBalanceing.value = false
//     })
//   })
//   isShowPayList.value = false
// }

watch(
  () => props.modelValue,
  val => {
    if (val) {
      isSkeleton.value = false
      // GetNFTFee().then(async res => {
      //   if (res) {
      //     const response = await GetGenesisFee(props.nft.nftGenesis)
      //     nftFee.val = {
      //       ...res,
      //       ...response,
      //     }
      //     nextTick(async () => {
      //       // await checkIsEnough()
      //       isSkeleton.value = false
      //     })
      //   }
      // })
    }
  }
)
</script>

<style lang="scss" scoped src="./NFTBuy.scss"></style>
