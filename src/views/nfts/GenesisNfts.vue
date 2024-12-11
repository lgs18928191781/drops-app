<template>
  <div class="genesis-wrap  flex items-center justify-center">
    <!-- <header class="flex items-center border-b pb-3 border-[#EDEFF2]">
      <div class="w-5/12">
        <span
          @click="back"
          class="inline-flex rounded-full bg-[#EDEFF2] p-1.5 cursor-pointer hover:scale-105"
        >
          <el-icon><ArrowLeftBold /></el-icon
        ></span>
      </div>
      <div class="w-7/12 text-base font-medium ">
        {{ $t('Nfts.launch_create') }}
      </div>
    </header> -->
    <div class="form-wrap   py-7 w-[90vw] sm:w-[70vw] lg:w-[40vw]">
      <el-form :model="form">
        <el-form-item class="flex" label-width="50%">
          <template #label>
            <span class="flex-1 text-sm font-light font-sora text-normalColor">
              {{ $t('Nfts.launch_form_title1') }}</span
            >
          </template>
          <template #default>
            <div class="flex  relative justify-end">
              <el-upload
                :multiple="false"
                action="#"
                class="avatar-uploader w-30 h-30 flex items-center justify-center border-none rounded-[8px] bg-[#29272E]"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.cover" :src="form.cover" class="avatar rounded-lg" />
                <el-icon v-else class="avatar-uploader-icon " color="#BFC2CC" :size="35"
                  ><Plus
                /></el-icon>
                
                <div
                  v-if="form.cover"
                  @click="remove"
                  class="absolute w-[120PX] flex items-center justify-center  bottom-[0px] py-0.5 bg-[rgba(0,0,0,0.4)]  rounded-b-lg hover:bg-[rgba(0,0,0,0.3)]"
                >
                  <span class="text-[#FFFFFF]">{{ $t('Nfts.lauch_delete') }}</span>
                </div>
              </el-upload>
            </div>
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-sm font-light font-sora text-normalColor">{{
              $t('Nfts.launch_title2')
            }}</span>
          </template>
          <template #default>
            <el-input
            maxlength="30"
            show-word-limit
            v-model="form.name" :placeholder="$t('Nfts.launch_placeholder1')" />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-sm font-light font-sora text-normalColor">{{
              $t('Nfts.launch_title3')
            }}</span>
          </template>
          <template #default>
            <el-input
              :rows="5"
              v-model="form.desc"
              type="textarea"
              :placeholder="$t('Nfts.launch_placeholder2')"
            />
          </template>
        </el-form-item>

        <div class="flex flex-col">
          <div class="flex items-center justify-between space-x-4">
            <el-form-item class="flex flex-col flex-1" label-width="auto">
              <template #label>
                <span class="flex text-sm font-light font-sora text-normalColor">{{
                  $t('Nfts.launch_title4')
                }}</span>
              </template>
              <template #default>
                <el-input
                    v-model="form.totalSupply"
                    maxlength="4"
                    show-word-limit
                    :formatter="(value:string) => `${value}`.replace(/\D$/g, '').slice(0,4)"
                    :parser="(value:string) => `${value}`.replace(/\D$/g, '').slice(0,4)"
                    :placeholder="$t('Nfts.launch_placeholder3')"
                  />
              </template>
            </el-form-item>
            <el-form-item class="flex flex-col flex-1" label-width="auto">
              <template #label>
                <span class="flex text-sm font-light font-sora text-normalColor">{{
                  $t('Nfts.launch_title5')
                }}</span>
              </template>
              <template #default>
                <el-select v-model="form.royaltyRate" placeholder="Select" style="width: 100%">
                  <el-option v-for="item in royaltyRate" :label="item + ' ' + '%'" :value="item" />
                </el-select>
              </template>
            </el-form-item>
          </div>
        </div>


            <el-form-item class="flex flex-col"   label-width="auto" >
              <template #label>
            <span class="flex text-sm font-light font-sora text-normalColor">{{
              $t('Nfts.lanuch_classify')
            }}</span>
          </template>
            <template #default>
              <div class=" gray-exclued-text  min-h-14  flex">
                <el-select class="custom-select" multiple v-model="form.classify" placeholder="Select" style="width: 100%">
                  <el-option
                    v-for="item in classifyList"
                    :key="item.classify"
                    :disabled="item.disabled"
                    :label="item.name()"
                    :value="item.classify"
                  />
                </el-select>
              </div>
            </template>
          </el-form-item >

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-sm font-light font-sora text-normalColor">{{
              $t('Nfts.launch_title6')
            }}</span>
          </template>
          <template #default>
            <el-input v-model="form.website" :placeholder="$t('Nfts.launch_placeholder6')" />
          </template>
        </el-form-item>


        <div class="flex flex-col ">
            <div class="flex set-price-wrap items-center justify-between space-x-4">
              <el-form-item class="flex flex-col flex-1" label-width="auto">
                <template #label>
                  <span class="flex text-base font-medium">{{ $t('Nfts.lanuch_auto_market_setprice') }}</span>
                  <span class="ml-1  text-base font-medium">({{ $t('Nfts.mint_price_unit') }})</span>
                </template>
                <template #default>
                
   
                  <el-input
                    v-model="form.initialPrice"
                   :formatter="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :parser="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :placeholder="$t('Nfts.lanuch_set_init_price')"
                  >
                  <template #append>
       = {{$filters.toSats(form.initialPrice)}} Sats
      </template>
                </el-input>
                </template>
              </el-form-item>
              <el-form-item class="flex flex-col flex-1" label-width="auto">
                <template #label>
                  <span class="flex text-base font-medium">{{ $t('Nfts.lanuch_auto_market_setpriceAdd') }}</span>
                  <span class="ml-1 text-base font-medium">({{ $t('Nfts.mint_price_unit') }})</span>
                  <el-popover
                  placement="top-start"
                  :title="$t('Nfts.lanuch_growth_price_desc')"
                  :width="250"
                  trigger="hover"
                >
                  <template #reference>
                    <el-icon :size="18" class="align-middle ml-1 cursor-pointer"
                      ><QuestionFilled
                    /></el-icon>
                  </template>

                  <div class="flex flex-col text-sm font-medium">
                    <span>{{ $t('NFTs.lanuch_growth_content1') }}</span>
                    <span class="mt-2 whitespace-normal break-words">{{
                      $t('NFTs.lanuch_growth_content2')
                    }}</span>
                    <span class="mt-2">{{ $t('NFTs.lanuch_growth_content3') }}</span>
                  </div>
                </el-popover>
                </template>
                <template #default>
                  <el-input
                    v-model="form.priceGrowth"
                   :formatter="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :parser="(value:string) => `${value}`.replace(regex,(match,p1,p2,p3)=>`${p1}${p2}`)"
                    :placeholder="$t('Nfts.lanuch_set_price_increase')"
                  >
                  <template #append>
       = {{$filters.toSats(form.priceGrowth)}} Sats
      </template>
                </el-input>
                </template>
              </el-form-item>
            </div>
          </div>

        <el-form-item>
          <div
            class="mt-10 text-base font-medium py-4 flex items-center cursor-pointer justify-center main-border"
            :class="[createCollectionDisabled ? 'primary' : 'gray']"
            @click="onSubmit"
          >
            {{ $t('Nfts.launch_next') }}
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftBold,Delete,Plus } from '@element-plus/icons-vue'
import { reactive,ref ,computed} from 'vue'
import type { UploadProps  } from 'element-plus'
import { ElMessage,ElLoading } from 'element-plus'
import { compressImage, FileToAttachmentItem ,openLoading} from '@/utils/util'

