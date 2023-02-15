<template>
  <div class="nft-issue">
    <div class="nft-issue-header">
      <header class="flex flex-align-center flex-pack-center">
        <div class="flex1">
          <span class="title">{{ $t('NFT.Issue NFT') }}</span>
        </div>
        <a class="main-border primary" @click="isShowOption = true">{{ $t('NFT.Add Issue') }}</a>
        <a
          class="main-border"
          :class="[list.filter(item => !item.isSuccess).length ? 'primary' : 'faded']"
          @click="confirmIssue"
          >{{ $t('NFT.Confirm Issue') }}</a
        >
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
      <div
        class="issue-item flex flex-align-center flex-pack-center"
        v-for="(item, index) in list"
        :key="item.uuid"
      >
        <span
          class="status flex flex-align-center flex-pack-center"
          :class="{ success: item.isSuccess }"
          @click="operateItem(index)"
        >
          <Icon :name="item.isSuccess ? 'check' : 'x_mark'" />
        </span>

        <div class="success-cover" v-if="item.isSuccess"></div>

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
  genesis: GenesisItem | undefined
  name: string
  cover: AttachmentItem | undefined
  sourceFile: AttachmentItem | undefined
  acceptAddress: string
  desc: string
  index: number
  uuid: string
  isSuccess?: boolean
}
</script>
<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { GetUserGenesisList } from '@/api/aggregation'
import { Chains, NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { ElOption, ElSelect } from 'element-plus'
import { reactive, ref } from 'vue'
import IssueModalVue, { IssueNFTOption } from './components/IssueModal.vue'
import { v1 } from 'uuid'
import { useGenesisStore } from '@/stores/genesis'
import AddImageWarpVue from '@/components/AddImageWarp/AddImageWarp.vue'
import { openLoading } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { router } from '@/router'

const userStore = useUserStore()
const genesisStore = useGenesisStore()
const i18n = useI18n()

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
      const genesis = i === 0 || option.isSameGenesis ? option.genesis : undefined
      const name = i === 0 || option.isSameName ? option.name : ''
      const cover = i === 0 || option.isSameCover ? option.cover : undefined
      const sourceFile =
        i === 0 || option.isSoureFileSameCover
          ? option.cover
          : i === 0 || option.isSameSourceFile
          ? option.sourceFile
          : undefined
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
  const taskList = list.filter(item => !item.isSuccess)
  if (taskList.length === 0) return

  let allCheckSuccess = true
  for (let i = 0; i < taskList.length; i++) {
    if (!taskList[i].genesis) {
      allCheckSuccess = false
      ElMessage.error(i18n.t('NFT.Issue.GenesisEmpty'))
      break
    }
    if (!taskList[i].name) {
      allCheckSuccess = false
      ElMessage.error(i18n.t('NFT.Issue.NameEmpty'))
      break
    }
    if (!taskList[i].cover) {
      allCheckSuccess = false
      ElMessage.error(i18n.t('NFT.Issue.CoverEmpty'))
      break
    }
    if (!taskList[i].sourceFile) {
      allCheckSuccess = false
      ElMessage.error(i18n.t('NFT.Issue.SourceFileEmpty'))
      break
    }
    if (!taskList[i].acceptAddress) {
      allCheckSuccess = false
      ElMessage.error(i18n.t('NFT.Issue.AcceptAddressEmpty'))
      break
    }
  }

  if (allCheckSuccess) {
    const loading = openLoading({
      text: i18n.t('NFT.IssueLoading'),
    })
    const taskParams: any = []
    for (let i = 0; i < taskList.length; i++) {
      const params = {
        type: 'metacontract',
        genesisId: taskList[i].genesis!.genesis,
        sensibleId: taskList[i].genesis!.sensibleId,
        receiverAddress: taskList[i].acceptAddress,
        name: taskList[i].name,
        desc: taskList[i].desc,
        icon: `metafile://$[0]`,
        backIcon: '',
        website: '',
        issuerName: '',
        data: {
          originalFileTxid: 'metafile://$[1]',
        },
      }
      taskParams.push({
        nodeName: NodeName.NftIssue,
        data: JSON.stringify(params),
        attachments: [taskList[i].cover, taskList[i].sourceFile],
      })
    }
    try {
      const response = await userStore.showWallet.batchCreateBrfcChildNode(taskParams, {
        callback: params => {
          return new Promise(resolve => {
            taskList[params.index].isSuccess = true
            if (
              params.transactions.nft?.issue?.tokenIndex ===
              (taskList[params.index].index - 1).toString()
            ) {
              genesisStore.updateCurrentTotalSupply({
                genesis: taskList[params.index].genesis!.genesis,
                codehash: taskList[params.index].genesis!.codehash,
              })
              resolve({
                isContinue: true,
              })
            } else {
              const count = parseInt(params.transactions.nft!.issue!.tokenIndex) + 1
              genesisStore.updateCurrentTotalSupply({
                genesis: taskList[params.index].genesis!.genesis,
                codehash: taskList[params.index].genesis!.codehash,
                count: count,
              })
              taskList[params.index].index = count
              resolve({
                isContinue: false,
                error: i18n.t('NFT.Issue.TokenIndexNoteMatch'),
              })
            }
          })
        },
      })
      if (response) {
        ElMessage.success(i18n.t('NFT.Issue.AllIssueSuccess'))
        loading.close()
      } else if (response === null) {
        loading.close()
      }
    } catch (error) {
      ElMessage.error((error as any).message)
      loading.close()
    }
  }
}

async function operateItem(index: number) {
  if (list[index].isSuccess) {
    const link = router.resolve({
      name: 'nftDetail',
      params: {
        genesis: list[index].genesis!.genesis,
        codehash: list[index].genesis!.codehash,
        tokenIndex: list[index].index - 1,
        chain: Chains.MVC,
      },
    })
    window.open(`${location.origin}${link.href}`, '_blank')
  } else {
    list.splice(index, 1)
  }
}

getGenesisList()
</script>

<style lang="scss" scoped src="./Issue.scss"></style>
