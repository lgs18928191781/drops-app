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
    <div>
      <DrawerRightHeader :title="$t('Wallet.Transfer')" @back="emit('update:modelValue', false)" />

      <div class="content">
        <template v-if="userInfo.val">
          <div class="confirm-info">
            <div class="confirm-info-item flex flex-align-center">
              <div class="label flex1">{{ $t('NFT.Transfer Account') }}</div>
              <div class="value">
                <div class="user flex flex-align-center">
                  <UserAvatar
                    :meta-id="userInfo.val!.metaId"
                    :image="userInfo.val!.avatarImage"
                    :name="userInfo.val!.name"
                    :meta-name="userInfo.val!.metaName"
                    :disabled="true"
                  />
                  <div class="flex1">
                    <template v-if="userInfo.val!.metaId === ''">
                      Address:
                      <div>{{ userInfo.val!.address }}</div>
                    </template>
                    <template v-else>
                      <div class="name">
                        <UserName :name="userInfo.val!.name" :meta-name="userInfo.val!.metaName" />
                      </div>
                      <div class="metaid">MetaID:{{ userInfo.val!.metaId.slice(0,6)}}</div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="confirm-info-item  flex flex-align-center">
              <div class="label flex1">{{ $t('NFT.Amount') }}</div>
              <div class="value" v-if="props.ftInfo?.genesis">
                <span class="amount">
                  {{ form.amount }}
                  {{ props.ftInfo?.ftSymbol }}
                </span>
              </div>
              <div class="value" v-else>
                <span class="amount">
                  {{ unit === TransferUnit.Space ? form.amount : $filters.space(form.amount) }}
                  {{ TransferUnit.Space }}
                </span>
              </div>
            </div>

            <div class="operate flex flex-align-center">
              <a
                class="main-border primary flex1 mr-3 text-center"
                v-loading="loading"
                :element-loading-svg="LoadingTEXT"
                @click="confirmTransfer"
                >{{ $t('NFT.Confirm Transfer Amount') }}</a
              >
              <a
                class="main-border flex1 text-center"
                :class="{ faded: loading }"
                @click="cancel"
                >{{ $t('Cancel') }}</a
              >
            </div>
          </div>
        </template>
        <template v-else>
          <ElForm :model="form" :rules="rules" :label-position="'top'" ref="FormRef">
            <ElFormItem prop="address" :label="$t('Wallet.Transfer Accound')">
              <ElInput
                type="text"
                v-model="form.target"
                placeholder="MetaID/Address/Paymail/MetaName"
                :disabled="loading"
              />
            </ElFormItem>
            <ElFormItem prop="amount" :label="$t('Wallet.Transfer Amount')">
              <ElInput
                type="number"
                v-model="form.amount"
                :placeholder="$t('Wallet.Enter Transfer Amount')"
                @change="onAmountChange"
                :disabled="loading"
              >
                <template #append v-if="!props.ftInfo?.codehash || !props.ftInfo?.genesis">
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
                v-loading="loading"
                :element-loading-svg="LoadingTEXT"
                :element-loading-text="$t('Loading')"
                @click="transfer"
                >{{ $t('Wallet.Transfer') }}</a
              >
            </ElFormItem>
          </ElForm>
        </template>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { NodeName, SdkPayType } from '@/enum'
import { getAccountUserInfo } from '@/utils/util'

const props = defineProps<{
  modelValue: boolean
  ftInfo: ftListType | null
}>()

const emit = defineEmits(['close', 'update:modelValue'])
const i18n = useI18n()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({
  target: '',
  amount: '',
})
const FormRef = ref()
const enum TransferUnit {
  Satoshi = 'Satoshi',
  Space = 'Space',
}
const units = [TransferUnit.Satoshi, TransferUnit.Space]
const unit = ref(TransferUnit.Space)
const userInfo: { val: undefined | UserAllInfo } = reactive({ val: undefined })

const rules = {
  target: [{ required: true, message: i18n.t('Wallet.Enter Transfer Address'), trigger: 'blur' }],
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
  if (props.ftInfo?.genesis) {
    let ftValue = new Decimal(form.amount).toString()
    if (+ftValue <= 0) ftValue = new Decimal(100).toString()
    form.amount = ftValue
  } else if (unit.value === 'Satoshi') {
    let value = new Decimal(form.amount).toInteger().toNumber()
    if (value <= 0) value = 1
    form.amount = value.toString()
  }
}

function transfer() {
  FormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const res = await getAccountUserInfo(form.target).catch(error => {
        ElMessage.error(error.message)
        loading.value = false
      })
      if (res) {
        userInfo.val = res
        loading.value = false
      }
    }
  })
}

async function confirmTransfer() {
  if (loading.value) return
  loading.value = true
  let value
  let res
  if (props.ftInfo?.genesis) {
    value = new Decimal(form.amount).mul(Math.pow(10, props.ftInfo.decimalNum!)).toString()
    res = await userStore.showWallet.createBrfcChildNode(
      {
        nodeName: NodeName.FtTransfer,
        data: JSON.stringify({
          codehash: props.ftInfo.codehash,
          genesis: props.ftInfo.genesis,
          receivers: [
            {
              address: userInfo.val!.address,
              amount: value,
            },
          ],
        }),
      }
      // {
      //   payType: SdkPayType.SPACE,
      // }
    )
  } else {
    value =
      unit.value === TransferUnit.Satoshi
        ? new Decimal(form.amount).toNumber()
        : new Decimal(form.amount).mul(Math.pow(10, 8)).toNumber()
    res = await userStore.showWallet
      .createBrfcChildNode(
        {
          nodeName: NodeName.SendMoney,
          payTo: [
            {
              amount: value,
              address: userInfo.val!.address,
            },
          ],
        },
        {
          payType: SdkPayType.SPACE,
          isTransfer: true,
        }
      )
      .catch(error => {
        ElMessage.error(error.message)
        loading.value = false
      })
  }

  if (res) {
    form.amount = ''
    form.target = ''
    userInfo.val = undefined
    ElMessage.success(i18n.t('Wallet.Transfer Success'))
    loading.value = false
  } else {
    loading.value = false
  }
}

function cancel() {
  if (loading.value) return
  userInfo.val = undefined
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
