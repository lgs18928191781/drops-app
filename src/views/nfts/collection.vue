<template>
  <div class="collection-wrap">
    <div class="top-bar flex flex-align-center">
      <div class="flex1 flex flex-align-center">
        <div class="flex1">
          <a class="back flex flex-align-center" @click="$router.back()">
            <span class="flex flex-align-center flex-pack-center ">
              <Icon name="down" />
            </span>
            {{ $t('back') }}
          </a>
          <!-- <div class="flex flex-align-center text-sm" v-else>
              <Icon name="shapexs" customClass="h-4 w-3.5 mr-2" />
              {{ $t('NFTS.NFTs Launch Pad') }}
            </div> -->
        </div>
        <div class="collection-selector flex1 flex items-center justify-center text-lg">
          <el-select
            @change="triggleCollection"
            popper-class="select-wrap"
            v-model="genesisCollection"
          >
            <el-option
              v-for="(item, index) in MyCollectionList"
              :key="index"
              :label="item.collectionName"
              :value="item.collectionPinId"
            >
              <template #default>
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center">
                    <img class="w-8 h-8 mr-1 rounded-md object-cover" :src="item.cover" alt="" />
                    <span>{{ item.collectionName }}</span>
                  </div>
                  <div
                    v-if="genesisCollection == item.collectionName"
                    class="w-5 h-5 flex items-center justify-center bg-[#FFDC51] p-1.5 rounded-md"
                  >
                    <el-icon :size="9" color="#303133"><Select /></el-icon>
                  </div>
                </div>
              </template>
            </el-option>
          </el-select>
        </div>
        <div class=" flex flex1  justify-end cursor-pointer text-[#5586BB]" @click="genesisNfts">
          {{ $t('NFTs.genesis_nfts') }}
        </div>
      </div>
      <!-- <nav>
            <a v-for="(item, index) in navs" :key="index" @click="commonSoon">{{ item.name }}</a>
          </nav> -->
    </div>

    <div class="content-wrap p-[18px] border-2 border-solid border-[#303133] rounded-xl mt-5 ">
      <div class="nfts-card flex">
        <div class="nfts-cover flex items-center justify-center w-24 h-24 rounded-lg ">
          <img class="w-full rounded-lg " :src="currentNftsCollect.cover" alt="" />
        </div>
        <div class="nfts-detail w-full ml-4">
          <div class="flex-col">
            <div class="nfts-name">
              <span class="text-2xl font-medium">{{ currentNftsCollect.collectionName }}</span>
              <LucideIcon name="external-link"></LucideIcon>
            </div>
            <div class="nfts-intro flex text-[#909399] text-xs">
              <span>
                {{ currentNftsCollect.intro }}
              </span>
            </div>
          </div>
          <div class="nfts-footer flex items-center text-sm ">
            <div class="flex items-center justify-start flex-wrap">
              <div class="blockchain flex items-center mr-6">
                <span class="mr-2">{{ $t('Nfts.lanuch_chain') }}</span>
                <img
                  class="w-5 h-5 mr-1"
                  :src="currentNftsCollect.chain == CollectionMintChain.btc ? btc : mvc"
                  alt=""
                />
                <span class="font-medium">{{ currentNftsCollect.chain }}</span>
              </div>
              <div class="market-option flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_makemarket') }}</span>
                <span>{{ currentNftsCollect.autoMarket }}</span>
              </div>
              <div class="total-supply flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_totalSupply') }}</span>
                <span>{{ currentNftsCollect.totalSupply }}</span>
              </div>
              <div class="mint-amount flex ">
                <span class="mr-1">{{ $t('Nfts.lanuch_minted') }}</span>
                <span>{{
                  Number(currentNftsCollect.totalSupply) -
                    Number(currentNftsCollect.currentTotalSupply)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 ">
      <div class="mint-wrap flex items-center justify-between border-b pb-5 border-[#EDEFF2]">
        <div class="text-lg font-medium">{{ $t('Nfts.lanuch_bulkMint') }}</div>
        <div class="mint-btn flex text-sm font-medium">
          <button
            @click="modelValue = true"
            class="py-1 px-3 rounded-md border border-transparent flex items-center justify-center mr-2 bg-[#FFDC51] "
          >
            {{ $t('Nfts.lanuch_addMint') }}
          </button>
          <button
            class="py-1 px-3 rounded-md border border-transparent flex items-center justify-center "
            :class="[tableData.length ? 'bg-[#FFDC51]' : 'bg-[#EDEFF2] text-[#BFC2CC]']"
            @click="finallyMint"
          >
            <span class="mr-1">{{ $t('Nfts.lanuch_confirm_minting') }}</span>
            <span v-if="tableData.length">{{ tableData.length }}</span>
          </button>
        </div>
      </div>
      <div class="form-wrap mt-6">
        <el-table
          @cell-click="selectChange"
          :data="tableData"
          style="width: 100%;height:500px"
          header-row-class-name="text-sm text-[#303133]"
        >
          <el-table-column prop="cover" :label="$t('Nfts.lanuch_nftcover')" width="120">
            <template #default="scope">
              <div
                class="main-border gray-exclued-text p-2 min-h-14  flex justify-between items-center "
              >
                <div class="w-8 h-8 rounded-md ">
                  <img class="" :src="scope.row.cover" alt="" />
                </div>
                <el-icon class="cursor-pointer" @click="deleteCover(scope.row)"><Close /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="source" :label="$t('Nfts.lanuch_source')" width="180">
            <template #default="scope">
              <div
                class="main-border gray-exclued-text  p-2 min-h-14 flex justify-between items-center truncate"
              >
                <div class="w-8 h-8 rounded-md ">
                  <span>{{ prettyAddress(scope.row.source) }}</span>
                </div>
                <el-icon class="cursor-pointer" @click="deleteCover(scope.row)"><Close /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="desc" :label="$t('Nfts.lanuch_desc')" width="250">
            <template #default="scope">
              <div class="main-border gray-exclued-text py-3.5  p-2 min-h-14 truncate  ">
                <span>{{ scope.row.desc ?? '' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="classify" :label="$t('Nfts.lanuch_classify')" width="180">
            <template #default="scope">
              <div class=" gray-exclued-text p-2 min-h-14  flex items-center justify-center">
                <el-select multiple v-model="scope.row.classify" placeholder="Select">
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
          </el-table-column>
          <el-table-column prop="receiver" :label="$t('Nfts.lanuch_receive_address')" width="250">
            <template #default="scope">
              <div class="main-border py-3.5 gray-exclued-text p-2 min-h-14  ">
                <span class="">{{ prettyAddress(scope.row.receiver, 12) }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="op" :label="$t('Nfts.lanuch_operation')" width="150">
            <template #default="scope">
              <div class="flex items-center ">
                <span
                  @click="removeItem(scope.row)"
                  :class="[
                    'ml-3',
                    'cursor-pointer',
                    'text-[#FC6D5E]',
                    'text-center',
                    'opacity-100',
                    ' hover:opacity-80',
                    'font-medium',
                  ]"
                  >{{ scope.row.op }}</span
                >
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <div class="h-80 flex items-center justify-center ">
              <span class="text-base">{{ $t('Nfts.lanuch_mint_blank') }}</span>
            </div>
          </template>
        </el-table>
      </div>
    </div>
  </div>

  <CollectionDialog
    v-model="modelValue"
    :defiendFooter="defiendFooter"
    :isHideCancelBtn="false"
    :operateWarpMarginTop="12"
  >
    <template #title>
      <div class="title text-center flex1" :style="{ fontSize: '24px' }">
        {{ isEdit ? $t('Nfts.lanuch_edit') : $t('Nfts.lanuch_addMint') }}
      </div>
    </template>
    <template #content>
      <div>
        <el-form
          ref="ruleFormRef"
          :label-position="labelPosition"
          label-width="auto"
          :rules="rules"
          :model="mintData"
          style="max-width: 600px"
        >
          <el-form-item>
            <template #label>
              <div class="flex items-center justify-between">
                <span class="text-base text-[#303133] font-medium">{{
                  $t('Nfts.lanuch_addMintAmount')
                }}</span>
                <div class="text-[#909399] flex items-center">
                  <span class="mr-1">{{ $t('Nfts.lanuch_mintLimited') }}</span>
                  <span>{{
                    Number(currentNftsCollect.currentTotalSupply) - tableData.length
                  }}</span>
                </div>
              </div>
            </template>
            <div class="mt-1">
              <el-input v-model="mintData.mintAmount" />
            </div>
          </el-form-item>
          <!--cover-->
          <el-form-item>
            <div class="flex items-center justify-between">
              <span class="text-base font-medium">{{ $t('Nfts.lanuch_nftcover') }}</span>
              <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameCover') }}</span>
                    <ElSwitch v-model="mintData.isSameCover" />
                  </div>
                </div>
              </div>
            </div>
            <div class="w-30 mt-1">
              <AddImageWarpVue v-model:attachment="mintData.cover" :onlyFileName="false" />
            </div>
          </el-form-item>

          <!--sourece file-->
          <el-form-item>
            <div class="flex items-center justify-between">
              <span class="text-base font-medium">{{ $t('Nfts.lanuch_Nftsource') }}</span>
              <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameSource') }}</span>
                    <ElSwitch v-model="mintData.isSameSource" />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-1">
              <AddImageWarpVue v-model:attachment="mintData.cover" :onlyFileName="true" />
            </div>
          </el-form-item>
          <!--desc-->
          <el-form-item>
            <div class="flex  items-center justify-between">
              <span class="text-base font-medium">{{ $t('Nfts.lanuch_desc') }}</span>
              <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameDesc') }}</span>
                    <ElSwitch v-model="mintData.isSameDesc" />
                  </div>
                </div>
              </div>
            </div>
            <div class="nfts-desc main-border gray mt-1">
              <ElInput
                :placeholder="$t('Nfts.lanuch_descPlaceholder')"
                type="textarea"
                v-model="mintData.desc"
              />
            </div>
          </el-form-item>

          <!--Classify-->
          <el-form-item>
            <div class="flex  items-center justify-between">
              <span class="text-base font-medium">{{ $t('Nfts.lanuch_classify') }}</span>
              <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameClassify') }}</span>
                    <ElSwitch v-model="mintData.isSameClassify" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-1">
              <ElSelect multiple v-model="mintData.classify" style="width:100%">
                <ElOption
                  v-for="item in classifyList"
                  :key="item.classify"
                  :disabled="item.disabled"
                  :label="item.name()"
                  :value="item.classify"
                />
              </ElSelect>
            </div>
          </el-form-item>

          <!--Receiver-->
          <el-form-item>
            <div class="flex items-center justify-between">
              <span class="text-base font-medium">{{ $t('Nfts.lanuch_receive_address') }}</span>
              <div class="text-[#909399]">
                <div class="switch-list flex flex-align-center" v-if="!isEdit">
                  <div class="switch-item flex flex-align-center">
                    <span class="mr-2">{{ $t('Nfts.lanuch_useSameReceiver') }}</span>
                    <ElSwitch v-model="mintData.isSameReceiver" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-1">
              <ElInput type="text" v-model="mintData.receiver" />
            </div>
          </el-form-item>

          <el-form-item>
            <div class="operate flex items-center justify-between font-medium text-base">
              <div
                class="main-border  cursor-pointer text-center py-2.5  mr-2.5 darkGray flex-1"
                @click="cancel(ruleFormRef)"
              >
                {{ $t('Cancel') }}
              </div>
              <div
                class="main-border primary cursor-pointer text-center  py-2.5 flex-1"
                @click="confirm(ruleFormRef)"
              >
                {{ $t('Nfts.launch_OK') }}
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </CollectionDialog>

  <!--create Nfts-->
  <CollectionDialog
    v-model="createNftsModel"
    :defiendFooter="defiendFooter"
    :isHideCancelBtn="false"
    :operateWarpMarginTop="12"
  >
  <template #title>
    <header class="flex w-full  items-center justify-center">
     
      <div class="text-lg font-medium ">
        {{ $t('Nfts.launch_create') }}
      </div>
    </header>
  </template>

  <template #content>
    <div class="form-wrap py-7">
      <el-form :model="createCollectionform">
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
                <img v-if="createCollectionform.cover" :src="createCollectionform.cover" class="avatar rounded-lg" />
                <el-icon v-else class="avatar-uploader-icon " color="#BFC2CC" :size="35"
                  ><Plus
                /></el-icon>
                <div
                  v-if="createCollectionform.cover"
                  @click="removeCollectionCover"
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
            <el-input v-model="createCollectionform.name" :placeholder="$t('Nfts.launch_placeholder1')" />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title3') }}</span>
          </template>
          <template #default>
            <el-input
              :rows="10"
              v-model="createCollectionform.desc"
              type="textarea"
              :placeholder="$t('Nfts.launch_placeholder2')"
            />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          

          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title4') }}</span>
          </template>
          <template #default>
            <el-input
              v-model="createCollectionform.totalSupply"
              :formatter="(value:string) => `${value}`.replace(/\D+$/g, '')"
              :parser="(value:string) => value.replace(/\D+$/g, '')"
              :placeholder="$t('Nfts.launch_placeholder3')"
            />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('NFTs.lanuch_title1') }}</span>
          </template>
          <template #default>
            <el-select v-model="chain" placeholder="Select" style="width:100%">
          <template #prefix>
            <span>
              <img class="w-6 h-6" :src="chain == NftsLaunchPadChain.btc ? btc : mvc" alt="" />
            </span>
          </template>

          <el-option
            class="flex items-center my-2"
            v-for="item in chainOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <Icon :name="item.icon" custom-class="h-6 w-6 mr-2" />
            <span class="text-sm">{{ item.label }}</span>
          </el-option>
        </el-select>
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('NFTs.lanuch_title2') }}</span>
          </template>
          <template #default>
            <el-select v-model="createCollectionform.autoMakeMarket" placeholder="Select" style="width: 100%">
          <el-option
            v-for="item in optionMakeMarket"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
          </template>
        </el-form-item>


        <el-form-item>
          <div
            class="mt-5 text-base font-medium py-4 flex items-center cursor-pointer justify-center main-border primary"
            @click="onSubmitNewCollection"
          >
            {{ $t('Nfts.launch_next') }}
          </div>
        </el-form-item>
      </el-form>
    </div>
  </template>
 
  
  </CollectionDialog>
