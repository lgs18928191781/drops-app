<template>
    <div class="inner-page-header container flex flex-align-center">
        <div class="inner-page-header-left flex1">
            <div class="title flex flex-align-center"><img @click="router.back()" src="@/assets/images/bannet_icon_ins.svg" />MetaBot</div>
            <div class="drsc">由各个方块组建的头像NFT…（一段稍微介绍头像的文案）</div>
        </div>
        <div class="search-warp flex flex-align-center">
          <input
            class="flex1"
            v-model="keyword"
            :placeholder="$t('search')"
            @keyup.enter="search"
            type="text"
          />
          <img src="@/assets/images/icon_search.svg" @click="search" />
        </div>
    </div>

    <!-- banner -->
    <div class="banner container">
      <a><img src="@/assets/images/banner.svg" alt="" /></a>
    </div>

    <div class="metabot-tags container">
      <a class="metabot-tag" :class="{'active': sectionIndex === index }" v-for="(section, index) in sections" :key="index" @click="changeSectionIndex(index)">{{section.name}}</a>
    </div>

    <el-skeleton class="meta-bot-list container" :loading="isShowSkeleton" animated :count="pagination.pageSize">
      <template #template>
        <div class="meta-bot-item">
          <div class="cover">
            <el-skeleton-item variant="image" style="width: 100%; height: 100%; display: block; position: absolute; border-radius: 8px 8px 0 0;" />
          </div>
          <div class="cont">
            <div class="name"><el-skeleton-item variant="text" style="width: 30%;" /></div>
            <div class="user-list">
              <div class="user-item flex flex-align-center">
                <el-skeleton-item variant="text" style="width: 60%;" />
              </div>
              <div class="user-item flex flex-align-center">
                <el-skeleton-item variant="text" style="width: 60%;" />
              </div>
            </div>
            <el-skeleton-item class="btn btn-block btn-gray" variant="button " style="width: 100%; box-sizing: border-box; border: none;" />
          </div>
        </div>
      </template>
      <template #default>
        <!-- MetaBot list -->
        <div class="meta-bot-list container">
          <a @click="toDetail(metabot)" class="meta-bot-item" v-for="metabot in metaBots" :key="metabot.nftGenesis + metabot.nftCodehash + metabot.nftTokenIndex ">
            <div class="cover">
              <img :src="metafileUrl(metabot.nftIcon)" :alt="metabot.nftName" />
            </div>
            <div class="cont">
              <div class="name">{{metabot.nftName}}</div>
              <div class="user-list">
                <div class="user-item flex flex-align-center">
                  <img class="avatar" :src="$filters.avatar(metabot.nftIssueMetaId)" />
                  <span class="name">{{metabot.nftIssuer}}</span>
                  <span class="type">({{ $t('creater') }})</span>
                </div>
                <div class="user-item flex flex-align-center">
                  <img class="avatar" :src="$filters.avatar(metabot.nftOwnerMetaId)" />
                  <span class="name">{{metabot.nftOwnerName}}</span>
                  <span class="type">({{ $t('owner') }})</span>
                </div>
              </div>
              <div class="btn btn-block" :class="{'btn-gray': metabot.nftSellState !== 0 || !metabot.nftIsReady  || (store.state.userInfo && store.state.userInfo.metaId === metabot.nftOwnerMetaId) }" @click.stop="buy(metabot)">{{new Decimal(metabot.nftPrice).div(Math.pow(10,8)).toString()}} BSV</div>
            </div>
          </a>
        </div>
      </template>
    </el-skeleton>
    

    <div class="page-footer">
      <LoadMore
        :pagination="pagination"
        @getMore="getMore"
        v-if="metaBots.length > 0 && !isShowSkeleton"
      />
      <IsNull v-else />
    </div>

</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue"
import { useStore } from '@/store'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '../components/IsNull/IsNull.vue'
import { useRouter } from "vue-router"
import { GetMetaBotList, GetMetaBotListBySearch } from "@/api"
import { ElLoading, ElMessage, ElMessageBox, ElSkeleton, ElSkeletonItem } from "element-plus"
import { checkSdkStatus, metafileUrl } from "@/utils/util"
import { useI18n } from "vue-i18n"
import Decimal from "decimal.js-light"


const store = useStore()
const router = useRouter()
const i18n = useI18n()
const isShowSkeleton = ref(true)
const keyword = ref('')
const metaBots: GetMetaBotListResItem [] = reactive([])
const pagination = reactive({
  ...store.state.pagination,
})

const sections = [
  {name: '#001-050', start: 1, end: 20},
  {name: '#051-100', start: 51, end: 100},
  {name: '#101-150', start: 101, end: 150},
  {name: '#151-200', start: 151, end: 200},
]
const sectionIndex = ref(0) 

function search() {
  isShowSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  if (keyword.value === '') {
    sectionIndex.value = 0
    getDatas(true)
  } else {
    sectionIndex.value = -1
    getSearchDatas(true)
  }
}

function toDetail (metabot: GetMetaBotListResItem) {
  router.push({
    name: 'detail',
    params: {
      genesisId: metabot.nftGenesis,
      codehash: metabot.nftCodehash,
      tokenIndex: metabot.nftTokenIndex
    }
  })
}

function getDatas (isCover = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMetaBotList({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      Start: sections[sectionIndex.value].start,
      End: sections[sectionIndex.value].end
    })
    if (res.code === 0) {
      if (isCover) {
        metaBots.length = 0
      }
      if (res.data.results.items.length > 0) {
        metaBots.push(...res.data.results.items)
      } else {
        pagination.nothing = true
      }
      isShowSkeleton.value = false
    }
    resolve()
  })
}

