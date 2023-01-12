<template>
  <div class="search-register">
    <div class="metaname-sm-container">
      <Navigation
        :list="[$t('MetaName.Search'), $t('MetaName.Register'), $t('MetaName.Registering')]"
      />

      <ElSkeleton :loading="isSkeleton" animated>
        <Image class="metaname-card" :src="($route.params.metaFile as string)" />

        <div class="tips">{{ $t('MetaName.RegisteringTips') }}</div>

        <div class="status">
          <div
            class="status-item flex flexa-alignc-center"
            v-for="(item, index) in statusList"
            :key="index"
            :class="{ active: order.val!.status >= item.value &&  order.val!.status < 4}"
          >
            <div class="index">{{ index + 1 }}.</div>
            <div class="label flex1">{{ item.name() }}</div>
            <div
              class="check-warp flex flex-align-center flex-pack-center"
              v-if="status >= item.value"
            >
              <Icon name="check" />
            </div>
            <ElIcon class="is-loading" v-if="item.value === order.val!.status + 1">
              <Loading />
            </ElIcon>
          </div>

          <!-- error -->
          <div class="status-item  error flex flexa-alignc-center" v-if="order.val!.status >= 4">
            <div class="index">*</div>
            <div class="label flex1">{{ errorMsg[order.val!.status]() }}</div>
            <div class="check-warp flex flex-align-center flex-pack-center ">
              <Icon name="x_mark" />
            </div>
          </div>
        </div>

        <RouterLink :to="{ name: 'metaNameSearch' }">
          <PlainBtnVue>
            {{ $t('MetaName.Continue to register other domain names') }}
          </PlainBtnVue>
        </RouterLink>
      </ElSkeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import PlainBtnVue from '../components/PlainBtn/PlainBtn.vue'
import Navigation from '../components/Navigation/Navigation.vue'
import { GetMetaNameIsRegister } from '@/api/metaname'
import { GetOrder } from '@/api/wxcore'

const i18n = useI18n()
const route = useRoute()

const status = ref(0)
const metaName: { val: null | MetaNameSearchResult } = reactive({ val: null })
const isSkeleton = ref(true)
const order: { val: null | Order } = reactive({ val: null })
let intervar: NodeJS.Timeout

const errorMsg = {
  4: () => i18n.t('MetaName.error1'),
  5: () => i18n.t('MetaName.error2'),
  6: () => i18n.t('MetaName.error3'),
  7: () => i18n.t('MetaName.error4'),
  10: () => i18n.t('MetaName.error5'),
  11: () => i18n.t('MetaName.error6'),
  12: () => i18n.t('MetaName.error7'),
  13: () => i18n.t('MetaName.error8'),
  14: () => i18n.t('MetaName.error9'),
}

const statusList = [
  {
    name: () => i18n.t('MetaName.Confirm Collect Money'),
    value: 2,
  },
  {
    name: () => i18n.t('MetaName.Locked') + ' ' + route.params.metaName,
    value: 2,
  },
  {
    name: () => i18n.t('MetaName.Register') + ' ' + route.params.metaName,
    value: 2,
  },
  {
    name: () =>
      i18n.t('MetaName.Confirm') +
      ' ' +
      route.params.metaName +
      ' ' +
      i18n.t('MetaName.is uniqueness'),
    value: 2,
  },
  {
    name: () => i18n.t('MetaName.Register Success'),
    value: 3,
  },
]

function getMetaName() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetMetaNameIsRegister(route.params.metaName as string).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      metaName.val = res.data
      resolve()
    }
  })
}

function getOrder() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetOrder({
      order_id: route.params.orderId as string,
      pay_type: route.params.platform as string,
      product_type: route.params.productType as string,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      order.val = res.data
      resolve()
    }
  })
}

if (route.params.metaName) {
  getOrder().then(() => {
    isSkeleton.value = false
    if (order.val!.status < 3) {
      intervar = setInterval(() => {
        getOrder()
      }, 3000)
    }
  })
  // getMetaName().then(() => {})
}

onUnmounted(() => {
  clearInterval(intervar)
})
</script>

<style lang="scss" scoped src="./Register.scss"></style>
