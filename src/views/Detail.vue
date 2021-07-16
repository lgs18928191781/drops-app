<template>
  <div class="nft-detail">
    <div class="top flex container">
      <!-- {{ nft.val.coverUrl }} -->
      <el-image
        class="cover"
        fit="cover"
        :lazy="true"
        :alt="nft.val.nftName"
        :src="nft.val.coverUrl"
        :preview-src-list="[nft.val.coverUrl]">
      </el-image>
      <!-- <img class="cover" :src="nft.val.coverUrl" /> -->
      <div class="cont flex1 flex flex-v">
        <div class="name flex flex-align-center">
          <span class="text flex1">{{ nft.val.nftName }}</span>
          <img src="@/assets/images/icon_share.svg" alt="分享" />
        </div>
        <div class="creater-msg">
          <div class="author flex flex-align-center">
            <img class="avatar" :src="$filters.avatar(nft.val.foundryMetaId)" />
            <div class="author-msg flex1">
              <div class="creater">{{ $t('creater') }}: {{ nft.val.foundryName }}</div>
              <div class="metaid">MetaID:{{ nft.val.foundryMetaId.slice(0, 6) }}</div>
            </div>
          </div>
          <CertTemp />
        </div>
        <div class="drsc flex1 flex flex-v">
          <div class="title">{{ $t('drsc') }}：</div>
          <div class="cont flex1">
            {{ nft.val.describe }}
          </div>
        </div>

        <template v-if="nft.val.putAway && nft.val.remainingTime > 0">
          <div class="timeleft">
            {{ $t('timeleft') }}：<span>{{ day }}</span>{{ $t('day') }}<span>{{ hour }}</span>{{ $t('hour')
            }}<span>{{ minute }}</span>{{ $t('minu') }}<span>{{ second }}</span>{{ $t('second') }}
          </div>
          <!-- <div class="btn btn-block"  @click="buy">{{ $t('use') }} {{ nft.val.amount }} BSV {{ $t('buy') }}</div> -->
          <div class="btn btn-block" v-if="!store.state.userInfo || (store.state.userInfo && store.state.userInfo.metaId !== nft.val.ownerMetaId)" @click="buy">{{ $t('use') }} {{ nft.val.amount }} BSV {{ $t('buy') }}</div>
        </template>
      </div>
    </div>

    <div class="bottom">
      <div class="bottom-warp">
        <div class="tab">
          <a
            :class="{ active: index === tabIndex }"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="changeTabIndex(index)"
            >{{ tab.name }}</a
          >
        </div>
        <div class="tab-cont">
          <!-- 作品细节 -->
          <div class="work-deail" v-if="tabIndex === 0">
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{ $t('workname') }}：</div>
                <div class="value flex1">{{ nft.val.nftName }}</div>
              </div>
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{ $t('workclass') }}：</div>
                <div class="value flex1">
                  <span v-for="item in nft.val.classify.split(',')" :key="item">{{ item }}</span>
                </div>
              </div>
              <div class="work-detail-item flex flex-align-baseline">
                <div class="key">{{ $t('workdrsc') }}：</div>
                <div class="value flex1">
                  {{ nft.val.describe }}
                </div>
              </div>
            </div>
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{ $t('createtime') }}：</div>
                <div class="value flex1">{{ nft.val.forgeTime }}</div>
              </div>
              <div class="work-detail-item flex flex flex-align-baseline">
                <div class="key">{{ $t('contractaddr') }}：</div>
                <div class="value flex1">
                  {{ nft.val.contractAddress }}
                  <a class="copy" @click="copy(nft.val.contractAddress)">{{ $t('copy') }}</a>
                </div>
              </div>
              <div class="work-detail-item flex flex-align-center">
                <div class="key">TokenID：</div>
                <div class="value flex1">
                  {{ nft.val.tokenId }}
                  <a class="copy" @click="copy(nft.val.tokenId)">{{ $t('copy') }}</a>
                </div>
              </div>
            </div>
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{ $t('creater') }}：</div>
                <div class="value flex1">
                  <div class="author flex flex-align-center">
                    <img class="avatar" :src="$filters.avatar(nft.val.foundryMetaId)" :alt="nft.val.foundryName" />
                    <div class="author-msg flex1">
                      <div class="creater">{{ $t('creater') }}: {{ nft.val.foundryName }}</div>
                      <div class="metaid">MetaID: {{ nft.val.foundryMetaId.slice(0, 6) }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{ $t('haveder') }}：</div>
                <div class="value flex1">
                  <div class="author flex flex-align-center">
                    <img class="avatar" :src="$filters.avatar(nft.val.ownerMetaId)" :alt="nft.val.ownerName" />
                    <div class="author-msg flex1">
                      <div class="creater">{{ $t('creater') }}: {{ nft.val.ownerName }}</div>
                      <div class="metaid">MetaID:{{ nft.val.ownerMetaId.slice(0, 6) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="work-deail-section">
              <div class="work-detail-item flex flex-align-center">
                <div class="key">{{ $t('worktype') }}：</div>
                <div class="value flex1">{{ nftTypes.find(item => item.value === nft.val.type)?.name }} 1920*1080PX 5.2M</div>
              </div>
              <div class="work-detail-item flex flex-align-center" v-if="nft.val.type === '3'">
                <div class="key">{{ $t('histroyrevenue') }}：</div>
                <div class="value flex1">
                  {{ nft.val.revenue }} BSV <a @click="toLink">{{ $t('workdetaillink') }}</a>
                </div>
              </div>
              <div class="work-detail-item flex flex-align-center" v-else>
                <div class="key">{{ $t('worklink') }}：</div>
                <div class="value flex1">
                  <a class="link" @click="toLink">{{ $t('workdetaillink') }}</a>
                </div>
              </div>
            </div>

            <div class="remark">
              <div class="remark-item">
                {{ $t('remark1') }}<a>{{ $t('knowmore') }}</a>
              </div>
              <div class="remark-item">{{ $t('remark2') }}</div>
              <div class="remark-item">{{ $t('remark3') }}</div>
            </div>
          </div>

          <!-- 拥有记录 -->
          <div class="haved-record" v-else-if="tabIndex === 1">
            <div class="tr th flex flex-align-center">
              <span class="td flex1">{{ $t('owner') }}</span>
              <span class="td flex1">{{ $t('role') }}</span>
              <span class="td flex1">{{ $t('time') }}</span>
              <span class="td flex1">{{ $t('price') }}</span>
            </div>
            <div
              class="tr flex flex-align-center"
              v-for="(record, index) in records"
              :key="record.ownerTime"
            >
              <span class="td flex1 user flex flex-align-center">
                <img :src="record.headUrl" :alt="record.username" />
                <span class="name">{{ record.username }}</span>
              </span>
              <span class="td role flex1 flex flex-align-center flex-pack-center">
                {{
                  index === 0
                    ? $t('creater')
                    : index === records.length - 1
                    ? $t('histsoryowner')
                    : $t('haveder')
                }}
              </span>
              <span class="td time flex1">{{ $filters.dateTimeFormat(record.ownerTime) }}</span>
              <span class="td price flex1">{{ record.amount }}BSV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import CertTemp from '@/components/Cert/Cert.vue'
import { useI18n } from 'vue-i18n'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
// @ts-ignore
import { BuyNft, GetNftDetail, NftApiCode, TransactionRecord } from '@/api'
import * as dayjs from 'dayjs'
import { useStore } from '@/store'
import { nftTypes } from '@/config'
import { checkSdkStaut } from '@/utils/util'

const i18n = useI18n()
const route = useRoute()
const store = useStore()
const tabs = [{ name: i18n.t('workdetail') }, { name: i18n.t('possessionrecord') }]
let tabIndex = ref(0)

const nft: { val: NftItemDetail } = reactive({
  val: {
    foundryName: 'string',
    foundryMetaId: 'string',
    foundryHead: 'string',
    amount: 0,
    remainingTime: 0,
    nftName: 'string',
    classify: 'string',
    describe: 'string',
    forgeTime: 0,
    contractAddress: 'string',
    tokenId: 'string',
    ownerName: 'string',
    ownerMetaId: 'string',
    ownerHead: 'string',
    type: 'string',
    revenue: 'string',
    coverUrl: '',
    tx: '',
    putAway: false,
  },
})


function getDetail() {
  return new Promise<void>(async (resolve) => {
    if (typeof route.params.tokenId === 'string') {
      const res = await GetNftDetail({
        tokenId: route.params.tokenId,
      })
      if (res.code === NftApiCode.success) {
        nft.val = res.data
        countDownTimeLeft()
      }
    }
    resolve()
  })
}

const records: TransactionRecordItem[] = reactive([])
function getRecord() {
  return new Promise<void>(async (resolve) => {
    if (typeof route.params.tokenId === 'string') {
      const res = await TransactionRecord({
        tokenId: route.params.tokenId,
      })
      if (res.code === NftApiCode.success) {
        records.length = 0
        records.push(...res.data)
      }
    }
    resolve()
  })
}

function changeTabIndex(index: number) {
  if (tabIndex.value === index) {
    return
  }
  tabIndex.value = index
}

function copy(value: string) {
  toClipboard(value)
    .then(() => {
      ElMessage.success(i18n.t('copysuccess'))
    })
    .catch(() => {
      ElMessage.success(i18n.t('copyerror'))
    })
}

let interval: NodeJS.Timeout
const day = ref(0)
const hour = ref(0)
const minute = ref(0)
const second = ref(0)
function countDownTimeLeft () {
  interval = setInterval(() => {
    if (nft.val.remainingTime){
      nft.val.remainingTime = nft.val.remainingTime - 1000
      const timeleft = dayjs(nft.val.remainingTime)
      day.value = timeleft.day()
      hour.value = timeleft.subtract(day.value, 'day').hour()
      minute.value = timeleft.subtract(day.value, 'day').subtract(hour.value, 'hour').minute()
      second.value = timeleft.subtract(day.value, 'day').subtract(hour.value, 'hour').subtract(minute.value, 'minute').second()
      if(day.value <= 0 && hour.value <= 0 && minute.value <= 0 &&  second.value <= 0) {
        nft.val.remainingTime = 0
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

function imgError (error: string) {
  console.log(error)
  debugger
}

function toLink () {
  const url = `${import.meta.env.VITE_WhatsonChain}/tx/${nft.val.tx}`
  window.open(url)
}

async function buy () {
  checkSdkStaut()
  const res = await BuyNft({
    tokenId: nft.val.tokenId,
    payMentAddress: store.state.userInfo!.address,
    collectionAddress: store.state.userInfo!.address
  })
  if (res.code === NftApiCode.success) {
    debugger
    ElMessage.success(i18n.t('buySuccess'))
  }
}

if (route.params.tokenId) {
  getDetail()
  getRecord()
}
</script>
<style lang="scss" scoped src="./Detail.scss"></style>
