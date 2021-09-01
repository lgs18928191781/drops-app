<template>
  <div class="create">
    <div class="create-header flex flex-align-center">
      <img class="icon" src="@/assets/images/icon_casting.svg" />
      <div class="title flex1 flex flex-align-center">
        <span class="flex1">{{ $t('createNft') }}</span>
        <a @click="changeCreateType"
          >{{ createTypeIndex === 0 ? $t('createbytx') : $t('createbylocal')
          }}<i class="el-icon-arrow-right"></i
        ></a>
      </div>
    </div>
    <div class="cont-warp">
      <div class="tags" v-if="createTypeIndex !== 1">
        <template v-for="(type, index) in _nftTypes">
          <template v-if="type.disabled">
            <ElTooltip effect="dark" :content="$t('stayTuned')" placement="top">
              <a :class="{ active: type.value === nft.type }" @click="changeTag(index)">{{
                $t(type.key)
              }}</a>
            </ElTooltip>
          </template>
          <template v-else>
            <a
              :class="{ active: type.value === nft.type, disabled: type.disabled }"
              @click="changeTag(index)"
              >{{ $t(type.key) }}</a
            >
          </template>
        </template>
      </div>
      <div class="tips">
        <template v-if="createTypeIndex === 1">{{ $t('nftTxidTips') }} <br /></template>
        <template v-if="nft.type === '1'"> {{ $t('nftImageDrsc') }}<br /> </template>
        <template v-if="nft.type === '3'">
          {{ $t('nftCopyrightDrsc') }}<br />
          {{ $t('nftCopyrightDrsc2') }}<br />
        </template>
        {{ $t('createtips2') }}<br />
        {{ $t('createtips3') }}
      </div>
      <!-- txId 铸造 -->
      <div class="create-form-item" v-if="createTypeIndex === 1 || nft.type === '3'">
        <div class="title">TXID</div>
        <div class="cont">
          <div class="input-warp flex flex-align-center">
            <div class="input-value flex1">
              <input
                class="flex1"
                v-model="nft.tx"
                type="text"
                @blur="checkTxIdStatus"
                :placeholder="$t('txIdTips')"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 源文件 铸造 -->
      <div class="create-form-item" v-else-if="createTypeIndex === 0 && nft.type !== '3'">
        <div class="title">{{ $t('nftoriginal') }}</div>
        <div class="cont">
          <div class="input-warp flex flex-align-center">
            <div class="input-value flex1">
              <span v-if="originalFile && originalFile.name !== ''">{{ originalFile?.name }}</span>
              <span class="placeholder" v-else>{{ $t('uploadTips') }}</span>
            </div>
            <img src="@/assets/images/file_upload.svg" />
            <input class="flex1" accept="image/*" type="file" @change="originalFileInputChage" />
          </div>
        </div>
      </div>
      <!-- 封面图 -->
      <div class="create-form-item">
        <div class="title">{{ $t('nftbase') }}</div>
        <div class="cont">
          <div class="upload-warp">
            <div class="upload">
              <div class="add flex flex-align-center flex-pack-center">
                <template v-if="coverFile && coverFile.name !== ''">
                  <ElImage
                    class="cover"
                    fit="cover"
                    :src="coverFile.base64Data"
                    :preview-src-list="[coverFile.base64Data]"
                  />
                  <!-- <img class="cover" :src="coverFile.base64Data"  /> -->
                  <a class="close" @click="removeCover">{{ $t('delete') }}</a>
                </template>
                <template v-else>
                  <div>
                    <img class="icon" src="@/assets/images/img_upload.svg" />
                    <div class="label">{{ $t('uploadcover') }}</div>
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
      <div
        class="input-item type flex flex-align-center"
        @click="isShowClassifyModal = true; isShowSeriesModal = false "
      >
        <div class="select-warp flex flex-align-center">
          <div class="key flex1">{{ $t('choosetype') }}</div>
          <div class="value">
            <span v-if="nft.classify.length > 0">{{ nft.classify.join(',') }}</span>
            <span v-else class="placeholder">{{ $t('choose') }}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <PickerModel
            name="classify"
            listKey="classify"
            :title="$t('choosetype')"
            :multiple="true"
            disabled="disabled"
            :visible="isShowClassifyModal"
            @confirm="isShowClassifyModal = false"
            :list="classifyList"
            :selecteds="nft.classify"
          />
        </div>
      </div>

      <!-- 系列 -->
      <div class="create-form-item seices">
        <div class="title flex flex-align-center">
          <span class="flex1">{{ $t('isserices') }}</span>
          <ElPopover
            placement="top-start"
            style="word-wrap: break-word; word-break: break-all"
            :width="200"
            trigger="hover"
            :content="$t('whatNftSeies')"
          >
            <template #reference>
              <a>{{ $t('whatserices') }}</a>
            </template>
          </ElPopover>
        </div>
        <div class="cont">
          <div
            class="input-item flex flex-align-center"
            @click="isShowSeriesModal = true; isShowClassifyModal = false"
          >
            <div class="select-warp flex flex-align-center">
              <div class="key flex1">{{ $t('chooseserices') }}</div>
              <div class="value">
                <span v-if="selectedSeries.length > 0">{{ selectedSeries[0] }}</span>
                <span v-else class="placeholder">{{ $t('choose') }}</span>
                <i class="el-icon-arrow-right"></i>
              </div>
              <PickerModel
                name="series"
                listKey="series"
                :title="$t('chooseserices')"
                :visible="isShowSeriesModal"
                @confirm="isShowSeriesModal = false"
                :list="series"
                :selecteds="selectedSeries"
              >
                <template v-slot:item="{ item }">
                  <span>{{ item.currentNumber }}/{{ item.maxNumber }}</span>
                </template>
                <template v-slot:bottom>
                  <div
                    class="btn btn-block create-series-btn"
                    @click="isShowCreateSeriesModal = true"
                  >
                    {{ $t('createSerie') }}
                  </div>
                </template>
              </PickerModel>
            </div>
          </div>
        </div>
      </div>

      <div class="btn btn-block" @click="createNft">{{ $t('confirmcreate') }}</div>
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

  <!-- 创建系列 -->
  <ElDialog v-model="isShowCreateSeriesModal">
    <div class="create-series">
      <div class="title">{{ $t('createSerieProd') }}</div>
      <div class="drsc">
        {{ $t('createSerieTips') }}
      </div>
      <input type="text" v-model="serie.name" :placeholder="$t('createSeriesNamePlar')" />
      <input
        type="number"
        v-model="serie.number"
        min="0"
        :placeholder="$t('createSeriesNumberPlar')"
      />
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
  ElMessage,
  ElLoading,
  ElTooltip,
  ElPopover,
  ElMessageBox,
} from 'element-plus'

