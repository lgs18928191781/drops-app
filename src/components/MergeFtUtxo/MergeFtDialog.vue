<template>
  <ContentModalVue
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    :title="$t('why merge utxo')"
    :i18n="i18n"
    :z-index="99999"
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
import { ref, reactive, watch } from 'vue'
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
interface Props {
  modelValue: boolean
  i18n?: any
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue) {
      getFts(true)
    }
  }
)

const props = withDefaults(defineProps<Props>(), {})
const $i18n = props.i18n ? props.i18n : useI18n()
const $t = $i18n.t
const ftDataLoading = ref(true)
let FtList: Array<Partial<ftListType> & { ftUtxos: any }> = reactive([])
const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const pagination = reactive({ ...initPagination })
const currentChain = ref(Chains.MVC)

async function MergeFt(tokenInfo: Partial<ftListType> & { ftUtxos: any }) {
  tokenInfo.loading = true
  try {
    const ftManager = userStore.showWallet?.wallet?.getFtManager()
    let mergeAmount = '0'
    for (let utxo of tokenInfo.ftUtxos) {
      mergeAmount = new Decimal(mergeAmount).add(utxo.value).toString()
    }
    const mergeTransferUtxoParams = {
      codehash: tokenInfo.codehash,
      genesis: tokenInfo.genesis,
      isMerge: true,
      senderWif: userStore.showWallet?.wallet?.getPathPrivateKey('0/0').toString(),
      receivers: [
        {
          amount: mergeAmount,
          address: userStore.user?.address,
        },
      ],
    }
    const mergeRes = await ftManager.transfer(mergeTransferUtxoParams)

    if (!mergeRes) {
      throw new Error('merge FtUtxo failed')
    }
    FtList = FtList.filter(ft => {
      return ft.genesis != tokenInfo.genesis
    })
    tokenInfo.loading = false
    ElMessage.success($t('Merge Utxo Success'))
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
            const ftUtxo = await getFtUtxo({
              address: userStore.user!.address,
              codehash: ft.codehash,
              genesis: ft.genesis,
            })

            if (ftUtxo.length > 1) {
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
