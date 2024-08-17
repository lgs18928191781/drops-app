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
              :label="item.name"
              :value="item.collectionPinId"
            >
              <template #default>
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center">
                    <Image :src="item?.coverPinid" custom-class="w-8 h-8 mr-1 rounded-md object-cover" />  
                   
                    <span>{{ item.name }}</span>
                  </div>
                  <div
                    v-if="genesisCollection == item.name"
                    class="w-5 h-5 flex items-center justify-center bg-[#FFDC51] p-1.5 rounded-md"
                  >
                    <el-icon :size="9" color="#303133"><Select /></el-icon>
                  </div>
                </div>
              </template>
            </el-option>
          </el-select>
        </div>
        <div class=" flex flex1  justify-end cursor-pointer text-[#5586BB]">
          <span @click="genesisNfts" class="p-1 rounded hover:bg-[#5586BB] hover:text-white">{{
            $t('NFTs.genesis_nfts')
          }}</span>
        </div>
      </div>
      <!-- <nav>
            <a v-for="(item, index) in navs" :key="index" @click="commonSoon">{{ item.name }}</a>
          </nav> -->
    </div>

    <div class="content-wrap p-[18px] border-2 border-solid border-[#303133] rounded-xl mt-5 ">
      <div class="nfts-card flex">
        <div class="nfts-cover flex items-center justify-center w-24 h-24 rounded-lg ">
          <Image :src="currentNftsCollect?.coverPinid" custom-class="w-full rounded-lg" />  
          <!-- <img class="w-full rounded-lg " :src="currentNftsCollect?.cover" alt="" /> -->
        </div>
        <div class="nfts-detail w-full ml-4">
          <div class="flex-col">
            <div class="nfts-name flex items-center justify-between">
              <span class="text-2xl font-medium">{{ currentNftsCollect?.name }}</span>

              <ExternalLink
                :size="18"
                color="#909399"
                class="cursor-pointer hover:scale-110"
              ></ExternalLink>
            </div>
            <div class="nfts-intro flex text-[#909399] text-xs">
              <span>
                {{ currentNftsCollect?.desc }}
              </span>
            </div>
          </div>
          <div class="nfts-footer flex items-center text-sm ">
            <div class="flex items-center justify-start flex-wrap">
              <div class="blockchain flex items-center mr-6">
                <span class="mr-2">{{ $t('Nfts.lanuch_chain') }}</span>
                <img
                  class="w-5 h-5 mr-1"
                  :src="currentNftsCollect?.chain == CollectionMintChain.btc ? btc : mvc"
                  alt=""
                />
                <span class="font-medium">{{ currentNftsCollect?.chain }}</span>
              </div>
              <div class="market-option flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_makemarket') }}</span>
                <span>{{ currentNftsCollect?.autoMarket }}</span>
              </div>
              <div class="total-supply flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_totalSupply') }}</span>
                <span>{{ currentNftsCollect?.totalSupply }}</span>
              </div>

              <div class="total-supply flex mr-6">
                <span class="mr-1">{{ $t('Nfts.lanuch_mintable_Supply') }}</span>
                <span>{{ currentNftsCollect?.currentSupply }}</span>
              </div>

              <div class="mint-amount flex ">
                <span class="mr-1">{{ $t('Nfts.lanuch_minted') }}</span>
                <span>{{ mintedAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="auto-market-wrap  mt-8">
      <div class="title text-lg py-4 font-medium">
        {{ $t('Nfts.lanuch_auto_market_title') }}
      </div>
      <div class="content flex items-center py-6 border-t border-[#EDEFF2] flex-row">
        <div class="config-wrap pr-10 border-r border-[#EDEFF2] w-1/5">
          <div class="flex flex-col">
            <div class="">
              <div>
                <span>{{ $t('Nfts.lanuch_auto_market_setprice') }}</span>
                <span class="ml-1 font-medium">({{ $t('Nfts.mint_price_unit') }})</span>
              </div>
              <el-input
                :placeholder="$t('Nfts.lanuch_set_init_price')"
                class="h-12 mt-2"
                v-model="autoMaketData.initialPrice"
                :disabled="
                  !currentNftsCollect?.autoMarket || Boolean(currentNftsCollect?.initialPrice)
                "
              ></el-input>
            </div>
            <div class="mt-3.5">
              <span>{{ $t('Nfts.lanuch_auto_market_setpriceAdd') }}</span>
              <el-input
                :placeholder="$t('Nfts.lanuch_set_price_increase')"
                class="h-12 mt-2"
                v-model="autoMaketData.priceGrowth"
                :disabled="
                  !currentNftsCollect?.autoMarket || Boolean(currentNftsCollect?.priceGrowth)
                "
              ></el-input>
            </div>
          </div>
          <div class="mt-3.5 text-[#909399] flex flex-row items-center justify-center">
            <div class="mr-4">
              <span class="mr-1">X:</span> <span>{{ $t('Nfts.lanuch_X') }}</span>
            </div>
            <div>
              <span class="mr-1"> Y:</span>
              <span>{{ $t('Nfts.lanuch_Y') }}</span>
            </div>
          </div>
        </div>
        <div class="echart-wrap pl-10 w-4/5 ">
          <Line ref="chartRef" :style="customStyle" :data="data" :options="options" />
        </div>
      </div>
    </div>

    <div class="mt-12 ">
      <div class="mint-wrap flex items-center justify-between border-b pb-5 border-[#EDEFF2]">
        <div class="text-lg font-medium">{{ $t('Nfts.lanuch_bulkMint') }}</div>

        <div class="mint-btn flex text-sm font-medium">
          <button
            @click="mintOne"
            class="py-1 px-3 rounded-md border border-transparent flex items-center justify-center mr-2 bg-[#FFDC51] "
          >
            铸造单个
          </button>

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
          <el-table-column prop="id" :label="$t('Nfts.lanuch_nftIndex')" width="100">
            <template #default="scope">
              <div
                class="main-border gray-exclued-text p-2 min-h-14  flex justify-between items-center "
              >
                <div class="w-8 h-8 rounded-md ">
                  <span>#{{ scope.row.id }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="cover" :label="$t('Nfts.lanuch_nftcover')" width="120">
            <template #default="scope">
              <div
                class="main-border gray-exclued-text p-2 min-h-14  flex justify-between items-center "
              >
                <div class="w-8 h-8 rounded-md ">
                  <img class="" :src="scope.row.cover.url" alt="" />
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
          <!-- <el-table-column prop="receiver" :label="$t('Nfts.lanuch_receive_address')" width="250">
            <template #default="scope">
              <div class="main-border py-3.5 gray-exclued-text p-2 min-h-14  ">
                <span class="">{{ prettyAddress(scope.row.receiver, 12) }}</span>
              </div>
            </template>
          </el-table-column> -->

          <!-- <el-table-column prop="process" :label="$t('Nfts.lanuch_upload_process')" width="150">
            <template #default="scope">
             
              <el-progress
                :text-inside="true"
                :stroke-width="15"
                :percentage="scope.row.process"
                color="#FFDC51"
              />
            </template>
          </el-table-column> -->

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
                    Number(currentNftsCollect?.currentSupply) - tableData.length
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
          <!-- <el-form-item>
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
          </el-form-item> -->

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
                  <img
                    v-if="createCollectionform.cover"
                    :src="createCollectionform.cover"
                    class="avatar rounded-lg"
                  />
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
              <el-input
                v-model="createCollectionform.name"
                :placeholder="$t('Nfts.launch_placeholder1')"
              />
            </template>
          </el-form-item>

          <el-form-item class="flex flex-col " label-width="auto">
            <template #label>
              <span class="flex text-base font-medium">{{ $t('Nfts.launch_title3') }}</span>
            </template>
            <template #default>
              <el-input
                :rows="5"
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
              <span class="flex text-base font-medium">{{ $t('Nfts.launch_title5') }}</span>
            </template>
            <template #default>
              <el-select
                v-model="createCollectionform.royaltyRate"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option v-for="item in royaltyRate" :label="item + ' ' + '%'" :value="item" />
              </el-select>
            </template>
          </el-form-item>

          <el-form-item class="flex flex-col " label-width="auto">
            <template #label>
              <span class="flex text-base font-medium">{{ $t('Nfts.launch_title6') }}</span>
            </template>
            <template #default>
              <el-input
                v-model="createCollectionform.website"
                :placeholder="$t('Nfts.launch_placeholder6')"
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
                    <img
                      class="w-6 h-6"
                      :src="chain == NftsLaunchPadChain.btc ? btc : mvc"
                      alt=""
                    />
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
              <el-select
                v-model="createCollectionform.autoMakeMarket"
                placeholder="Select"
                style="width: 100%"
              >
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

import { ExternalLink } from 'lucide-vue-next'
import btc from '@/assets/nft/btc.png'
import mvc from '@/assets/nft/mvc.png'
import { Close, Plus } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, computed, onMounted, watch, toRaw } from 'vue'
import { compressImage, FileToAttachmentItem, prettyAddress, sleep } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import CollectionDialog from './collection-dialog.vue'

import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'
import { AttachmentItem } from '@/@types/hd-wallet'
import { classifyList, fileType, royaltyRate } from '@/config'
import { useGenesisStore } from '@/stores/genesis'

import { CollectionMintChain,SdkPayType } from '@/enum'
import { Select } from '@element-plus/icons-vue'
import { useConnectionStore } from '@/stores/connection'
import { ElLoading, ElMessage } from 'element-plus'
import { NftsLaunchPadChain, NftsLaunchPadChainSymbol,SIGHASH_ALL,SIGHASH_ALL_ANYONECANPAY } from '@/data/constants'
import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
import { Line } from 'vue-chartjs'
import { useEchart } from '@/hooks/use-echart-tool'
import type {  FormInstance, FormRules,UploadProps } from 'element-plus'
import { useFeebStore } from '@/stores/feeb'
import { uploadNftsFile,generateCommitAddress,mintNftItem,submitMintOrder} from '@/api/mrc721-api'
import Decimal from 'decimal.js-light'
import {exclusiveChange} from '@/hooks/use-buildtx-entity'
import { useNetworkStore } from '@/stores/network'
import { useBtcJsStore } from '@/stores/btcjs'
import * as secp256k1 from 'tiny-secp256k1'
import {usePayModalEntity} from '@/hooks/use-pay-modal-entity'
import {  type Psbt } from 'bitcoinjs-lib'
const i18n = useI18n()
const genesisStore = useGenesisStore()
const connectionStore = useConnectionStore()
const modelValue = ref(false)
const createNftsModel = ref(false)
const ruleFormRef = ref<FormInstance>()
const labelPosition = ref('top')
const isEdit = ref(false)
const defiendFooter = ref(true)
const chain = ref<string>(NftsLaunchPadChain.btc)
const router = useRouter()
const route = useRoute()
const networkStore=useNetworkStore()
const { mintNftItemEntity } = useMetaIDEntity()
const { data, options } = useEchart()
const feeStore = useFeebStore()
const chartRef = ref()
const payModalEntity=usePayModalEntity()
const autoMaketData=ref({
  initialPrice:'',
  priceGrowth:''
})


watch(
  () => route.params.pinid,
  newValue => {
    currentNftsCollect.value = genesisStore.getList.find(item => {
      return item.collectionPinId == newValue
    })
    autoMaketData.value.initialPrice=currentNftsCollect.value?.initialPrice!
    autoMaketData.value.priceGrowth=currentNftsCollect.value?.priceGrowth!
    genesisCollection.value = currentNftsCollect.value!.name
  }
)

onMounted(() => {
  // genesisStore.updateItem({
  //   ...currentNftsCollect.value,
  //   initialPrice:'',
  //   priceGrowth:""
  // })

})

type MintInfo = {
  mintAmount: number
  cover: AttachmentItem
  source: AttachmentItem
  desc: string
  classify: string[]
  receiver: string
}

type UseSameOption = {
  isSameCover: boolean
  isSameSource: boolean
  isSameDesc: boolean
  isSameClassify: boolean
  isSameReceiver: boolean
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
  coverHex: '',
  desc: '',
  totalSupply: '0',
  royaltyRate: '0',
  website: '',
  metadata:null,
  chain: NftsLaunchPadChain.btc,
  autoMakeMarket: true,
})

