<template>
  <div class="create">
    <div class="create-header flex flex-align-center">
      <img class="icon" src="@/assets/images/icon_casting.svg" />
      <div class="title flex1 flex flex-align-center">
        <span class="flex1">{{$t('createnft')}}</span>
        <a @click="changeCreateType">{{ createTypeIndex === 0 ? $t('createbytx') : $t('createbylocal')}}<i class="el-icon-arrow-right" /></a>
      </div>
    </div>
    <div class="cont-warp">
      <div class="tags">
        <a v-for="(type,index) in nftTypes" :key="type.value" :class="{ 'active': type.value === nft.type }" @click="changeTag(index)">{{ type.name }}</a>
      </div>
      <div class="tips">
        {{$t('createtips1')}}<br />
        {{$t('createtips2')}}<br />
        {{$t('createtips3')}}
      </div>
      <!-- txId 铸造 -->
      <div class="create-form-item" v-if="createTypeIndex === 1">
        <div class="title">NFT TXID</div>
        <div class="cont">
          <div class="input-warp flex flex-align-center">
            <div class="input-value flex1">
              <input class="flex1"  v-model="nft.tx" type="text" :placeholder="$t('txIdTips')" @change="originalFileInputChage" />
            </div>
          </div>
        </div>
      </div>
      <!-- 源文件 铸造 -->
      <div class="create-form-item" v-else-if="createTypeIndex === 0">
        <div class="title">{{$t('nftoriginal')}}</div>
        <div class="cont">
          <div class="input-warp flex flex-align-center">
            <div class="input-value flex1">
              <span v-if="originalFile && originalFile.name !== ''">{{originalFile?.name}}</span>
              <span class="placeholder" v-else>{{$t('uploadTips')}}</span>
            </div>
            <img src="@/assets/images/file_upload.svg" />
            <input class="flex1" accept="image/*" type="file" @change="originalFileInputChage" />
          </div>
        </div>
      </div>
      <div class="create-form-item">
        <div class="title">{{$t('nftbase')}}</div>
        <div class="cont">
          <div class="upload-warp">
            <div class="upload">
              <div class="add flex flex-align-center flex-pack-center">
                <template v-if="coverFile && coverFile.name !== ''">
                  <ElImage class="cover" fit="cover" :src="coverFile.base64Data" :preview-src-list="[coverFile.base64Data]" />
                  <!-- <img class="cover" :src="coverFile.base64Data"  /> -->
                  <a class="close" @click="removeCover">{{$t('delete')}}</a>
                </template>
                <template v-else>
                  <div>
                    <img class="icon" src="@/assets/images/img_upload.svg" />
                    <div class="label">{{$t('uploadcover')}}</div>
                  </div>
                  <input type="file" accept="image/*" @change="coverFileInputChage" />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-item name">
        <input v-model="nft.nftName" type="text" :placeholder="$t('nameplac')" />
      </div>
      <div class="input-item drsc">
        <textarea v-model="nft.intro" :placeholder="$t('drscplac')"></textarea>
      </div>
      <div class="input-item type flex flex-align-center" @click="isShowClassifyModal = true; isShowSeriesModal = false">
        <div class="select-warp flex flex-align-center">
          <div class="key flex1">{{$t('choosetype')}}</div>
          <div class="value">
            <span v-if="nft.classify.length > 0">{{nft.classify.join(',')}}</span>
            <span v-else class="placeholder">{{$t('choose')}}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <PickerModel :title="$t('choosetype')" :multiple="true" :visible="isShowClassifyModal" @confirm="isShowClassifyModal = false" :list="classifies" :selecteds="nft.classify" />
        </div>
      </div>

      <!-- 系列 -->
      <div class="create-form-item seices">
        <div class="title flex flex-align-center">
          <span class="flex1">{{$t('isserices')}}</span>
          <a>{{$t('whatserices')}}</a>
        </div>
        <div class="cont">
          <div class="input-item flex flex-align-center" @click="isShowSeriesModal = true; isShowClassifyModal = false">
            <div class="select-warp flex flex-align-center">
              <div class="key flex1">{{$t('chooseserices')}}</div>
              <div class="value">
                <span v-if="selectedSeries.length > 0">{{ selectedSeries[0] }}</span>
                <span v-else class="placeholder">{{$t('choose')}}</span>
                <i class="el-icon-arrow-right"></i>
              </div>
              <PickerModel name="name" listKey="name" :title="$t('chooseserices')" :visible="isShowSeriesModal" @confirm="isShowSeriesModal = false" :list="series" :selecteds="selectedSeries">
                <div class="btn btn-block create-series-btn" @click="isShowCreateSeriesModal = true">{{ $t('createSerie') }}</div>
              </PickerModel>
            </div>
          </div>
        </div>
      </div>

      <div class="btn btn-block" @click="createNft">{{$t('confirmcreate')}}</div>
    </div>
  </div>
  <!-- <div class="my-nft">
    <div class="section container">
      <div class="section-header flex flex-align-center">
        <div class="title flex1">我的NFT</div>
        <a class="btn"
          >开始铸造<img class="icon-right" src="@/assets/images/bannet_icon_ins_right.svg"
        /></a>
      </div>
      <div class="section-cont nft-list">
        <template v-for="item in Array.from({ length: 4 })">
          <NftItem />
        </template>
      </div>
    </div>
  </div> -->

  <!-- nft 详情modal -->
  <ElDialog v-model="dialogVisible">
    <div class="nft-msg">
      <div class="nft-msg-main flex">
        <div class="cover">
          <img src="" />
          <a class="tag">艺术</a>
        </div>
        <div class="cont flex1">
          <div class="name">Saint Sophia</div>
          <div class="author flex flex-align-center">
            <img class="avatar" />
            <div class="author-msg flex1">
              <div class="creater">铸造者: 范特西</div>
              <div class="metaid">MetaID:34c5em</div>
            </div>
          </div>
          <div class="drsc">
            Outside the spring mountains, the master-disciple the crowd, outing in late spring,
            preaching and teaching karma to solve puzzles.
            画意：春山外，春衫短。夫子徒众，暮春踏青，传道授业解惑者也。
          </div>
        </div>
      </div>
      <div class="nft-msg-other">
        <div class="nft-msg-other-item">
          <div class="key">合约地址</div>
          <div class="value">0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec</div>
        </div>
        <div class="nft-msg-other-item">
          <div class="key">TokenID</div>
          <div class="value">0x1dDB2C0897daF18632662E71fdD2dbDC0eB3a9Ec</div>
        </div>
      </div>
      <div class="btn btn-block">上架出售</div>
    </div>
  </ElDialog>

  <!-- 创建系列 -->
  <ElDialog v-model="isShowCreateSeriesModal">
    <div class="create-series">
      <div class="title">{{ $t('createSerieProd') }}</div>
      <div class="drsc">
        {{ $t('createSerieTips') }}
      </div>
      <input type="text" v-model="serie.name" :placeholder="$t('createSeriesNamePlar')" />
      <input type="number" v-model="serie.number" min="0" :placeholder="$t('createSeriesNumberPlar')" />
      <div class="btn btn-block" @click="createSerie">{{ $t('create') }}</div>
    </div>
  </ElDialog>
