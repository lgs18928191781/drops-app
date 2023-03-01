<template>
  <ElDialog
    :model-value="modelValue"
    class="sm"
    :close-on-click-modal="false"
    :title="$t('NFT.Sell')"
    @close="emit('update:modelValue', false)"
    :show-close="!loading"
  >
    <div
      class="sell-nft"
      v-loading="loading"
      :element-loading-svg="LoadingTEXT"
      :element-loading-text="$t('Loading')"
    >
      <NFTMsgVue :nft="nft" />

      <ElForm :model="form" :rules="rule" ref="FormRef">
        <ElFormItem prop="sellPrice">
          <ElInput
            type="number"
            v-model="form.sellPrice"
            :placeholder="$t('NFT.Set selling price')"
            @change="setPrice"
          >
            <template #append>
              <ElSelect v-model="unit" @change="onChangeUnit">
                <ElOption
                  v-for="item in units"
                  :key="item.rate"
                  :label="item.value"
                  :value="item.value"
                />
              </ElSelect>
            </template>
          </ElInput>
        </ElFormItem>

        <!-- <div class="price-info-list">
          <div class="price-info-item flex flex-align-center">
            <div class="label flex1">{{ $t('NFT.Set actual income') }}</div>
            <div class="value flex flex-align-center">
              <ElInput type="number" v-model="form.actualincomePrice" @change="setSellPrice" />
              {{ rootStore.currentPrice }}
            </div>
          </div>

          <div class="price-info-item flex flex-align-center">
            <div class="label flex1">
              {{
                $t('NFT.Platform fee')
              }}({{  new Decimal(extraFee.val!.platformPercentage).mul(100).toFixed(2) }}%)
            </div>
            <div class="value">
              {{ platformFee }}
              {{ rootStore.currentPrice }}
            </div>
          </div>

          <div class="price-info-item flex flex-align-center">
            <div class="label flex1">
              {{
                $t('NFT.Royalty fee')
              }}({{ new Decimal(extraFee.val!.royaltyPercentage).mul(100).toFixed(2) }}%)
            </div>
            <div class="value">
              {{ royaltyFee }}
              {{ rootStore.currentPrice }}
            </div>
          </div>
        </div> -->
      </ElForm>

      <div class="operate">
        <a class="main-border primary" @click="submitForm">
          {{ $t('NFT.Sell') }}
        </a>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { GetLegalRecevierAddress, LegalSaleNft } from '@/api/legal'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { dateTimeFormat } from '@/utils/filters'
import { Mitt, MittEvent } from '@/utils/mitt'
import { getUserBuyExtraFee } from '@/utils/util'
import NftDetail from '@/views/nft/NftDetail.vue'
import Decimal from 'decimal.js-light'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTCoverVue from '../NFTCover/NFTCover.vue'
import NFTMsgVue from '../NFTMsg/NFTMsg.vue'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { NodeName, SdkPayType } from '@/enum'
import { FormInstance } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  nft: GenesisNFTItem
}>()

const emit = defineEmits(['update:modelValue', 'success'])
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const minSatoshi = 22000
const FormRef = ref<FormInstance>()

enum Unit {
  Space = 'SPACE',
  Satoshi = 'Satoshi',
}
const units = [
  { value: Unit.Space, rate: Math.pow(10, -8), toFixed: 8 },
  { value: Unit.Satoshi, rate: Math.pow(10, 8), toFixed: 0 },
]
const unit = ref(Unit.Space)
const form = reactive({
  sellPrice: '',
  actualincomePrice: '',
})
const extraFee: {
  val: null | {
    platformPercentage: number
    royaltyPercentage: number
    platformFee: number
    royaltyFee: number
    total: number
  }
} = reactive({ val: null })
const loading = ref(false)

const rule = {
  sellPrice: [
    {
      required: true,
      message: i18n.t('NFT.Set selling price'),
      trigger: 'blur',
    },
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        const minPrice = new Decimal(minSatoshi)
          .div(unit.value === Unit.Satoshi ? 1 : Math.pow(10, 8))
          .toNumber()
        if (new Decimal(value).toNumber() < minPrice) {
          callback(new Error(i18n.t('NFT.Selling price must be greater than ') + minPrice))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  actualincomePrice: [
    {
      required: true,
      message: i18n.t('NFT.Set actual income'),
      trigger: 'blur',
    },
  ],
}

const platformFee = computed(() => {
  if (!form.actualincomePrice || !extraFee.val) {
    return 0
  } else {
    let price = new Decimal(form.actualincomePrice).mul(extraFee.val!.platformPercentage).toNumber()
    if (price < 0.01) price = 0.01
    price = new Decimal(new Decimal(price).toFixed(2)).toNumber()
    return price
  }
})

const royaltyFee = computed(() => {
  if (!form.actualincomePrice || !extraFee.val) {
    return 0.0
  } else {
    let price = new Decimal(form.actualincomePrice).mul(extraFee.val!.royaltyPercentage).toNumber()
    if (price < 0.01) price = 0.01
    price = new Decimal(new Decimal(price).toFixed(2)).toNumber()
    return price
  }
})

function getyExtraFee() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await getUserBuyExtraFee({
      codehash: props.nft.nftCodehash,
      genesis: props.nft.nftGenesis,
      isFirstSell: false,
      amount: 0,
      ignoreIndex: 1,
      isNotCache: true,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res) {
      extraFee.val = res
      resolve()
    }
  })
}

