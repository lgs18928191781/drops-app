<template>
  <ElSkeleton :loading="isShowSkeleton" animated>
    <template #template>
      <DetailSkeleton />
    </template>

    <template #default>
      <div class="nft-detail">
        <div class="nft-msg flex">
          <div class="cover-warp">
            <NFTCover
              :needGizp="true"
              :cover="[nft.val?.pic_path]"
              :is-show-prew="true"
              :is-lazy="false"
            />
          </div>
          <div class="flex1 nft-msg-right flex flex-v">
            <div class="flex1">
              <div class="top flex flex-align-center">
                <div class="flex1">
                  <RouterLink
                    :to="{
                      name: 'nftCollectionDetail',
                      params: { topicType: collection.val.topicType },
                    }"
                    class="collection-name flex flex-align-center"
                    v-if="collection.val"
                  >
                    {{ collection.val!.name }} <Icon name="certed" />
                  </RouterLink>
                </div>
                <div class="operate-list flex flex-align-center">
                  <!-- <div class="operate-item flex flex-align-center" @click="payLike">
                    <Icon
                      :name="nft.val!.nftHasLike ? 'message_like' : 'like'"
                      :class="{ 'like-ing': isLikeing }"
                    />
                    <span class="count">{{ nft.val!.nftLikeCount }}</span>
                  </div> -->
                  <div class="operate-item flex flex-align-center" @click="share">
                    <img src="@/assets/images/share@2x.png" alt="" class="w-[18px] h-[18px] " />
                  </div>
                </div>
              </div>
              <div class="text-[18px] font-medium text-[#A9CDF4]">
                {{nft.val!.collection_name }}
              </div>
              <div class="name">
                {{nft.val!.nft_name }}
              </div>

              <div class="owner flex flex-align-center">
                <UserAvatar
                  :meta-id="nft.val?.owner_info.metaid"
                  :image="nft.val?.owner_info.avatarId"
                  :name="nft.val?.owner_info.name"
                  :meta-name="''"
                />
                <div class="flex1">
                  <div class="owner-msg-item flex flex-align-center">
                    <span class="label">{{ $t('NFT.Owner') }}:</span>
                    <span class="value"
                      ><UserName :name="nft.val?.owner_info.name" :meta-name="''" />
                    </span>
                  </div>
                  <div class="owner-msg-item">
                    <span class="label">MetaID:</span>
                    <span class="value">{{ nft.val!.owner_info.metaid.slice(0, 6) }}</span>
                  </div>
                </div>
              </div>

              <div class="current-price">
                <div class="title">{{ $t('NFT.Current price') }}</div>
                <div class="price flex flex-align-end">
                  <template v-if="isSale">
                    <span class="space">{{ $filters.space(realSalePrice) }} BTC</span>
                    <!-- <span class="curreny"
                      ><AmountVue :price="nft.val!.sale_price" :currency="ToCurrency.BTC"
                    /></span> -->
                  </template>
                  <template v-else>--</template>
                </div>
              </div>

              <div class="redeem">
                <div
                  class="main-border w-20 cursor-pointer py-2 cur primary flex1 flex flex-align-center flex-pack-center"
                  @click="redeeem"
                  :class="[
                    isSale || !isReady ? 'faded' : 'primary',
                    isSale ? 'cursor-not-allowed' : 'cursor-pointer',
                  ]"
                  v-if="isMyNFT && !isDestroyed"
                >
                  {{ $t('NFT.Redeem') }}
                </div>
              </div>
            </div>

            <div class="nft-operate flex flex-align-center">
              <div
                class="main-border  flex1 flex flex-align-center flex-pack-center"
                :class="nftBtnClass"
                @click="nftBtnFunction"
              >
                {{ nftBtnText }}
              </div>

              <div
                class="main-border primary flex1 flex flex-align-center flex-pack-center"
                @click="transfer"
                v-if="isMyNFT && !isSale && isReady && !isDestroyed"
              >
                {{ $t('NFT.Transfer') }}
              </div>
            </div>
          </div>
        </div>

        <div class="nft-other-msg flex">
          <div class="description-warp">
            <div class="nft-other-msg-section" ref="DescriptionWarpRef">
              <div class="nft-other-msg-item">
                <div class="title">{{ $t('NFT.Description') }}</div>
                <div class="content">
                  <div class="description-list">
                    <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Name') }}:</span>
                      <span class="value flex1">{{ nft.val?.nft_name }}</span>
                    </div>
                    <!-- <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Category') }}:</span>
                      <span class="value flex1">
                        <template
                          v-if="nft.val!.nftClassifyList && nft.val!.nftClassifyList.length"
                        >
                          <span v-for="item in nft.val!.nftClassifyList" class="mr-1" :key="item">{{
                            classifyList.find(_item => _item.classify === item)?.name()
                          }}</span>
                        </template>
                        <template v-else>--</template>
                      </span>
                    </div> -->
                    <!-- <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Introduction') }}:</span>
                      <span class="value flex1 drsc">{{ nft.val. || '--' }}</span>
                    </div> -->
                  </div>
                </div>
              </div>

              <div class="nft-other-msg-item">
                <div class="title hover flex flex-align-center" @click="onChangeDetails">
                  <div class="flex1">{{ $t('NFT.Details') }}</div>
                  <Icon name="down" :class="{ active: isShowDetails }" />
                </div>
                <div class="content" v-if="isShowDetails">
                  <div class="description-list">
                    <!-- <div class="description-item flex">
                      <span class="label">TokenID:</span>
                      <span class="value flex1">
                        <template v-if="nft.val.nftTokenId">
                          {{ nft.val.nftTokenId }}
                          <a @click="copy(nft.val!.nftTokenId)">{{ $t('Copy') }}</a
                          ><a @click="tx(nft.val!.nftTokenId)">{{ $t('NFT.Check') }}</a>
                        </template>
                        <template v-else>
                          --
                        </template>
                      </span>
                    </div> -->
                    <!-- <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Create Time') }}:</span>
                      <span
                        class="value flex1"
                        >{{ nft.val!.nftTimestamp ? $filters.dateTimeFormat(nft.val!.nftTimestamp) : '--'}}</span
                      >
                    </div> -->
                    <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Issue TXID') }}:</span>
                      <span class="value flex1">
                        <template v-if="nft.val!.item_pinid">
                          {{ nft.val!.item_pinid}}
                          <a @click="copy(nft.val!.item_pinid)">{{ $t('Copy') }}</a>
                          <a @click="tx(nft.val!.item_pinid)">{{ $t('NFT.Check') }}</a>
                        </template>
                        <template v-else>--</template>
                      </span>
                    </div>

                    <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Creator') }}:</span>
                      <span class="value flex1 flex flex-align-center">
                        <div class="creator flex flex-align-center">
                          <UserAvatar
                            :meta-id="nft.val!.creator_info.metaid"
                            :image="''"
                            :name="''"
                            :meta-name="''"
                          />
                          <div class="flex1">
                            <div class="username">
                              <UserName :name="''" :meta-name="''" />
                            </div>
                            <div class="meta-id">
                              MetaID: {{ nft.val!.creator_info.metaid.slice(0, 6) }}
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="flex1">
            <div
              class="nft-other-msg-section flex flex-v"
              :style="{ height: recordWarpHeight + 'px' }"
            >
              <div class="nft-other-msg-item flex1 flex flex-v">
                <div class="title">{{ $t('NFT.Record') }}</div>
                <div class="content flex1 flex flex-v">
                  <NFTDetailRecord
                    :genesis="(route.params.genesis as string)"
                    :codehash="(route.params.codehash as string)"
                    :token-index="(route.params.tokenIndex as string)"
                    :chain="(route.params.chain as string)"
                  />
                </div>
              </div>
            </div>
          </div> -->
        </div>

        <!-- <div class="more-nft" v-if="nft.val!.nftTopicType && nfts.length">
          <div class="title">{{ $t('NFT.More from this collection') }}</div>
          <ElRow :gutter="gutter" class="more-nft-list">
            <ElCol
              :xs="12"
              :sm="12"
              :md="6"
              :lg="6"
              :xl="6"
              v-for="item in nfts"
              :key="item.nftTokenIndex"
            >
              <NFTItem :nft="item" @buy="onBuy" @sale="onSale" @offsale="onOffSale" />
            </ElCol>
          </ElRow>
        </div> -->
      </div>

      <NFTSellVue :nft="currentNFT.val!" v-model="isShowSell" @success="onOperateSuccess" />
      <NFTBuyVue
        :nft="currentNFT.val!"
        v-model="isShowBuy"
        :is-hide-detail="true"
        @success="onOperateSuccess"
      />
      <NFTTransferVue :nft="nft.val!" v-model="isShowTransfer" @success="onOperateSuccess" />
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import DetailSkeletonVue from './DetailSkeleton.vue'
import NFTCover from '@/components/NFTCover/NFTCover.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import NFTDetail from '@/utils/nftDetail'
import { GetLegalNftDetail } from '@/api/legal'
import ShareIcon from '@/assets/images/icon_share.svg?url'
import { useI18n } from 'vue-i18n'
import ListIcon from '@/assets/images/list_icon_ins.svg?url'
import CastingIcon from '@/assets/images/icon_casting.svg?url'
import { GetNFT, GetNftHolderList, GetCollectionNFTs } from '@/api/aggregation'
import { pagination, classifyList } from '@/config'
import Decimal from 'decimal.js-light'
import LinkIcon from '@/assets/images/list_icon_link.svg?url'
import { ArrowDown } from '@element-plus/icons-vue'
import { isMobile, useRootStore } from '@/stores/root'
import PayConfirmVue from '@/components/PayConfirm/PayConfirm.vue'
import { UnitName } from '@/config'
import NFTSellVue from '@/components/NFTSell/NFTSell.vue'
import NFTBuyVue from '@/components/NFTBuy/NFTBuy.vue'
import { checkUserLogin, tx, calcNftRealSalePrice, openLoading } from '@/utils/util'
import AmountVue from '@/components/Amount/Amount.vue'
import NFTTransferVue from '@/components/NFTTransfer/NFTTransfer.vue'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { Chains, NFTOperateType, NFTSellType, NodeName, ToCurrency } from '@/enum'
import NFTDetailRecord from './components/NFTDetailRecord.vue'
import NFTItem from '@/components/NFTItem/NFTItem.vue'
import DetailSkeleton from './DetailSkeleton.vue'
import { GetCollectByTopicType } from '@/api/strapi'
import {
  IsMyNFT,
  IsSale,
  NFTOffSale,
  NFTRedeem,
  isDestory,
  isNFTCanOperate,
  IsReady,
} from '@/utils/nft'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNFTItemDetail } from '@/api/mrc721-api'
import { useConnectionStore } from '@/stores/connection'
import { sleep } from '@/utils/util'
import { useNFTEntity } from '@/hooks/use-nft-entity'

