<template>
  <ElSkeleton :loading="isSkeleton" animated class="container">
    <div class="pay-resullt flex flex-align-center flex-pack-center">
      <ElResult
        :icon="status === PayStatus.Success ? 'success' : 'error'"
        :title="status === PayStatus.Success ? '支付成功' : '支付失败'"
        :sub-title="amonut ? `ShowPayLimited: ￥${new Decimal(amonut).div(100).toFixed(2)}` : ''"
      >
        <template #extra>
          <ElButton type="primary" @click="confirm">确认</ElButton>
        </template>
      </ElResult>
    </div>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { PayPlatform, PayStatus } from '@/enum'
import { router } from '@/router'
import { alertCatchError, checkOrderStatus } from '@/utils/util'
import { ElMessage } from 'element-plus'
import { decode } from 'js-base64'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Decimal from 'decimal.js-light'

const route = useRoute()
const status = ref(PayStatus.Ing)
const isSkeleton = ref(true)
const amonut = ref(0)
let uuidMsg = {
  isBlindbox: false,
  form: '',
  payPlatform: PayPlatform.UnionPay,
}

function confirm() {
  if (self !== top) {
    // iframe 中
    window.parent.postMessage(
      {
        status: status.value,
      },
      '*'
    )
    window.close()
  } else {
    const form = uuidMsg.form
    if (form) {
      router.replace(form as string)
    } else {
      router.replace('/')
    }
  }
}

function checkOrder() {
  return new Promise<void>(async resolve => {
    const res = await checkOrderStatus({
      orderId: route.query.orderId as string,
      payPlatform: uuidMsg.payPlatform,
      isBilinbox: uuidMsg.isBlindbox,
    }).catch(error => {
      alertCatchError(error)
      resolve()
    })
    if (res) {
      status.value = res.status
      if (res.amount) amonut.value = res.amount
    }
    resolve()
  })
}

if (route.query.orderId && route.query.uuid) {
  uuidMsg = JSON.parse(sessionStorage.getItem(route.query.uuid as string)!)
  checkOrder().then(() => {
    isSkeleton.value = false
  })
} else {
  ElMessage.error('orderId为空')
}
</script>

<style lang="scss" scoped src="./Result.scss"></style>
