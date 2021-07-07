<template>
  <div class="create flex">
    <img class="icon" src="@/assets/images/icon_casting.svg" />
    <div class="cont-warp flex1">
      <div class="title flex flex-align-center">
        <span class="flex1">{{$t('createnft')}}</span>
        <a @click="changeCreateType">{{ createTypeIndex === 0 ? $t('createbytx') : $t('createbylocal')}}<i class="el-icon-arrow-right" /></a>
      </div>
      <div class="tags">
        <a v-for="(tag,index) in tags" :key="index" :class="{ 'active': tagIndex === index }" @click="changeTag(index)">{{ tag.name }}</a>
      </div>
      <div class="tips">
        {{$t('createtips1')}}<br />
        {{$t('createtips2')}}<br />
        {{$t('createtips3')}}
      </div>
      <!-- txId 铸造 -->
      <div class="create-form-item" v-if="createTypeIndex === 1">
        <div class="title">NFT txId</div>
        <div class="cont">
          <div class="input-warp flex flex-align-center">
            <div class="input-value flex1">
              <input class="flex1"  type="text" :placeholder="$t('txIdTips')" @change="originalFileInputChage" />
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
                  <img class="cover" :src="coverFile.base64Data"  />
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
        <input v-model="nftName" type="text" :placeholder="$t('nameplac')" />
      </div>
      <div class="input-item drsc">
        <textarea v-model="nftDrsc" :placeholder="$t('drscplac')"></textarea>
      </div>
      <div class="input-item type flex flex-align-center">
        <div class="select-warp flex flex-align-center">
          <div class="key flex1">{{$t('choosetype')}}</div>
          <div class="value">
            <span class="placeholder">{{$t('choose')}}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <ElSelect v-model="value" placeholder="请选择">
            <ElOption
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </ElOption>
          </ElSelect>
        </div>
      </div>
      <div class="create-form-item seices">
        <div class="title flex flex-align-center">
          <span class="flex1">{{$t('isserices')}}</span>
          <a>{{$t('whatserices')}}</a>
        </div>
        <div class="cont">
          <div class="input-item flex flex-align-center">
            <div class="select-warp flex flex-align-center">
              <div class="key flex1">{{$t('chooseserices')}}</div>
              <div class="value">
                <span class="placeholder">{{$t('choose')}}</span>
                <i class="el-icon-arrow-right"></i>
              </div>
              <ElSelect v-model="value" placeholder="请选择">
                <ElOption
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </ElOption>
              </ElSelect>
            </div>
          </div>
        </div>
      </div>
      <div class="btn btn-block">{{$t('confirmcreate')}}</div>
    </div>
  </div>

  <div class="create flex">
    <img class="icon" src="@/assets/images/bannet_icon_ins.svg" />
    <div class="cont-warp flex1">
      <div class="title flex flex-align-center">
        <span class="flex1">{{$t('salenft')}}</span>
        <a>{{$t('saledrsc')}}<i class="el-icon-arrow-right" /></a>
      </div>
      <div class="nft-sale-set">
        <div class="msg flex">
          <img class="cover" alt="" />
          <div class="cont flex1 flex flex-v">
            <div class="flex1">
              <div class="name">Saint Sophia</div>
              <div class="msg-item flex flex-align-center">
                <span class="key">{{$t('creater')}}：</span>
                <div class="author value flex flex-align-center">
                  <img class="" alt="" />
                  <span class="username">HamzaKirbas</span>
                </div>
              </div>
              <div class="msg-item flex flex-align-center">
                <span class="key">{{$t('createtime')}}：</span>
                <div class="value">2020-12-30 12:34:20</div>
              </div>
            </div>
            <CertTemp />
          </div>
        </div>
        <div class="form">
          <div class="form-item">
            <!-- <div class="title">时间</div> -->
            <div class="cont flex flex-align-center">
              <input :placeholder="$t('timeplac')" type="datetime" class="flex1" />
              <img class="icon" src="@/assets/images/list_icon_calendar.svg" />
              <ElDatePicker
                class="el-datetime"
                v-model="value1"
                :editable="false"
                type="datetime"
                placeholder="选择日期时间"
              >
              </ElDatePicker>
            </div>
          </div>
          <div class="form-item">
            <!-- <div class="title">价格</div> -->
            <div class="cont flex flex-align-center">
              <input :placeholder="$t('priceplac')" type="number" class="flex1" />
              <div class="type">
                <ElDropdown trigger="click">
                  <span class="flex flex-align-center"> BSV <span class="arrow"></span> </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>BSV</el-dropdown-item>
                      <el-dropdown-item>狮子头</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </ElDropdown>
              </div>
            </div>
          </div>
          <div class="to-histiry">
            <a>{{$t('seehistoryprice')}}</a>
          </div>
        </div>
        <div class="btn btn-block">{{$t('confirmsale')}}</div>
      </div>
    </div>
  </div>

  <div class="my-nft">
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
  </div>

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

  <!-- nft 上架设置modal -->
  <ElDialog v-model="isShowSetModal">
    <div class="nft-sale-set">
      <div class="msg flex flex-align-center">
        <img class="cover" alt="" />
        <div class="cont">
          <div class="name flex1">Saint Sophia</div>
          <div class="msg-item flex flex-align-center">
            <span class="key">铸造者：</span>
            <div class="author flex flex-align-center">
              <img class="" alt="" />
              <span class="username">HamzaKirbas</span>
            </div>
          </div>
          <div class="msg-item flex flex-align-center">
            <span class="key">铸造时间：2020-12-30 12:34:20</span>
            <div class="author flex flex-align-center">
              <img class="" alt="" />
              <span class="username">HamzaKirbas</span>
            </div>
          </div>
        </div>
      </div>
      <div class="form">
        <div class="form-item">
          <div class="title">价格</div>
          <div class="cont flex flex-align-center">
            <input placeholder="设置NFT的价格" type="number" class="flex1" />
            <div class="type">
              <ElDropdown trigger="click">
                <span class="flex flex-align-center"> BSV <span class="arrow"></span> </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>BSV</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </ElDropdown>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="title">时间</div>
          <div class="cont flex flex-align-center">
            <input placeholder="选择NFT上架结束时间" type="datetime" class="flex1" />
            <img class="icon" src="@/assets/images/list_icon_calendar.svg" />
            <ElDatePicker
              class="el-datetime"
              v-model="value1"
              :editable="false"
              type="datetime"
              placeholder="选择日期时间"
            >
            </ElDatePicker>
          </div>
        </div>
      </div>
      <div class="btn btn-block">确认上架</div>
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
} from 'element-plus'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import { tranfromImgFile } from '@/utils/util'
import { ref, reactive } from '@vue/reactivity'
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const tags = [
  { name: '图片'},
  { name: '图片'},
]
const tagIndex = ref(0)

