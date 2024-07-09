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
        <div class="collection-selector flex1 flex items-center justify-center">
          <el-select v-model="genesisCollection" >
                  <el-option
                    v-for="(item,index) in MyCollectionList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
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
        <div class="nfts-cover w-24 h-24 rounded-lg bg-orange-200">
          <img class="w-full" :src="btc" alt="" />
        </div>
        <div class="nfts-detail w-full ml-4">
          <div class="flex-col">
            <div class="nfts-name">
              <span class="text-2xl font-medium">Autie the Duck</span>
              <LucideIcon name="external-link"></LucideIcon>
            </div>
            <div class="nfts-intro flex text-[#909399] text-xs">
              <span>
                132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213132132131321321313213213
              </span>
            </div>
          </div>
          <div class="nfts-footer">
            <div class="blockchain flex mr-6">
              <span>{{ $t('Nfts.lanuch_chain') }}</span>
              <img src="" alt="" />
              <span>1321321</span>
            </div>
            <div class="market-option flex mr-6">
              <span>{{ $t('Nfts.lanuch_makemarket') }}</span>
            </div>
            <div class="total-supply flex mr-6">
              <span>{{ $t('Nfts.lanuch_totalSupply') }}</span>
            </div>
            <div class="mint-amount flex ">
              <span>{{ $t('Nfts.lanuch_minted') }}</span>
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
            :class="[tableData.length  ? 'bg-[#FFDC51]' : 'bg-[#EDEFF2] text-[#BFC2CC]']"
            >
            <span class="mr-1">{{ $t('Nfts.lanuch_confirm_minting') }}</span>
            <span v-if="tableData.length ">{{ tableData.length  }}</span>
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
                <span class="">{{ prettyAddress(scope.row.receiver,12) }}</span>
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
                <div class="text-[#909399]">
                  <span>{{ $t('Nfts.lanuch_mintLimited') }}</span>
                  <span>1000</span>
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


          
            <el-form-item >
              <div class="operate flex items-center justify-between font-medium text-base">
                <div class="main-border  cursor-pointer text-center py-2.5  mr-2.5 darkGray flex-1" @click="cancel(ruleFormRef)">{{$t('Cancel')}}</div>
                <div  class="main-border primary cursor-pointer text-center  py-2.5 flex-1" @click="confirm(ruleFormRef)">
        {{$t('Nfts.launch_OK')}}
                </div>
     
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
import { Close } from '@element-plus/icons-vue'
import { reactive, ref,computed } from 'vue'
import { compressImage, FileToAttachmentItem, prettyAddress, sleep } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import CollectionDialog from './collection-dialog.vue'
import type { FormProps } from 'element-plus'
import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'
import { AttachmentItem } from '@/@types/hd-wallet'
import { classifyList } from '@/config'
import type {  FormInstance, FormRules, Column } from 'element-plus'
import { useConnectionStore } from '@/stores/connection'
import { ElLoading } from 'element-plus'
const i18n = useI18n()
const connectionStore=useConnectionStore()
const modelValue = ref(false)
const ruleFormRef = ref<FormInstance>()
const labelPosition = ref<FormProps['labelPosition']>('top')
const isEdit=ref(false)
const defiendFooter=ref(true)
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

const tableData = reactive<MintListInfo[]>([

])

const genesisCollection=ref('Autie the Duck')

const MyCollectionList=reactive([
  {
    name:'Autie the Duck'
  },
  {
    name:'MetaBot X'
  }
])


const mintData=reactive<MintInfo & UseSameOption>({
  mintAmount:0,
  cover:'',
  source:'',
  desc:'',
  classify:[],
  receiver:connectionStore.userInfo.address ?? '',
  isSameCover:false,
  isSameSource:false,
  isSameDesc:false,
  isSameClassify:false,
  isSameReceiver:false
})

const mintBtnState=computed(()=>{
  return mintData.mintAmount > 0 && tableData.length < 10
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


function genesisNfts() {}

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
</script>

<style scoped src="./collection.scss"></style>
