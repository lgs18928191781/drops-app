<template>
  <div>
    <ElInput type="number" v-model="form.genesis.totalSupply" placeholder="系列数量" />
    <ElInput type="text" v-model="form.genesis.seriesName" placeholder="系列名称" />
    <ElInput type="text" v-model="form.name" placeholder="NFT名称" />
    <ElInput type="text" v-model="form.desc" placeholder="NFT描述" />
    <ElInput type="text" v-model="form.metafile" placeholder="metafile" />
    <ElInput type="number" v-model="form.count" placeholder="铸造数量" />

    <ElButton @click="genesis">创建</ElButton>
  </div>
</template>

<script setup lang="ts">
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'

const userStore = useUserStore()

const form = reactive({
  genesis: {
    type: 'metacontract',
    totalSupply: '',
    seriesName: '',
  },
  name: '',
  desc: '',
  metafile: '',
  count: 1,
})

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
</script>

<style lang="scss" scoped></style>