</template>
<script setup lang="ts">
import {
  ElDialog,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElImage,
ElMessage
} from 'element-plus'
// import ElDatePicker from 'element-plus/lib/el-date-picker'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import { tranfromImgFile } from '@/utils/util'
import { ref, reactive } from '@vue/reactivity'
import { useI18n } from "vue-i18n";
import { CreateNft, GetSeries, NftApiCode, Upload } from '@/api'
import { useStore } from '@/store'
import { router } from '@/router'
import PickerModel from '@/components/PickerModal/PickerModel.vue'
import { nftTypes } from '@/config'


const i18n = useI18n();
const store = useStore()

//分类
const classifies = reactive(['艺术', '运动', '电影'])


const nft: any = reactive({
  nftName: '',
  type: '',
  fileUrl: '',
  coverUrl: '',
  intro: '',
  tx: '',
  classify: [],
})


const isShowClassifyModal = ref(false)

// 0: create by local 1:create by tx
const createTypeIndex = ref(0) 
function changeCreateType () {
  createTypeIndex.value = createTypeIndex.value === 0 ? 1 : 0
}

const dialogVisible = false

let nftName = ref('')
let nftDrsc =  ref('')
let originalFile: MetaFile = reactive({
  base64Data: '',
  BufferData: '',
  hexData: '',
  name: '',
  data_type: ''
})
let coverFile: MetaFile = reactive({
  base64Data: '',
  BufferData: '',
  hexData: '',
  name: '',
  data_type: ''
})