</template>

<script setup lang="ts">
import LucideIcon from '@/components/LucideIcon/index.vue'
import btc from '@/assets/nft/btc.png'
import mvc from '@/assets/nft/mvc.png'
import { Close ,Plus} from '@element-plus/icons-vue'
import { useRouter,useRoute} from 'vue-router'
import { reactive, ref,computed,onMounted ,watch} from 'vue'
import { compressImage, FileToAttachmentItem, prettyAddress, sleep } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import CollectionDialog from './collection-dialog.vue'
import type { FormProps } from 'element-plus'
import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'
import { AttachmentItem } from '@/@types/hd-wallet'
import { classifyList,fileType } from '@/config'
import { useGenesisStore } from '@/stores/genesis'
import type {  FormInstance, FormRules } from 'element-plus'
import {CollectionMintChain} from '@/enum'
import { Select } from '@element-plus/icons-vue'
import { useConnectionStore } from '@/stores/connection'
import { ElLoading, ElMessage,type UploadProps} from 'element-plus'
import { NftsLaunchPadChain, NftsLaunchPadChainSymbol } from '@/data/constants'

const i18n = useI18n()
const genesisStore = useGenesisStore()
const connectionStore=useConnectionStore()
const modelValue = ref(false)
const createNftsModel=ref(false)
const ruleFormRef = ref<FormInstance>()
const labelPosition = ref<FormProps['labelPosition']>('top')
const isEdit=ref(false)
const defiendFooter=ref(true)
const chain = ref<string>(NftsLaunchPadChain.btc)
const router=useRouter()
const route=useRoute()
watch(()=>route.params.pinid,(newValue)=>{
  currentNftsCollect.value=genesisStore.getList.find((item)=>{
    return item.collectionPinId == newValue
  })
  genesisCollection.value= currentNftsCollect.value.collectionName
})