const createTypes = [
  { name: i18n.t('createbylocal')},
  { name: i18n.t('createbytx')},
]

// 0: create by local 1:create by tx
const createTypeIndex = ref(0) 
function changeCreateType () {
  createTypeIndex.value = createTypeIndex.value === 0 ? 1 : 0
}

const dialogVisible = false
const isShowSetModal = true

let nftName = ref('')
let nftDrsc =  ref('')
let originalFile: ImageFile = reactive({
  base64Data: '',
  BufferData: '',
  hexData: '',
  name: '',
  type: ''
})
let coverFile: ImageFile = reactive({
  base64Data: '',
  BufferData: '',
  hexData: '',
  name: '',
  type: ''
})

// {
//   base64Data: '',
//   BufferData: '',
//   hexData: '',
//   name: '',
//   type: ''
// }

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
      coverFile.base64Data = res.base64Data
      coverFile.hexData = res.hexData
      coverFile.name = res.name
    }
  }
}

function removeCover () {
  coverFile.name = ''
  coverFile.base64Data = ''
  coverFile.hexData = ''
  coverFile.name = ''
}

function changeTag (index: number) {
  if (tagIndex.value === index) {
    return
  }
  tagIndex.value = index
}
</script>
<style lang="scss" scoped src="./Create.scss"></style>
