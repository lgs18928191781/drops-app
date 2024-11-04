<template>
    <ElSkeleton :loading="isSkeleton" animated>
      <template #template>
        <CollectionSkeleton />
      </template>
  
      <template #default>
        <div class="collection font-sora" id="collection">
          <!-- cover -->
          <Image class="cover" :src="MetabotCollection.banner" />
         
          <div class="collection-content">
            <!-- collection-avatar -->
            <div class="collection-avatar">
              <!-- <UserAvatar
                :address="collection.val?.collection_creator?.address"
                :meta-id="''"
                :image="collection.val?.collection_creator?.avatarId"
                :name="''"
                :meta-name="''"
                custom-class="w-28 h-28 box-border border-4 border-[#fff] shadow-[0px 4px 6px 0px rgba(48, 49, 51, 0.2)] rounded-lg object-cover"
              /> -->
              <Image
                :src="MetabotCollection.icon"
                class="w-28 h-28 box-border border-4 border-[#fff] shadow-[0px 4px 6px 0px rgba(48, 49, 51, 0.2)] rounded-lg object-cover"
              />
            </div>
  
            <!-- collection-msg -->
            <div class="collection-msg flex">
              <div class="flex1">
                <div class="name flex flex-align-center">
                  {{ MetabotCollection.collectionName }} <Icon name="certed" />
                </div>
                <div class="creator flex flex-align-center">
                  {{ $t('NFT.Creater') }}:
                <UserName
                      :metaid="MetabotCollection.metaid"
                      :name="MetabotCollection.collectionName"
                      :meta-name="''"
                  />
                  <!-- <Icon name="center_star" /> -->
                  <!-- <img src="@/assets/images/creatorIcon.png" alt="" class="w-[26px] h-[24px] ml-1" /> -->
                </div>
                <div class="drsc">
                  <template v-if="MetabotCollection.desc.length > 100">
                    <span class="text break-words">
                      {{ MetabotCollection.desc.slice(0, 100) }}...</span
                    ><a @click="isShowContent = true">{{ $t('NFT.Discover More') }}</a>
                  </template>
                  <template v-else>{{ MetabotCollection.desc }}</template>
                </div>
              </div>
              <div class="">
                <div class="statiscs-list">
                  <div class="statiscs-item" v-for="(item, index) in statiscs" :key="index">
                    <div class="flex flex-align-center flex-pack-center">
                      <div class="statiscs-item-warp">
                        <template v-if="item.value !== '0' && item.value !== ''">
                          <div class="value flex flex-align-center">
                            <img class="mr-1" v-if="item.icon" :src="BTC" alt="">
                            <span class="amount">{{ item.value }} </span>
                            <span class="unit">{{ item.unit }}</span>
                            
                          </div>
                        </template>
                        <template v-else>
                          <div class="value">--</div>
                        </template>
                        <div class="label font-bold">{{ item.name() }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- tab -->
            <div class="tab flex flex-align-center">
              <a
                v-for="(item, index) in tabs"
                :key="index"
                :class="{ active: item.value === tabActive }"
                @click="changeTab(item.value)"
                >{{ item.name() }}</a
              >
            </div>
  
            <!-- CollectionWorks -->
            <template v-if="tabActive === NFTCollectTab.CollectionWorks">
              <ElAffix :offset="scrrentWarpOffsetTop">
                <div class="screen flex flex-align-center" id="screen">
                  <div class="flex1">
                    <!-- <a
                      class="main-border flex flex-align-center"
                      @click="isShowFilterWarp = !isShowFilterWarp"
                    >
                      <Icon name="filter" />
                      <template v-if="isShowFilterWarp">{{ $t('NFT.Filter') }}</template>
                    </a> -->
                  </div>
                  <!-- <ElSelect v-model="sortIndex" @change="refreshDatas">
                    <ElOption
                      v-for="(item, index) in sorts"
                      :key="index"
                      :label="item.name()"
                      :value="index"
                    />
                  </ElSelect> -->
                  <div class="display flex flex-align-center">
                    <a
                      @click="changeCell(item.value)"
                      v-for="item in cells"
                      :key="item.value"
                      :class="{ active: item.value === cell.val.value }"
                    >
                      <Icon :name="item.icon" />
                    </a>
                  </div>
                </div>
              </ElAffix>
  
              <div class="collection-nft-content flex">
                <template v-if="isShowFilterWarp">
                  <ElAffix :offset="filterWarpOffsetTop">
                    <CollectionFilterWarp
                      v-model:sell-type="sellType"
                      v-model:price-range="priceRange"
                      @change="refreshDatas"
                    />
                  </ElAffix>
                </template>
  
                <ElRow
                  :gutter="gutter"
                  class="nft-list flex1"
                  v-infinite-scroll="getMore"
                  :infinite-scroll-immediate="false"
                  :infinite-scroll-distance="100"
                  v-if="isShowNFTList"
                >
                  <ElCol
                    :xs="cell.val.xs"
                    :sm="cell.val.sm"
                    :md="cell.val.md"
                    :lg="cell.val.lg"
                    :xl="cell.val.xl"
                    v-for="(item, index) in list"
                    :key="isListLoading ? index : item.nftTokenIndex"
                  >
                    <MetabotItem
                      :nft="item"
                      :isSimple="false"
                      :loading="isListLoading"
                    />
                  </ElCol>
  
                  <ElCol v-if="!isListLoading && nfts.length === 0">
                    <IsNull />
                  </ElCol>
                </ElRow>
              </div>
  
              <LoadMore :pagination="pagination" v-if="!isListLoading && nfts.length > 0" />
            </template>
            <!-- PriceTrend -->
            <template v-else>
              <ElAffix :offset="scrrentWarpOffsetTop">
                <div class="screen flex flex-align-center" id="screen">
                  <div class="flex1">
                    <!-- <a
                      class="main-border flex flex-align-center"
                      @click="isShowFilterWarp = !isShowFilterWarp"
                    >
                      <Icon name="filter" />
                      <template v-if="isShowFilterWarp">{{ $t('NFT.Filter') }}</template>
                    </a> -->
                  </div>
                  <ElSelect v-model="sortIndex" @change="refreshSaleDatas">
                    <ElOption
                      v-for="(item, index) in sorts"
                      :key="index"
                      :label="item.name()"
                      :value="index + 1"
                    />
                  </ElSelect>
                  <div class="display flex flex-align-center">
                    <a
                      @click="changeCell(item.value)"
                      v-for="item in cells"
                      :key="item.value"
                      :class="{ active: item.value === cell.val.value }"
                    >
                      <Icon :name="item.icon" />
                    </a>
                  </div>
                </div>
              </ElAffix>
              <div class="collection-nft-content flex">
                <ElRow
                  :gutter="gutter"
                  class="nft-list flex1"
                  v-infinite-scroll="getMore"
                  :infinite-scroll-immediate="false"
                  :infinite-scroll-distance="100"
                  v-if="!isShowNFTList"
                >
                  <ElCol
                    :xs="cell.val.xs"
                    :sm="cell.val.sm"
                    :md="cell.val.md"
                    :lg="cell.val.lg"
                    :xl="cell.val.xl"
                    v-for="(nft, index) in saleNfts"
                    :key="isSaleListLoading ? index : nft.item_pinid"
                  >
                    <NFTItemVue
                      :nft="nft"
                      @buy="buyNFT"
                      @sale="onSale"
                      @offsale="onOffsale"
                      :loading="isSaleListLoading"
                    />
                  </ElCol>
  
                  <ElCol v-if="!isSaleListLoading && saleNfts.length === 0">
                    <IsNull />
                  </ElCol>
                </ElRow>
              </div>
  
              <LoadMore :pagination="pagination" v-if="!isSaleListLoading && saleNfts.length > 0" />
  
              <!-- <CollectionChart /> -->
            </template>
          </div>
        </div>
  
        <ContentModal
          v-model="isShowContent"
          :title="collection.val?.name"
          :content="collection.val?.nft_desc"
        />
  
        <!-- NFTBuy -->
        <NFTBuy :nft="saleNftItem.val!" v-model="isShowNftBuy" @success="onOperateSuccess" />
        <!-- NFTSlae -->
        <NFTSellVue :nft="saleNftItem.val!" v-model="isShowNftSale" @success="onOperateSuccess" />
      </template>
    </ElSkeleton>
  </template>
  
  <script setup lang="ts">
  import { nextTick, onMounted, reactive, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import MetabotItem from '@/components/NFTItem/MetabotItem.vue'
  import NFTItemVue from '@/components/NFTItem/NFTItem.vue'
  import { GetCollect, GetCollectByTopicType } from '@/api/strapi'
  import { useRoute, useRouter } from 'vue-router'
  import ContentModal from '@/components/ContentModal/ContentModal.vue'
  import { GetCollectionNFTs } from '@/api/aggregation'
  import { initPagination } from '@/config'
  import LoadMore from '@/components/LoadMore/LoadMore.vue'
  import NFTBuy from '@/components/NFTBuy/NFTBuy.vue'
  import { CollectionOrderType, CollectionSortType, NFTSellType } from '@/enum'
  import CollectionFilterWarp from '@/views/nft/components/CollectionFilterWarp.vue'
  import CollectionSkeleton from '@/views/nft/collection/CollectionSkeleton.vue'
  import IsNull from '@/components/IsNull/IsNull.vue'
  import { isMobile } from '@/stores/root'
  import { satoshi, space } from '@/utils/filters'
  import NFTSellVue from '@/components/NFTSell/NFTSell.vue'
  import { GetGenesisStatistics } from '@/api/broad'
  import CollectionChart from '../components/CollectionChart.vue'
  import { GetGenesisNFTs, GetNFTs } from '@/api/aggregation'
  import {
    NFTOffSale,
    IsMyNFT,
    IsSale,
    NFTRedeem,
    isDestory,
    isNFTCanOperate,
    IsReady,
  } from '@/utils/nft'
  import {
    getCollectionDetail,
    getCollectionMintAmout,
    getCollectionMintableList,
    getPoolInfo,
    getSaleOrderList,
    getPriceRecord,
  } from '@/api/mrc721-api'
  import { ElMessage } from 'element-plus'
  import { useConnectionStore, ConnectChain } from '@/stores/connection'
  import { useNetworkStore } from '@/stores/network'
  import { useNFTEntity } from '@/hooks/use-nft-entity'
  import { useFeebStore } from '@/stores/feeb'
  
  import { openLoading, calcNftRealSalePrice, sleep, checkUserLogin } from '@/utils/util'
  
  import { NftsLaunchPadChainSymbol, PlatformRate,MinRoyaltyFee,MinPlatformFee } from '@/data/constants'
  import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
  import { checkDummyAmount } from '@/hooks/use-buildtx-entity'
  import BTC from '@/assets/icons/btc.svg?url'
  const networkStore = useNetworkStore()
  const feeStore = useFeebStore()
  const nftEntity = useNFTEntity()
  const i18n = useI18n()
  const route = useRoute()
  const router = useRouter()
  const { getUserAllInfo } = useMetaIDEntity()
  const nftPagination = reactive({ ...initPagination })
  enum NFTCollectTab {
    CollectionWorks = 0,
    PriceTrend = 1,
  }
  const connectionStore = useConnectionStore()
  const scrrentWarpOffsetTop = ref(0)
  const filterWarpOffsetTop = ref(0)
  const gutter = window.innerWidth > 750 ? 22 : 10
  const tabs = [
    {
      name: () => i18n.t('NFT.My_collection works'),
      value: NFTCollectTab.CollectionWorks,
    },
    {
      name: () => i18n.t('NFT.Collection sale'),
      value: NFTCollectTab.PriceTrend,
    },
  ]
  const tabActive = ref(NFTCollectTab.CollectionWorks)
  const statiscs = reactive([
    {
      name: () => i18n.t('NFT.Initial Price'),
      value: '--',
      unit: 'BTC',
    },
    {
      name: () => i18n.t('NFT.Floor Price'),
      value: '--',
      unit: 'BTC',
    },
    {
      name: () => i18n.t('NFT.Highest Price'),
      value: '--',
      unit: 'BTC',
    },
    {
      name: () => i18n.t('NFT.Circulation'),
      value: '--',
      unit: '',
    },
    {
      name: () => i18n.t('NFT.Minted'),
      value: '--',
      unit: '',
    },
    {
      name: () => i18n.t('NFT.PoolAmount'),
      value: '--',
      unit: 'BTC',
    },
    // {
    //   name: () => i18n.t('NFT.Owner'),
    //   value: '--',
    //   unit: '',
    // },
    {
      name: () => i18n.t('NFT.Blockchain'),
      value: 'Bitcoin',
      unit: '',
      icon:'BTC'
    },
  ])
  const collection: { val: null | NftsCollection } = reactive({ val: null })
  const MetabotCollection={
    banner:`https://cmsapi.nos.art/uploads/metabot_banner_5a940cece6.png`,
    icon:`https://cmsapi.nos.art/uploads/metabot_icon_656afcf2f0.jpeg`,
    metaid:`974e2977d5c9446f7f48fd82c9ea51f82749b9ef7c00d26b73bc450d167d5f31`,
    collectionName:`MetaBot V1 `,
    desc:`Introducing MetaBot, the pioneering robot of the future, residing on the MVC blockchain. It came into existence during the transitional phase between the old and new century of the Internet, carrying the paramount mission of revolutionizing the traditional online world. At its core, MetaBot embodies values like creativity, freedom, and a daring spirit of adventure and combat.

The first-generation MetaBot series consists of remarkable NFTs, boasting a limited total of 999 pieces. Within this collection, 997 pieces are available for purchase on the market, while the exclusive #1 and #2 NFTs remain reserved.

One of the most outstanding aspects of MetaBot is its unique approach to identity. It breaks free from conventional boundaries such as gender, race, and age, celebrating diversity and individuality. Each MetaBot flaunts a distinct appearance that is inviolable, making them truly one-of-a-kind. A MetaBot comprises seven components, including body, head, clothing, ears, mouth, eyes, and hair, each contributing to its distinctive allure.

Furthermore, the true essence of MetaBot lies in the rare ultimate set, comprised of a total of 15 prized pieces. Among these exclusive components, you'll find ShowBot, Tycoon, Athlete, Gangster, Player, Cat, Incomplete Bot, Musician, Godfather, Child, Rapper, Joker, Thief, Vigilante, and Police, each with its own extraordinary traits and characteristics.

MetaBot stands as an emblem of innovation and limitless possibilities, captivating the hearts of both collectors and enthusiasts within the MetaNet blockchain community. Step into the future and unlock the power of MetaBot – where creativity knows no bounds!`,

  }
  const isSkeleton = ref(false)
  const isShowContent = ref(false)
  const pagination = reactive({ ...initPagination, pageSize: 24 })
  const nfts: GenesisNFTItem[] = reactive([])
  const saleNfts: NftOrderType[] = reactive([])
  const nft: { val: NftMintItemType | null } = reactive({ val: null })
  const saleNftItem: { val: NftOrderType | null } = reactive({ val: null })
  const isShowNftBuy = ref(false)
  const isShowNftSale = ref(false)
  const cells = [
    {
      value: 1,
      xs: 24,
      sm: 12,
      md: 8,
      lg: 8,
      xl: 6,
      icon: 'layout-grid-fill',
    },
    {
      value: 0,
      xs: 12,
      sm: 8,
      md: 6,
      lg: 6,
      xl: 4,
      icon: 'grid-fill',
    },
  ]
  const cell = reactive({ val: cells[0] })
  const sellType = ref(NFTSellType.All)
  let priceRange: [string, string] = reactive(['', ''])
  const isShowFilterWarp = ref(false)
  const isListLoading = ref(false)
  const isSaleListLoading = ref(false)
  const sorts = [
    {
      name: () => i18n.t('NFT.Sort.Price low to high'),
      sortType: CollectionSortType.Price,
      orderType: CollectionOrderType.ASC,
    },
    {
      name: () => i18n.t('NFT.Sort.Price high to low'),
      sortType: CollectionSortType.Price,
      orderType: CollectionOrderType.DESC,
    },
    {
      name: () => i18n.t('NFT.Sort.realease_time'), //i18n.t('NFT.Sort.Default Ranking'),
      sortType: CollectionSortType.Default,
      orderType: CollectionOrderType.ASC,
    },
  
    // {
    //   name: () => i18n.t('NFT.Sort.Number: X to 1'),
    //   sortType: CollectionSortType.TokenIndex,
    //   orderType: CollectionOrderType.DESC,
    // },
    // {
    //   name: () => i18n.t('NFT.Sort.Number: 1 to X'),
    //   sortType: CollectionSortType.TokenIndex,
    //   orderType: CollectionOrderType.ASC,
    // },
  ]
  
  const sortIndex = ref(1)
  
  const list = computed(() => {
    if (isListLoading.value) {
      return Array.from({ length: pagination.pageSize }) as GenesisNFTItem[]
    } else {
      return nfts
    }
  })
  

  
  const isShowNFTList = computed(() => {
    if ((isMobile && isShowFilterWarp.value) || tabActive.value == NFTCollectTab.PriceTrend) {
      return false
    } else {
      return true
    }
  })
  
  async function mintItem(nft: NftMintItemType) {
    console.log('aaaa', nft)
  
    const loading = openLoading()
    try {
      await checkUserLogin()
      //const checkDummyRes= await checkDummyAmount()
  
      // if(!checkDummyRes){
      //   throw new Error(`get dummy utxo error`)
      // }
  
      // await sleep(500)
  
      const res = await nftEntity.mintItem({
        commitAddress: nft.commit_address,
        collectionPinid: collection.val?.collection_pinid!,
        receiverAddress: connectionStore.userInfo.address,
        feeb: feeStore.getCurrentFeeb,
      })
  
      if (res?.code == 200) {
        loading.close()
        nfts.forEach(item => {
          if (item.commit_address == nft.commit_address) {
            item.is_minted = 1
          }
        })
        await sleep(1000)
        refreshDatas()
      } else {
        loading.close()
      }
    } catch (error) {
      loading.close()
      return ElMessage.error(`${(error as any).message}`)
    }
  }
  
  function getCollectionCreator(address: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const needInfo = {
          network: connectionStore.last.network || networkStore.network,
          currentAddress: address,
        }
  
        const user = await connectionStore.last.getUser({ ...needInfo })
        if (collection.val) {
          collection.val.collection_creator = user
          resolve()
        } else {
          reject()
        }
      } catch (error) {
        reject()
      }
    })
  }

  function getGenesisNTFs(isCover = false) {
  if (isCover) {
    nftPagination.flag = ''
  }
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetGenesisNFTs({
      address:`n11W7vY8JnmXpx73Sr4wimP2fHwKQg61A7`,
      chain: `mvc`,
      codehash: `e205939ad9956673ce7da9fbd40514b30f66dc35`,
      genesis: `45bedfa465383df5711ce8d3ca7521e69931040a`,
      ...nftPagination,
    })
    
    if (res.code === 0) {
        
      if (isCover) nfts.length = 0
      if (res.data.results.items.length === 0) nftPagination.nothing = true
      nftPagination.flag = res.data?.cursor ? res.data.cursor : ''
      nfts.push(...res.data.results.items)
      resolve()
    }
  })
}

  
  function getDatas(isCover = false) {
    
    return new Promise<void>(async (resolve, reject) => {
      if (!collection.val) {
        reject()
      }
      const res = await getCollectionMintableList({
        collectionPinid: collection.val?.collection_pinid!,
        page: pagination.page,
        pageSize: pagination.pageSize,
      }).catch(error => {
        ElMessage.error(error.message)
      })
      if (res?.code == 200) {
        if (isCover) nfts.length = 0
        if (res.data.result.length === 0) pagination.nothing = true
        nfts.push(...res.data.result)
      }
      resolve()
    })
  }
  
  function getSaleDatas(isCover = false) {
    return new Promise<void>(async (resolve, reject) => {
      if(isCover){
        pagination.page = 1
      }
      
      const res = await getSaleOrderList({
        collectionPinid: collection.val?.collection_pinid!,
        page: pagination.page,
        pageSize: pagination.pageSize,
        orderType:sortIndex.value
      }).catch(error => {
        ElMessage.error(error.message)
      })
  
      if (res?.code == 200) {
        
        if (isCover) saleNfts.length = 0
        if (res.data.length === 0) pagination.nothing = true
        for (let item of res.data) {
          if (connectionStore.last.user.address) {
            item.creator_info = await getUserAllInfo(item.creator_info.address)
            item.owner_info = await getUserAllInfo(item.saler_address)
          }
        }
        
        saleNfts.push(...res.data)
      }
      resolve()
    })
  }
  
  function getCollection() {
    
    return new Promise<void>(async (resolve, reject) => {
      
      const res = await getCollectionDetail({
        collectionPinid: route.params.topicType as string,
      })
      
      if (res.code == 200) {
        
        const mintRes = await getCollectionMintAmout({
          collectionPinid: res.data.result.collection_pinid,
        })
  
        // for(let item of res.data.result){
        //   getUserAllInfo(item.collection_creator.address).then(res=>{
  
        //   })
        // }
  
        // getCollectionCreator(res.data.result.address).then((res)=>{
  
        // }).catch(()=>{
  
        //   reject()
        // })
        
        if (mintRes.code == 200 && (mintRes.data.mintAmout > 0 || mintRes.data.currentSupply > 0)) {
          const collectionCreator = await getUserAllInfo(res.data.result.address)
          const { mintAmout, currentSupply, currentMintPrice } = mintRes.data
          if (connectionStore.last.user.address) {
            res.data.result.collection_creator = collectionCreator
          } else {
            res.data.result.collection_creator = mintRes.data.creatorInfo
          }
  
          collection.val = {
            ...res.data.result,
            current_supply: currentSupply,
            minted: mintAmout,
            current_mint_price: currentMintPrice ? currentMintPrice : res.data.result.init_price,
          }
          
  
          const priceRes = await getPriceRecord({
            collectionPinid: route.params.topicType as string,
          })
          
          if (priceRes.code == 200 && priceRes.data.floor_price) {
            // debugger
            // const floorRoyaltyFee=collection.val?.royalty_rate > 0 ? priceRes.data.floor_price * (collection.val?.royalty_rate / 100) > MinRoyaltyFee ? priceRes.data.floor_price * (collection.val?.royalty_rate / 100) : MinRoyaltyFee : 0
            // const floorPlatFormRate=priceRes.data.floor_price * (PlatformRate / 100) > MinPlatformFee ? priceRes.data.floor_price * (PlatformRate / 100) : MinPlatformFee
  
            // const hignRoyaltyFee=+collection.val?.royalty_rate > 0 ? priceRes.data.high_price * (collection.val?.royalty_rate / 100) > MinRoyaltyFee ? priceRes.data.high_price * (collection.val?.royalty_rate / 100) : MinRoyaltyFee : 0
            // const highPlatFormRate=priceRes.data.high_price * (PlatformRate / 100) > MinPlatformFee ? priceRes.data.high_price * (PlatformRate / 100) > MinPlatformFee : MinPlatformFee
  
            // const floorPirce=priceRes.data.floor_price + floorRoyaltyFee + floorPlatFormRate
            // const hignPrice=priceRes.data.high_price + hignRoyaltyFee + highPlatFormRate
            statiscs[1].value = space(priceRes.data.floor_price).toString()
            statiscs[2].value = space(priceRes.data.high_price).toString()
          }
  
          statiscs[0].value = space(res.data.result.init_price).toString()
          // statiscs[1].value = space(res.data.result.init_price).toString()
          // statiscs[2].value = space(currentMintPrice).toString()
          statiscs[3].value = res.data.result.total_supply.toString()
          statiscs[4].value = mintAmout.toString()
          getPoolInfo({
            collectionPinid: collection.val?.collection_pinid!,
          }).then(pool => {
            const { pool_total, redeem_total } = pool.data.result
            statiscs[5].value = `${space(pool_total - redeem_total)}`
          })
          resolve()
        } else if (mintRes.code != 200) {
          reject()
          ElMessage.error(mintRes.msg)
        } else {
          reject()
        }
      } else {
        ElMessage.error(res.msg)
        reject()
      }
  
      // const res = await GetCollectByTopicType(route.params.topicType as string).catch(error => {
      //   ElMessage.error(error.message)
      // })
      // if (res) {
      //   collection.val = res
      //   resolve()
      // }
    })
  }
  
  // function getDatas(isCover = false) {
  //   return new Promise<void>(async (resolve, reject) => {
  //     const sort = sorts[sortIndex.value]
  //     const res = await GetCollectionNFTs({
  //       topicType: collection.val!.topicType,
  //       sortType: sort.sortType,
  //       orderType: sort.orderType,
  //       sellType: sellType.value,
  //       startPrice: priceRange[0] ? satoshi(priceRange[0]).toString() : '',
  //       endPrice: priceRange[1] ? satoshi(priceRange[1]).toString() : '',
  //       ...pagination,
  //     }).catch(error => {
  //       ElMessage.error(error.message)
  //     })
  //     if (res?.code === 0) {
  //       if (isCover) nfts.length = 0
  //       if (res.data.results.items.length === 0) pagination.nothing = true
  //       nfts.push(...res.data.results.items)
  //       resolve()
  //     }
  //   })
  // }
  
   function getMore() {
    
    if (isSkeleton.value || pagination.loading || pagination.nothing || isListLoading.value || isSaleListLoading.value) return
    pagination.loading = true
    pagination.page++
    if(tabActive.value == 1){
     
      getSaleDatas().then(()=>{
        
        pagination.loading = false
      })
    }else{
      getDatas().then(() => {
      pagination.loading = false
    })
    }
    
  }
  
  function changeCell(cellValue: number) {
    if (cell.val.value === cellValue) return
    cell.val = cells.find(item => item.value === cellValue)!
  }
  
  const realbuyPrice = computed(() => {
    return calcNftRealSalePrice(saleNftItem.val!.sale_price,saleNftItem.val!.total_sale_price,saleNftItem.val!.royalty_rate)
  })
  
  async function buyNFT(item: NftOrderType) {
    // alert(111)
    console.log(item)
    saleNftItem.val = item
    await checkUserLogin()
    try {
      const result = await isNFTCanOperate({
        nftPinid: item.item_pinid,
      })
      if (result) {
        const buyRes = await nftEntity.buyNft({
          nftItem: item,
          psbtHex: item.order_id,
          buyerAddress: connectionStore.last.user.address,
          nftPinid: item.item_pinid,
          chain: NftsLaunchPadChainSymbol.btc,
          extraFee: {
            salePrice: realbuyPrice.value.salePrice,
            platformFee: realbuyPrice.value.platformFee,
            royalFee: realbuyPrice.value.royaltyFee,
            royaltyRate:realbuyPrice.value.royaltyRate,
            platformRate: PlatformRate,
          },
        })
  
        if (buyRes) {
          ElMessage.success(i18n.t('NFT.Buy Success'))
          onOperateSuccess(item,'buy')
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
  
    //isShowNftBuy.value = true
  }
  
  async function refreshSaleDatas(){
    console.log("isSkeleton.value",isSkeleton.value)
    isSaleListLoading.value=true
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
  
   
    await getSaleDatas(true)
    isSaleListLoading.value=false
    // getSaleDatas(true).then(()=>{
    //   isSaleListLoading.value=true
    // }).catch(()=>{
    //   isSaleListLoading.value=true
    // })
  }
  
  function refreshDatas() {
    isListLoading.value = true
    if (isMobile && isShowFilterWarp.value) {
      isShowFilterWarp.value = false
    }
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    getDatas(true).then(() => {
      isListLoading.value = false
    }).catch(()=>{
      isListLoading.value = false
    })
  }
  
  async function onOffsale(item: NftOrderType) {
    await checkUserLogin()
    const result = await NFTOffSale(item).catch(error => {
      ElMessage.error(error.message)
    })
    if (result) {
      onOperateSuccess(result)
      
      await sleep(500)
       await getSaleDatas(true)
    }
  }
  
  async function onSale(item: NftOrderType) {
    await checkUserLogin()
    saleNftItem.val = item
    isShowNftSale.value = true
  }
  
  function onOperateSuccess(item: NftOrderType,type?:string) {
    
    const index = saleNfts.findIndex(_item => _item.order_id === item.order_id)
    if (index > -1) {
      saleNfts[index] = item
    }
    if(type == 'buy'){
      getSaleDatas(true).then()
    }
  }
  
  function getGenesisStatistics() {
    return new Promise<void>(async resolve => {
      const res = await GetGenesisStatistics(route.params.topicType as string).catch(error => {
        ElMessage.error(error.message)
      })
      if (res?.code === 0) {
        statiscs[0].value = space(res.data.panicPrice).toString()
        statiscs[1].value = space(res.data.minPrice).toString()
        statiscs[2].value = space(res.data.maxPrice).toString()
        statiscs[3].value = res.data.totalSupply.toString()
        statiscs[4].value = res.data.totalHolder.toString()
        resolve()
      }
    })
  }
  
  function changeTab(value: NFTCollectTab) {
    if (tabActive.value === value) return
    if (value === NFTCollectTab.PriceTrend) {
      tabActive.value = value
      pagination.page = 1
      pagination.loading = false
      pagination.nothing = false
      saleNfts.length = 0
  
      getSaleDatas().then()
    } else {
      tabActive.value = value
      pagination.page = 1
      pagination.loading = false
      pagination.nothing = false
    }
  }
  
//   getCollection()
//     .then(() => {
//       getDatas(true)
//         .then(() => {
          
//           isSkeleton.value = false
//         })
//         .catch(() => {
//           isSkeleton.value = false
//         })
//     })
//     .catch(() => {
//       isSkeleton.value = false
//     })
  
  // getCollection().then(() => {
  //   getDatas(true).then(() => {
  //     isSkeleton.value = false
  //     nextTick(() => {
  //       // scrrentWarpOffsetTop.value = document.getElementById('collection')!.offsetTop - 18
  //       // filterWarpOffsetTop.value =
  //       //   document.getElementById('collection')!.offsetTop +
  //       //   document.getElementById('screen')!.clientHeight
  //     })
  //   })
  // })
  // getGenesisStatistics()
  getGenesisNTFs().then(() => {
      nftPagination.loading = false
    })
  </script>
  
  <style lang="scss" scoped src="./index.scss"></style>
  