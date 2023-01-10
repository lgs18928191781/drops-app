<template>
  <div class="metaname-search-index">
    <div class="metaname-sm-container">
      <SearchWarp :meta-name="metaName" @submit="searchSubmit" />

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

      <div class="result-warp flex flex-align-center disabled">
        <div class="flex1">
          <div class="name">lsongren.meta</div>
          <div class="msg flex flex-align-center">
            <span class="dot"></span>
            <span class="status"
              >{{ $t('MetaName.UnRegistered') }} {{ $t('MetaName.Registered') }}</span
            ><span class="time"
              >,&nbsp;{{ $t('MetaName.Expire date') }}:&nbsp;{{ $t('MetaName.About') }}&nbsp;{{
                $filters.dateTimeFormat('0', 'YYYY-MM-DD hh:MM')
              }}</span
            >
          </div>
        </div>
        <a class="flex flex-align-center"> {{ $t('MetaName.Sign up now') }}</a>
        <RouterLink :to="{ name: 'metaNameMarket' }" class="flex flex-align-center">
          <Icon name="market" /> {{ $t('MetaName.To Market Check') }}</RouterLink
        >
      </div>
    </div>
  </div>

  <ElDialog
    v-model="isShowRegister"
    class="metaname"
    :title="$t('MetaName.Register') + ':' + '&nbsp;lsongren.meta'"
  >
    <div class="metaname-register" v-if="false">
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
        <div class="price">$5</div>
        <div class="label">{{ $t('MetaName.Total Fee') }}</div>
      </div>
      <div class="btn primary">{{ $t('MetaName.Next Step') }}</div>
    </div>

    <PayMsg v-else />
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { payPlatformList } from '@/config'
import { useUserStore } from '@/stores/user'
import { PayPlatform } from '@/enum'
import PayMsg from '../components/PayMsg/PayMsg.vue'
import SearchWarp from '../components/SearchWarp/SearchWarp.vue'
import { useRoute } from 'vue-router'

const i18n = useI18n()
const userStore = useUserStore()
const route = useRoute()
const metaName = ref(route.query.metaName ? (route.query.metaName as string) : '')

const fees = [
  {
    name: () => i18n.t('MetaName.feeCharacter1'),
    price: () => i18n.t('MetaName.Not Yet Open'),
    case: 'ab.meta',
  },
  {
    name: () => i18n.t('MetaName.feeCharacter2'),
    price: () => '$660/年',
    case: 'san.meta',
  },
  {
    name: () => i18n.t('MetaName.feeCharacter3'),
    price: () => '$160/年',
    case: 'jack.meta',
  },
  {
    name: () => i18n.t('MetaName.feeCharacter4'),
    price: () => '$5/年',
    case: 'jonathan.meta',
  },
]
const isShowRegister = ref(false)
const year = ref(1)

const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)

function changePayType(platform: PayPlatform) {
  if (currentPayPlatform.value === platform) return
  currentPayPlatform.value = platform
}

function searchSubmit(data: string) {
  metaName.value = data
  searchMetaName()
}

function searchMetaName() {}

if (route.query.metaName) {
  searchMetaName()
}
</script>

<style lang="scss" scoped src="./Search.scss"></style>
