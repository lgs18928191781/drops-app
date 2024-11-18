<template>
  <ElDialog
    :model-value="isShow"
    class="none-header none-padding sm"
    :close-on-click-modal="false"
    :z-index="9999"
  >
    <div class="global-pay-confirm">
      <div class="header">
        <span class="title" v-if="basicType == 'buy'"> {{ i18n.t('SDK.payconfirm.buy') }}</span>
        <span class="title" v-if="basicType == 'mint'"> {{ i18n.t('SDK.payconfirm.mint') }}</span>
        <span class="title" v-if="basicType == 'convert'"> {{ i18n.t('SDK.payconfirm.convert') }}</span>

        <!-- <a class="close flex flex-align-center flex-pack-center" @click="cancel">
          <Icon name="x_mark" />
        </a> -->
        <img
          src="@/assets/images/close-o@1x.png"
          alt=""
          class="w-[30px] h-[30px] absolute top-0 right-0 cursor-pointer"
          @click="cancel"
        />
      </div>

      <!--加图片-->
      <div v-if="feeInfo.extraInfo" class="buyNftInfo flex mt-10 mb-10">
        <!-- <NFTCover :cover="[feeInfo.extraInfo.item_cover]" /> -->
         <Image
         :src="feeInfo.extraInfo.item_cover"
         class="w-[120px] h-[120px] mr-7"
         ></Image>
       
        <div class="font-sora flex flex-col justify-between">
          <div>
            <div class="text-[20px] font-light mb-2">{{ feeInfo.extraInfo.nft_name }}</div>
            <div class="text-[20px] font-bold">{{ space(realSalePrice) }} BTC</div>
          </div>
          <div class="">
            <div class="flex">
              <UserAvatar
                :address="feeInfo.extraInfo.creator_info.address"
                :meta-id="feeInfo.extraInfo.creator_info.metaid"
                :image="feeInfo.extraInfo.creator_info.avatarId"
                :name="feeInfo.extraInfo.creator_info.name"
                :disabled="true"
                :meta-name="''"
              />
              <div class="flex1 flex flex-align-center info ml-2">
                <span class="user-name-warp"
                  ><UserName
                    :name="feeInfo.extraInfo.creator_info.name"
                    :meta-name="''"
                    :noTag="true"
                /></span>
                <span class="role">({{ i18n.t('NFT.Creater') }})</span>
              </div>
            </div>
            <div class="flex mt-1">
              <UserAvatar
                :address="feeInfo.extraInfo.owner_info?.address"
                :meta-id="feeInfo.extraInfo.owner_info?.metaid"
                :image="feeInfo.extraInfo.owner_info?.avatarId"
                :name="feeInfo.extraInfo.owner_info?.name"
                :disabled="true"
                :meta-name="''"
              />
              <div class="flex1 flex flex-align-center info ml-2">
                <span class="user-name-warp"
                  ><UserName
                    :name="feeInfo.extraInfo.owner_info?.name"
                    :meta-name="''"
                    :noTag="true"
                /></span>
                <span class="role">({{ i18n.t('NFT.Owner') }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pay-count flex flex-align-end flex-pack-center" v-if="!feeInfo.extraInfo">
        <div>
          <div class="msg flex flex-align-end flex-pack-center">
            <div class="count font-bold">
              <span class="mr-2">{{ space(useAmount) }}</span>
              <span>{{ payType }}</span>
            </div>
            <!-- <div class="lable"></div> -->
          </div>
          <div class="text">
            {{ i18n.t('SDK.payconfirm.Payment required') }}
          </div>
        </div>
      </div>

      <div class="text-sm">
        <div class="py-4 flex flex-col">
          <div class="py-2 flex flex-row items-center justify-between">
            <div class="text-[#909399]">
              {{
                basicType == 'basic'
                  ? i18n.t('Nfts.lanuch_baseFee')
                  : basicType == 'mint'
                  ? i18n.t('Nfts.lanuch_MintFee') :  basicType == 'convert' ? i18n.t('Nfts.lanuch_convert')  : i18n.t('Nfts.lanuch_saleFee')
                 
              }}
            </div>
            <div>
              <span class="mr-1">{{ space(feeInfo.basic) }}</span>

              <span>{{ payType }}</span>
            </div>
          </div>
          <div class="py-2 flex flex-row items-center justify-between">
            <div class="text-[#909399]">
              {{ i18n.t('Nfts.service_fee') }}({{ feeInfo.platformRate }}%)
            </div>
            <div>
              <span class="mr-1">{{ space(feeInfo.service) }}</span>
              <span class="mr-1" v-if="feeInfo.platformRate"></span>
              <span>{{ payType }}</span>
            </div>
          </div>

          <div class="py-2 flex flex-row items-center justify-between" v-if="feeInfo.royalty">
            <div class="text-[#909399]">
              {{ i18n.t('Nfts.service_royalty_fee') }}({{ feeInfo.royaltyRate }}%)
            </div>
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


          <div v-if="basicType == 'convert'" class="py-2 flex flex-row items-center justify-between" >
            <div class="text-[#909399]">{{ i18n.t('Nfts.conver_transfer_nft_fee') }}</div>
            <div>
              <span class="mr-1">{{ transferNftFixFee }}</span>
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
            <span class="mr-1">{{ space(feeInfo.total) }} </span>
            <span>{{ payType }}</span>
            <div v-if="extractFee > 0">
              <span>+</span>
              <span class="mr-1">{{ space(extractFee) }} </span>
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
        <!-- <a class="main-border flex1" @click="cancel">
          {{ i18n.t('Cancel') }}
        </a> -->
        <a class="main-border flex1 primary" @click="confirm">
          {{ i18n.t('SDK.payconfirm.Confirm') }}
        </a>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { SdkPayType } from '@/enum'
import { ref,computed } from 'vue'
import { Router } from 'vue-router'
import { space } from '@/utils/filters'
import {type feeInfoType} from '@/hooks/use-pay-modal-entity'
import { ElMessage } from 'element-plus'
import NFTCover from '../NFTCover/NFTCover.vue'
import { checkUserLogin, calcNftRealSalePrice } from '@/utils/util'

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
  basicType:'basic' | 'mint' | 'buy' | 'convert'
  extractFee:number
}

const props = withDefaults(defineProps<Props>(), {
  payType: SdkPayType.BTC,
})


const transferNftFixFee=0.00013492

const isShow = ref(true)

const emit = defineEmits(['changeConfirmVisible', 'confirm', 'cancel', 'recharge'])

const realSalePrice = computed(() => {
  const { total } = calcNftRealSalePrice(props.feeInfo.extraInfo?.sale_price,props.feeInfo.extraInfo?.total_sale_price,props.feeInfo.extraInfo?.royalty_rate)
  return total
})
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
