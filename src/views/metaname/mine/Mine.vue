<template>
  <div class="metaname-sm-container">
    <div class="mine-section">
      <div class="title">{{ $t('MetaName.Currently Connected Wallet') }}</div>
      <div class="content">
        <div class="current-wallet flex flex-align-center">
          <UserAvatar
            :meta-id="userStore.user!.metaId"
            :image="userStore.user!.avatarImage"
            :name="userStore.user!.name"
            :metaName="userStore.user!.metaName"
          />
          <div class="cont flex1">
            <div class="name">
              <UserName :name="userStore.user!.name" :meta-name="userStore.user!.metaName" />
            </div>
            <div class="metaid">
              {{ userStore.user!.metaId.slice(0, 6) }}...{{ userStore.user!.metaId.slice(-6) }}
            </div>
          </div>
          <!-- <PlainBtnVue>
            {{ $t('MetaName.Switch Wallet') }}
          </PlainBtnVue> -->
        </div>
      </div>
    </div>

    <div class="mine-section">
      <div class="title">
        <a
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ active: item.value === tabActive }"
          @click="changeTab(item.value)"
        >
          {{ item.name() }}
        </a>
      </div>
      <div class="content">
        <template v-if="tabActive === MetaNameMineTabvalue.MyMetaName">
          <div
            class="metaname-list"
            v-infinite-scroll="load"
            :infinite-scroll-immediate="false"
            :infinite-scroll-distance="100"
          >
            <ElSkeleton :loading="isSkeleton" animated>
              <div
                class="metaname-item flex "
                v-for="item in list.filter(_item => _item.name && _item.expiredBlockTime)"
                :key="item.codeHash + item.genesis + item.tokenIndex"
              >
                <Image class="cover" :src="item.icon" />
                <div class="cont flex1">
                  <div class="name flex flex-align-center">
                    <span>{{ item.name }}</span
                    >.metaid
                  </div>
                  <div :class="[remindExpired(item.expireDate) ? 'waringTime' : 'time']">
                    {{
                      remindExpired(item.expireDate)
                        ? $t('MetaName.ReadyExpire')
                        : $t('MetaName.Expire date')
                    }}:&nbsp;{{ $t('MetaName.About') }}&nbsp;{{
                      $filters.dateTimeFormat(item.expireDate, 'UTC')
                    }}(UTC)
                  </div>
                  <div class="operate flex flex-align-center flex-pack-end">
                    <a class="btn primary" @click="renewItem(item)">
                      {{ $t('MetaName.Domain Renewal') }}</a
                    >
                    <RouterLink
                      :to="{ name: 'mineMetaName', params: { metaName: item.name || '1' } }"
                    >
                      <PlainBtnVue>
                        {{ $t('MetaName.Configure domain name') }}
                      </PlainBtnVue>
                    </RouterLink>
                  </div>
                </div>
              </div>

              <IsNull v-if="list.length === 0" />
              <LoadMore v-else :pagination="pagination" />
            </ElSkeleton>
          </div>
        </template>
        <template v-else>
          <div class="order-list">
            <div class="order-item" v-for="(item, index) in orders" :key="index">
              <div class="metaname">
                <span class="key">MetName:</span><span class="value">{{ item.name }}</span>
              </div>
              <div class="order_id">
                <span class="key">{{ $t('MetaName.OrderId') }}:</span
                ><span class="value">{{ item.order_id }}</span>
              </div>
              <div class="status">
                <span class="key">{{ $t('MetaName.OrderStatus') }}:</span
                ><span class="value">{{
                  item.state === 2 ? $t('MetaName.Registering') : $t('MetaName.RegisterFail')
                }}</span>
              </div>
            </div>
            <IsNull v-if="orders.length <= 0" />
          </div>
        </template>
      </div>
    </div>
  </div>

  <RenewModal
    v-model="isShowRenew"
    v-if="currentMetaName.val"
    :metaname="currentMetaName.val!.name"
    :expire-date="currentMetaName.val.expireDate"
    :metafile="currentMetaName.val.icon"
    @success="refreshDatas"
  />
</template>

<script setup lang="ts">
import { getBlockHeight } from '@/api'
import { GetUserMetaNames } from '@/api/aggregation'
import { initPagination } from '@/config'
import { useUserStore } from '@/stores/user'
import { GetExpiredUTC } from '@/utils/util'
import { reactive, ref } from 'vue'
import PlainBtnVue from '../components/PlainBtn/PlainBtn.vue'
import RenewModal from '../components/RenewModal/RenewModal.vue'
import { remindExpired } from '@/utils/util'
import IsNull from '@/components/IsNull/IsNull.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import { useI18n } from 'vue-i18n'
import { GetMetaNameOrders } from '@/api/wxcore'

const userStore = useUserStore()
const isShowRenew = ref(false)
const list: MetaNameItem[] = reactive([])
const pagination = reactive({ ...initPagination, flag: '' })
const isSkeleton = ref(true)
const currentMetaName: { val: null | MetaNameItem } = reactive({ val: null })
const orders: MetaNameOder[] = reactive([])
let blockHeight: any

const i18n = useI18n()
enum MetaNameMineTabvalue {
  MyMetaName = 0,
  Order = 1,
}
const tabs = [
  {
    name: () => i18n.t('MetaName.My MetaName'),
    value: MetaNameMineTabvalue.MyMetaName,
  },
  {
    name: () => i18n.t('MetaName.My Order'),
    value: MetaNameMineTabvalue.Order,
  },
]
const tabActive = ref(MetaNameMineTabvalue.MyMetaName)

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetUserMetaNames({
      address: userStore.user!.address,
      ...pagination,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      if (isCover) list.length = 0
      pagination.flag = res.data.nextFlag
      if (!pagination.flag) pagination.nothing = true
      for (let item of res.data.results.items) {
        const result = GetExpiredUTC(item.expiredBlockTime || 0)
        if (result) {
          item.expireDate = result
        } else {
          item.expireDate = '0'
        }
      }
      list.push(...res.data.results.items)
      resolve()
    }
  })
}

function getBlock() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await getBlockHeight().catch(error => {
      ElMessage.error(error.message)
    })
    if (res) {
      blockHeight = res
      resolve()
    }
  })
}

function load() {
  if (isSkeleton.value || pagination.loading || pagination.nothing) return
  pagination.page++
  pagination.loading = true
  getDatas().then(() => {
    pagination.loading = false
  })
}

function refreshDatas() {
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  pagination.flag = ''
  getDatas(true)
}

function renewItem(item: MetaNameItem) {
  if (userStore.metaletLogin) {
    return ElMessage.error(`${i18n.t('metaname_not allow_renew')}`)
  }
  currentMetaName.val = item
  isShowRenew.value = true
}

async function changeTab(value: MetaNameMineTabvalue) {
  if (tabActive.value === value) return
  tabActive.value = value
  if (tabActive.value === MetaNameMineTabvalue.Order) {
    const res = await GetMetaNameOrders(userStore.user!.metaId).catch(error => {
      ElMessage.error(error.message)
    })
    if (res) {
      orders.length = 0
      orders.push(...res.data)
    }
  }
}

getBlock().then(() => {
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
})
</script>

<style lang="scss" scoped src="./Mine.scss"></style>
