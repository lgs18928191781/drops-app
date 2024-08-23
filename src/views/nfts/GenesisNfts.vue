<template>
  <div class="genesis-wrap">
    <header class="flex items-center border-b pb-3 border-[#EDEFF2]">
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
    </header>
    <div class="form-wrap py-7">
      <el-form :model="form">
        <el-form-item class="flex items-center  " label-width="50%">
          <template #label>
            <span class="flex-1 text-base font-medium"> {{ $t('Nfts.launch_form_title1') }}</span>
          </template>
          <template #default>
            <div class="flex relative justify-end">
              <el-upload
                :multiple="false"
                action="#"
                class="avatar-uploader  w-24 h-24 flex items-center justify-center  border-2 border-[#BFC2CC] rounded-xl"
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
                  class="absolute flex items-center justify-center bottom-0.5 py-0.5 bg-[rgba(0,0,0,0.4)] w-24 rounded-b-lg hover:bg-[rgba(0,0,0,0.3)]"
                >
                  <span class="text-[#FFFFFF]">{{ $t('Nfts.lauch_delete') }}</span>
                </div>
              </el-upload>
            </div>
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title2') }}</span>
          </template>
          <template #default>
            <el-input v-model="form.name" :placeholder="$t('Nfts.launch_placeholder1')" />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title3') }}</span>
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

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title5') }}</span>
          </template>
          <template #default>
            <el-select v-model="form.royaltyRate" placeholder="Select" style="width: 100%">
              <el-option v-for="item in royaltyRate" :label="item + ' ' + '%'" :value="item" />
            </el-select>
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title6') }}</span>
          </template>
          <template #default>
            <el-input v-model="form.website" :placeholder="$t('Nfts.launch_placeholder6')" />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title4') }}</span>
          </template>
          <template #default>
            <el-input
              v-model="form.totalSupply"
              :formatter="(value:string) => `${value}`.replace(/\D+$/g, '')"
              :parser="(value:string) => value.replace(/\D+$/g, '')"
              :placeholder="$t('Nfts.launch_placeholder3')"
            />
          </template>
        </el-form-item>

        <el-form-item>
          <div
            class="mt-10 text-base font-medium py-4 flex items-center cursor-pointer justify-center main-border primary"
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
import { reactive,ref } from 'vue'
import type { UploadProps  } from 'element-plus'
import { ElMessage } from 'element-plus'
import { compressImage, FileToAttachmentItem } from '@/utils/util'
import { useRouter,useRoute } from 'vue-router'
import { useGenesisStore } from '@/stores/genesis'
import {CollectionMintChain,SdkPayType,NFTsError} from '@/enum'
import { useConnectionStore } from '@/stores/connection'
import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
import { fileType,royaltyRate } from '@/config'
import {usePayModalEntity} from '@/hooks/use-pay-modal-entity'
import { useI18n } from 'vue-i18n'
import {genesisCollection,issueCollection} from '@/api/mrc721-api'
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
  totalSupply:'0',
  royaltyRate:'0',
  website:'',
  metadata:{}
})


const onSubmit = async() => {
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
  try {
  if(existNfts?.collectionPinId){
    return ElMessage.error(`${i18n.t('Nfts.lanuch_existNfts')}`)
  }else{
    const {createCollectionDescRes,coverPinId} = await mintNftEntity({
    body:{
      name:form.name,
      totalSupply:+form.totalSupply,
      royaltyRate:+form.royaltyRate,
      desc:form.desc,
      website:form.website,
      cover:'',
      metadata:form.metadata
    },
    attachments:[form.originFile],
  })
  
  if( createCollectionDescRes?.revealTxIds.length){
    const genesisRes= await genesisCollection({
        metaId:connectionStore.last.metaid,
        name:form.name
      })

      console.log("genesisRes",genesisRes)
      
      const collectionInfo={
        name:form.name,
        coverPinid:coverPinId,
        desc:form.desc,
        website:form.website,
        metaData:JSON.stringify(form.metadata),
        totalSupply:+form.totalSupply,
        chain:route.params.chain as CollectionMintChain,
        autoMarket:route.params.type == '0' ? false : true,
        royaltyRate:+form.royaltyRate,
        collectionPinId:`${createCollectionDescRes?.revealTxIds[0]!}i0`,
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
        metaData:form.metadata,
        chain:route.params.chain == 'btc' ? CollectionMintChain.btc : CollectionMintChain.mvc,
        collectionPinId:`${createCollectionDescRes?.revealTxIds[0]!}i0`,
        autoMarket:route.params.type == '0' ? false : true,
        genesisTimestamp:Date.now(),
        metaId:connectionStore.last.metaid,
        initialPrice:'',
        priceGrowth:'',
        minted:0,
        currentSupply:0
        })
  

  toNftsDetail(`${createCollectionDescRes?.revealTxIds[0]!}i0`)
        }else{
          return ElMessage.error(issueRes.msg)
        }
   

  }
  }



  //console.log("createCollectionDescRes",createCollectionDescRes)
  
    

 


  }catch (error:any) {
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
    ElMessage.error('Avatar picture must be JPG/PNG/GIF/WEBP format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('Avatar picture size can not exceed 1MB!')
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
