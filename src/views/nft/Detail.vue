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
              :cover="[
            nft.val!.nftIcon,
            nft.val!.nftBackIcon,
          ]"
              :is-show-prew="true"
              :is-lazy="false"
              :is-remint="nft.val!.nftHasCompound"
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
                  <div class="operate-item flex flex-align-center" @click="payLike">
                    <Icon
                      :name="nft.val!.nftHasLike ? 'message_like' : 'like'"
                      :class="{ 'like-ing': isLikeing }"
                    />
                    <span class="count">{{ nft.val!.nftLikeCount }}</span>
                  </div>
                  <div class="operate-item flex flex-align-center" @click="share">
                    <Icon name="share_nft" />
                  </div>
                </div>
              </div>
              <div class="name">
                {{ nft.val!.nftName }}
              </div>

              <div class="owner flex flex-align-center">
                <UserAvatar
                  :meta-id="nft.val!.nftOwnerMetaId"
                  :image="nft.val!.nftOwnerAvatarImage"
                  :name="nft.val!.nftOwnerName"
                  :meta-name="nft.val!.nftOwnerUserInfo.metaName"
                />
                <div class="flex1">
                  <div class="owner-msg-item flex flex-align-center">
                    <span class="label">{{ $t('NFT.Owner') }}:</span>
                    <span class="value"
                      ><UserName
                        :name="nft.val!.nftOwnerName"
                        :meta-name="nft.val!.nftOwnerUserInfo.metaName"
                      />
                    </span>
                  </div>
                  <div class="owner-msg-item">
                    <span class="label">MetaID:</span>
                    <span class="value">{{ nft.val!.nftOwnerMetaId.slice(0, 6) }}</span>
                  </div>
                </div>
              </div>

              <div class="current-price">
                <div class="title">{{ $t('NFT.Current price') }}</div>
                <div class="price flex flex-align-end">
                  <template v-if="isSale">
                    <span class="space">{{ $filters.space(nft.val!.nftPrice) }} Space</span>
                    <span class="curreny"
                      ><AmountVue :price="nft.val!.nftPrice" :currency="ToCurrency.MVC"
                    /></span>
                  </template>
                  <template v-else>--</template>
                </div>
              </div>
            </div>

            <div class="nft-operate flex flex-align-center">
              <div
                class="main-border flex1 flex flex-align-center flex-pack-center"
                :class="nftBtnClass"
                @click="nftBtnFunction"
              >
                {{ nftBtnText }}
              </div>

              <div
                class="main-border primary flex1 flex flex-align-center flex-pack-center"
                @click="transfer"
                v-if="isMyNFT && !isSale"
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
                      <span class="value flex1">{{ nft.val!.nftName }}</span>
                    </div>
                    <div class="description-item flex">
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
                    </div>
                    <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Introduction') }}:</span>
                      <span class="value flex1 drsc">{{ nft.val.nftDesc || '--' }}</span>
                    </div>
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
                    <div class="description-item flex">
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
                    </div>
                    <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Create Time') }}:</span>
                      <span
                        class="value flex1"
                        >{{ nft.val!.nftTimestamp ? $filters.dateTimeFormat(nft.val!.nftTimestamp) : '--'}}</span
                      >
                    </div>
                    <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Issue TXID') }}:</span>
                      <span class="value flex1">
                        <template v-if="nft.val!.nftIssueMetaTxId">
                          {{ nft.val!.nftIssueMetaTxId}}
                          <a @click="copy(nft.val!.nftIssueMetaTxId)">{{ $t('Copy') }}</a>
                          <a @click="tx(nft.val!.nftIssueMetaTxId)">{{ $t('NFT.Check') }}</a>
                        </template>
                        <template v-else>--</template>
                      </span>
                    </div>

                    <div class="description-item flex">
                      <span class="label">{{ $t('NFT.Creator') }}:</span>
                      <span class="value flex1 flex flex-align-center">
                        <div class="creator flex flex-align-center">
                          <UserAvatar
                            :meta-id="nft.val!.nftIssueMetaId"
                            :image="nft.val!.nftIssueAvatarImage"
                            :name="nft.val!.nftIssuer"
                            :meta-name="nft.val!.nftIssueUserInfo.metaName"
                          />
                          <div class="flex1">
                            <div class="username">
                              <UserName
                                :name="nft.val!.nftIssuer"
                                :meta-name="nft.val!.nftIssueUserInfo.metaName"
                              />
                            </div>
                            <div class="meta-id">
                              MetaID: {{ nft.val!.nftIssueMetaId.slice(0, 6) }}
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

          <div class="flex1">
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
          </div>
        </div>

        <div class="more-nft" v-if="nft.val!.nftTopicType">
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
        </div>
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
import { checkUserLogin, NFTOffSale, tx } from '@/utils/util'
import AmountVue from '@/components/Amount/Amount.vue'
import NFTTransferVue from '@/components/NFTTransfer/NFTTransfer.vue'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { Chains, NFTOperateType, NFTSellType, NodeName, ToCurrency } from '@/enum'
import NFTDetailRecord from './components/NFTDetailRecord.vue'
import NFTItem from '@/components/NFTItem/NFTItem.vue'
import DetailSkeleton from './DetailSkeleton.vue'
import { GetCollectByTopicType } from '@/api/strapi'
import { IsMyNFT, IsSale } from '@/utils/nft'

const isShowSkeleton = ref(true)
const isShowDrscDetail = ref(false)
const userStore = useUserStore()
const route = useRoute()
const i18n = useI18n()
const tabIndex = ref(0)
const rootStore = useRootStore()
const isShowDetails = ref(false)
const recordWarpHeight = ref(0)
const DescriptionWarpRef = ref()
const nfts: GenesisNFTItem[] = reactive([])
const isLikeing = ref(false)
const collection: { val: null | Collect } = reactive({ val: null })
const currentNFT: { val: null | GenesisNFTItem } = reactive({ val: null })
const gutter = window.innerWidth > 750 ? 22 : 10

