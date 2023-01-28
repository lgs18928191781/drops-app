<template>
  <ElDrawer
    :model-value="modelValue"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    custom-class="none-padding"
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <div
      v-loading="loading"
      :element-loading-svg="LoadingTEXT"
      :element-loading-text="$t('Loading')"
    >
      <DrawerRightHeader :title="$t('Wallet.Transfer')" @back="emit('update:modelValue', false)" />
      <!-- <header class="flex flex-align-center">
        <Icon name="down" @click="emit('update:modelValue', false)" />
        <div class="title">{{ $t('Wallet.Transfer') }}</div>
      </header> -->

      <div class="content">
        <ElForm :model="form" :rules="rules" :label-position="'top'" ref="FormRef">
          <ElFormItem prop="address" :label="$t('Wallet.Transfer Address')">
            <ElInput
              type="text"
              v-model="form.address"
              :placeholder="$t('Wallet.Enter Transfer Address')"
            />
          </ElFormItem>
          <ElFormItem prop="amount" :label="$t('Wallet.Transfer Amount')">
            <ElInput
              type="number"
              v-model="form.amount"
              :placeholder="$t('Wallet.Enter Transfer Amount')"
              @change="onAmountChange"
            >
              <template #append>
                <el-select
                  v-model="unit"
                  placeholder="Select"
                  style="width: 100px"
                  @change="changeUnit"
                >
                  <el-option :label="item" :value="item" v-for="item in units" />
                </el-select>
              </template>
            </ElInput>
          </ElFormItem>

          <ElFormItem>
            <a
              class="main-border flex1 primary flex flex-align-center flex-pack-center"
              @click="transfer"
              >{{ $t('Wallet.Transfer') }}</a
            >
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import Decimal from 'decimal.js-light'
import { useI18n } from 'vue-i18n'
import DrawerRightHeader from '../DrawerRightHeader/DrawerRightHeader.vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['close', 'update:modelValue'])
const i18n = useI18n()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({
  address: '',
  amount: '',
})
const FormRef = ref()
const units = ['Satoshi', 'Space']
const unit = ref('Satoshi')

const rules = {
  address: [{ required: true, message: i18n.t('Wallet.Enter Transfer Address'), trigger: 'blur' }],
  amount: [
    { required: true, message: i18n.t('Wallet.Enter Transfer Amount'), trigger: 'blur' },
    // {
    //   type: 'number',
    //   asyncValidator: (rule: any, value: number) => {
    //     return new Promise<void>((resolve, reject) => {
    //       if (unit.value === 'Satoshi' && value < 18) {
    //         reject('too young') // reject with error message
    //       } else {
    //         resolve()
    //       }
    //     })
    //   },
    //   trigger: 'blur'
    // },
  ],
}

function changeUnit() {
  if (form.amount === '') return
  if (unit.value === 'Space') {
    form.amount = new Decimal(form.amount).div(Math.pow(10, 8)).toString()
  } else {
    form.amount = new Decimal(form.amount).mul(Math.pow(10, 8)).toString()
  }
}

function onAmountChange() {
  if (unit.value === 'Satoshi') {
    let value = new Decimal(form.amount).toInteger().toNumber()
    if (value <= 0) value = 1
    form.amount = value.toString()
  }
}

function transfer() {
  FormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const value =
        unit.value === 'Satoshi'
          ? new Decimal(form.amount).toNumber()
          : new Decimal(form.amount).mul(Math.pow(10, 8)).toNumber()
      const res = await userStore.showWallet
        .sendMoney([
          {
            amount: value,
            address: form.address,
          },
        ])
        .catch(error => {
          ElMessage.error(error.message)
          loading.value = false
        })
      if (res) {
        FormRef.value.resetFields()
        ElMessage.success(i18n.t('Wallet.Transfer Success'))
        loading.value = false
      }
    }
  })
}

watch(
  () => props.modelValue,
  async () => {
    if (props.modelValue) {
    }
  }
)
</script>

<style lang="scss" scoped src="./Transfer.scss"></style>
