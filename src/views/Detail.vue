<template>
  <div class="nft-detail">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <template #template>
        <div class="top flex container">
          <!-- {{ nft.val.coverUrl }} -->
          <ElSkeletonItem class="cover" variant="image" />
          <div class="cont flex1 flex flex-v">
            <div class="name flex flex-align-center">
              <ElSkeletonItem class="text" variant="text" />
              <ElSkeletonItem variant="image" />
            </div>
            <div class="creater-msg">
              <div class="author flex flex-align-center">
                <ElSkeletonItem variant="image" class="avatar" />
                <div class="author-msg flex1">
                  <ElSkeletonItem class="creater" variant="text" />
                  <ElSkeletonItem class="metaid" variant="text" />
                </div>
              </div>
              <CertTemp />
            </div>
            <div class="drsc flex1 flex flex-v">
              <ElSkeletonItem class="title" variant="h1" />
              <div class="cont flex1">
                <ElSkeletonItem variant="text" />
              </div>
            </div>

            <template>
              <div class="timeleft">
                <ElSkeletonItem variant="text" />
              </div>
              <ElSkeletonItem class="btn btn-block" variant="button" />
            </template>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom-warp">
            <div class="tab">
              <ElSkeletonItem variant="text" />
              <ElSkeletonItem variant="text" />
            </div>
            <div class="tab-cont">
              <!-- 作品细节 -->
              <div class="work-deail" v-if="tabIndex === 0">
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-baseline">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex flex-align-baseline">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center" v-if="nft.val.type === '3'">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center" v-else>
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>

                <div class="remark">
                  <div class="remark-item">
                    <ElSkeletonItem variant="text" />
                  </div>
                  <div class="remark-item"><ElSkeletonItem variant="text" /></div>
                  <div class="remark-item"><ElSkeletonItem variant="text" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #default>
        <div class="top flex container">
          <!-- {{ nft.val.coverUrl }} -->
          <el-image
            class="cover flex flex-align-center flex-pack-center"
            :lazy="true"
            :alt="nft.val.nftName"
            :src="nft.val.coverUrl"
            :preview-src-list="[nft.val.coverUrl]"
          >
          </el-image>
          <!-- <img class="cover" :src="nft.val.coverUrl" /> -->
          <div class="cont flex1 flex flex-v">
            <div class="name flex flex-align-center" >
              <span class="text flex1">{{ nft.val.nftName }}</span>
              <img src="@/assets/images/icon_share.svg" :alt="$t('share')" @click="share" />
            </div>
            <div class="creater-msg">
              <div class="author flex flex-align-center">
                <img class="avatar" :src="$filters.avatar(nft.val.foundryMetaId)" />
                <div class="author-msg flex1">
                  <div class="creater">{{ $t('creater') }}: {{ nft.val.foundryName }}</div>
                  <div class="metaid">MetaID:{{ nft.val.foundryMetaId.slice(0, 6) }}</div>
                </div>
              </div>
              <CertTemp @click="toCert" />
            </div>
            <div class="drsc flex1 flex flex-v">
              <div class="title">{{ $t('drsc') }}：</div>
              <div class="cont flex1">
                {{ nft.val.describe }}
              </div>
            </div>

            <template v-if="nft.val.putAway && nft.val.remainingTime > 0">
              <div class="timeleft">
                {{ $t('timeleft') }}：<span>{{ day }}</span
                >{{ $t('day') }}<span>{{ hour }}</span
                >{{ $t('hour') }}<span>{{ minute }}</span
                >{{ $t('minu') }}<span>{{ second }}</span
                >{{ $t('second') }}
              </div>
            </template>
              <!-- <div class="btn btn-block"  @click="buy">{{ $t('use') }} {{ nft.val.amount }} BSV {{ $t('buy') }}</div> -->
              <div
                class="btn btn-block"
                @click="buy"
                v-if="
                  !store.state.userInfo ||
                  (store.state.userInfo && store.state.userInfo.metaId !== nft.val.ownerMetaId)
                "
              >
                {{ i18n.locale.value === 'zh' ? `以 ${price} BSV 购买`: `Buy Now At ${price} BSV`}}
              </div>
              <template
                v-else-if="
                  store.state.userInfo && store.state.userInfo.metaId === nft.val.ownerMetaId
                "
              >
                <div class="btn btn-block btn-plain" v-if="nft.val.putAway" @click="offSale">
                  {{ $t('offsale') }}
                </div>
                <div class="btn btn-block" v-else @click="onSale">{{ $t('sale') }}</div>
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
                >{{ $t(tab.key) }}</a
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
                      <span v-for="item in nft.val.classify.split(',')" :key="item">{{
                        item
                      }}</span>
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
                    <div class="value flex1">{{ $filters.dateTimeFormat(nft.val.forgeTime) }}</div>
                  </div>
                  <div class="work-detail-item flex flex flex-align-baseline">
                    <div class="key">{{ $t('contractaddr') }}：</div>
                    <div class="value flex1 nowrap">
                      {{ nft.val.contractAddress }}
                      <a class="copy" @click="copy(nft.val.contractAddress)">{{ $t('copy') }}</a>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">TokenID：</div>
                    <div class="value flex1 nowrap">
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
                        <img
                          class="avatar"
                          :src="$filters.avatar(nft.val.foundryMetaId)"
                          :alt="nft.val.foundryName"
                        />
                        <div class="author-msg flex1">
                          <div class="creater">{{ nft.val.foundryName }}</div>
                          <div class="metaid">MetaID: {{ nft.val.foundryMetaId.slice(0, 6) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('haveder') }}：</div>
                    <div class="value flex1">
                      <div class="author flex flex-align-center">
                        <img
                          class="avatar"
                          :src="$filters.avatar(nft.val.ownerMetaId)"
                          :alt="nft.val.ownerName"
                        />
                        <div class="author-msg flex1">
                          <div class="creater">{{ nft.val.ownerName }}</div>
                          <div class="metaid">MetaID:{{ nft.val.ownerMetaId.slice(0, 6) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('worktype') }}：</div>
                    <div class="value flex1">
                      {{ nftTypes.find((item) => item.value === nft.val.type)?.name }} 1920*1080PX
                      5.2M
                    </div>
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
                    {{ $t('remark1') }}
                    <!-- <a @click="more">{{ $t('knowmore') }}</a> -->
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
                    <img :src="$filters.avatar(record.metaId)" :alt="record.username" />
                    <span class="name">{{ record.username }}</span>
                  </span>
                  <span class="td role flex1 flex flex-align-center">
                    <img src="@/assets/images/icon_casting.svg" v-if="index === 0" />
                    {{
                      index === 0
                        ? $t('creater')
                        : index === records.length - 1
                        ? $t('haveder')
                        : $t('histsoryowner')
                    }}
                  </span>
                  <span class="td time flex1">{{ $filters.dateTimeFormat(record.ownerTime) }}</span>
                  <span class="td price flex1">{{ record.amount ? new Decimal(record.amount).div(10**8).toString() : '--'}}BSV</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ElSkeleton>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import CertTemp from '@/components/Cert/Cert.vue'