import { NftsLaunchPadChainSymbol, PlatformRate } from '@/data/constants'
import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
import { checkDummyAmount } from '@/hooks/use-buildtx-entity'
const isShowSkeleton = ref(true)
const isShowDrscDetail = ref(false)
const userStore = useUserStore()
const route = useRoute()
const i18n = useI18n()
const tabIndex = ref(0)
const { getUserAllInfo } = useMetaIDEntity()
const rootStore = useRootStore()
const isShowDetails = ref(false)
const recordWarpHeight = ref(0)
const DescriptionWarpRef = ref()
const nfts: NftOrderType[] = reactive([])
const isLikeing = ref(false)
const collection: { val: null | Collect } = reactive({ val: null })
const currentNFT: { val: null | NftOrderType } = reactive({ val: null })
const gutter = window.innerWidth > 750 ? 22 : 10
const connectionStore = useConnectionStore()
const nftEntity = useNFTEntity()
const isSale = computed(() => {
  return IsSale(nft.val)
})

const isDestroyed = computed(() => {
  return isDestory(nft.val)
})

const isMyNFT = computed(() => {
  return IsMyNFT(nft.val)
})

const isReady = computed(() => {
  return IsReady(nft.val)
})

const nft: { val: NftOrderType | null } = reactive({
  val: null,
})