type MintInfo={
  mintAmount:number
  cover:AttachmentItem
  source:AttachmentItem
  desc:string
  classify:string[]
  receiver:string
}

type UseSameOption={
  isSameCover:boolean
  isSameSource:boolean
  isSameDesc:boolean
  isSameClassify:boolean
  isSameReceiver:boolean
}

const chainOptions = [
  {
    value: NftsLaunchPadChain.btc,
    label: NftsLaunchPadChain.btc,
    icon: 'logo_btc',
  },
  {
    value: NftsLaunchPadChain.mvc,
    label: NftsLaunchPadChain.mvc,
    icon: 'logo_mvc',
  },
]

const createCollectionform = reactive({
  name: '',
  cover: '',
  coverHex:'',
  desc: '',
  totalSupply:"0",
  website:'',
  chain:NftsLaunchPadChain.btc,
  autoMakeMarket:true
})



const genesisCollection=ref('')
const currentNftsCollect=ref()
const tableData = reactive<MintListInfo[]>([

])

const optionMakeMarket = reactive([
  {
    value: true,
    label: computed(() =>
      chain.value == NftsLaunchPadChain.btc
        ? i18n.t('Nfts.launch_noSupport')
        : i18n.t('Nfts.launch_yes')
    ),
    disabled: computed(() => chain.value == NftsLaunchPadChain.btc),
  },
  {
    value: false,
    label: computed(() => i18n.t('Nfts.launch_no')),
  },
])