import { useI18n } from 'vue-i18n'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { ElLoading, ElMessage, ElSkeleton, ElSkeletonItem, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
// @ts-ignore
import { BuyNft, GetNftDetail, GetNFTOwnerAddress, NftApiCode, TransactionRecord } from '@/api'
// @ts-ignore
import dayjs from 'dayjs'
import { useStore } from '@/store'
import { nftTypes } from '@/config'
import { checkSdkStatus } from '@/utils/util'
import Decimal from 'decimal.js-light'
import { router } from '@/router'
import NftOffSale from '@/utils/offSale'

const i18n = useI18n()
const route = useRoute()
const store = useStore()
const tabs = [{ name: i18n.t('workdetail'), key: 'workdetail' }, { name: i18n.t('possessionrecord'), key: 'possessionrecord' }]
let tabIndex = ref(0)
const isShowSkeleton = ref(true)

// @ts-ignore
const nft: { val: NftItemDetail } = reactive({
  val: {}
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
        isShowSkeleton.value = false
      }
    }
    resolve()
  })
}

// NFT价格 stas 转 bsv
const price = computed(() => {
  if (nft.val.amount) {
    return new Decimal(nft.val.amount).div(10**8).toString()
  } else {
    return '--'
  }
})

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
function countDownTimeLeft() {
  interval = setInterval(() => {
    if (nft.val.remainingTime) {
      nft.val.remainingTime = nft.val.remainingTime - 1000
      const timeleft = dayjs(nft.val.remainingTime)
      day.value = timeleft.day()
      hour.value = timeleft.subtract(day.value, 'day').hour()
      minute.value = timeleft.subtract(day.value, 'day').subtract(hour.value, 'hour').minute()
      second.value = timeleft
        .subtract(day.value, 'day')
        .subtract(hour.value, 'hour')
        .subtract(minute.value, 'minute')
        .second()
      if (day.value <= 0 && hour.value <= 0 && minute.value <= 0 && second.value <= 0) {
        nft.val.remainingTime = 0
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

function imgError(error: string) {
  console.log(error)
}

function toLink() {
  const url = `${import.meta.env.VITE_WhatsonChain}/tx/${nft.val.tx}`
  window.open(url)
}

function offSale() {
  ElMessageBox.confirm(`${i18n.t('offsaleConfirm')} ${ nft.val.nftName } ?`, i18n.t('niceWarning'))
  .then(async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'full-loading',
    })
    NftOffSale(nft.val)
      .then(() => {
        loading.close()
      })
      .catch(() => {
        loading.close()
      })
  })
}

function onSale() {
  router.push({ name: 'sale', params: { tokenId: nft.val.tokenId } })
}

async function buy() {
  await checkSdkStatus()
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })

  const params = {
    codehash: nft.val.codeHash,
    genesis: nft.val.genesis,
    tokenIndex: nft.val.tokenIndex,
    opreturnData: nft.val.sellTxId,
    genesisTxid: nft.val.genesisTxId,
  }

  const getAddressRes = await GetNFTOwnerAddress({ tokenId: nft.val.tokenId }).catch(() => loading.close())
  debugger
  if (getAddressRes && getAddressRes.code === NftApiCode.success) {
    const res = await store.state.sdk
    ?.buyNFT({
      address: getAddressRes.data.address,
      txId: nft.val.sellTxId,
      amount: nft.val.amount,
      ...params,
    })
    .catch(() => {
      loading.close()
    })
    debugger
    if (res && res.code === 200) {
      // 上链完 nft buy 协议 要 上报服务器
      const response = await BuyNft({
        tokenId: nft.val.tokenId,
        payMentAddress: store.state.userInfo!.address,
        collectionAddress: getAddressRes.data.address,
        payTxId: res.data.txId,
        amount: new Decimal(nft.val.amount).mul(10**8).toNumber()
      }).catch(() => loading.close())
      if (response && response.code === NftApiCode.success) {
        nft.val.ownerMetaId = store.state.userInfo!.metaId
        nft.val.ownerName = store.state.userInfo!.name
        ElMessage.success(i18n.t('buySuccess'))
      }
    }
  }
  loading.close()

  // const response = await store.state.sdk?.nftBuy({
  //   txId: nft.val.sellTxId,
  //   ... params
  // })
  // if (response?.code === 200) {
  //   // 购买完要上链 nft buy 协议
  //   const buyProtocolRes = await store.state.sdk?.createNftBuyProtocol({
  //     txId: response.data.txid,
  //     sellTxId: nft.val.sellTxId,
  //     createdAt: new Date().getTime(),
  //     txHex: response.data.txHex,
  //     satoshisPrice: new Decimal(nft.val.amount).mul(10**8).toString(),
  //     buyerMetaId: store.state.userInfo!.metaId,
  //     ... params
  //   })
  //   if (buyProtocolRes?.code === 200) {
  //     // 上链完 nft buy 协议 要 上报服务器
  //     const res = await BuyNft({
  //       tokenId: nft.val.tokenId,
  //       payMentAddress: store.state.userInfo!.address,
  //       collectionAddress: store.state.userInfo!.address
  //     })
  //     if (res.code === NftApiCode.success) {
  //       ElMessage.success(i18n.t('buySuccess'))
  //     }
  //   }
  // }

  // loading.close()
}

// 分享
function share () {
  const value = `${i18n.t('shareText1')}\r\n ${nft.val.nftName}：${window.location.href}`
  toClipboard(value)
    .then(() => {
      ElMessage.success(i18n.t('copyShareSuccess'))
    })
    .catch(() => {
      ElMessage.success(i18n.t('copyerror'))
    })
}

// 
function toCert () {
  ElMessage.info(i18n.t('stayTuned'))
}

function more () {
  ElMessage.info(i18n.t('stayTuned'))
}
if (route.params.tokenId) {
  getDetail()
  getRecord()
}
</script>
<style lang="scss" scoped src="./Detail.scss"></style>