const isSale = computed(() => {
  return IsSale(nft.val)
})

const isMyNFT = computed(() => {
  return IsMyNFT(nft.val)
})

const nft: { val: GenesisNFTItem | null } = reactive({
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

const nftBtnText = computed(() => {
  if (nft.val?.nftIsOrderLock) {
    return i18n.t('NFT.NFT Order Locked')
  } else if (isMyNFT.value) {
    if (isSale.value) {
      return i18n.t('NFT.Off Sale')
    } else {
      return i18n.t('NFT.Sale')
    }
  } else {
    if (isSale.value) {
      return i18n.t('NFT.Buy Now')
    } else {
      return i18n.t('NFT.NotCanBuy')
    }
  }
})

const nftBtnClass = computed(() => {
  if (nft.val?.nftIsOrderLock) {
    return 'faded'
  } else if (isMyNFT.value) {
    return ''
  } else {
    if (isSale.value) {
      return 'primary'
    } else {
      return 'faded'
    }
  }
})

const isShowSell = ref(false)

function nftBtnFunction() {
  if (nft.val?.nftIsOrderLock) {
    return
  } else if (isMyNFT.value) {
    if (isSale.value) {
      offSale(nft.val!)
    } else {
      currentNFT.val = nft.val
      isShowSell.value = true
    }
  } else {
    if (isSale.value) {
      currentNFT.val = nft.val
      isShowBuy.value = true
    } else {
      return
    }
  }
}

function getDetail() {
  return new Promise<void>(async resolve => {
    const res = await GetNFT({
      genesis: route.params.genesis as string,
      codehash: route.params.codehash as string,
      chain: route.params.chain as string,
      tokenIndex: route.params.tokenIndex as string,
      metaId: userStore.user?.metaId,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      nft.val = res.data.results.items[0]
      currentNFT.val = res.data.results.items[0]
      if (nft.val!.nftTopicType) {
        GetCollectByTopicType(nft.val!.nftTopicType).then(res => {
          if (res) collection.val = res
        })
        getNFTs()
      }
      resolve()
    }
  })
}

async function offSale(item: GenesisNFTItem) {
  const result = await NFTOffSale(item)
  if (result) {
    onOperateSuccess(result)
  }
}

function toSale() {
  return ElMessage.info(i18n.t('Comming Soon'))
  // isShowSell.value = true
}

// 分享
function share() {
  const value = `${i18n.t('shareText1')}\r\n ${nft.val!.nftName}:${window.location.href}`
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
  if (nft.val!.nftChain === 'bsv' || nft.val!.nftChain === 'mvc') {
    isShowTransfer.value = true
  } else {
    ElMessage.info(
      `${i18n.t('NotSupportCurrentChainNFTTransfer')}: ${nft.val!.nftChain.toUpperCase()}`
    )
  }
}

function onChangeDetails() {
  isShowDetails.value = !isShowDetails.value
  if (!isMobile) {
    nextTick(() => {
      recordWarpHeight.value = DescriptionWarpRef.value?.clientHeight
    })
  }
}

function getNFTs() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetCollectionNFTs({
      topicType: nft.val!.nftTopicType,
      page: 1,
      pageSize: 5,
      sellType: NFTSellType.All,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      nfts.length = 0
      res.data.results.items = res.data.results.items.filter(
        item => item.nftTokenIndex !== nft.val!.nftTokenIndex
      )
      if (res.data.results.items.length === 5) {
        res.data.results.items.splice(4, 1)
      }
      nfts.push(...res.data.results.items)
      resolve()
    }
  })
}

async function payLike() {
  await checkUserLogin()
  if (nft.val?.nftHasLike || isLikeing.value) return
  isLikeing.value = true
  const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
  const payAddress = nft.val!.nftIssueAddress
  const res = await userStore
    .showWallet!.createBrfcChildNode({
      nodeName: NodeName.PayLike,
      data: JSON.stringify({
        createTime: new Date().getTime(),
        isLike: '1',
        likeTo: nft.val?.nftIssueMetaTxId,
        pay: payAmount,
        payTo: payAddress,
      }),
      payTo: [{ amount: payAmount, address: payAddress }],
    })
    .catch(error => {
      ElMessage.error(error.message)
      isLikeing.value = false
    })
  if (res) {
    ElMessage.success(i18n.t('NFT.Like Success'))
    nft.val!.nftHasLike = true
    nft.val!.nftLikeCount++
    isLikeing.value = false
  }
}

function onBuy(item: GenesisNFTItem) {
  currentNFT.val = item
  isShowBuy.value = true
}
function onSale(item: GenesisNFTItem) {
  currentNFT.val = item
  isShowSell.value = true
}

function onOffSale(item: GenesisNFTItem) {
  offSale(item)
}

function onOperateSuccess(item: GenesisNFTItem) {
  if (
    nft.val!.nftGenesis === item.nftGenesis &&
    nft.val!.nftCodehash === item.nftCodehash &&
    nft.val!.nftTokenIndex === item.nftTokenIndex
  ) {
    nft.val = item
  } else {
    const index = nfts.findIndex(
      _item =>
        _item.nftGenesis === item.nftGenesis &&
        _item.nftCodehash === item.nftCodehash &&
        _item.nftTokenIndex === item.nftTokenIndex
    )
    if (index > -1) {
      nfts[index] = item
    }
  }
}

onMounted(() => {
  if (route.params.genesis && route.params.codehash && route.params.tokenIndex) {
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