const MyCollectionList=computed(()=>{
  if(genesisStore.getList.length){
   return genesisStore.getList
  }else{
    return []
  }


})




const mintData=reactive<MintInfo & UseSameOption>({
  mintAmount:0,
  cover:'',
  source:'',
  desc:'',
  classify:[],
  receiver:connectionStore.userInfo.address ?? '',
  isSameCover:true,
  isSameSource:true,
  isSameDesc:true,
  isSameClassify:true,
  isSameReceiver:true
})

const rules = reactive<FormRules<MintInfo>>({
  // mintAmount:[
  // { required: true, message: 'Please input minting amount', trigger: 'blur' },
  // ],
  // cover:[
  // {
  //     required: true,
  //     message: 'Please select NFT cover',
  //     trigger: 'change',
  // },
  // ],
  // source:[
  // {
  //     required: true,
  //     message: 'Please select NFT source file',
  //     trigger: 'change',
  // },
  // ],
  // desc:[
  // {
  //     required: false,
  //     message: 'Please select NFT source file',
  //     trigger: 'blur',
  // },
  // ],
  // classify:[
  // {
  //     required: false,
  //     message: 'Please select NFT source file',
  //     trigger: 'blur',
  // },
  // ],
  // receiver:[
  // { required: true, message: 'Please input receiver address', trigger: 'blur' },
  // ]
})


