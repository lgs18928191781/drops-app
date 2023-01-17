<template>
  <div class="nft-issue">
    <header class="flex flex-align-center">
      <div class="flex1">
        <span class="title">{{ $t('NFT.Issue NFT') }}</span>
      </div>
      <a class="main-border primary" @click="isShowOption = true">{{ $t('NFT.Add Issue') }}</a>
    </header>
  </div>

  <IssueModalVue v-model="isShowOption" @confirm="addIssueItem" />
</template>

<script setup lang="ts">
import { GetUserGenesisList } from '@/api/aggregation'
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { ElOption, ElSelect } from 'element-plus'
import { reactive, ref } from 'vue'
import IssueModalVue, { IssueNFTOption } from './components/IssueModal.vue'

const userStore = useUserStore()

const isShowOption = ref(false)
const form = reactive({
  genesis: {
    type: 'metacontract',
    totalSupply: '',
    seriesName: '',
  },
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
})

const genesisList: GenesisItem[] = reactive([])
const currentGenesis = ref('')

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

async function genesis() {
  const res = await userStore.showWallet.createBrfcChildNode({
    nodeName: NodeName.NftGenesis,
    data: JSON.stringify({
      ...form.genesis,
    }),
  })
  // debugger
  if (res) {
    for (let i = 0; i < form.count; i++) {
      const response = await userStore.showWallet.createBrfcChildNode({
        nodeName: NodeName.NftIssue,
        data: JSON.stringify({
          type: 'metacontract',
          genesisId: res.currentNode?.genesis,
          genesisTxid: res.currentNode?.txId,
          receiverAddress: userStore.user?.address,
          sensibleId: res.currentNode!.sensibleId,
          name: form.name,
          desc: form.desc,
          icon: form.metafile,
          backIcon: '',
          website: '',
          issuerName: '',
          data: {
            originalFileTxid: form.metafile,
          },
        }),
      })
    }
  }
}

async function ftGenesis() {
  const res = await userStore.showWallet.ftGenesis()
}

function addIssueItem(option: IssueNFTOption) {
  let result: any = []
  for (let i = 0; i < option.count; i++) {
    result.push({
      genesis: option.genesis,
    })
  }
}

getGenesisList()
</script>

<style lang="scss" scoped src="./Issue.scss"></style>