import { useRouter,useRoute } from 'vue-router'
import { useGenesisStore } from '@/stores/genesis'
import {CollectionMintChain,SdkPayType,NFTsError} from '@/enum'
import { useConnectionStore } from '@/stores/connection'
import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
import { fileType,royaltyRate,classifyList } from '@/config'
import {usePayModalEntity} from '@/hooks/use-pay-modal-entity'
import { useI18n } from 'vue-i18n'
import {genesisCollection,issueCollection,getPinfromPath} from '@/api/mrc721-api'
import {NftsLaunchPadChain,NftsLaunchPadChainSymbol} from '@/data/constants'
import {toSats} from '@/utils/filters'
import Decimal from 'decimal.js-light'
const router=useRouter()
const route=useRoute()
const i18n = useI18n()
const genesisStore = useGenesisStore()
const connectionStore=useConnectionStore()
const {mintNftEntity}=useMetaIDEntity()
const {awaitPayConfrim}=usePayModalEntity()
const form = reactive({
  name: '',
  cover:'',
  originFile:null,
  desc: '',
  totalSupply: 0,
  royaltyRate: 0,
  website:'',
  initialPrice:0.0001,
  priceGrowth:0.0001,
  classify:[],
  metadata:{}
})

const regex=/(\d+)(\.\d{5})(\d+)/