function getSearchDatas (isCover = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMetaBotListBySearch({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      SearchWord: keyword.value
    })
    if (res.code === 0) {
      if (isCover) {
        metaBots.length = 0
      }
      if (res.data.results.items.length > 0) {
        metaBots.push(...res.data.results.items)
      } else {
        pagination.nothing = true
      }
      isShowSkeleton.value = false
    }
    resolve()
  })
}

function getMore () {
  if(pagination.loading || pagination.nothing) return
  pagination.page++
  pagination.loading = true
  if (keyword.value === '') {
    getDatas().then(() => {
      pagination.loading = false
    })
  } else {
    getSearchDatas().then(() => {
      pagination.loading = false
    })
  }
}

function changeSectionIndex (index: number) {
  if (sectionIndex.value === index) return
  sectionIndex.value = index
  isShowSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  keyword.value = ''
  getDatas(true)
}

async function buy(metabot: GetMetaBotListResItem) {
  await checkSdkStatus()

  if (metabot.nftSellState === 1) {
    ElMessage.warning(i18n.t('isBeCancelSelled'))
    return
  } else if (metabot.nftSellState === 2) {
    ElMessage.warning(i18n.t('isBeBuyed'))
    return
  } else {
    if (!metabot.nftIsReady) return
  }

  if (store.state.userInfo) {
    if (store.state.userInfo.metaId === metabot.nftOwnerMetaId) return
  } else {
    return
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })

  

  // const getAddressRes = await GetNFTOwnerAddress({ tokenId: nft.val.tokenId }).catch(() =>
  //   loading.close()
  // )
  // if (getAddressRes && getAddressRes.code === NftApiCode.success) {
    
  // }


  const params = {
      codehash: metabot.nftCodehash,
      genesis: metabot.nftGenesis,
      tokenIndex: metabot.nftTokenIndex,
      genesisTxid: metabot.nftGenesisTxId,
      // address: getAddressRes.data.address,
      sensibleId: metabot.nftSensibleId,
      sellTxId: metabot.nftSellTxId,
      sellContractTxId: metabot.nftSellContractTxId,
      amount: new Decimal(metabot.nftPrice).toNumber()
    }
    // 需要消费金额
    const useAmountRes = await store.state.sdk
      ?.nftBuy({
        checkOnly: true,
        ...params
      })
      .catch(() => {
        loading.close()
      })
    if (useAmountRes?.code === 200) {
      const useAmount = useAmountRes.data.amount! /* + nft.val.amount */
      // 查询用户余额
    const userBalanceRes = await store.state.sdk?.getBalance()
    if (userBalanceRes && userBalanceRes.code === 200) {
      if (userBalanceRes.data.satoshis > useAmount) {
        // 余额足够
        ElMessageBox.confirm(
          `${i18n.t('useAmountTips')}: ${useAmount} SATS`,
          i18n.t('niceWarning'),
          {
            confirmButtonText: i18n.t('confirm'),
            cancelButtonText: i18n.t('cancel'),
            closeOnClickModal: false
          }
        ).then(async () => {
          // 确认支付
          const res = await store.state.sdk?.nftBuy(params).catch(() => {
            loading.close()
          })
          if (res?.code === 200) {
            // nft.val.ownerMetaId = store.state.userInfo!.metaId
            // nft.val.ownerName = store.state.userInfo!.name
            // nft.val.putAway = false
            ElMessage.success(i18n.t('buySuccess'))
            loading.close()
            router.push({ name: 'nftSuccess', 
              params: { 
                genesisId: metabot.nftGenesis,
                tokenIndex: metabot.nftTokenIndex,
                codehash: metabot.nftCodehash
              },
              query: {
                type: 'buyed'
              }
            })

            /* // 上链完 nft buy 协议 要 上报服务器
            const response = await BuyNft({
              tokenId: nft.val.tokenId,
              payMentAddress: store.state.userInfo!.address,
              collectionAddress: nft.val.ownerAddress,
              payTxId: res.data.txid,
              amount: new Decimal(nft.val.amount).toNumber(),
            }).catch(() => loading.close())
              if (response && response.code === NftApiCode.success) {
                nft.val.ownerMetaId = store.state.userInfo!.metaId
                nft.val.ownerName = store.state.userInfo!.name
                nft.val.putAway = false
                ElMessage.success(i18n.t('buySuccess'))
                loading.close()
              } */
            } else {
              loading.close()
              if (res) {
                nftNotCanBuy(res)
              }
            }
          })
          .catch(() => loading.close())
        } else {
          // 余额不足
          loading.close()
          ElMessageBox.alert(
            `
          <p>${i18n.t('useAmountTips')}: ${useAmount} SATS</p>
          <p>${i18n.t('insufficientBalance')}</p>
        `,
            {
              confirmButtonText: i18n.t('confirm'),
              dangerouslyUseHTMLString: true,
            }
          )
          return
        }
      }
    } else {
      loading.close()
      if (useAmountRes) {
        nftNotCanBuy(useAmountRes)
      }
    }
}

function nftNotCanBuy (res: any) {
  if (res.code === 204 && res.data && res.data.message === 'The NFT is not for sale because  the corresponding SellUtxo cannot be found.') {
    ElMessage.error(i18n.t('nftNotCanBuy'))
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    isShowSkeleton.value = true
    getDatas(true)
  }
}


onMounted(() => {
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas(true)
})


// isShowSkeleton.value = false
</script>
<style lang="scss" scoped src="./MetaBot.scss"></style>