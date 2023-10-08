<template>
  <div class="h-full  ">
    <div class="header flex flex-align-center mt-1">
      <div class="flex1">
        {{ $t('DAO.Top500') }}
      </div>
    </div>

    <!-- Information -->
    <div class="section">
      <el-table :data="stakingItems" style="width: 100%" height="700" v-loading="loading">
        <el-table-column prop="sort" :label="$t('DAO.Rank')" width="100" align="center">
        </el-table-column>
        <el-table-column prop="address" :label="$t('DAO.Address')" align="center">
        </el-table-column>
        <el-table-column
          prop="tokenAmount"
          :label="$t('DAO.TokenAmount')"
          width="180"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StakingItem } from '@/@types/api'
import { GetTopStakings } from '@/api/aggregation'
import Decimal from 'decimal.js-light'
import { reject } from 'lodash'
import { nextTick } from 'process'

import { reactive, ref } from 'vue'

const stakingItems: StakingItem[] = reactive([])
let loading = ref(true)

async function getStakingItems(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const res = await GetTopStakings()

    if (res?.code === 0) {
      loading.value = false
      stakingItems.push(
        ...res.data.results.items.map((d, index) => ({
          sort: index + 1,
          ...d,
          tokenAmount: new Decimal(d.tokenAmount).div(10 ** 8).toString(),
        }))
      )
      resolve()
    } else {
      ElMessage.error(`error network`)
      reject()
    }
  })
}
getStakingItems()
</script>

<style lang="scss" scoped src="./Rank.scss"></style>
