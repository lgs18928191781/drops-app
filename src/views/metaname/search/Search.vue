<template>
  <div class="metaname-search-index">
    <div class="metaname-sm-container">
      <SearchWarp :meta-name="metaName" @submit="searchSubmit" v-loading="loading" />

      <div class="fee-warp">
        <div class="title">{{ $t('MetaName.Annual registration fee') }}</div>
        <div class="fee-list">
          <div class="fee-item th flex flex-align-center">
            <span class="flex1">{{ $t('MetaName.Character') }}</span>
            <span class="price">{{ $t('MetaName.Price') }}</span>
            <span class="flex1 case">{{ $t('MetaName.Case') }}</span>
          </div>
          <div class="fee-item flex flex-align-center" v-for="(item, index) in fees" :key="index">
            <span class="flex1">{{ item.name() }}</span>
            <span class="price">{{ item.price() }}</span>
            <span class="flex1 case">{{ item.case }}</span>
          </div>
        </div>
      </div>

      <div
        class="result-warp flex flex-align-center"
        :class="{ disabled: metaNameInfo.val && metaNameInfo.val.expiredBlockTime !== -1 }"
        v-if="metaNameInfo.val"
      >
        <div class="flex1 cont">
          <div class="name">{{ metaNameInfo.val!.name }}</div>
          <div class="msg flex flex-align-center">
            <span class="dot"></span>
            <span class="status">{{
              metaNameInfo.val.expiredBlockTime === -1
                ? $t('MetaName.UnRegistered')
                : $t('MetaName.Registered')
            }}</span
            ><span class="time" v-if="metaNameInfo.val.expiredBlockTime !== -1"
              >,&nbsp;{{ $t('MetaName.Expire date') }}:&nbsp;
              <template v-if="isGetExpireDateLoading">
                <ElIcon class="is-loading">
                  <Loading />
                </ElIcon>
              </template>
              <template v-else> {{ $t('MetaName.About') }}&nbsp;{{ expireDate }}(UTC) </template>
            </span>
          </div>
        </div>
        <a
          class="flex flex-align-center"
          v-if="metaNameInfo.val.expiredBlockTime === -1"
          @click="isShowRegister = true"
        >
          {{ $t('MetaName.Sign up now') }}</a
        >
        <RouterLink :to="{ name: 'metaNameMarket' }" class="flex flex-align-center" v-else>
          <Icon name="market" /> {{ $t('MetaName.To Market Check') }}</RouterLink
        >
      </div>
    </div>
  </div>

  <ElDialog
    v-model="isShowRegister"
    class="metaname"
    :title="metaNameInfo.val ? $t('MetaName.Register') + ':' + ' ' + metaNameInfo.val!.name : ''"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :show-close="!submitLoading"
  >
    <div v-loading="submitLoading">
      <div class="metaname-register" v-if="!isNextStep">
        <div class="year flex flex-align-center">
          <div class="title flex1">{{ $t('MetaName.Registration period') }}</div>
          <div class="count flex flex-align-center">
            <a
              class="flex flex-align-center flex-pack-center"
              @click="year > 1 ? (year = year - 1) : ''"
              >-</a
            >
            <span class="value">{{ year }} {{ $t('MetaName.Year') }}</span>
            <a @click="year = year + 1" class="flex flex-align-center flex-pack-center">+</a>
          </div>
        </div>

        <div class="amount">
          <div class="price">${{ totalPrice }}</div>
          <div class="label">{{ $t('MetaName.Total Fee') }}</div>
        </div>
        <div class="btn primary" @click="isNextStep = true">{{ $t('MetaName.Next Step') }}</div>
      </div>

      <template v-else>
        <template v-if="metaNameInfo.val">
          <PayMsg
            :name="metaNameInfo.val!.name"
            @back="isNextStep = false"
            :price="totalPrice"
            :year="year"
            :type="MetaNameReqCode.register"
            v-model:loading="submitLoading"
            @success="onPaySuceess"
          />
        </template>
      </template>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { payPlatformList } from '@/config'