import { checkSdkStatus, tranfromImgFile } from '@/utils/util'
import { ref, reactive } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'
import {
  CreateNft,
  CreateSerice,
  GetClassies,
  GetMyNftSummaryList,
  GetSeries,
  GetTxData,
  GetTxStatus,
  NftApiCode,
  Upload,
} from '@/api'
import { useStore } from '@/store'
import { router } from '@/router'
import PickerModel from '@/components/PickerModal/PickerModel.vue'
import { nftTypes, classifyList } from '@/config'
// import { IssueNFTResData, SdkGenesisNFTRes } from '@/typings/sdk'

const _nftTypes = reactive(nftTypes)

const i18n = useI18n()
const store = useStore()

//分类
// const classifies = reactive([])
// async function getClassifies() {
//   const res = await GetClassies()
//   if (res.code === NftApiCode.success) {
//     const disabledClassify = ['纪念卡', '别名', '头像', '权益']
//     classifies.length = 0
//     for (let i = 0; i < disabledClassify.length; i++) {
//       const index = res.data.findIndex((_item) => _item.classify === disabledClassify[i])
//       if (index !== -1) {
//         res.data[index].disabled = true
//       }
//     }
//     // @ts-ignore
//     classifies.push(...res.data)
//   }
// }

// getClassifies()

const nft = reactive({
  nftName: '',
  type: '1',
  fileUrl: '',
  coverUrl: '',
  intro: '',
  tx: '',
  classify: [],
})

const isShowClassifyModal = ref(false)

// 0: create by local 1:create by tx
const createTypeIndex = ref(0)
function changeCreateType() {
  createTypeIndex.value = createTypeIndex.value === 0 ? 1 : 0
  
}

const dialogVisible = false

let originalFile: MetaFile = reactive({
  base64Data: '',
  BufferData: '',
  hexData: '',
  name: '',
  data_type: '',
  raw: null,
})
let coverFile: MetaFile = reactive({
  base64Data: '',
  BufferData: '',
  hexData: '',
  name: '',
  data_type: '',
  raw: null,
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
      originalFile.raw = res.raw
      originalFile.data_type = res.data_type
    }
  }
}

async function coverFileInputChage(e: Event) {
  const input = e.target as HTMLInputElement
  let files = input.files
  if (files) {
    const res = await tranfromImgFile(files[0])
    if (res) {
      console.log(res.hexData)
      coverFile.name = res.name
      coverFile.raw = res.raw
      coverFile.base64Data = res.base64Data
      coverFile.hexData = res.hexData
      coverFile.data_type = res.data_type
    }
  }
}

//系列
const selectedSeries: string[] = reactive([])
const serie = reactive({
  name: '',
  number: '',
})
const isShowCreateSeriesModal = ref(false)
const isShowSeriesModal = ref(false)
const series: any[] = reactive([])