const records: GetNftHolderListResItem[] = reactive([])

const ownerHistoryPagination = reactive({
  ...pagination,
})

const ownerRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})

const issueRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})
const isShowBuy = ref(false)
const isShowTransfer = ref(false)

const realSalePrice = computed(() => {
  const { total } = calcNftRealSalePrice(nft.val!.sale_price, nft.val!.royalty_rate)
  return total
})

const realbuyPrice = computed(() => {
  return calcNftRealSalePrice(nft.val!.sale_price, nft.val!.royalty_rate)
})

const nftBtnText = computed(() => {
  if (isMyNFT.value) {
    if (isSale.value) {
      return i18n.t('NFT.Off Sale')
    } else if (isDestroyed.value) {
      return i18n.t('NFT.isDestroyed')
    } else {
      return i18n.t('NFT.Sale')
    }
  } else {
    if (isSale.value) {
      if (!isReady.value) {
        return i18n.t('NFT.in_mempool')
      }

      return i18n.t('NFT.Buy Now')
    } else if (isDestroyed.value) {
      return i18n.t('NFT.isDestroyed')
    } else {
      return i18n.t('NFT.NotCanBuy')
    }
  }
})

const nftBtnClass = computed(() => {
  if (isDestroyed.value) {
    return 'gray'
  } else if (isMyNFT.value) {
    return ''
  } else {
    if (isSale.value) {
      if (!isReady.value) {
        return 'gray'
      }
      return 'primary'
    } else {
      return 'faded'
    }
  }
})

