<template>
  <ElDialog
    :model-value="modelValue"
    :title="$t('NFT.Issue NFT Options')"
    class="sm"
    :close-on-click-modal="false"
    @close="emit('update:modelValue', false)"
  >
    <ElForm :model="form" :label-position="'top'" ref="FormRef">
      <!-- count -->
      <ElFormItem :label="$t('NFT.Issue Count')" prop="count">
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.count" /></div>
        </div>
      </ElFormItem>

      <!-- genesis -->
      <ElFormItem :label="$t('NFT.Belong Genesis')" prop="genesis">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Belong Genesis') }}
            </div>
            <a class="create-genesis" @click="isShowCreateGenesis = true">{{
              $t('NFT.Create Genesis')
            }}</a>
            <div class="switch-list flex flex-align-center">
              <div class="switch-item flex flex-align-center">
                <span class="label">{{ $t('NFT.AllSame') }}</span>
                <ElSwitch v-model="form.isSameGenesis" />
              </div>
            </div>
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1 flex flex-align-center">
            <ElSelect
              class="flex1"
              :model-value="form.genesis ? form.genesis.genesis + '/' + form.genesis.codehash : ''"
            >
              <ElOption
                v-for="item in genesisStore.list"
                :key="item.codehash + item.genesis"
                :label="item.seriesName"
                :value="item.genesis + '/' + item.codehash"
                @click="form.genesis = item"
              ></ElOption>
            </ElSelect>
          </div>
        </div>
      </ElFormItem>

      <!-- cover -->
      <ElFormItem prop="cover">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Cover') }}
            </div>
            <div class="switch-list flex flex-align-center">
              <div class="switch-item flex flex-align-center">
                <span class="label">{{ $t('NFT.CoverIsSameSourFille') }}</span>
                <ElSwitch v-model="form.isSoureFileSameCover" />
              </div>
              <div class="switch-item flex flex-align-center">
                <span class="label">{{ $t('NFT.AllSame') }}</span>
                <ElSwitch v-model="form.isSameCover" />
              </div>
            </div>
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

      <!-- sourceFile -->
      <ElFormItem prop="sourceFile" v-if="!form.isSoureFileSameCover">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Source File') }}
            </div>
            <div class="switch-list flex flex-align-center">
              <div class="switch-item flex flex-align-center">
                <span class="label">{{ $t('NFT.AllSame') }}</span>
                <ElSwitch v-model="form.isSameSourceFile" />
              </div>
            </div>
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

      <!-- name -->
      <ElFormItem prop="name">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Name') }}
            </div>
            <div class="switch-list flex flex-align-center">
              <div class="switch-item flex flex-align-center">
                <span class="label">{{ $t('NFT.AllSame') }}</span>
                <ElSwitch v-model="form.isSameName" />
              </div>
            </div>
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.name" /></div>
        </div>
      </ElFormItem>

      <!-- desc -->
      <ElFormItem prop="desc">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Drsc') }}
            </div>
            <div class="switch-list flex flex-align-center">
              <div class="switch-item flex flex-align-center">
                <span class="label">{{ $t('NFT.AllSame') }}</span>
                <ElSwitch v-model="form.isSameDesc" />
              </div>
            </div>
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.desc" /></div>
        </div>
      </ElFormItem>

      <!-- acceptAddress -->
      <ElFormItem prop="acceptAddress">
        <template #label>
          <div class="label-warp flex flex-align-center">
            <div class="flex1">
              {{ $t('NFT.Accept Address') }}
            </div>
            <div class="switch-list flex flex-align-center">
              <div class="switch-item flex flex-align-center">
                <span class="label">{{ $t('NFT.AllSame') }}</span>
                <ElSwitch v-model="form.isSameAcceptAddress" />
              </div>
            </div>
          </div>
        </template>
        <div class="form-item flex flex-align-center flex1">
          <div class="flex1"><ElInput type="text" v-model="form.acceptAddress" /></div>
        </div>
      </ElFormItem>

      <ElFormItem>
        <a
          class="main-border primary flex1 flex flex-align-center flex-pack-center"
          @click="confirm"
        >
          {{ $t('Confirm') }}
        </a>
      </ElFormItem>
    </ElForm>

    <CreateGenesis v-model="isShowCreateGenesis" />
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
import { ElSwitch, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'
import CreateGenesis from './CreateGenesis.vue'
import { useGenesisStore } from '@/stores/genesis'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['confirm', 'update:modelValue'])
const FormRef = ref<FormInstance>()
const userStore = useUserStore()
const genesisStore = useGenesisStore()
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
const isShowCreateGenesis = ref(false)

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

function confirm() {
  emit('confirm', form)
  FormRef.value?.resetFields()
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped src="./IssueModal.scss"></style>