async function originalFileInputChage(e: Event) {
  const input = e.target as HTMLInputElement
  let files = input.files
  if (files) {
    const res = await tranfromImgFile(files[0])
    if (res) {
      originalFile.name = res.name
      originalFile.base64Data = res.base64Data
      originalFile.hexData = res.hexData
      originalFile.name = res.name
      originalFile.raw = res.raw
      originalFile.data_type = res.data_type
      // const response = await store.state.sdk?.createMetaFile({
      //   accessToken: store.state.token!.access_token,
      //   data: {
      //     name: originalFile.name,
      //     data: originalFile.hexData,
      //     encrypt: 1,
      //     data_type: originalFile.data_type
      //   }
      // })
    }
  }
}

async function coverFileInputChage(e: Event) {
  const input = e.target as HTMLInputElement
  let files = input.files
  if (files) {
    const res = await tranfromImgFile(files[0])
    if (res) {
      coverFile.name = res.name
      coverFile.raw = res.raw
      coverFile.base64Data = res.base64Data
      coverFile.hexData = res.hexData
      coverFile.name = res.name
    }
  }
}

//系列
const selectedSeries: { name: string, number: number} [] = reactive([])
const serie = reactive({
  name: '',
  number: ''
})
const isShowCreateSeriesModal = ref(false) 
const isShowSeriesModal = ref(false) 
const series: any []  = reactive([])
async function getSeries () {
  const res = await GetSeries()
  if (res.code === NftApiCode.success) {
    series.length = 0
    series.push(...res.data)
  }
}
function createSerie () {
  debugger
  if (serie.name === '') {
    ElMessage.error(i18n.t('createSeriesNamePlar'))
    return
  }
  if (!serie.number) {
    ElMessage.error(i18n.t('createSeriesNumberPlar'))
    return
  }
  const index = series.findIndex(item => item.name === serie.name)
  if (index !== -1) {
    ElMessage.error(i18n.t('havedSameNameSeries'))
    return
  }
  ElMessage.success(i18n.t('createdSuccess'))
  series.push(JSON.parse(JSON.stringify(serie)))
  serie.name = ''
  serie.number = ''
  isShowCreateSeriesModal.value = false
}
getSeries ()

function removeCover () {
  coverFile.name = ''
  coverFile.base64Data = ''
  coverFile.hexData = ''
  coverFile.name = ''
}

function changeTag (index: number) {
  const value = nftTypes[index].value
  if (nft.type === value) return
  nft.type = value
}

async function createNft () {
  // nft 类型
  if (nft.type === '') {
      ElMessage.warning(i18n.t('nftTypeTips'))
      return
  }

  if (createTypeIndex.value == 0) {
    // 源文件创建
    if (originalFile.name === '') {
      ElMessage.warning(i18n.t('uploadTips'))
      return
    }
  } else {
    // Tx创建
    if (nft.tx === '') {
      ElMessage.warning(i18n.t('txIdTips'))
      return
    }
  }

  // 封面图
  if (coverFile.name === '') {
      ElMessage.warning(i18n.t('uploadcover'))
      return
  }

  // 名称
  if (nft.nftName === '') {
      ElMessage.warning(i18n.t('nameplac'))
      return
  }

  // 描述
  if (nft.intro === '') {
      ElMessage.warning(i18n.t('drscplac'))
      return
  }

  // 分类
  if (nft.classify.length <= 0) {
      ElMessage.warning(i18n.t('chooseserices'))
      return
  }

  

  
  // 上传源文件到阿里云
  const originalFileForm = new FormData()
  originalFileForm.append('file', originalFile.raw)
  const fileUrl = await Upload(originalFileForm)

  // 上传封面图到阿里云
  const coverForm = new FormData()
  coverForm.append('file', coverFile.raw)
  const coverUrl = await Upload(coverForm)
  
  const params = {
    ...nft,
    classify: nft.classify.join(','),
    fileUrl,
    coverUrl,
    tokenId: 'nftId',
    nftId: 'nftId'
  }

  if (selectedSeries.length > 0) {
    const item = series.find(_item => _item.name === selectedSeries[0])
    params.series = item.name
    params.seriesNumber = item.number
  }

  const res = await CreateNft(params)
  
  if (res.code === NftApiCode.success) {
    ElMessage.success(i18n.t('castingsuccess'))
    router.push({ name: 'detail', params: { tokenId: res.data.tokenId }})
  }
}

function confirmClassify () {
  isShowClassifyModal.value = !isShowClassifyModal.value
}

</script>
<style lang="scss" scoped src="./Create.scss"></style>
