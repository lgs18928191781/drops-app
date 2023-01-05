<template>
  <ElDialog :model-value="true" :title="$t('NFT.Issue NFT Options')" class="sm">
    <ElForm :model="form" :label-position="'top'">
      <ElFormItem prop="cover">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Cover') }}
            </div>
            <ElSwitch v-model="form.isSoureFileSameCover" />
            <ElSwitch v-model="form.isSameCover" />
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1">
            <div class="w-30">
              <AddImageWarpVue v-model:attachment="form.cover" />
            </div>
          </div>
        </div>
      </ElFormItem>

      <ElFormItem prop="sourceFile" v-if="!form.isSoureFileSameCover">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Source File') }}
            </div>
            <ElSwitch v-model="form.isSameSourceFile" />
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1">
            <div class="w-30">
              <AddImageWarpVue v-model:attachment="form.sourceFile" />
            </div>
          </div>
        </div>
      </ElFormItem>

      <ElFormItem prop="name">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Name') }}
            </div>
            <ElSwitch v-model="form.isSameName" />
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.name" /></div>
        </div>
      </ElFormItem>

      <ElFormItem prop="desc">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Drsc') }}
            </div>
            <ElSwitch v-model="form.isSameDesc" />
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.desc" /></div>
        </div>
      </ElFormItem>

      <ElFormItem prop="acceptAddress">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Accept Address') }}
            </div>
            <ElSwitch v-model="form.isSameAcceptAddress" />
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.acceptAddress" /></div>
        </div>
      </ElFormItem>

      <ElFormItem :label="$t('NFT.Issue Count')" prop="count">
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.count" /></div>
        </div>
      </ElFormItem>

      <ElFormItem :label="$t('NFT.Belong Genesis')" prop="genesis">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Belong Genesis') }}
            </div>
            <ElSwitch v-model="form.isSameGenesis" />
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1 flex flex-align-center">
            <ElSelect
              class="flex1"
              :model-value="form.genesis ? form.genesis.genesis + '/' + form.genesis.codehash : ''"
            >
              <ElOption
                v-for="item in genesisList"
                :key="item.codehash + item.genesis"
                :label="item.seriesName"
                :value="item.genesis + '/' + item.codehash"
              ></ElOption>
            </ElSelect>
          </div>
        </div>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script lang="ts">
export interface IssueNFTOption {
  name: string
  isSameName: boolean
  desc: string
  isSameDesc: boolean
  cover: null | AttachmentItem
  isSameCover: boolean
  isSoureFileSameCover: boolean
  count: number
  acceptAddress: string
  isSameAcceptAddress: boolean
  sourceFile: null | AttachmentItem
  isSameSourceFile: boolean
  genesis: GenesisItem | null
  isSameGenesis: boolean
}
</script>
<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { GetUserGenesisList } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'
import { ElSwitch } from 'element-plus'
import { reactive } from 'vue'
import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'

const userStore = useUserStore()
const genesisList: GenesisItem[] = reactive([])
const form: IssueNFTOption = reactive({
  name: '',
  isSameName: false,
  desc: '',
  isSameDesc: false,
  cover: null,
  isSameCover: false,
  count: 1,
  acceptAddress: userStore.user?.address || '',
  isSameAcceptAddress: false,
  sourceFile: null,
  isSameSourceFile: false,
  genesis: null,
  isSameGenesis: false,
  isSoureFileSameCover: false,
})

function getGenesisList() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetUserGenesisList({
      metaId: userStore.user!.metaId,
      page: 1,
      pageSize: 9999,
    })
    if (res.code === 0) {
      genesisList.length = 0
      genesisList.push(...res.data.results.items)
    }
    resolve()
  })
}

getGenesisList()
</script>

<style lang="scss" scoped src="./IssueModal.scss"></style>