// async function getSeries() {
//   const res = await GetMyNftSummaryList({ Page: '1', PageSize: '99', Address: store.state.userInfo!.address })
//   if (res.code === 0) {
//     if (res.data.results.items.length > 0) {
//       res.data.results.items.map(item => {
//         if (item.nftSeriesName && item.nftSeriesName !== '') {
//           series.push({
//             series: item.nftSeriesName && item.nftSeriesName !== '' ? item.nftSeriesName : item.nftName,
//             maxNumber: item.nftTotalSupply,
//             currentNumber: item.nftMyPendingCount,
//             codeHash: item.nftCodehash,
//             genesis:  item.nftGenesis,
//             genesisTxId: item.genesisTxId,
//             sensibleId:  item.nftSensibleId
//           })
//         }
//       })
//     }
//     debugger
//   }
// }

async function getSeries() {
  const res = await GetSeries({ page: 1, pageSize: 99 })
  if (res.code === NftApiCode.success) {
    series.length = 0
    series.push(...res.data)
  }
}

//  创建系列
async function createSerie() {
  if (serie.name === '') {
    ElMessage.error(i18n.t('createSeriesNamePlar'))
    return
  }
  if (!serie.number) {
    ElMessage.error(i18n.t('createSeriesNumberPlar'))
    return
  }
  const index = series.findIndex((item) => item.name === serie.name)
  if (index !== -1) {
    ElMessage.error(i18n.t('havedSameNameSeries'))
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })

  const response = await store.state.sdk?.genesisNFT({
    seriesName: serie.name,
    nftTotal: serie.number
  })
  if (response && response.code === 200) {
    const res = await CreateSerice({
      name: serie.name,
      count: parseInt(serie.number),
      codeHash: response.data.codehash,
      genesis: response.data.genesisId,
      genesisTxId: response.data.genesisTxid,
      sensibleId: response.data.sensibleId,
    })
    if (res.code === NftApiCode.success) {
      ElMessage.success(i18n.t('createdSuccess'))
      series.push({
        series: serie.name,
        maxNumber: serie.number,
        currentNumber: 0,
        codeHash: response.data.codehash,
        genesis: response.data.genesisId,
        genesisTxId: response.data.genesisTxid,
        sensibleId: response.data.sensibleId
      })
      serie.name = ''
      serie.number = ''
      isShowCreateSeriesModal.value = false
    }
  }
  loading.close()
}
getSeries()

function removeCover() {
  coverFile.name = ''
  coverFile.base64Data = ''
  coverFile.hexData = ''
  coverFile.name = ''
}

function changeTag(index: number) {
  if (createTypeIndex.value === 1) return
  const type = nftTypes[index]
  if (type.disabled) return
  const value = type.value
  if (nft.type === value) return
  nft.type = value
}

// 检测txId是否可以铸造
async function checkTxIdStatus() {
  const result = await checkTxId()
  if (result.status === TxIdStatus.NotCreate) {
    nft.tx = ''
    ElMessage.error(i18n.t('txidToNftFaile'))
  } else if (result.status === TxIdStatus.NotOwner) {
    nft.tx = ''
    ElMessage.error(i18n.t('txIdNotOwner'))
  } else if (result.status === TxIdStatus.NotRightTxId) {
    nft.tx = ''
    ElMessage.error(i18n.t('notRightTxId'))
  } else if (result.status === TxIdStatus.Success) {
    if (result.data){
      // MetaFile
    if (result.data.parentNodeName === 'MetaFile') {
        nft.type = '1'
      } else if (result.data.parentNodeName === 'MetaAccessContent') {
        nft.type = '3'
        nft.nftName = result.data.data.title
        nft.intro = result.data.data.artMark
        coverFile = result.data.data.artCover
      } else {
        nft.tx = ''
        ElMessage.error(i18n.t('txidToNftFaile'))
      }
    }
  }
}

const enum TxIdStatus {
  NotCreate = 1,
  NotOwner = 2,
  Success = 3,
  NotRightTxId = 4
}

async function checkTxId () {
  return new Promise<{
    status: TxIdStatus,
    data?: any
  }>(async resolve => {
    const response = await GetTxData(nft.tx)
      if (response.code == 200 && response.result.data.length > 0) {
        const data = response.result.data[0]

        // check user owner 
        if (data.rootTxId === store.state.userInfo?.metaId) {
          if (nft.type === '3' && createTypeIndex.value !== 1) {
            if (data.parentNodeName !== 'MetaAccessContent') {
              resolve({
                status: TxIdStatus.NotRightTxId,
                data
              })
            } else {
              resolve({
                status: TxIdStatus.Success,
                data
              })
            }
          } else {
            resolve({
              status: TxIdStatus.Success,
              data
            })
          }
        } else {
          resolve({
            status: TxIdStatus.NotOwner,
            data
          })
        }
      } else {
        resolve({
          status: TxIdStatus.NotCreate
        })
      }
      /* const res = await GetTxStatus({
        txId: nft.tx,
      })
      if (res.code === NftApiCode.success) {
        
      } else {
        resolve({
          status: TxIdStatus.NotCreate
        })
      } */
  })
}