const newFile: Array<{id:number, file: File; picId: string,itemDesc:string,classify:string[] }> = reactive([])

const genesisCollection = ref('')
const currentNftsCollect = ref<Mrc721CollectionItem>()
const tableData = reactive<MintListInfo[]>([])

const customStyle = computed(() => {
  return {
    height: '230px',
  }
})

const optionMakeMarket = reactive([
  {
    value: true,
    label: computed(() => i18n.t('Nfts.launch_yes')
      // chain.value == NftsLaunchPadChain.btc
      //   ? i18n.t('Nfts.launch_noSupport')
      //   : i18n.t('Nfts.launch_yes')
    ),
    disabled:false
    //  disabled: computed(() => chain.value == NftsLaunchPadChain.btc),
  },
  {
    value: false,
    label: computed(() => i18n.t('Nfts.launch_no')),
  },
])

const MyCollectionList = computed(() => {
  if (genesisStore.getList.length) {
    return genesisStore.getList
  } else {
    return []
  }
})

const mintedAmount=computed(()=>{
  if(currentNftsCollect.value?.totalSupply!){
    return currentNftsCollect.value.minted
  }else{
    return 0
  }

})

const mintData = reactive<MintInfo & UseSameOption>({
  mintAmount: 0,
  cover: '',
  source: '',
  desc: '',
  classify: [],
  receiver: connectionStore.userInfo.address ?? '',
  isSameCover: true,
  isSameSource: true,
  isSameDesc: true,
  isSameClassify: true,
  isSameReceiver: true,
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

type MintListInfo = Omit<MintInfo, 'mintAmount'> & { id: number; op: string; }


  async function formatToSignInputs(psbt:Psbt){
    try {
      const pubkey=await connectionStore.provider?.btc.getPublicKey()
      debugger
    const toSignInputs=[]
    if(psbt.inputCount == 1){
      throw new Error('No input to Sign')
    }
    if(psbt.inputCount > 0){
        for(let i=1;i<psbt.inputCount;i++){
          toSignInputs.push({
            index:i,
        address:connectionStore.last.user.address,
        publickey:pubkey,
        sighashTypes:[129],
        disableTweakSigner:false
          })
        }
      }
      console.log("toSignInputs",toSignInputs)
      return toSignInputs
    } catch (error) {
      throw new Error(error as any)
    }
  }

  async function mintOne(){
    try {
      debugger
     const getOrderPsbtRes= await mintNftItem({
        creatorMetaId:`fd596734d8949a661997eaee3639eb4fa01aa335c70d0777d919d589f3afee34`,
      name:`CyptoPunkParty`,
      feeb:feeStore.last.currentFeeb.feeRate,
      commitAddress:`tb1p7w4rz53djajg9re0pxdycxz4t7l2zjyaq2yvcm06zxhgw5ln9gqqn5jte8`,
      receiverAddress:connectionStore.last.user.address
    })
    if(getOrderPsbtRes.code == 200){
    const psbtHex=getOrderPsbtRes.data.psbtHex
     const estiomateResult=await estimatePsbtFee(psbtHex,feeStore.last.currentFeeb.feeRate,true)
     if(estiomateResult){
      const {psbt,feeb}=await estimatePsbtFee(psbtHex,feeStore.last.currentFeeb.feeRate)
      const toSignInputs=await formatToSignInputs(psbt)
      const rawTx= await connectionStore.adapter.signPsbt(psbt.toHex(),{
        toSignInputs:toSignInputs,
        autoFinalized:true
      })
      //a1fae68d854da4becfc357ae4a8e0abb5c1e1307ba29c25cee53454526639584i0
      
      console.log("signRes",rawTx)
      if(rawTx){
        const submitRes= await submitMintOrder({
        creatorMetaId:`fd596734d8949a661997eaee3639eb4fa01aa335c70d0777d919d589f3afee34`,
        name:`CyptoPunkParty`,
        commitAddress:`tb1p7w4rz53djajg9re0pxdycxz4t7l2zjyaq2yvcm06zxhgw5ln9gqqn5jte8`,
        psbtHex:rawTx,
        feeb:feeb
      })
      debugger
      }
     

      
    }
    debugger
    } }catch (error) {
      debugger
      console.log("error",error)
     return ElMessage.error(error as any)
    }

    
    // try {

   

    //  }
 
      

    // } catch (error) {
    //   console.log("error",error)
    //   return ElMessage.error(error as any)
    // }

    
  }


function getCollectionData() {
  currentNftsCollect.value = genesisStore.getList.find(item => {
    return item.collectionPinId == route.params.pinid
  })
  if(currentNftsCollect.value?.name){
    genesisCollection.value = currentNftsCollect.value!.name
    autoMaketData.value.initialPrice=currentNftsCollect.value?.initialPrice!
    autoMaketData.value.priceGrowth=currentNftsCollect.value?.priceGrowth!
  }

}

function genesisNfts() {
  //createNftsModel.value = true
  router.push('/nfts')
}

function removeItem(item: any) {
  let newArr = tableData.filter(ele => {
    return ele.id !== item.id
  })
  let newFileList=newFile.filter(ele => {
    return ele.id !== item.id
  })
  console.log("newFILE",newFile)
  
  tableData.length = 0
  newFile.length=0
  newArr.map((item,index)=>{
      item.id=index+1+mintedAmount.value
  })
  newFileList.map((item,index)=>{
      item.id=index+1+mintedAmount.value
  })



  tableData.push(...newArr)
  newFile.push(...newFileList)
}

function editNft(item: MintListInfo) {
  isEdit.value = true
  fillMintData(item)
  modelValue.value = true
}

function fillMintData(item: MintListInfo) {
  mintData.cover = item.cover
  mintData.classify = item.classify
  mintData.desc = item.desc
  mintData.receiver = item.receiver
  mintData.source = item.source
}

async function selectChange(newSelection: any) {
  if (!newSelection.cover) {
    let input = document.createElement('input')
    input.type = 'file'
    await sleep(300)
    input.click()
    input.onchange = async (e: Event) => {
      const files: File[] = [...e.target!.files!]
      for (let item of files) {
        
        const compressed = await compressImage(item)
        const result = await FileToAttachmentItem(compressed)
        newSelection.cover = result.url
        newSelection.source = result.fileName
      }
    }
  }
}

function deleteCover(item: any) {
  item.cover = ''
  item.source = ''
}

function performChunk(datas: MintListInfo[]) {
  return new Promise<void>(resolve => {
    if (datas.length == 0) {
      return
    }
    let i = 0
    function _run() {
      if (i == datas.length) {
        return
      }
      requestIdleCallback(idle => {
        while (idle.timeRemaining() > 0 && i < datas.length) {
          const item = datas[i]
          tableData.push(item)
          i++
        }
        _run()
      })
    }
    _run()
    resolve()
  })
}

const confirm = async (formEl: any) => {
  if (!formEl) return
  if (!mintData.mintAmount) return
  if (mintData.mintAmount > Number(currentNftsCollect.value!.currentSupply))
    return ElMessage.error(`${i18n.t('Nfts.lanuch_overLimit_amount')}`)
  if (!mintData.cover) return ElMessage.error(`${i18n.t('Nfts.lanuch_cover_null')}`)
  //newFile.length = 0
  let currentlength = tableData.length

  const tableList: MintListInfo[] = []
  for (let i = 1; i <= mintData.mintAmount; i++) {
    tableList.push({
      id: i + currentlength + mintedAmount.value ,
      op: i18n.t('Nfts.lanuch_delete'),

      cover: mintData.cover,
      source: mintData.cover?.fileName,
      desc: mintData.desc,
      //receiver: mintData.receiver ?? connectionStore.userInfo.address,
      classify: mintData.classify,
    })
    newFile.push({
      id:i + currentlength + mintedAmount.value,
      file: mintData.cover.originFile!,
      picId: mintData.cover.sha256,
      itemDesc:mintData.desc,
      classify:mintData.classify
    })
  }
  console.log('newFile', newFile)
  const loadingInstance = ElLoading.service({
    target: '.form-wrap',
    text: 'loading',
  })

  setTimeout(() => {
    performChunk(tableList).then(() => loadingInstance.close())
  }, 500)

  // setTimeout(async() => {
  //   tableData.push(...tableList)

  //   loadingInstance.close()
  // }, 500);
  modelValue.value = false
  //tableData
}

function cancel(formEl: any) {
  if (!formEl) return
  formEl.resetFields()
  modelValue.value = false
}

function triggleCollection(pinId: string) {
  if (pinId == currentNftsCollect.value!.collectionPinId) {
    let collection = MyCollectionList.value.find(item => {
      return item.collectionPinId == pinId
    })
    genesisCollection.value = collection?.name
  } else {
    const loadingInstance = ElLoading.service({
      target: '.body',
    })

    setTimeout(() => {
      router.push({
        name: 'nftsCollection',
        params: {
          pinid: pinId,
        },
      })

      loadingInstance.close()
    }, 300)
    // currentNftsCollect.value=MyCollectionList.value.find(item=>{
    //   return item.collectionPinId == pinId
    // })
  }
}

function checkIsSameFile(pre:{file: File;
    picId: string},cur:{file: File;
    picId: string}){
  if(cur.picId == pre.picId){
    return true
  }else return false
}

async function preMint() {
    try {
      let params=new FormData()

      for(let i=0;i<newFile.length;i++){
      params.append('file',newFile[i].file)
    }
    params.append('name',currentNftsCollect.value?.name!)
    if(!currentNftsCollect.value?.initialPrice && autoMaketData.value.initialPrice){
        params.append('initialPrice',new Decimal(autoMaketData.value.initialPrice).mul(10**8).toString())
        params.append('priceGrowth',autoMaketData.value.priceGrowth)
      }
    const res= await generateCommitAddress(params)
    console.log("res",res)
    
    if(res?.code == 200){
      return res.data
    }else return []


    } catch (error) {

    }
}

async function estimateBuildTxFee(targetAddress:string[] = [],feeb:number,checkOnly:boolean=false){
  const bitcoinjs = useBtcJsStore().get!
  try {
    if(!targetAddress.length){
    for(let i=0;i<newFile.length;i++){
      targetAddress.push(connectionStore.last.user.address)
    }
  }
    const psbt =new bitcoinjs.Psbt({ network: networkStore.typedNetwork })
    for(let i =0;i<newFile.length;i++){
      psbt.addOutput({
        value: 546,
        address:targetAddress[i],
      })
    }
    psbt.addOutput({
      value:1999,
      address:connectionStore.last.user.address
    })
  const estiomateResult= await exclusiveChange({
      psbt: psbt,
      maxUtxosCount:3,
      sighashType:SIGHASH_ALL_ANYONECANPAY,
      feeb:feeb ?? feeStore.last.currentFeeb.feeRate,
   })

   console.log("estiomateResult",estiomateResult)
   debugger
   if(checkOnly){
    const feeInfo={
      basic:newFile.length * 546,
      service:import.meta.env.VITE_MINT_NFT_SERVICE_FEE,
      miner:estiomateResult!.fee,
      feeb:estiomateResult!.feeb,
      total:new Decimal(estiomateResult!.fee).add(newFile.length * 546).add(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
    }
    const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'basic')

    return result
   }
   console.log("estiomateresult",estiomateResult)
   return estiomateResult
  } catch (error) {
    debugger
  }
}

async function estimatePsbtFee(psbtHex:string,feeb:number,checkOnly:boolean=false){
  const bitcoinjs = useBtcJsStore().get!
  try {
   if(!psbtHex){
    throw new Error(`${i18n.t('Nfts.psbt_empty')}`)
   }
    const psbt =bitcoinjs.Psbt.fromHex(psbtHex,{ network: networkStore.typedNetwork })
 
    const estiomateResult= await exclusiveChange({
      psbt: psbt,
      maxUtxosCount:3,
      sighashType:SIGHASH_ALL_ANYONECANPAY,
      feeb:feeb ?? feeStore.last.currentFeeb.feeRate,
   })

 
   if(checkOnly){
    const {paymentValue,fee,changeValue}=estiomateResult
    const mintPrice=new Decimal(paymentValue!).sub(changeValue).sub(fee).sub(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
    const feeInfo={
      basic:mintPrice,
      service:import.meta.env.VITE_MINT_NFT_SERVICE_FEE,
      miner:estiomateResult!.fee,
      feeb:estiomateResult!.feeb,
      total:new Decimal(estiomateResult!.fee).add(mintPrice).add(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
    }
    const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'mint')

    return result
   }
   
   return estiomateResult
  } catch (error) {
    throw new Error(error)
  }
}

async function finallyMint() {

    try {
    if(!autoMaketData.value.initialPrice && !autoMaketData.value.priceGrowth){
      return ElMessage.error(`${i18n.t('Nfts.lanuch_automarket_set')}`)
    }
    debugger
    const estiomateResult= await estimateBuildTxFee([],feeStore.last.currentFeeb.feeRate,true)

    if(!estiomateResult){
      return ElMessage.error(`${i18n.t('Nfts.cancel_transation')}`)
    }

    let params=new FormData()
    for(let i=0;i<newFile.length;i++){
      params.append('file',newFile[i].file)
      params.append('picId',newFile[i].picId)
      params.append('itemDesc',newFile[i].itemDesc)
      params.append('classify',JSON.stringify(newFile[i].classify))
    }
    params.append('metaid',currentNftsCollect.value?.metaId!)
    params.append('name',currentNftsCollect.value?.name!)

    const commitAddressList =await preMint()

    if(commitAddressList.length){

      params.append('commitAddress',JSON.stringify(commitAddressList))


    }else{
      throw new Error(`${i18n.t('Nfts.lanuch_generate_commit_address_fail')}`)
    }

   const {psbt:Psbt1}=await estimateBuildTxFee(commitAddressList,feeStore.last.currentFeeb.feeRate)

   const rawTx= await connectionStore.adapter.signPsbt(Psbt1.toHex())
    console.log("signRes",rawTx)
   debugger

  if(rawTx?.status == 'canceled'){
    return ElMessage.error('sign error')
    throw new Error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)

  }else if(rawTx){
    params.append('rawTx',rawTx)
  }

    uploadNftsFile(params).then((res)=>{
      
      if(res.code == 200){
        tableData.length=0
        newFile.length=0
      if(currentNftsCollect.value?.autoMarket && !currentNftsCollect.value?.initialPrice){
        genesisStore.updateItem({
          ...currentNftsCollect.value,
          // initialPrice:autoMaketData.value.initialPrice!,
          // priceGrowth:autoMaketData.value.priceGrowth!
        })
        currentNftsCollect.value.initialPrice=autoMaketData.value.initialPrice
        currentNftsCollect.value.priceGrowth=autoMaketData.value.priceGrowth
      }
      genesisStore.updateCurrentTotalSupply({
            name:currentNftsCollect.value!.name,
            count:newFile.length
          })
      }



    })

  } catch (error) {

  }



  // try {



  //   const attachments: AttachmentItem[] = []
  //   const body = tableData.map((item, index) => {
  //     attachments.push(item.cover)
  //     return {
  //       pinid: '',
  //       name: `#${index + 1}`,
  //       desc: item.desc,
  //       cover: '',
  //       metadata: {
  //         classify: toRaw(item.classify),
  //       },
  //     }
  //   })
  //   console.log('body', body, attachments)
  //   debugger
  //   const mintItemRes = await mintNftItemEntity({
  //     collectionName: genesisCollection.value,
  //     body: body,
  //     attachments: attachments,

  //     noBroadcast: false,
  //   })
  //   console.log('mintItemRes', mintItemRes)
  //   debugger
  // } catch (error) {
  //   console.log('error', error)
  //   debugger
  // }


}

const onSubmitNewCollection = async () => {
  router.push('/nfts')
  // const existNfts= genesisStore.getList.find((item)=>item.name == createCollectionform.name)
  // try {
  //   if(existNfts?.collectionPinId){
  //   return ElMessage.error(`${i18n.t('Nfts.lanuch_existNfts')}`)
  // }else if(existNfts?.name){

  //   var {createCollectionDescRes,coverPinId} = await mintNftEntity({
  //   body:{
  //     name:createCollectionform.name,
  //     totalSupply:+createCollectionform.totalSupply,
  //     royaltyRate:+createCollectionform.royaltyRate,
  //     desc:createCollectionform.desc,
  //     website:createCollectionform.website,
  //     cover:'',
  //     metadata:createCollectionform.metadata
  //   },
  //   attachments:[form.originFile],
  //   noBroadcast:false,
  //   collectionName:existNfts.name
  // })
  // }else{
  //   debugger
  //   var {createCollectionDescRes,coverPinId} = await mintNftEntity({
  //   body:{
  //     name:form.name,
  //     totalSupply:+form.totalSupply,
  //     royaltyRate:+form.royaltyRate,
  //     desc:form.desc,
  //     website:form.website,
  //     cover:'',
  //     metadata:form.metadata
  //   },
  //   attachments:[form.originFile],
  // })


  // }
  // } catch (error) {

  // }
  // genesisStore.add({
  //   totalSupply: +createCollectionform.totalSupply,
  //   coverPinid:'',
  //   name: createCollectionform.name,
  //   desc: createCollectionform.desc,
  //   cover: createCollectionform.cover,
  //   website: createCollectionform.website,
  //   metaData: 'null',
  //   royaltyRate: +createCollectionform.royaltyRate,
  //   chain:
  //     createCollectionform.chain == 'Bitcoin' ? CollectionMintChain.btc : CollectionMintChain.mvc,
  //   collectionPinId: '',
  //   currentTotalSupply: createCollectionform.totalSupply,
  //   autoMarket: createCollectionform.autoMakeMarket,
  //   genesisTimestamp: Date.now(),
  //   metaId: connectionStore.last.metaid,
  //   initialPrice:'',
  //   priceGrowth:''
  // })

  // router.push({
  //   name: 'nftsCollection',
  //   params: {
  //     pinid: '66666',
  //   },
  // })
}

function removeCollectionCover(e: any) {
  e.stopPropagation()
  if (createCollectionform.cover) {
    createCollectionform.cover = ''
    createCollectionform.coverHex = ''
  } else return
}

const beforeAvatarUpload:UploadProps['beforeUpload'] = async (rawFile) => {
  if (!fileType.includes(rawFile.type)) {
    ElMessage.error('Avatar picture must be JPG/PNG/GIF/WEBP format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('Avatar picture size can not exceed 1MB!')
    return false
  }
  const compressed = await compressImage(rawFile)
  const result = await FileToAttachmentItem(compressed, 0, true)
  createCollectionform.cover = result.base64!
  createCollectionform.coverHex = result.data

  return true
}

getCollectionData()
</script>

<style scoped src="./collection.scss"></style>