type MintListInfo=Omit<MintInfo,'mintAmount'> & {id:number, op:string}


function getCollectionData(){
  currentNftsCollect.value= genesisStore.getList.find((item)=>{
    return item.collectionPinId == route.params.pinid
  })
 
  genesisCollection.value= currentNftsCollect.value.collectionName
}



function genesisNfts() {
  createNftsModel.value = true
}

function removeItem(item: any) {

  const newArr = tableData.filter(ele => {
    return ele.id !== item.id
  })
  tableData.length = 0
  tableData.push(...newArr)
}

function editNft(item:MintListInfo){
  isEdit.value=true
  fillMintData(item)
  modelValue.value = true

}

function fillMintData(item:MintListInfo){
 mintData.cover=item.cover
 mintData.classify=item.classify
 mintData.desc=item.desc
 mintData.receiver=item.receiver
 mintData.source=item.source
}

async function selectChange(newSelection: any) {
  if (!newSelection.cover) {
    let input = document.createElement('input')
    input.type = 'file'
    await sleep(300)
    input.click()
    input.onchange = async (e: Event) => {
      const files: File[] = [...e.target!.files!]
      const compressed = await compressImage(files[0])
      const result = await FileToAttachmentItem(compressed)
      newSelection.cover = result.url
      newSelection.source = result.fileName
    }
  }
}