const isShowSell = ref(false)

async function redeeem() {
  if (isSale.value) {
    return ElMessage.error(`${i18n.t('offsale not allowed')}`)
  }
  if (!isReady.value) {
    return ElMessage.error(`${i18n.t('NFT.in_mempool')}`)
  }
  if (isDestroyed.value) {
    return ElMessage.error(`${i18n.t('is_destory not allowed')}`)
  }
  const loading = openLoading({ text: i18n.t('NFT.redeeming') })
  try {
    await checkUserLogin()

    const redeeemRes = await nftEntity.redeemNft({
      nftPinid: nft.val!.item_pinid,
      collectionPinid: nft.val!.collection_pinid,
      psbtHex: nft.val!.order_id,
      mintPrice: nft.val!.mint_price,
    })
    if (redeeemRes.txid) {
      loading.close()
      ElMessage.success(i18n.t('NFT.redeeem Success'))
      nft.val!.is_destroy = 1
      onOperateSuccess(nft.val!)
    } else {
      loading.close()
      throw new Error(redeeemRes.msg)
    }
  } catch (error) {
    loading.close()
    ElMessage.error(error as any)
  }
}

async function nftBtnFunction() {
  if (isDestroyed.value) {
    return
  }
  if (isMyNFT.value) {
    if (isSale.value) {
      offSale(nft.val!)
    } else {
      currentNFT.val = nft.val
      isShowSell.value = true
    }
  } else {
    if (isSale.value) {
      await checkUserLogin()
      if (!isReady.value) {
        return
      }
      // currentNFT.val = nft.val
      // isShowBuy.value = true
      await onBuy(nft.val!)
    } else {
      return
    }
  }
}

