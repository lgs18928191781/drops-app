<template>
  <div>
    <ElSelect v-model="currentGenesis">
      <ElOption
        v-for="item in genesisList"
        :key="item.codehash + item.genesis"
        :label="item.seriesName"
        :value="item.genesis + '/' + item.codehash"
      ></ElOption>
    </ElSelect>

    <ElInput type="number" v-model="form.genesis.totalSupply" placeholder="系列数量" />
    <ElInput type="text" v-model="form.genesis.seriesName" placeholder="系列名称" />
    <ElInput type="text" v-model="form.name" placeholder="NFT名称" />
    <ElInput type="text" v-model="form.desc" placeholder="NFT描述" />
    <ElInput type="text" v-model="form.metafile" placeholder="metafile" />
    <ElInput type="number" v-model="form.count" placeholder="铸造数量" />
    <ElInput type="text" v-model="form.receiveAddress" placeholder="接受的地址" />

    <ElButton @click="genesis">创建</ElButton>

    <IssueModalVue />
  </div>
</template>

<script setup lang="ts">
import { GetUserGenesisList } from '@/api/aggregation'
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { ElOption, ElSelect } from 'element-plus'
import { reactive, ref } from 'vue'
import IssueModalVue from './components/IssueModal.vue'

const userStore = useUserStore()

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

getGenesisList()
</script>

<style lang="scss" scoped></style>
