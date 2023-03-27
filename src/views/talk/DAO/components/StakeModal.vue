<template>
  <Modal
    :modelValue="modelValue"
    :extraCloseEvent="() => (isSkeleton = true)"
    @update:modelValue="val => emit('update:modelValue', val)"
    :loading="loading"
  >
    <template #title>{{ $t('DAO.Stake') }}</template>
    <template #body>
      <ElSkeleton :loading="isSkeleton" animated>
        <div class="stake">
          <div class="stake-amount">
            <div class="title flex flex-align-center">
              <div class="flex1">
                <span class="label">{{ $t('DAO.Stake amount') }}</span>
              </div>
              <a class="balance" @click="percentage = 100"
                >{{ balance }} {{ talk.activeCommunity!.dao!.governanceSymbol.toUpperCase() }}</a
              >
            </div>
            <div class="amount-percent">
              <div class="percent-numer">{{ percentage }}%</div>
              <div class="percent-line">
                <el-slider v-model="percentage" @change="onPercentChange" />
              </div>
              <div class="percent-options flex flex-align-center">
                <a
                  class="flex1"
                  v-for="option in options"
                  :key="option.value"
                  :class="{ active: percentage === option.value }"
                  @click="
                    () => {
                      percentage = option.value
                      onPercentChange()
                    }
                  "
                  >{{ option.name }}</a
                >
              </div>
            </div>

            <div class="amount-number flex flex-align-center">
              <div class="label">
                {{ talk.activeCommunity?.dao?.governanceSymbol }}
              </div>
              <ElInput v-model="amountNumber" type="number" @change="onAmountChange" />
            </div>

            <div
              class="main-border"
              :class="[amountNumber > 0 ? 'primary' : 'faded']"
              @click="stake"
            >
              {{ $t('DAO.Stake') }}
            </div>
          </div>
        </div>
      </ElSkeleton>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { GetStake, Pledge } from '@/api/dao'
import Modal from '@/components/Modal/Modal.vue'
import { Chains, DAOStakeOperate, NodeName, SdkPayType } from '@/enum'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { getBalance } from '@/utils/util'
import Decimal from 'decimal.js-light'
import { val } from 'dom7'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])

const talk = useTalkStore()
const userStore = useUserStore()
const i18n = useI18n()

const balance = ref(0)
const options = [
  { name: '25%', value: 25 },
  { name: '50%', value: 50 },
  { name: '75%', value: 75 },
  { name: 'MAX', value: 100 },
]
const symbols = [
  {
    symbol: 'space',
    rate: Math.pow(10, 8),
    toFixed: 8,
  },
]

const amountNumber = ref(0)
const percentage = ref(0)
const isSkeleton = ref(true)
const loading = ref(false)

const currentSymbol = computed(() => {
  return symbols.find(item => item.symbol === talk.activeCommunity?.dao?.governanceSymbol)
})

function getBlance() {
  return new Promise<void>(async (resolve, reject) => {
    const chains: any = {
      space: Chains.MVC,
    }
    // @ts-ignore
    const res = await getBalance({ chain: chains[talk.activeCommunity!.dao!.governanceSymbol] })
    if (typeof res === 'number') {
      if (res) {
        const item = symbols.find(
          _item => _item.symbol === talk.activeCommunity!.dao!.governanceSymbol
        )
        balance.value = new Decimal(
          new Decimal(res).div(item!.rate).toFixed(item?.toFixed)
        ).toNumber()
      }

      resolve()
    }
  })
}

function onPercentChange() {
  if (balance.value) {
    amountNumber.value = new Decimal(balance.value)
      .mul(percentage.value)
      .div(100)
      .toNumber()
  } else {
    amountNumber.value = 0
  }
}

function onAmountChange() {
  if (balance.value) {
    percentage.value = new Decimal(balance.value)
      .div(amountNumber.value)
      .mul(100)
      .toInteger()
      .toNumber()
  } else {
    percentage.value = 0
  }
}

async function stake() {
  if (!amountNumber.value) return
  loading.value = true
  try {
    const stakeRes = await GetStake({
      symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${talk.activeCommunity!.dao!.daoId}`,
      address: userStore.user!.address!,
      op: DAOStakeOperate.Pledge,
    })
    if (stakeRes.code === 0) {
      const amount = new Decimal(amountNumber.value)
        .mul(currentSymbol.value!.rate)
        .toInteger()
        .toNumber()
      const result = await userStore.showWallet.createBrfcChildNode(
        {
          nodeName: NodeName.SendMoney,
          payTo: [
            {
              address: stakeRes.data.mvcToAddress,
              amount: new Decimal(amount)
                .add(stakeRes.data.txFee)
                .toInteger()
                .toNumber(),
            },
          ],
        },
        {
          payType: SdkPayType.SPACE,
          isBroadcast: false,
        }
      )
      if (result) {
        if (result.payToAddress?.transaction) {
          await userStore.showWallet.wallet?.provider.broadcast(
            result.payToAddress?.transaction.toString()
          )
        }
        const res = await Pledge({
          symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${
            talk.activeCommunity!.dao!.daoId
          }`,
          requestIndex: stakeRes.data.requestIndex,
          mvcRawTx: result.sendMoney.transaction.toString(),
          mvcOutputIndex: 0,
          mvcAddAmount: amount,
        })

        if (res.code === 0) {
          ElMessage.success(i18n.t('DAO.Pledge successful'))
          emit('update:modelValue', false)
          percentage.value = 0
          amountNumber.value = 0
          loading.value = false
        }
      } else if (result === null) {
        loading.value = false
      }
    }
  } catch (error) {
    ElMessage.error((error as any).message)
    loading.value = false
  }
}

watch(
  () => props.modelValue,
  result => {
    if (result) {
      getBlance().then(() => {
        isSkeleton.value = false
      })
    }
  }
)
</script>

<style lang="scss" scoped src="./StakeModal.scss"></style>
