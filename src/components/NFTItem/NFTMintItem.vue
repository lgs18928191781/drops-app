<template>
  <ElSkeleton :loading="loading" animated>
    <template #template>
      <NFTItemSkeleton />
    </template>
    <template #default>
      <div class="nft-item" @click="toNFT">
        <NFTCover :cover="[nft.pic_path]" />

        <div class="name" :class="{ simple: isSimple }">
          {{ nft.nft_name }}
        </div>

        <!-- <div class="token-index">#{{ parseInt(nft.nftTokenIndex) + 1 }}</div> -->
        <!-- <div class="amount" :class="{ simple: isSimple }">
            <template v-if="isSale"> {{ $filters.space(nft.nftPrice) }} Space </template>
            <template v-else>--</template>
          </div> -->

        <div class="user-list">
          <div class="user-item flex flex-align-center">
            <UserAvatar
              :meta-id="collection.collection_creator?.metaid"
              :image="collection.collection_creator?.avatarId"
              :name="collection.collection_creator?.name"
              :meta-name="''"
            />
            <div class="flex1 flex flex-align-center info text-sm font-light">
              <span class="user-name-warp"
                ><UserName
                  :name="collection.collection_creator?.name"
                  :meta-name="''"
                  :metaId="collection.collection_creator?.metaid"
                  :noTag="true"
              /></span>
              <span class="role">({{ $t('NFT.Creater') }})</span>
            </div>
          </div>
          <!-- <div class="user-item flex flex-align-center">
              <UserAvatar
                :meta-id="nft.nftOwnerMetaId"
                :image="nft.nftOwnerAvatarImage"
                :name="nft.nftOwnerName"
                :disabled="true"
                :meta-name="nft.nftOwnerUserInfo?.metaName"
              />
              <div class="flex1 flex flex-align-center info">
                <span class="user-name-warp"
                  ><UserName
                    :name="nft.nftOwnerName"
                    :meta-name="nft.nftOwnerUserInfo?.metaName"
                    :noTag="true"
                /></span>
                <span class="role">({{ $t('NFT.Owner') }})</span>
              </div>
            </div> -->
        </div>

        <div :class="['main-border', nft.is_minted == 0 ? 'primary' : 'gray']" @click.stop="btnFun">
          {{ btnText }}
        </div>
      </div>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import NFTCover from '../NFTCover/NFTCover.vue'
import Amount from '../Amount/Amount.vue'
import { Chains, NFTSellState, ToCurrency } from '@/enum'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NFTItemSkeleton from './NFTItemSkeleton.vue'
import { useUserStore } from '@/stores/user'
import { IsMyNFT, IsSale } from '@/utils/nft'
import { useI18n } from 'vue-i18n'
import { checkUserLogin } from '@/utils/util'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  nft: NftMintItemType
  collection: NftsCollection
  loading?: boolean
  isSimple?: boolean
}>()

//   const emit = defineEmits(['buy', 'offsale', 'sale'])
const emit = defineEmits(['mint'])
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const i18n = useI18n()

//   const isMyNFT = computed(() => {
//     return IsMyNFT(props.nft)
//   })

//   const isSale = computed(() => {
//     return IsSale(props.nft)
//   })

const btnText = computed(() => {
  if (props.nft.is_minted == 0) {
    return i18n.t('NFTs.lanuch_mint')
  } else if (props.nft.is_minted) {
    return i18n.t('NFTs.lanuch_minted')
  }

  // if (props.nft.nftIsOrderLock) {
  //   return i18n.t('NFT.NFT Order Locked')
  // } else if (isMyNFT.value) {
  //   if (isSale.value) {
  //     return i18n.t('NFT.Off Sale')
  //   } else {
  //     return i18n.t('NFT.Sale')
  //   }
  // } else {
  //   if (isSale.value) {
  //     return i18n.t('NFT.Buy Now')
  //   } else {
  //     return i18n.t('NFT.Discover More')
  //   }
  // }
})

async function btnFun() {
  if (props.nft.is_minted == 0) {
    emit('mint', props.nft)
  } else return

  // if (props.nft.nftIsOrderLock) {
  //   toNFT()
  // } else if (isMyNFT.value) {
  //   if (isSale.value) {
  //     emit('offsale', props.nft)
  //   } else {
  //     emit('sale', props.nft)
  //   }
  // } else {
  //   if (isSale.value) {
  //     await checkUserLogin()
  //     emit('buy', props.nft)
  //   } else {
  //     toNFT()
  //   }
  // }
}

function toNFT() {
  if (!props.nft.item_pinid) {
    return ElMessage.error(`${i18n.t('Nfts.not_allow_todetail')}`)
  }
  router.push({
    name: 'nftDetail',
    params: {
      collectionpinid: route.params.topicType as string,
      nftpinid: props.nft.item_pinid,
    },
  })
}
</script>

<style lang="scss" scoped src="./NFTMintItem.scss"></style>