function setPrice() {
  let price = new Decimal(form.sellPrice)
  const uninItem = units.find(item => item.value === unit.value)
  form.sellPrice = price.toFixed(uninItem!.toFixed)
}

function setSellPrice() {
  let price = new Decimal(form.actualincomePrice).toNumber()
  if (price < 0.01) price = 0.01
  form.actualincomePrice = new Decimal(price).toFixed(2)
  form.sellPrice = new Decimal(form.actualincomePrice)
    .plus(platformFee.value)
    .plus(royaltyFee.value)
    .toFixed(2)
}

function onChangeUnit() {
  if (form.sellPrice) {
    const uninItem = units.find(item => item.value === unit.value)
    form.sellPrice = new Decimal(form.sellPrice).mul(uninItem!.rate).toFixed(uninItem!.toFixed)
  }
}

function submitForm() {
  FormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      if (props.nft.nftCanSellTimestamp > new Date().getTime()) {
        return ElMessage.error(
          `此NFT冻结到 ${dateTimeFormat(props.nft.nftCanSellTimestamp)}, 才可上架销售`
        )
      }
      try {
        loading.value = true
        // 法币上架
        // const getAddressRes = await GetLegalRecevierAddress()
        // if (getAddressRes.code === 0) {
        //   const transferNFTRes = await userStore.showWallet!.createBrfcChildNode({
        //     nodeName: NodeName.NftTransfer,
        //     data: JSON.stringify({
        //       receiverAddress: getAddressRes.data.address,
        //       tokenIndex: props.nft.nftTokenIndex,
        //       codehash: props.nft.nftCodehash,
        //       genesis: props.nft.nftGenesis,
        //     }),
        //   })
        //   if (transferNFTRes && transferNFTRes.nft) {
        //     const result = await LegalSaleNft({
        //       price: new Decimal(form.actualincomePrice).mul(100).toString(),
        //       sellDesc: 'ShowV3',
        //       txid: transferNFTRes.nft.transfer!.txId,
        //     })
        //     if (result.code === 0) {
        //       emit('success')
        //       Mitt.emit(MittEvent.SellNFT, {
        //         genesis: props.nft.nftGenesis,
        //         codehash: props.nft.nftCodehash,
        //         tokenIndex: props.nft.nftTokenIndex,
        //         chain: props.nft.nftChain,
        //       })
        //       emit('update:modelValue', false)
        //       loading.value = false
        //       ElMessage.success('上架成功')
        //     } else {
        //       Error(result.error)
        //     }
        //   } else {
        //     loading.value = false
        //   }
        // }

        // Space 上架
        const sellPriceSatoshi = new Decimal(form.sellPrice)
          .mul(unit.value === Unit.Satoshi ? 1 : Math.pow(10, 8))
          .toNumber()
        const res = await userStore.showWallet.createBrfcChildNode(
          {
            nodeName: NodeName.NftSell,
            data: JSON.stringify({
              codehash: props.nft.nftCodehash, // nft的codehash
              genesis: props.nft.nftGenesis, // nft的genesisId
              tokenIndex: props.nft.nftTokenIndex, // nft的tokenIndex
              price: sellPriceSatoshi, // nft的出售价格 单位聪
              sensibleId: props.nft.nftSensibleId, // nft的sensibleId
              sellDesc: 'ShowV3',
              sellUtxo: {
                txId: props.nft.nftSellContractTxId,
                outputIndex: 0,
                sellerAddress: props.nft.nftOwnerAddress,
                price: props.nft.nftPrice,
              },
            }),
          },
          {
            payType: SdkPayType.ME,
          }
        )
        if (res) {
          loading.value = false
          emit('success', {
            ...props.nft,
            nftPrice: sellPriceSatoshi,
            nftSellState: 0,
            nftIsReady: true,
            nftSellTxId: res.nft!.sell!.sellTxId,
            nftSellContractTxId: res.nft!.sell!.txId,
          })
          emit('update:modelValue', false)
          form.sellPrice = ''
          ElMessage.success('上架成功')
        } else {
          loading.value = false
        }
      } catch (error) {
        loading.value = false
        ElMessage.error((error as any).message)
      }
    }
  })
}
</script>

<style lang="scss" scoped src="./NFTSell.scss"></style>
