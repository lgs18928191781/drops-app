<template>
  <ElDialog :model-value="true" class="none-header none-padding sm" :close-on-click-modal="false">
    <button @click="genesisNft">create</button>
    <div class="nft-modal">
      <header class="flex flex-align-center">
        <a class="back flex flex-align-center flex-pack-center">
          <Icon name="down" />
        </a>
        <div class="flex1 title">Show My NFT</div>

        <a class="close flex flex-align-center flex-pack-center">
          <Icon name="x_mark " />
        </a>
      </header>

      <div class="content">
        <div class="genesis-list" v-loading="true">
          <div class="genesis-item" v-for="item in Array.from({ length: 12 })">
            <div class="top flex flex-align-center">
              <div class="name flex1">MetaBot NFT Avatar</div>
              <a class="main-border primary">
                <Icon name="right" />
              </a>
            </div>
            <div class="author flex flex-align-center">
              <div class="msg flex1 flex flex-align-center">
                <UserAvatar :meta-id="''" />
                ShowPayTeam
              </div>
              <div class=" ">{{ $t('Number') }}: 10</div>
            </div>
            <div class="nft-list">
              <div class="nft-item" v-for="nft in Array.from({ length: 3 })">
                <Image :src="''" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { GetNFTs } from '@/api/aggregation'
import { initPagination } from '@/config'
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'

const userStore = useUserStore()
const pagination = reactive({ ...initPagination })
const genesisList = reactive([])

function getDatas(isCover = false) {
  return new Promise(async (resolve, reject) => {
    const res = await GetNFTs({
      address: userStore.user!.address,
      ...pagination,
    })
    if (res.code === 0) {
      if (isCover) genesisList.length = 0
    }
  })
}

async function genesisNft() {
  //   const res = await userStore.showWallet.createBrfcChildNode({
  //     nodeName: NodeName.NftIssue,
  //     data: JSON.stringify({
  //       type: 'sensible',
  //       genesisId: '95c24ac2e0a4b668620c2f6f3b86c204536f42aa',
  //       genesisTxid: '',
  //       receiverAddress: userStore.user!.address,
  //       name: 'testNFT1',
  //       desc: 'test nft',
  //       data: {},
  //       icon: 'metafile://8467393e1fbcfd5b54fc41249625c1005cbc4945840b692b582f0f7fe64f68c8',
  //       website: '',
  //       issuerName: userStore.user!.name,
  //     }),
  //   })
  //   debugger
  const res = await userStore.showWallet.genesisNFT({
    totalSupply: 10,
    seriesName: 'test1',
  })
}

getDatas()
</script>

<style lang="scss" scoped src="./NFTModal.scss"></style>
