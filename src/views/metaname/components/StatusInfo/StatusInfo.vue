<template>
  <div class="search-register">
    <div class="metaname-sm-container">
      <Navigation :list="navigation" />

      <ElSkeleton :loading="isSkeleton" animated>
        <Image
          class="metaname-card"
          :src="metaName.val ? `metacontract://${metaName.val!.nftCodeHash}/${metaName.val!.genesisId}/${metaName.val!.tokenIndex}` : $route.params.metaFile as string"
        />

        <div class="tips" v-if="order.val!.status !== 3">
          {{
            type === MetaNameOperateType.Register
              ? $t('MetaName.RegisteringTips')
              : $t('MetaName.RenewingTips')
          }}
        </div>

        <div class="tips success" v-else>
          {{
            type === MetaNameOperateType.Register
              ? $t('MetaName.RegisterSuccessTips') +
                name +
                '.metaid ' +
                $t('MetaName.RegisterSuccessTips2')
              : $t('MetaName.RenewSuccessTips') +
                name +
                '.metaid ' +
                $t('MetaName.RenewSuccessTips2')
          }}
        </div>

        <div class="status" v-if="order.val!.status !== 3">
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
        <div class="success-warp" v-else>
          <!-- <div class="top flex flex-algin-center">
            <span class="label flex1">${{ order.val!.pay_amount }}</span>
          </div> -->
          <div class="list">
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Registration time') }}</span>
              </div>
              <span class="value">
                <template v-if="isGetRegisterDateLoading">
                  <ElIcon class="is-loading">
                    <Loading />
                  </ElIcon>
                </template>
                <template v-else>{{ $filters.dateTimeFormat(registerDate) }} (UTC)</template>
              </span>
            </div>
            <div class="info-item flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('MetaName.Expire date') }}</span>
              </div>
              <span class="value flex flex-align-center">
                <template v-if="isGetExpireDateLoading">
                  <ElIcon class="is-loading">
                    <Loading />
                  </ElIcon>
                </template>
                <template v-else>{{ expireDate }} (UTC)</template>
                <el-tooltip
                  class="pre-line"
                  :content="$t('MetaName.Expire date Tips')"
                  placement="top"
                >
                  <Icon name="question_circle" />
                </el-tooltip>
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-align-center operat">
          <RouterLink :to="{ name: 'metaNameSearch' }" class="flex1">
            <PlainBtnVue>
              {{ $t('MetaName.Continue to register other domain names') }}
            </PlainBtnVue>
          </RouterLink>
          <RouterLink
            :to="{ name: 'mineMetaName', params: { metaName: metaName.val!.name } }"
            class="btn primary flex1"
            v-if="order.val?.status === 3 && metaName.val"
            >{{ $t('MetaName.Look MetaName') }}</RouterLink
          >
        </div>
      </ElSkeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import PlainBtnVue from '../PlainBtn/PlainBtn.vue'
import Navigation from '../Navigation/Navigation.vue'
import { GetMetaNameInfo, GetOrder } from '@/api/wxcore'
import { MetaNameOperateType } from '@/enum'
import { GetExpiredUTC, loopExecution, loopExecutionRun } from '@/utils/util'
import { GetTx } from '@/api'
import { error } from 'console'

interface Props {
  orderId: string
  platform: string
  productType: string
  navigation: string[]
  type: MetaNameOperateType
  name: string
}
const props = withDefaults(defineProps<Props>(), {})

const i18n = useI18n()
const route = useRoute()

const status = ref(0)
const metaName: { val: null | MetaNameIndexerInfo } = reactive({ val: null })
const isSkeleton = ref(true)
const order: { val: null | Order } = reactive({ val: null })
let intervar: NodeJS.Timeout
const isGetRegisterDateLoading = ref(true)
const isGetExpireDateLoading = ref(true)
const expireDate = ref('')
const registerDate = ref(0)

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
    name: () => i18n.t('MetaName.Locked') + ' ' + props.name,
    value: 2,
  },
  {
    name: () => i18n.t('MetaName.Register') + ' ' + props.name,
    value: 2,
  },
  {
    name: () =>
      i18n.t('MetaName.Confirm uniq') + ' ' + props.name + ' ' + i18n.t('MetaName.is uniqueness'),
    value: 2,
  },
  {
    name: () =>
      props.type === MetaNameOperateType.Register
        ? i18n.t('MetaName.Register Success')
        : i18n.t('MetaName.Renew Success'),
    value: 3,
  },
]

function getMetaName() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetMetaNameInfo(props.name).catch(error => {
      reject(error)
    })
    if (res) {
      if (res.registerState === 2) {
        reject(new Error(i18n.t('MetaName.Issueing')))
      } else {
        metaName.val = res
        resolve()
      }
    }
  })
}

function getOrder() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetOrder({
      order_id: props.orderId,
      pay_type: props.platform,
      product_type: props.productType,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      order.val = res.data
      if (order.val!.status === 3) {
        await getMetaName()
        getTimeInfo()
      }

      if (order.val!.status >= 3) {
        clearInterval(intervar)
      }
      resolve()
    }
  })
}

function getTimeInfo() {
  setTimeout(async () => {
    const expiredBlockTime = GetExpiredUTC(metaName.val!.expiredBlockTime)
    if (expiredBlockTime) {
      expireDate.value = expiredBlockTime!
      isGetExpireDateLoading.value = false
    } else {
      ElMessage.error(`${i18n.t('getExpiredTimeFail')}`)
    }

    const res: any = await loopExecution(GetTx, metaName.val!.txid).catch(error => {
      ElMessage.error(error.message)
    })
    if (res) {
      registerDate.value = res.txDetail.timestamp * 1000
      isGetRegisterDateLoading.value = false
    }
  }, 3000)
}

if (props.name) {
  const list =
    props.type === MetaNameOperateType.Register ? [getOrder()] : [getMetaName(), getOrder()]
  Promise.all(list).then(() => {
    getOrder().then(async () => {
      isSkeleton.value = false
      if (order.val!.status < 3) {
        intervar = setInterval(() => {
          getOrder()
        }, 3000)
      }
      if (order.val!.status === 3) {
        if (!metaName.val) {
          await loopExecutionRun({
            fun: getMetaName,
          }).catch(error => {
            ElMessage.error(error.message)
          })
        }
        getTimeInfo()
      }
    })
  })
}

onUnmounted(() => {
  clearInterval(intervar)
})
</script>

<style lang="scss" scoped src="./StatusInfo.scss"></style>