const createCollectionDisabled=computed(()=>{
  return form.name && form.totalSupply && form.originFile
})

const onSubmit = async() => {

  
  const whitelist=['bc1ppzdcjgkyk57kd39w8nwmv92strkmf2dvd876n0xxne9wcycvg06satvw0c',
  'bc1p2am8gpgps2453ny3nqygnf4t70yjrv5h32xk7xzjy8622dl6vtrsjuup5v','176C9RPWDggnvdVcWG3wrZEJcm1bHTcKM5',
  'bc1pm4yqy8xgyncxusj3sx365x7h08al6krk55nyz7ysavqcumshzq4skfk8du',
  '136Pnewh7HhZ61UZLrzwgSVY9BbxZoNhVQ','17LK4XoemSdVDtoZforjb9bf2RiDQzvYGq','1K1Heqm7qgisKhtsGsDq9TPhoV6JXw6BVu']
        if(!whitelist.includes(connectionStore.userInfo?.address)){
          return ElMessage.error(`During the beta testing period of Drops, only whitelisted users are allowed to create collections`)
        }

  const loading = openLoading()
  if(!createCollectionDisabled.value){
     ElMessage.error(`${i18n.t('Nfts.onSubmitNewCollection_fail')}`)
     loading.close()
     return
  }
  
//   else if(existNfts?.name){

// var {createCollectionDescRes,coverPinId} = await mintNftEntity({
// body:{
//   name:form.name,
//   totalSupply:+form.totalSupply,
//   royaltyRate:+form.royaltyRate,
//   desc:form.desc,
//   website:form.website,
//   cover:'',
//   metadata:form.metadata
// },
// attachments:[form.originFile],
// noBroadcast:false,
// collectionName:existNfts.name
// })
// }
  //const result=await awaitPayConfrim(SdkPayType.BTC,1000,10000)
  const existNfts= genesisStore.getList.find((item)=>item.name == form.name)
  const collectionName=form.name.toLowerCase()
 
 const checkCollectionName= await getPinfromPath({
   path:`/nft/mrc721/${collectionName}`,
   metaIdList:[connectionStore.last.metaid]
 })

  try {
  if(existNfts && checkCollectionName?.list != 'null' ){
    loading.close()
    return ElMessage.error(`${i18n.t('Nfts.lanuch_existNfts')}`)
  }else{
    const metadata={
      // royaltyRate:+form.royaltyRate,
      classify:form.classify
    }
    
    const preMint = await mintNftEntity({
    body:{
      name:form.name,
      totalSupply:+form.totalSupply,
      royaltyRate:+form.royaltyRate,
      desc:form.desc,
      website:form.website,
      cover:'',
      //classify:form.classify,
      metadata:JSON.stringify(metadata),
    },
    attachments:[form.originFile],
    lockAddress:'',
    noBroadcast:true
  })
  loading.close()

  
  if(preMint!.isPay){
    
    if(preMint!.txFee > 0){
      
    const mvcBalance= await window.metaidwallet.getMvcBalance()
    
    if(Number(mvcBalance.total) < preMint!.txFee ){
      return ElMessage.error(`${i18n.t('Nts.mvc_balance_noenough')},${i18n.t('Nts.mvc_balance_need')} ${new Decimal(preMint!.txFee).div(10**8).toNumber()} Space`)
    }
    
  }
  const mvcTransfer=await window.metaidwallet.transfer({
  tasks:[
    {
      receivers:[
        {
          address:preMint!.receiverAddress,
          amount:preMint!.txFee
        }
      ]
    }
  ]
})

      if(mvcTransfer?.status == "canceled"){
        return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
      }

      if(!mvcTransfer.txids.length){

        return ElMessage.error(`${i18n.t(`Nfts.pay_file_fail`)}`)
        }


    const {createCollectionDescRes,coverPinId} = await mintNftEntity({
    body:{
      name:form.name,
      totalSupply:+form.totalSupply,
      royaltyRate:+form.royaltyRate,
      desc:form.desc,
      website:form.website,
      //classify:form.classify,
      cover:'',
      metadata:JSON.stringify(metadata)
    },
    attachments:[form.originFile],
    lockAddress:preMint!.receiverAddress,
    noBroadcast:false
  })

  if( createCollectionDescRes?.revealTxIds.length){
    const collectionPinid=`${createCollectionDescRes.revealTxIds[0]}i0`
    const genesisRes= await genesisCollection({
      collectionPinid:collectionPinid,
      collectionName:form.name,
      address:connectionStore.last.user.address
      })

      if(genesisRes.code !== 200){
        return ElMessage.error(genesisRes.msg)
      }

      console.log("genesisRes",genesisRes)

      const collectionInfo={
        name:form.name,
        coverPinid:coverPinId,
        desc:form.desc,
        website:form.website,
        metaData:JSON.stringify(metadata),
        classify:JSON.stringify(form.classify),
        totalSupply:+form.totalSupply,
        chain:'btc',
        autoMarket:false,
        royaltyRate:+form.royaltyRate,
        initialPrice:toSats(form.initialPrice),
        priceGrowth:toSats(form.priceGrowth),
        collectionPinId:collectionPinid,
        metaId:connectionStore.last.metaid,
        address:connectionStore.last.user.address,

      }
      const issueRes=await issueCollection({
        collectionInfo
      })

      console.log("issueRes",issueRes)

      if(issueRes.code == 200){

      genesisStore.add({
        totalSupply:+form.totalSupply,
        name:form.name,
        coverPinid:coverPinId,
        desc:form.desc,
        cover:form.cover,
        website:form.website,
        royaltyRate:+form.royaltyRate,
        metaData:metadata,
        classify:form.classify,
        chain: NftsLaunchPadChainSymbol.btc,
        collectionPinId:collectionPinid,
        autoMarket:false, //route.params.type == '0' ? false : true,
        genesisTimestamp:Date.now(),
        metaId:connectionStore.last.metaid,
        initialPrice:toSats(form.initialPrice),
        priceGrowth:toSats(form.priceGrowth),
        minted:0,
        currentSupply:0
        })


  toNftsDetail(collectionPinid)
        }else{
          loading.close()
          return ElMessage.error(issueRes.msg)
        }


  }



  }else{
    loading.close()
    return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
  }

  }



  //console.log("createCollectionDescRes",createCollectionDescRes)






  }catch (error:any) {
    loading.close()
    if(error.message == NFTsError.createNameSuccButDescError){
      ElMessage.error(`${i18n.t('Nfts.lanuch_created_desc_fail')}`)
    }else{
      ElMessage.error(error)
    }
    console.log("error",error)

  }

}

function toNftsDetail(pinid:string){
  router.push({name:'nftsCollection',params: {
      pinid
    }})
}

function back(){

    router.push({name:'launchpad'})
}

function remove(e:any){
    e.stopPropagation();
    if(form.cover){
        form.cover =''
        form.originFile=null
    // form.coverHex=''
    }else return
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = async(rawFile) => {
  
  if (!fileType.includes(rawFile.type) ) {
    ElMessage.error('Upload image must be JPG/PNG/GIF/WEBP format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('Upload image size can not exceed 1MB!')
    return false
  }

    const compressed = await compressImage(rawFile)
    const result = await FileToAttachmentItem(compressed,0,true)

    form.cover =result.base64!
    form.originFile=result

    // form.coverHex=result.data

  return true
}
</script>

<style scoped src="./GenesisNfts.scss"></style>
