<template>
  <ContentModalVue
    ref="contentModal"
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    :title="$t('why merge utxo')"
    :i18n="i18n"
    :z-index="10000"
    :extrafooter="true"
    :titleIntro="$t('title intro')"
  >
    <template #content>
      <div class="ftWrap">
        <div class="ftContanier" v-for="(item, index) in FtList" :key="index">
          <div class="left">
            <div class="flex flex-align-center flex-pack-center ftIcon">
              <img :src="item.icon" />
            </div>
            <div class="ftName">
              {{ item.name }}
            </div>
          </div>
          <div class="center">
            <el-progress
              :percentage="(item.mergedProcess!/item.mergeTotal!)*100"
              :stroke-width="12"
              striped
            >
              {{ item.mergedProcess }}/{{ item.mergeTotal }}
            </el-progress>
          </div>
          <div class="right">
            <el-button
              class="main-border mergeBtn"
              @click="MergeFt(item)"
              :loading="item.loading"
              >{{ item.loading ? $t('Loading') : $t('ft merge') }}</el-button
            >
          </div>
        </div>
        <div class="noData" v-if="!FtList.length">
          <div v-if="ftDataLoading">
            <Icon name="loading" class="w-10 h-10 animate-spin text-dark-400 dark:!text-gray-200" />
          </div>
          <div v-else>{{ $t('noDatas') }}</div>
        </div>
      </div>

      <LoadMoreVue :pagination="pagination" />
    </template>
  </ContentModalVue>
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import ContentModalVue from '../ContentModal/ContentModal.vue'
import { Chains } from '@/enum'
import { GetFTs } from '@/api/aggregation'
import { metafile } from '@/utils/filters'
import MSP from '@/assets/images/msp.png'
import LoadMoreVue from '../LoadMore/LoadMore.vue'
import { initPagination } from '@/config'
import { getFtUtxo } from '@/api'
import Decimal from 'decimal.js-light'
import { ElMessageBox } from 'element-plus'
interface Props {
  modelValue: boolean
  i18n?: any
}

// watch(
//   () => props.modelValue,
//   () => {
//     if (props.modelValue) {
//       getFts(true)
//     }
//   }
// )

const props = withDefaults(defineProps<Props>(), {})
const $i18n = props.i18n ? props.i18n : useI18n()
const $t = $i18n.t
const contentModal = ref()
const ftDataLoading = ref(true)
let FtList: Array<Partial<ftListType> & { ftUtxos: any }> = reactive([])
const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const pagination = reactive({ ...initPagination })
const currentChain = ref(Chains.MVC)

async function MergeFt(
  tokenInfo: Partial<ftListType> & { ftUtxos: any; mergeTotal: number; mergedProcess: number }
) {
  tokenInfo.loading = true

  try {
    const ftManager = userStore.showWallet?.wallet?.getFtManager()
    const mergeTransferUtxoParams = {
      codehash: tokenInfo.codehash,
      genesis: tokenInfo.genesis,
      ownerWif: userStore.showWallet?.wallet?.getPathPrivateKey('0/0').toString(),
      changeAddress: userStore.user!.address,
    }
    let mergeFlag = true
    await userStore.showWallet?.wallet?.checkNeedMergeUtxo()

    const estimatedFee = await ftManager
      .getMergeEstimateFee({
        codehash: tokenInfo.codehash,
        genesis: tokenInfo.genesis,
        ownerWif: userStore.showWallet?.wallet?.getPathPrivateKey('0/0').toString(),
      })
      .catch(error => {
        throw new Error(error)
      })

    const estimateTototalFee = new Decimal(tokenInfo.mergeTotal)
      .div(20)
      .mul(estimatedFee ?? 0)
      .div(Math.pow(10, 8))
      .toNumber()
    ElMessageBox.confirm(
      `${$t('MergeFtEstimate')} <span>${estimateTototalFee}</span> SPACE`,
      `${$t('MergeFtEstimateTitle')}`,

      {
        cancelButtonText: $t('Cancel'),
        confirmButtonText: $t('Confirm'),
        cancelButtonClass: 'main-border',
        confirmButtonClass: 'main-border primary',
        appendTo: contentModal.value,
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
      }
    )
      .then(async () => {
        while (mergeFlag) {
          try {
            let ftUtxo = await getFtUtxo({
              address: userStore.user!.address,
              codehash: tokenInfo.codehash!,
              genesis: tokenInfo.genesis!,
            })
            if (ftUtxo.length < 20) {
              mergeFlag = false
              break
            }
            const mergeRes = await ftManager.merge(mergeTransferUtxoParams)

            if (mergeRes) {
              tokenInfo.mergedProcess += 1
            } else {
              continue
            }
          } catch (error) {
            tokenInfo.loading = false
            ElMessage.error(error as any)
            throw new Error(error as any)
          }
        }

        FtList = FtList.filter(ft => {
          return ft.genesis != tokenInfo.genesis
        })
        tokenInfo.loading = false
        ElMessage.success($t('Merge Utxo Success'))
      })
      .catch(() => {
        tokenInfo.loading = false
      })
  } catch (error) {
    ElMessage.error(error as any)
    tokenInfo.loading = false
  }
}

function getFts(isCover = false) {
  ftDataLoading.value = true
  return new Promise<void>(async resolve => {
    if (
      currentChain.value !== Chains.MVC &&
      currentChain.value !== Chains.BSV &&
      !userStore.user!.address
    ) {
      FtList.length = 0

      resolve()
    } else {
      try {
        const res = await GetFTs({
          address: userStore.user!.address!,
          chain: Chains.MVC,
          page: 1,
          pageSize: 30,
        })

        if (res.code === 0) {
          if (isCover) FtList.length = 0
          if (res.data.results.items.length === 0) pagination.nothing = true
          const mspGenesis = `b2d75931958114e48c9927160f80363eae78e2dc`
          for (let ft of res.data.results.items) {
            let ftUtxo = await getFtUtxo({
              address: userStore.user!.address,
              codehash: ft.codehash,
              genesis: ft.genesis,
            })
            let moreFtUtxoFlag = true
            while (moreFtUtxoFlag) {
              const moreFtUtxo = await getFtUtxo({
                address: userStore.user!.address,
                codehash: ft.codehash,
                genesis: ft.genesis,
                flag: ftUtxo[ftUtxo.length - 1].flag,
              })
              if (moreFtUtxo.length > 0) {
                ftUtxo = [...ftUtxo, ...moreFtUtxo]
              } else {
                moreFtUtxoFlag = false
              }
            }

            if (ftUtxo.length > 20) {
              FtList.push({
                icon: ft.genesis == mspGenesis ? MSP : metafile(ft.icon),
                name: ft.name,
                value: +ft.balance,
                loading: false,
                codehash: ft.codehash,
                genesis: ft.genesis,
                decimalNum: ft.decimalNum,
                ftSymbol: ft.symbol,
                ftName: ft.name,
                ftUtxos: ftUtxo,
                mergeTotal: Math.floor(ftUtxo.length / 20),
                mergedProcess: 0,
              })
            }
          }
          ftDataLoading.value = false
          resolve()
        }
      } catch (error) {
        ftDataLoading.value = false
        resolve()
      }
    }
  })
}
</script>

<style lang="scss" src="./MergeFtDialog.scss"></style>
