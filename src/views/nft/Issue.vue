<template>
  <div class="nft-issue">
    <div class="nft-issue-header">
      <header class="flex flex-align-center">
        <div class="flex1">
          <span class="title">{{ $t('NFT.Issue NFT') }}</span>
        </div>
        <a class="main-border primary" @click="isShowOption = true">{{ $t('NFT.Add Issue') }}</a>
        <a class="main-border primary" @click="confirmIssue">{{ $t('NFT.Confirm Issue') }}</a>
      </header>

      <div class="issue-th issue-item flex flex-align-center">
        <span class="w-50">{{ $t('NFT.Belong Genesis') }}</span>
        <span class="w-20">{{ $t('NFT.Cover') }}</span>
        <span class="w-20">{{ $t('NFT.Source File') }}</span>
        <span class="flex1">{{ $t('NFT.Name') }}</span>
        <span class="flex1">{{ $t('NFT.Drsc') }}</span>
        <span class="flex1">{{ $t('NFT.Accept Address') }}</span>
        <span class="w-30">{{ $t('NFT.issueToknIndex') }}</span>
      </div>
    </div>

    <div class="issue-list">
      <div class="issue-item flex flex-align-center" v-for="item in list" :key="item.uuid">
        <ElForm
          :model="item"
          :label-position="'top'"
          ref="FormRef"
          class="flex flex-align-center flex1"
        >
          <!-- genesis -->
          <ElFormItem prop="genesis" class="w-50">
            <div class="form-item flex flex-align-center flex1">
              <div class="flex1 flex flex-align-center">
                <ElSelect
                  class="flex1"
                  :model-value="
                    item.genesis ? item.genesis.genesis + '/' + item.genesis.codehash : ''
                  "
                >
                  <ElOption
                    v-for="genesis in genesisStore.list"
                    :key="genesis.codehash + genesis.genesis"
                    :label="genesis.seriesName"
                    :value="genesis.genesis + '/' + genesis.codehash"
                    @click="item.genesis = genesis"
                  ></ElOption>
                </ElSelect>
              </div>
            </div>
          </ElFormItem>

          <!-- cover -->
          <ElFormItem prop="cover" class="w-20">
            <div class="form-item flex flex-align-center flex1">
              <div class="flex1">
                <div class="w-20">
                  <AddImageWarpVue v-model:attachment="item.cover" />
                </div>
              </div>
            </div>
          </ElFormItem>

          <!-- sourceFile -->
          <ElFormItem prop="sourceFile" class="w-20">
            <div class="form-item flex flex-align-center flex1">
              <div class="flex1">
                <div class="w-20">
                  <AddImageWarpVue v-model:attachment="item.sourceFile" />
                </div>
              </div>
            </div>
          </ElFormItem>

          <!-- name -->
          <ElFormItem prop="name" class="flex1">
            <div class="form-item flex flex-align-center flex1">
              <div class="flex1"><ElInput type="text" v-model="item.name" /></div>
            </div>
          </ElFormItem>

          <!-- desc -->
          <ElFormItem prop="desc" class="flex1">
            <div class="form-item flex flex-align-center flex1">
              <div class="flex1"><ElInput type="text" v-model="item.desc" /></div>
            </div>
          </ElFormItem>

          <!-- acceptAddress -->
          <ElFormItem prop="acceptAddress" class="flex1">
            <div class="form-item flex flex-align-center flex1">
              <div class="flex1"><ElInput type="text" v-model="item.acceptAddress" /></div>
            </div>
          </ElFormItem>

          <!-- index -->
          <ElFormItem prop="acceptAddress" class="w-30">
            <div class="form-item flex flex-align-center flex1">
              <div class="flex1">
                <ElInput type="number" :readonly="true" v-model="item.index" />
              </div>
            </div>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </div>

  <IssueModalVue v-model="isShowOption" @confirm="addIssueItem" />
</template>
<script lang="ts">
interface IssueItem {
  genesis: GenesisItem | null
  name: string
  cover: AttachmentItem | null
  sourceFile: AttachmentItem | null
  acceptAddress: string
  desc: string
  index: number
  uuid: string
}
</script>
<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { GetUserGenesisList } from '@/api/aggregation'
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { ElOption, ElSelect } from 'element-plus'
import { reactive, ref } from 'vue'
import IssueModalVue, { IssueNFTOption } from './components/IssueModal.vue'
import { v1 } from 'uuid'
import { useGenesisStore } from '@/stores/genesis'
import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'

const userStore = useUserStore()
const genesisStore = useGenesisStore()

const isShowOption = ref(false)

const list: IssueItem[] = reactive([])

const genesisList: GenesisItem[] = reactive([])
const currentGenesis = ref('')
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

function addIssueItem(option: IssueNFTOption) {
  let errorMsg
  for (let i = 0; i < option.count; i++) {
    try {
      const genesis = i === 0 || option.isSameGenesis ? option.genesis : null
      const name = i === 0 || option.isSameName ? option.name : ''
      const cover = i === 0 || option.isSameCover ? option.cover : null
      const sourceFile =
        i === 0 || option.isSoureFileSameCover
          ? option.cover
          : i === 0 || option.isSameSourceFile
          ? option.sourceFile
          : null
      const acceptAddress = i === 0 || option.isSameAcceptAddress ? option.acceptAddress : ''
      const desc = i === 0 || option.isSameDesc ? option.desc : ''
      const index = getCurrentGenesisIndex(genesis)
      const uuid = v1()
      list.push({
        genesis,
        name,
        cover,
        sourceFile,
        acceptAddress,
        desc,
        index,
        uuid,
      })
    } catch (error) {
      errorMsg = (error as any).message
    }

    if (errorMsg) {
      break
    }
  }

  if (errorMsg) {
    return ElMessage.error(errorMsg)
  }
}

function getCurrentGenesisIndex(genesis?: GenesisItem | null) {
  if (!genesis) return 0
  else {
    debugger
    const currentGenesisList = list.filter(
      item =>
        item.genesis &&
        item.genesis.codehash === genesis.codehash &&
        item.genesis.genesis === genesis.genesis
    )
    if (currentGenesisList && currentGenesisList.length) {
      return currentGenesisList[currentGenesisList.length - 1].index + 1
    } else {
      return genesis.currentTotalSupply + 1
    }
  }
}

async function confirmIssue() {
  const taskParams: any = []
  for (let i = 0; i < list.length; i++) {
    const params = {
      type: 'metacontract',
      genesisId: list[i].genesis!.genesis,
      sensibleId: list[i].genesis!.sensibleId,
      receiverAddress: list[i].acceptAddress,
      name: list[i].name,
      desc: list[i].desc,
      icon: `metafile://$[0]`,
      backIcon: '',
      website: '',
      issuerName: '',
      data: {
        originalFileTxid: 'metafile://$[${1}]',
      },
    }
    taskParams.push({
      nodeName: NodeName.NftIssue,
      data: JSON.stringify(params),
      attachments: [list[i].cover, list[i].sourceFile],
    })
  }
  const response = await userStore.showWallet.batchCreateBrfcChildNode(taskParams, {
    callback: params => {
      return new Promise(resolve => {
        console.log(params.transactions)
        resolve({
          isContinue: true,
        })
      })
    },
  })
  if (response) {
    debugger
  }
}

getGenesisList()
</script>

<style lang="scss" scoped src="./Issue.scss"></style>