// ElLoading.service({
//         lock: true,
//         text: 'Loading',
//         spinner: 'el-icon-loading',
//         background: 'rgba(0, 0, 0, 0.7)',
//         customClass: 'full-loading'
//     })

async function createNft() {
  await checkSdkStatus()

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

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  
  let seriesIndex = -1
  if (selectedSeries[0]) {
    seriesIndex = series.findIndex(item => item.series === selectedSeries[0])
  }

  const params = {
    receiverAddress: store.state.userInfo!.address, //  创建者接收地址
    nftname: nft.nftName,
    nftdesc: nft.intro,
    nfticon: {
        fileType: coverFile.data_type,
        fileName: coverFile.name,
        data: coverFile.hexData,
    },
    nftwebsite: '',
    nftissuerName: store.state.userInfo!.name,
    content: {
      nftType: nft.type,
      classifyList: JSON.stringify(nft.classify),
      originalFileTxid: {
        fileType: originalFile.data_type,
        fileName: originalFile.name,
        data: originalFile.hexData,
      },
      contentTxId: nft.tx
    },
    codeHash: seriesIndex !== -1 ? series[seriesIndex].codeHash : undefined,
    genesis: seriesIndex !== -1 ? series[seriesIndex].genesis : undefined,
    genesisTxId: seriesIndex !== -1 ? series[seriesIndex].genesisTxId : undefined,
    sensibleId: seriesIndex !== -1 ? series[seriesIndex].sensibleId : undefined
  }
  debugger
  const useAmount = await await store.state.sdk
    ?.createNFT({
      checkOnly: true,
      ...params,
    })
    .catch(() => {
      loading.close()
    })

  const userBalanceRes = await store.state.sdk?.getBalance()
  if (userBalanceRes && userBalanceRes.code === 200 && typeof useAmount === 'number' && userBalanceRes.data.satoshis > useAmount) {
    ElMessageBox.confirm(`${i18n.t('useAmountTips')}: ${useAmount} SATS`, i18n.t('niceWarning'), {
      confirmButtonText: i18n.t('confirm'),
      cancelButtonText: i18n.t('cancel'),
      closeOnClickModal: false
    }).then(async () => {
      // 余额足够且确认支付
      const res = await store.state.sdk?.createNFT(params).catch(() => {
        loading.close()
      })
      debugger
      if (res && typeof res !== 'number') {
        /* ElMessage.success(i18n.t('castingsuccess'))
        router.replace({ name: 'createSuccess', 
          params: { 
            genesisId: res.genesisId,
            tokenIndex: res.tokenIndex,
            codehash: res.codehash,
          }
        }) */


        // 上传源文件到阿里云
        // const originalFileForm = new FormData()
        // originalFileForm.append('file', originalFile.raw ? originalFile.raw : '')
        // const fileUrl = await Upload(originalFileForm)

        // 上传封面图到阿里云
        // const coverForm = new FormData()
        // coverForm.append('file', coverFile.raw ? coverFile.raw : '')
        // const coverUrl = await Upload(coverForm)
        const params = {
          nftName: nft.nftName,
          intro: nft.intro,
          type: nft.type,
          seriesName: selectedSeries[0],
          tx: res.txId,
          classify: nft.classify.join(','),
          fileUrl: 'test',
          coverUrl: 'test',
          tokenId: res.genesisId + res.tokenIndex,
          nftId: res.txId,
          codeHash: res.codehash,
          genesis: res.genesisId,
          genesisTxId: res.genesisTxid,
          tokenIndex: res.tokenIndex,
        }
        const response = await CreateNft(params)
        if (response.code === NftApiCode.success) {
          ElMessage.success(i18n.t('castingsuccess'))
          router.replace({ name: 'nftSuccess', 
            params: { 
              genesisId: res.genesisId,
              tokenIndex: res.tokenIndex,
              codehash: res.codehash,
            },
            query: {
              type: 'created',
              txId: res.txId
            }
          })
        }
      }
      if (loading) {
        loading.close()
      }
    })
    .catch(() => loading.close())
  } else {
    loading.close()
    if (typeof useAmount === 'number') {
      ElMessageBox.alert(`
        <p>${i18n.t('useAmountTips')}: ${useAmount} SATS</p>
        <p>${i18n.t('insufficientBalance')}</p>
      `, {
          confirmButtonText: i18n.t('confirm'),
          dangerouslyUseHTMLString: true
      })
    }
    return
  }
}


</script>
<style lang="scss" scoped src="./Create.scss"></style>
