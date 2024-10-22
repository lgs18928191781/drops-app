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
      <NFTMsgVue :nft="nft" >
        <div class="price-wrap flex flex-col">
          <div class="text-sm mt-[17px] text-[#C1BFC8]">{{ $t('Nfts.price') }}</div>
        <ElInput
            type="number"
            v-model="sellPrice"
            :placeholder="$t('NFT.Set selling price')"
            @input="limitDecimalPlaces"
            @change="setPrice"
          >

          <template #append>
            <img :src="BTC" alt="">
            </template>

        </ElInput>
        </div>
      </NFTMsgVue>

      <ElForm :model="form" :rules="rule" ref="FormRef">
        <!-- <ElFormItem prop="sellPrice">
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
        </ElFormItem> -->

        <div class="price-info-list">
          <div class="price-info-item flex flex-align-center">
            <div class="label  flex1">{{ $t('NFT.Set actual income') }}</div>
            <div class="value  flex flex-align-center">
              <div >{{ form.actualincomePrice }}</div>
              <!-- <ElInput type="number"  :model-value="form.actualincomePrice" @change="setSellPrice" /> -->
             <span class="ml-1 "> {{ ToCurrency.BTC }}</span>
            </div>
          </div>

          <div class="price-info-item flex flex-align-center">
            <div class="label flex items-center flex1">
             <span class="mr-1">
              {{
                $t('NFT.Platform fee')
              }}({{  new Decimal(extraFee.platformPercentage).mul(100).toFixed(2) }}%)
             </span>

            <el-popover
            placement="right"
            :title="$t('NFT.Platform fee')"
            :width="200"
            trigger="hover"
            :content="$t('Nfts.platform_desc')"
            >
            <template #reference>
              <el-icon><QuestionFilled /></el-icon>
            </template>
            </el-popover>

            </div>
            <div class="value">
              {{ $filters.space(platformFee) }}
              {{ ToCurrency.BTC }}
            </div>
          </div>

          <div class="price-info-item flex flex-align-center">
            <div class="label flex items-center flex1">
             <span class="mr-1">
              {{
                $t('NFT.Royalty fee')
              }}({{ new Decimal(extraFee.royaltyPercentage).mul(100).toFixed(2) }}%)
             </span>


