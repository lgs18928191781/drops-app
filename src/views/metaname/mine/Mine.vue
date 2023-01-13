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
          />
          <div class="cont flex1">
            <div class="name">{{ userStore.user!.name }}</div>
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
      <div class="title">{{ $t('MetaName.My MetaName') }}</div>
      <div class="content">
        <div
          class="metaname-list"
          v-infinite-scroll="load"
          :infinite-scroll-immediate="false"
          :infinite-scroll-distance="100"
        >
          <ElSkeleton :loading="isSkeleton" animated>
            <div
              class="metaname-item flex "
              v-for="item in list"
              :key="item.codeHash + item.genesis + item.tokenIndex"
            >
              <Image class="cover" :src="item.icon" />
              <div class="cont flex1">
                <div class="name">{{ item.name }}</div>
                <div class="time">
                  {{ $t('MetaName.Expire date') }}:&nbsp;{{ $t('MetaName.About') }}&nbsp;{{
                    $filters.dateTimeFormat(item.expireDate)
                  }}
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
          </ElSkeleton>
        </div>
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

const userStore = useUserStore()
const isShowRenew = ref(false)
const list: MetaNameItem[] = reactive([])
const pagination = reactive({ ...initPagination, flag: '' })
const isSkeleton = ref(true)
const currentMetaName: { val: null | MetaNameItem } = reactive({ val: null })
let blockHeight: any

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
        const result = await GetExpiredUTC(item.expiredBlockHeight, blockHeight).catch(error => {
          ElMessage.error(error.message)
          item.expireDate = '0'
        })
        if (result) {
          item.expireDate = result
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

function load() {}

function refreshDatas() {
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  pagination.flag = ''
  getDatas(true)
}

function renewItem(item: MetaNameItem) {
  currentMetaName.val = item
  isShowRenew.value = true
}

getBlock().then(() => {
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
})
</script>

<style lang="scss" scoped src="./Mine.scss"></style>