function getDetail() {
  return new Promise<void>(async resolve => {
    const res = await getNFTItemDetail({
      collectionPinid: route.params.collectionpinid as string,
      nftPinid: route.params.nftpinid as string,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 200) {
      const creatorInfo = await getUserAllInfo(res.data.creator_info.address)
      const ownerInfo = await getUserAllInfo(res.data.owner_info.address)
      console.log('ownerInfo', ownerInfo)
      if (connectionStore.last.user.address) {
        res.data.creator_info = {
          ...res.data.creator_info,
          avatar: creatorInfo.avatar,
          avatarId: creatorInfo.avatarId,
          name: creatorInfo.name,
        }
        res.data.owner_info = {
          ...res.data.owner_info,
          avatar: ownerInfo.avatar,
          avatarId: ownerInfo.avatarId,
          name: ownerInfo.name,
        }
      }

      nft.val = { ...res.data, collection_pinid: route.params.collectionpinid as string }
      currentNFT.val = { ...res.data, collection_pinid: route.params.collectionpinid as string }
      // if (nft.val!.nftTopicType) {
      //   GetCollectByTopicType(nft.val!.nftTopicType).then(res => {
      //     if (res) collection.val = res
      //   })
      //   getNFTs()
      // }
      resolve()
    }
  })
}

async function offSale(item: NftOrderType) {
  try {
    await checkUserLogin()
    const result = await NFTOffSale(item).catch(error => {
      ElMessage.error(error.message)
    })
    if (result) {
      onOperateSuccess(result)
    }
  } catch (error) {
    ElMessage.error(error as any)
  }
}

function toSale() {
  return ElMessage.info(i18n.t('Comming Soon'))
  // isShowSell.value = true
}

// 分享
function share() {
  const value = `${i18n.t('shareText1')}\r\n ${nft.val!.nft_name}:${window.location.href}`
  toClipboard(value)
    .then(() => {
      ElMessage.success(i18n.t('copyShareSuccess'))
    })
    .catch(() => {
      ElMessage.success(i18n.t('copyerror'))
    })
}

function transfer() {
  // return ElMessage.info(i18n.t('Comming Soon'))
  isShowTransfer.value = true
}

function onChangeDetails() {
  isShowDetails.value = !isShowDetails.value
  if (!isMobile) {
    nextTick(() => {
      recordWarpHeight.value = DescriptionWarpRef.value?.clientHeight
    })
  }
}

// function getNFTs() {
//   return new Promise<void>(async (resolve, reject) => {
//     const res = await GetCollectionNFTs({
//       topicType: nft.val!.nftTopicType,
//       page: 1,
//       pageSize: 5,
//       sellType: NFTSellType.All,
//     }).catch(error => {
//       ElMessage.error(error.message)
//     })
//     if (res?.code === 0) {
//       nfts.length = 0
//       res.data.results.items = res.data.results.items.filter(
//         item => item.nftTokenIndex !== nft.val!.nftTokenIndex
//       )
//       if (res.data.results.items.length === 5) {
//         res.data.results.items.splice(4, 1)
//       }
//       nfts.push(...res.data.results.items)
//       resolve()
//     }
//   })
// }

// async function payLike() {
//   await checkUserLogin()
//   if (nft.val?.nftHasLike || isLikeing.value) return
//   isLikeing.value = true
//   const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
//   const payAddress = nft.val!.nftIssueAddress
//   const res = await userStore
//     .showWallet!.createBrfcChildNode({
//       nodeName: NodeName.PayLike,
//       data: JSON.stringify({
//         createTime: new Date().getTime(),
//         isLike: '1',
//         likeTo: nft.val?.nftIssueMetaTxId,
//         pay: payAmount,
//         payTo: payAddress,
//       }),
//       payTo: [{ amount: payAmount, address: payAddress }],
//     })
//     .catch(error => {
//       ElMessage.error(error.message)
//       isLikeing.value = false
//     })
//   if (res) {
//     ElMessage.success(i18n.t('NFT.Like Success'))
//     nft.val!.nftHasLike = true
//     nft.val!.nftLikeCount++
//     isLikeing.value = false
//   }
// }
async function onBuy(item: NftOrderType) {
  currentNFT.val = item
  //isShowBuy.value = true
  try {
    await checkUserLogin()
    const result = await isNFTCanOperate({
      nftPinid: item.item_pinid,
    })
    if (result) {
      const buyRes = await nftEntity.buyNft({
        psbtHex: item.order_id,
        buyerAddress: connectionStore.last.user.address,
        nftPinid: item.item_pinid,
        chain: NftsLaunchPadChainSymbol.btc,
        extraFee: {
          salePrice: realbuyPrice.value.salePrice,
          platformFee: realbuyPrice.value.platformFee,
          royalFee: realbuyPrice.value.royaltyFee,
          platformRate: PlatformRate,
        },
      })

      if (buyRes) {
        ElMessage.success(i18n.t('NFT.Buy Success'))
        onOperateSuccess(item)
        // emit('update:modelValue', false)
        // buying.value = false
        //isShowSuccess.value = true
        // emit('success',)
      } else {
        //ElMessage.success(buyRes)
        //buying.value = false
      }

      // if (currentPayPlatform.value === PayPlatform.SPACE) {
      //   const params: any = {
      //     genesis: props.nft.nftGenesis,
      //     codehash: props.nft.nftCodehash,
      //     tokenIndex: props.nft.nftTokenIndex,
      //     sellTxId: props.nft.nftSellTxId,
      //     sellContractTxId: props.nft.nftSellContractTxId,
      //     sellUtxo: {
      //       txId: props.nft.nftSellContractTxId,
      //       outputIndex: 0,
      //       sellerAddress: props.nft.nftOwnerAddress,
      //       price: props.nft.nftPrice,
      //     },
      //   }
      //   const publisherFeeRate = platformFeeRate.value / 100
      //   const creatorFeeRate = royalyFeeRate.value / 100
      //   if (publisherFeeRate) {
      //     params.publisherFeeRate = publisherFeeRate
      //     params.publisherAddress = nftFee.val!.platformAddress
      //   }
      //   if (creatorFeeRate) {
      //     params.creatorFeeRate = creatorFeeRate
      //     params.creatorAddress = props.nft.nftIssueAddress
      //   }
      //   const res = await userStore.showWallet.createBrfcChildNode(
      //     {
      //       nodeName: NodeName.nftBuy,
      //       data: JSON.stringify(params),
      //     },
      //     {
      //       payType: SdkPayType.SPACE,
      //     }
      //   )
      //   if (res) {
      //     ElMessage.success(i18n.t('NFT.Buy Success'))
      //     emit('update:modelValue', false)
      //     buying.value = false
      //     isShowSuccess.value = true
      //   } else if (res === null) {
      //     buying.value = false
      //   }
      // } else {
      //   const res = await CreatePayOrder({
      //     platform: currentPayPlatform.value,
      //     fullPath: setPayQuitUrl({
      //       payPlatform: currentPayPlatform.value!,
      //       fullPath: route.fullPath,
      //       isBlindbox: false,
      //     }),
      //     goods_name: props.nft!.nftName,
      //     count: 1,
      //     product_type: ProductType.LegalNft, // 100-ME, 200-Legal_NFT,

      //     // 购买合约 NFT
      //     genesis: props.nft.nftGenesis,
      //     codehash: props.nft.nftCodehash,
      //     contract: props.nft.nftSellContractTxId,
      //     tokenIndex: props.nft.nftTokenIndex,
      //   })
      //   if (res) {
      //     payMsg.amount = res.pay_amount!.toString()
      //     payMsg.orderId = res.order_id
      //     payMsg.pay_decimal_num = res.pay_decimal_num
      //     payMsg.url = res.url
      //     buying.value = false
      //     emit('update:modelValue', false)
      //     nextTick(() => {
      //       isShowPayModal.value = true
      //     })
      //   }
      // }
    }
  } catch (error) {
    ElMessage.error((error as any).message)
    //buying.value = false
  }
}
function onSale(item: NftOrderType) {
  currentNFT.val = item
  isShowSell.value = true
}

function onOffSale(item: NftOrderType) {
  offSale(item)
}

async function onOperateSuccess(item: NftOrderType) {
  if (
    nft.val!.item_pinid === item.item_pinid &&
    nft.val!.collection_pinid === item.collection_pinid
  ) {
    nft.val = item
  } else {
    const index = nfts.findIndex(
      _item =>
        _item.item_pinid === item.item_pinid && _item.collection_pinid === item.collection_pinid
    )
    if (index > -1) {
      nfts[index] = item
    }
  }
  await sleep(500)
  getDetail()
    .then()
    .catch(e => ElMessage.error(e))
}

onMounted(() => {
  if (route.params.collectionpinid && route.params.nftpinid) {
    getDetail().then(() => {
      isShowSkeleton.value = false
      nextTick(() => {
        recordWarpHeight.value = DescriptionWarpRef.value?.clientHeight
      })
    })
  }
})

watch(
  () => userStore.isAuthorized,
  () => {
    isShowSkeleton.value = true
    getDetail().then(() => {
      isShowSkeleton.value = false
    })
  }
)
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
