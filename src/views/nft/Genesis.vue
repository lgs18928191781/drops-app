<template>
  <div>
    {{ userStore.user?.address }}
    <ElInput type="number" v-model="form.totalSupply" placeholder="系列数量" />
    <ElInput type="text" v-model="form.seriesName" placeholder="系列名称" />

    <ElButton @click="genesis">创建</ElButton>

    <ElButton @click="ftGenesis">FT</ElButton>
  </div>
</template>

<script setup lang="ts">
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'

const userStore = useUserStore()

const form = reactive({
  type: 'metacontract',
  totalSupply: '',
  seriesName: '',
})

async function genesis() {
  const res = await userStore.showWallet.createBrfcChildNode({
    nodeName: NodeName.NftGenesis,
    data: JSON.stringify({
      ...form,
    }),
  })
  // debugger
  if (res) {
    for (let i = 0; i < 20; i++) {
      const response = await userStore.showWallet.createBrfcChildNode({
        nodeName: NodeName.NftIssue,
        data: JSON.stringify({
          type: 'metacontract',
          genesisId: res.currentNode?.genesis,
          genesisTxid: res.currentNode?.txId,
          receiverAddress: userStore.user?.address,
          sensibleId: res.currentNode!.sensibleId,
          name: '大卫',
          desc: '大卫',
          icon: 'metafile://0be78bcaf6c3537d016902902d0856a6022fe446bc01921be1bfaab4fe526d12.jpeg',
          backIcon: '',
          website: '',
          issuerName: '',
          data: {
            originalFileTxid:
              'metafile://0be78bcaf6c3537d016902902d0856a6022fe446bc01921be1bfaab4fe526d12.jpeg',
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