import { useUserStore } from '@/stores/user'
import { PayPlatform } from '@/enum'
import PayMsg from '../components/PayMsg/PayMsg.vue'
import SearchWarp from '../components/SearchWarp/SearchWarp.vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { GetMetaNameIsRegister } from '@/api/metaname'
import { bytesLength, GetExpiredUTC, getMetaNamePrice, urlToBase64 } from '@/utils/util'
import Decimal from 'decimal.js-light'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import { Loading } from '@element-plus/icons-vue'
import { MetaNameAllPrice } from '@/api/wxcore'
import { useMetaNameStore } from '@/stores/metaname'

const i18n = useI18n()
const userStore = useUserStore()
const route = useRoute()
const metaName = ref(route.query.metaName ? (route.query.metaName as string) : '')
const metaNameInfo: { val: null | MetaNameSearchResult } = reactive({ val: null })
const metaNameStore = useMetaNameStore()

const fees = [
  {
    name: () => i18n.t('MetaName.feeCharacter1'),
    price: () => i18n.t('MetaName.Not Yet Open'),
    case: 'ab.meta',
  },
  {
    name: () => i18n.t('MetaName.feeCharacter2'),
    price: () => `$${metaNameStore.MetaNameFeePerYear.third}/${i18n.t('MetaName.Year')}`,
    case: 'san.meta',
  },
  {
    name: () => i18n.t('MetaName.feeCharacter3'),
    price: () => `$${metaNameStore.MetaNameFeePerYear.four}/${i18n.t('MetaName.Year')}`,
    case: 'jack.meta',
  },
  {
    name: () => i18n.t('MetaName.feeCharacter4'),
    price: () => `$${metaNameStore.MetaNameFeePerYear.five}/${i18n.t('MetaName.Year')}`,
    case: 'jonathan.meta',
  },
]
const isShowRegister = ref(false)
const year = ref(1)
const loading = ref(false)
const isNextStep = ref(false)
const expireDate = ref('')
const isGetExpireDateLoading = ref(false)
const submitLoading = ref(false)

const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)

const totalPrice = computed(() => {
  let result = 0
  if (metaNameInfo.val) {
    const price = getMetaNamePrice(metaNameInfo.val!.name)
    result = new Decimal(price).mul(year.value).toNumber()
  }
  return result
})

function changePayType(platform: PayPlatform) {
  if (currentPayPlatform.value === platform) return
  currentPayPlatform.value = platform
}

function searchSubmit(data: string) {
  metaName.value = data
  searchMetaName()
}

function searchMetaName() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetMetaNameIsRegister(metaName.value).catch(error => {
      if (error.code === 1) {
        metaNameInfo.val = {
          name: metaName.value,
          expiredBlockTime: -1,
          nftCodeHash: '',
          genesisId: '',
          tokenIndex: '',
          resolver: '',
        }
      } else {
        ElMessage.error(error.message)
      }
      resolve()
    })
    if (res?.code == 0) {
      metaNameInfo.val = res.data
      isGetExpireDateLoading.value = true
      getExporeDate().then(() => {
        isGetExpireDateLoading.value = false
      })
      resolve()
    }
  })
}

function onPaySuceess() {
  isShowRegister.value = false
  metaName.value = ''
  metaNameInfo.val = null
}

function getExporeDate() {
  return new Promise<void>(async (resolve, reject) => {
    const res = GetExpiredUTC(metaNameInfo.val!.expiredBlockTime)
    if (res) {
      expireDate.value = res
      resolve()
    } else {
      reject()
    }
  })
}

if (route.query.metaName) {
  loading.value = true
  searchMetaName().then(() => {
    loading.value = false
  })
}
</script>

<style lang="scss" scoped src="./Search.scss"></style>