function deleteCover(item: any) {
  item.cover = ''
  item.source = ''
}

const confirm = async(formEl: FormInstance | undefined) =>{

  if(!formEl) return
  if(!mintData.mintAmount)return
  if(mintData.mintAmount > Number(currentNftsCollect.value.currentTotalSupply)) return ElMessage.error(`${i18n.t('Nfts.lanuch_overLimit_amount')}`)
  if(!mintData.cover) return ElMessage.error(`${i18n.t('Nfts.lanuch_cover_null')}`)

  let currentlength=tableData.length
  const tableList:MintListInfo[]=[]
  for(let i=0;i<mintData.mintAmount;i++){
    tableList.push({
        id:i+currentlength,
        op:i18n.t('Nfts.lanuch_delete'),
        cover:mintData.cover?.url,
        source:mintData.cover?.fileName,
        desc:mintData.desc,
        receiver:mintData.receiver ?? connectionStore.userInfo.address,
        classify:mintData.classify
      })
    }
    const loadingInstance = ElLoading.service({
      target:'.form-wrap',
      text:'loading'
    })
    setTimeout(() => {
      tableData.push(...tableList)
      loadingInstance.close()
    }, 500);
    modelValue.value = false
  //tableData

}

function cancel(formEl: FormInstance | undefined){
  if (!formEl) return
  formEl.resetFields()
  modelValue.value = false

}


function triggleCollection(pinId:string){
  if( pinId == currentNftsCollect.value.collectionPinId) {
    let collection=MyCollectionList.value.find(item=>{
      return item.collectionPinId == pinId
    })
    genesisCollection.value=collection?.collectionName
  }else{
    const loadingInstance = ElLoading.service({
      target:'.body'
    })

   setTimeout(() => {
    router.push({
    name: 'nftsCollection',
    params: {
      pinid:pinId
    },
  })

  loadingInstance.close()
   }, 300);
    // currentNftsCollect.value=MyCollectionList.value.find(item=>{
    //   return item.collectionPinId == pinId
    // })
  }


}

async function finallyMint() {
    try {

    } catch (error) {

    }
}


const onSubmitNewCollection = async() => {
  

  genesisStore.add({
    totalSupply:createCollectionform.totalSupply,
    collectionName:createCollectionform.name,
    intro:createCollectionform.desc,
    cover:createCollectionform.cover,
    website:createCollectionform.website,
    metaData:'',
    chain:createCollectionform.chain == 'Bitcoin' ? CollectionMintChain.btc  : CollectionMintChain.mvc,
    collectionPinId:'66666',
    currentTotalSupply:createCollectionform.totalSupply,
    autoMarket:createCollectionform.autoMakeMarket,
    genesisTimestamp:Date.now(),
    metaId:connectionStore.last.metaid
  })

  router.push({
    name: 'nftsCollection',
    params: {
      pinid:'66666'
    },
  })


  
}

function removeCollectionCover(e:any){
    e.stopPropagation();
    if(createCollectionform.cover){
      createCollectionform.cover =''
      createCollectionform.coverHex=''
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

    createCollectionform.cover =result.base64!

    createCollectionform.coverHex=result.data

  return true
}

getCollectionData()

</script>

<style scoped src="./collection.scss"></style>
