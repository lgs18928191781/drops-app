<template>
  <ElDialog
    :model-value="modelValue"
    :title="$t('MetaName.Renew') + ': ' + metaname"
    class="metaname"
    @close="emit('update:modelValue', false)"
    :close-on-click-modal="false"
    :show-close="!loading"
  >
    <div v-loading="loading">
      <div class="renew" v-if="!isShowPayMsg">
        <div class="year section">
          <div class="label">{{ $t('MetaName.Renewal time') }}</div>
          <div class="count flex flex-align-center flex-pack-center">
            <a
              class="flex flex-align-center flex-pack-center"
              @click="year > 1 ? (year = year - 1) : ''"
              >-</a
            >
            <span class="value">{{ year }} {{ $t('MetaName.Year') }}</span>
            <a class="flex flex-align-center flex-pack-center" @click="year = year + 1">+</a>
          </div>
        </div>

        <div class="fee section flex flex-align-center">
          <div class="flex1">
            <span class="label">{{ $t('MetaName.Renewal Fee') }}</span>
          </div>
          <span class="value"
            ><span class="amount">${{ totalPrice }}</span></span
          >
        </div>

        <div class="fee section flex flex-align-center">
          <div class="flex1">
            <span class="label">{{ $t('MetaName.Expiration time after renewal') }}</span>
          </div>
          <span class="value flex flex-align-center"
            >{{ $t('MetaName.About') }}&nbsp;{{ $filters.dateTimeFormat(time) }} (UTC)
            <el-tooltip class="pre-line" :content="$t('MetaName.Expire date Tips')" placement="top">
              <Icon name="question_circle" />
            </el-tooltip>
          </span>
        </div>

        <div class="btn primary" @click="isShowPayMsg = true">
          {{ $t('MetaName.Next Step') }}
        </div>
      </div>

      <PayMsg
        :price="totalPrice"
        :year="year"
        :name="metaname"
        :type="MetaNameReqCode.renew"
        :metafile="metafile"
        v-model:loading="loading"
        v-if="isShowPayMsg"
        @back="isShowPayMsg = false"
        @success="onSuccess"
      />
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { getMetaNamePrice } from '@/utils/util'
import Decimal from 'decimal.js-light'
import PayMsg from '../PayMsg/PayMsg.vue'
import { MetaNameReqCode } from '@/utils/wallet/hd-wallet'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
  metaname: string
  expireDate: string | number
  metafile: string
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:modelValue', 'success'])
const year = ref(1)
const isShowPayMsg = ref(false)
const i18n = useI18n()
const loading = ref(false)

const time = computed(() => {
  return dayjs(props.expireDate || '')
    .add(year.value, 'year')
    .valueOf()
})

const totalPrice = computed(() => {
  const price = getMetaNamePrice(props.metaname)
  return new Decimal(price).mul(year.value).toNumber()
})

function onSuccess() {
  emit('success')
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped src="./RenewModal.scss"></style>