<el-popover
            placement="right"
            :title="$t('NFT.royalte fee')"
            :width="200"
            trigger="hover"
            :content="$t('Nfts.royalte_desc')"
            >
            <template #reference>
              <el-icon><QuestionFilled /></el-icon>
            </template>
            </el-popover>
            </div>
            <div class="value">
              {{ $filters.space(royaltyFee) }}
             {{ ToCurrency.BTC }}
            </div>
          </div>
        </div>
      </ElForm>

      <div class="operate">
        <a :class="['main-border primary',sellPrice ? '' : 'opacity-50']" @click="submitForm">
          {{ $t('NFT.submit_Sell') }}
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
import { Chains, NodeName, SdkPayType,ToCurrency } from '@/enum'
import { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import {useNFTEntity} from '@/hooks/use-nft-entity'
import BTC from '@/assets/icons/btc.svg?url'
import { QuestionFilled} from '@element-plus/icons-vue'
const props = defineProps<{
  modelValue: boolean
  nft: NftOrderType
}>()

const emit = defineEmits(['update:modelValue', 'success'])
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const minSatoshi = 10000
const FormRef = ref<FormInstance>()
const nftEntity=useNFTEntity()
enum Unit {
  BTC = 'BTC',
  Satoshi = 'Satoshi',
}
const units = [
  { value: Unit.BTC, rate: Math.pow(10, -8), toFixed: 8 },
  // { value: Unit.Satoshi, rate: Math.pow(10, 8), toFixed: 0 },
]
const unit = ref(Unit.BTC)
const  sellPrice=ref('')
const form = reactive({
  actualincomePrice: '0',

})

const extraFee=computed(()=>{
  return {
    platformPercentage:new Decimal(6).div(100).toNumber(),
    royaltyPercentage:new Decimal(props.nft.royalty_rate).div(100).toNumber()
  }
})

const loading = ref(false)

const rule = {
  // sellPrice: [
  //   {
  //     required: true,
  //     message: i18n.t('NFT.Set selling price'),
  //     trigger: 'blur',
  //   },
  //   {
  //     required: true,
  //     validator: (rule: any, value: any, callback: any) => {
  //       const minPrice = new Decimal(minSatoshi)
  //         .div(unit.value === Unit.Satoshi ? 1 : Math.pow(10, 8))
  //         .toNumber()
  //       if (new Decimal(value).toNumber() < minPrice) {
  //         callback(new Error(i18n.t('NFT.Selling price must be greater than ') + minPrice))
  //       } else {
  //         callback()
  //       }
  //     },
  //     trigger: 'blur',
  //   },
  // ],
  actualincomePrice: [
    {
      required: true,
      message: i18n.t('NFT.Set actual income'),
      trigger: 'blur',
    },
  ],
}

const platformFee = computed(() => {
  if(!sellPrice.value){
    return 0
  }
  let price = parseInt(new Decimal(sellPrice.value).mul(10 ** 8).mul(extraFee.value.platformPercentage).toString())  
 
  if(price < 2000){
    price=2000
  }
  return price
  // if (!form.actualincomePrice || !extraFee.val) {
  //   return 0
  // } else {
  //   let price = new Decimal(form.actualincomePrice).mul(extraFee.val!.platformPercentage).toNumber()
  //   if (price < 0.01) price = 0.01
  //   price = new Decimal(new Decimal(price).toFixed(2)).toNumber()
  //   return price
  // }
})

const royaltyFee = computed(() => {
  if(!sellPrice.value){
    return 0
  }
  if(extraFee.value.royaltyPercentage == 0){
    return 0
  }
  let price = parseInt(new Decimal(sellPrice.value).mul(10 ** 8).mul(extraFee.value.royaltyPercentage).toString())  
  if(price < 1000){
    price = 1000
    
  }
  return price
  // if (!form.actualincomePrice || !extraFee.val) {
  //   return 0.0
  // } else {
  //   let price = new Decimal(form.actualincomePrice).mul(extraFee.val!.royaltyPercentage).toNumber()
  //   if (price < 0.01) price = 0.01
  //   price = new Decimal(new Decimal(price).toFixed(2)).toNumber()
  //   return price
  // }
})

// function getyExtraFee() {

//   // return new Promise<void>(async (resolve, reject) => {
//   //   const res = await getUserBuyExtraFee({
//   //     codehash: props.nft.nftCodehash,
//   //     genesis: props.nft.nftGenesis,
//   //     isFirstSell: false,
//   //     amount: 0,
//   //     ignoreIndex: 1,
//   //     isNotCache: true,
//   //   }).catch(error => {
//   //     ElMessage.error(error.message)
//   //   })
//   //   if (res) {
//   //     extraFee.val = res
//   //     resolve()
//   //   }
//   // })
// }

function limitDecimalPlaces(){
  const regex = /^\d*\.?\d{0,8}$/;
  if (!regex.test(sellPrice.value)) {
    sellPrice.value= sellPrice.value.slice(0, -1);
      }
}

function setPrice() {
   //let price = new Decimal(sellPrice.value).toString()
  // //const uninItem = units.find(item => item.value === unit.value)
  
  // sellPrice.value = price
  if(+sellPrice.value < 0.00004){
    sellPrice.value = '0.00004'
  }

  form.actualincomePrice=new Decimal(sellPrice.value).sub(new Decimal(platformFee.value).div(10**8)).sub(new Decimal(royaltyFee.value).div(10**8)).toNumber().toFixed(8)
}

function setSellPrice() {
  // let price = new Decimal(form.actualincomePrice).toNumber()
  // form.actualincomePrice = new Decimal(price).toFixed(8)
  sellPrice.value = new Decimal(form.actualincomePrice)
    .plus(platformFee.value)
    .plus(royaltyFee.value)
    .toString()
    console.log("form.sellPrice",sellPrice.value)
}

function onChangeUnit() {
  if (sellPrice.value) {
    const uninItem = units.find(item => item.value === unit.value)
    sellPrice.value= new Decimal(sellPrice.value).mul(uninItem!.rate).toFixed(uninItem!.toFixed)
  }
}

function submitForm() {

  FormRef.value?.validate(async (valid, fields) => {
    if (valid) {
      // if (props.nft.nftCanSellTimestamp > new Date().getTime()) {
      //   return ElMessage.error(
      //     `此NFT冻结到 ${dateTimeFormat(props.nft.nftCanSellTimestamp)}, 才可上架销售`
      //   )
      // }
      if(!sellPrice.value){
        return ElMessage.error(`${i18n.t('Nfts.salePrice_empty')}`)
      }
      if(+form.actualincomePrice < 0){
        return ElMessage.error(`${i18n.t('Nfts.salePrice_overlimited')}`)
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
        const sellPriceSatoshi = new Decimal(form.actualincomePrice)
          .mul(Math.pow(10, 8))
          .toNumber()
          console.log("props.nft",props.nft)
          const totalPriceSatoshi=new Decimal(sellPrice.value).mul(Math.pow(10, 8)).toNumber()
       
          
        const res=await nftEntity.saleNft({
          collectionPinid:props.nft.collection_pinid,
          nftPinid:props.nft.item_pinid,
          salePrice:sellPriceSatoshi,
          totalPrice:totalPriceSatoshi,
          extraFee:{
            royaltyRateFee:royaltyFee.value > 0 ? parseInt(new Decimal(royaltyFee.value).toString()) : 0,
            platformFee:platformFee.value > 0 ? parseInt(new Decimal(platformFee.value).toString()) : 0,
          }
        })
        
        
        if (res) {
          loading.value = false
          emit('success', {
            ...props.nft,
            nftPrice: sellPriceSatoshi,
            nftSellState: 1,
            nftIsReady: true,
          },'onSale')
          emit('update:modelValue', false)
          sellPrice.value = ''
           //ElMessage.success(i18n.t('NFT.Sale Success'))
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
