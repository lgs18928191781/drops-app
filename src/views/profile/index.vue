<template>
    <div class="profile-wrap">
        <ElSkeleton :loading="isSkeleton" animated>
      <template #template>
        <CollectionSkeleton />
      </template>
  
      <template #default>
        <div class="collection font-sora" id="collection">
        
          <div class="collection-content">
            <!-- collection-avatar -->
            <div class="user-wrap flex items-center justify-between">
                <div class="collection-avatar flex flex-row items-center">
              <UserAvatar
                    :address="currentUser.val.address"
                :meta-id="''"
                :image="currentUser.val.avatarId"
                :name="''"
                :meta-name="''"
                custom-class="w-[100px] h-[100px] rounded-full mr-5"
              />
              <div class="flex flex-col ">
                <div class="text-3xl">{{  currentUser.val.name  }}</div>
                <div class="mt-3 text-lg text-[#807B8D]">MetaID:{{  currentUser.val.metaid.slice(0,6)  }}</div>
              </div>
              
            </div>
            <div @click="copyProfile" class="cursor-pointer hover:scale-110">
                <el-icon :size="18" color="#fff"><Share /></el-icon>
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
            <template v-if="tabActive === ProfileTab.Items">
              <!-- <ElAffix :offset="scrrentWarpOffsetTop">
                <div class="screen flex flex-align-center" id="screen">
                  <div class="flex1"> -->
                    <!-- <a
                      class="main-border flex flex-align-center"
                      @click="isShowFilterWarp = !isShowFilterWarp"
                    >
                      <Icon name="filter" />
                      <template v-if="isShowFilterWarp">{{ $t('NFT.Filter') }}</template>
                    </a> -->
                  <!-- </div> -->
                  <!-- <ElSelect v-model="sortIndex" @change="refreshDatas">
                    <ElOption
                      v-for="(item, index) in sorts"
                      :key="index"
                      :label="item.name()"
                      :value="index"
                    />
                  </ElSelect> -->
                  <!-- <div class="display flex flex-align-center">
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
              </ElAffix> -->
  
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
                    :key="isListLoading ? index : item.item_pinid"
                  >
                  <NFTItemVue
                      :nft="item"
                      @buy="buyNFT"
                      @sale="onSale"
                      @offsale="onOffsale"
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
            <template v-else-if="tabActive === ProfileTab.Listing">

            <div class="table-wrap">
                <el-table :data="saleNfts" height="250" style="width: 100%" row-class-name="table-row-wrap">
                     <!--collection-->
                <el-table-column label="Collection" width="200">
                        <template #default="scope">
                        <div class="flex w-full">
                            <Image class="mr-[6px]" :src="scope.row.item_cover"></Image>
                            <div class="flex w-7/12 flex-col justify-between text-[#fff]">
                                <span class="text-base overflow-ellipsis overflow-hidden whitespace-nowrap">{{ scope.row.nft_name }}</span>
                                <span class="text-xs ml-[8px]">#{{ scope.row.nftPinInfo.number }}</span>
                            </div>
      
                       
                        </div>
                        </template>
                        </el-table-column>
                        <!--type-->
                        <el-table-column label="Type" width="180">
                        <template #default="scope">
                            <div class="text-[#fff] text-sm ">{{ $t('Nfts.sell') }}</div>
                        </template>
                        </el-table-column>
                          <!--price-->
                          <el-table-column label="Price" width="180">
                        <template #default="scope">
                            <div class="text-[#fff] text-sm ">{{ $filters.space(scope.row.total_sale_price) }} BTC</div>
                        </template>
                        </el-table-column>
                          <!--From-->
                          <el-table-column label="From" width="180">
                        <template #default="scope">
                            <div class="text-[#fff] text-sm ">{{ $filters.omitMiddle(scope.row.saler_address) }}</div>
                        </template>
                        </el-table-column>
                            <!--Time-->
                            <el-table-column label="Time" width="200">
                        <template #default="scope">
                            <div class="text-[#fff] text-sm ">{{$filters.fomatISODate(scope.row.updated_at)  }}</div>
                        </template>
                        </el-table-column>

                            <!--Time-->
                            <el-table-column  width="180">
                        <template #default="scope">
                            <div @click="btnFun(scope.row)"  class="cursor-pointer cancel-list w-[120px] text-[#fff] text-sm ">
                                <span>{{btnText }}</span>
                            </div>
                        </template>
                        </el-table-column>
            </el-table>
            </div>



              <!-- <ElAffix :offset="scrrentWarpOffsetTop">
                <div class="screen flex flex-align-center" id="screen"> -->
                  <!-- <div class="flex1"> -->
                    <!-- <a
                      class="main-border flex flex-align-center"
                      @click="isShowFilterWarp = !isShowFilterWarp"
                    >
                      <Icon name="filter" />
                      <template v-if="isShowFilterWarp">{{ $t('NFT.Filter') }}</template>
                    </a> -->
                  <!-- </div> -->
                  <!-- <ElSelect v-model="sortIndex" @change="refreshDatas">
                    <ElOption
                      v-for="(item, index) in sorts"
                      :key="index"
                      :label="item.name()"
                      :value="index"
                    />
                  </ElSelect> -->
                  <!-- <div class="display flex flex-align-center">
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
              </ElAffix> -->
              <!-- <div class="collection-nft-content flex">
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
                  > -->



                    <!-- <NFTItemVue
                      :nft="nft"
                      @buy="buyNFT"
                      @sale="onSale"
                      @offsale="onOffsale"
                      :loading="isSaleListLoading"
                    /> -->
                  <!-- </ElCol>
  
                  <ElCol v-if="!isSaleListLoading && saleNfts.length === 0">
                    <IsNull />
                  </ElCol>
                </ElRow>
              </div> -->
  
              <!-- <LoadMore :pagination="pagination" v-if="!isSaleListLoading && saleNfts.length > 0" /> -->
  
              <!-- <CollectionChart /> -->
            </template>
            <!--Convert-->
            <template v-else>
             
  
              <div class="collection-nft-content flex">
                <!-- <template v-if="isShowFilterWarp">
                  <ElAffix :offset="filterWarpOffsetTop">
                    <CollectionFilterWarp
                      v-model:sell-type="sellType"
                      v-model:price-range="priceRange"
                      @change="refreshDatas"
                    />
                  </ElAffix>
                </template> -->
  
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
                    v-for="(item, index) in convertList"
                    :key="index"
                  >
                  <MetabotItem
                  :nftOwnerInfo="nftOwnerInfo.val"
                      :nft="item"
                      :isSimple="false"
                      :loading="isListLoading"
                      @convert="convertNft"
                    />
                  
                  </ElCol>
  
                  <ElCol v-if="!isListLoading && convertList.length === 0">
                    <IsNull />
                  </ElCol>
                </ElRow>
              </div>
  
              <LoadMore :pagination="pagination" v-if="!isListLoading && convertList.length > 0" />
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
        <!--NFTSaleSuccess-->
        <NFTSaleSuccessVue v-model="isShowSaleSuccess" @success="listSuccessful"></NFTSaleSuccessVue>
      </template>
    </ElSkeleton>

    </div>

  </template>
  
  <script setup lang="ts">
  import { nextTick, onMounted, reactive, ref, computed } from 'vue'
  import { Share} from '@element-plus/icons-vue'
  import { useI18n } from 'vue-i18n'
  import NFTMintItemVue from '@/components/NFTItem/NFTMintItem.vue'
  import NFTItemVue from '@/components/NFTItem/SelfNFTItem.vue'
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
  import NFTSaleSuccessVue from '@/components/NFTsaleSuccess/SaleSuccess.vue'
  import { GetGenesisStatistics } from '@/api/broad'
  import CollectionChart from '../components/CollectionChart.vue'
  import {

  NodeName,
  SdkPayType,
} from '@/enum'
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
    GetMyNFTs,getOwnerNftOnsale,
    GetOwnerNFTsListing,
    preConvert,
    submitConvert,
    
  } from '@/api/mrc721-api'
 
  import { ElMessage } from 'element-plus'

  import { useConnectionStore, ConnectChain,type BaseUserInfo } from '@/stores/connection'
  import { useNetworkStore } from '@/stores/network'
  import { useNFTEntity } from '@/hooks/use-nft-entity'
  import { useFeebStore } from '@/stores/feeb'
  
  import { openLoading, calcNftRealSalePrice, sleep, checkUserLogin,copy } from '@/utils/util'
import MetabotItem from '@/components/NFTItem/MetabotItem.vue'
  import { NftsLaunchPadChainSymbol, PlatformRate } from '@/data/constants'
  import { useMetaIDEntity } from '@/hooks/use-metaid-entity'
  import { checkDummyAmount } from '@/hooks/use-buildtx-entity'
  import BTC from '@/assets/icons/btc.svg?url'
import { GetGenesisNFTs } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'
import Decimal from 'decimal.js-light'
  const networkStore = useNetworkStore()
  const feeStore = useFeebStore()
  const nftEntity = useNFTEntity()
  const i18n = useI18n()
  const route = useRoute()
  const router = useRouter()
  const currentUser:{val:BaseUserInfo}=reactive({
    val:{

    }
  })
  const { getUserAllInfo } = useMetaIDEntity()
  const userStore = useUserStore()
  enum ProfileTab {
    Items = 0,
    Listing = 1,
    Convert = 2
  }

 



  const connectionStore = useConnectionStore()
  const scrrentWarpOffsetTop = ref(0)
  const filterWarpOffsetTop = ref(0)
  const convertNfts: GenesisNFTItem[] = reactive([])
  const gutter = window.innerWidth > 750 ? 22 : 10
  const tabs = [
    {
      name: () => isSelf.value ? i18n.t('NFT.Profile_items') : i18n.t('NFT.Profile_other_items'),
      value: ProfileTab.Items,
    },
    {
      name: () => i18n.t('NFT.Profile_listing'),
      value: ProfileTab.Listing,
    },
    {
      name: () => i18n.t('NFT.Profile_Convert'),
      value: ProfileTab.Convert,
    },
  ]
  const tabActive = ref(ProfileTab.Items)
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
  const isSkeleton = ref(true)
  const isShowContent = ref(false)
  const pagination = reactive({ ...initPagination, pageSize: 24 })
  const nfts: NftItemType[] = reactive([])
  const saleNfts: NftItemType[] = reactive([])
  const nft: { val: NftMintItemType | null } = reactive({ val: null })
  const saleNftItem: { val: NftOrderType | null } = reactive({ val: null })
  const isShowNftBuy = ref(false)
  const isShowNftSale = ref(false)
  const isShowSaleSuccess=ref(false)
  const nftOwnerInfo:{val:BaseUserInfo}=reactive({
    val:{
    address: '',
    avatar: '',
    avatarId: '',
    bio: '',
    bioId: '',
    isInit: false,
    metaid:'',
    name: '',
    nameId: '',
    number: '',
    rootTxId: '',
    soulbondToken: '',
    unconfirmed: '',
  }
  })
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
  
    {
      name: () => i18n.t('NFT.Sort.Number: X to 1'),
      sortType: CollectionSortType.TokenIndex,
      orderType: CollectionOrderType.DESC,
    },
    {
      name: () => i18n.t('NFT.Sort.Number: 1 to X'),
      sortType: CollectionSortType.TokenIndex,
      orderType: CollectionOrderType.ASC,
    },
  ]
  
  const sortIndex = ref(0)

  const convertList = computed(() => {
    debugger
    if (isListLoading.value) {
      return Array.from({ length: pagination.pageSize })
    } else {
      return convertNfts
    }
  })
  
  const list = computed(() => {
    if (isListLoading.value) {
      return Array.from({ length: pagination.pageSize }) as NftItemType[]
    } else {
      return nfts
    }
  })


  const isSelf=computed(()=>{
   
    return connectionStore.last.user.metaid == route.params.metaid
  })
  
  const saleOrderList = computed(() => {
    if (isSaleListLoading.value) {
      return Array.from({ length: pagination.pageSize }) as NftOrderType[]
    } else {
      return saleNfts
    }
  })
  
  const isShowNFTList = computed(() => {
    if ((isMobile && isShowFilterWarp.value) || tabActive.value == ProfileTab.Listing ) {
      return false
    } else {
      return true
    }
  })

  const btnText=computed(()=>{
    if(isSelf.value) {
        return `${i18n.t('Nfts.cancel_list')}`
    }else{
         return `${i18n.t('NFT.Discover More')}`
    }
  })

async function convertNft(nft:GenesisNFTItem){
  //1.转移
  console.log("nft",nft)
  debugger

  const preConvertRes= await preConvert({
    codehash:nft.nftCodehash,
    genesis:nft.nftGenesis,
    tokenIndex:nft.nftTokenIndex,
    nftAddress:connectionStore.userInfo.address,
    nftRawTx:'123'
  })
  if(preConvertRes.code == 200){
    debugger
    const {commitAddress,lockAddress,totalFee,nftRawTx}=preConvertRes.data
    const submitConvertRes= await submitConvert({
      commitAddress:commitAddress,
      lockAddress:lockAddress,
      nftRecevierAddress:connectionStore.userInfo.address,
      collectionPinid:`f673ba2fdcbc478fef736cb120a6ac487a0fedf4c3828296af6a25c57bcf822ei0`,
      feeb:feeStore.getCurrentFeeb,
      buildCommitFee:totalFee
        })
        if(submitConvertRes.code == 200){
          const {commitId,filePinid,psbtHex,fileRawTx,preFee,buildCommitFee,commitAddress,collectionPinid}=submitConvertRes.data
          debugger
          const finalSignRevealRes= await nftEntity.convertNft({
            convertPsbtHex:psbtHex,
            extraFee:new Decimal(preFee).add(buildCommitFee).toNumber(),
            commitAddress,
            collectionPinid,
            nftRawTx:'123',
            fileRawTx,
            commitId,
            filePinid,
            convertAddress:connectionStore.userInfo.address,
            genesis:nft.nftGenesis,
            tokenIndex:nft.nftTokenIndex
          })
          debugger
          if(finalSignRevealRes.revealTxId){
            debugger
            ElMessage.success(`${i18n.t('Nfts.convert_success')}`)
          }


        }

  }
  //mhgReAXohNMYeSLyQBECq76v7fCkYHzean
 

}


  async function copyProfile(){
    const value=`${window.location.origin}${route.fullPath}`
   await copy(value)
  }


  async function getProfileUser(){
    const address=route.params.address
    
    currentUser.val = await getUserAllInfo(address as string)
  }
  
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

 async function getConvertNft(isCover = false){
    return new Promise<void>(async (resolve, reject) => {
      const mvcAddress=await window.metaidwallet.getAddress()
      if (!mvcAddress) {
        reject()
      }
      if(isCover){
        pagination.page = 1
      }
 
      const res = await GetGenesisNFTs({
        address:mvcAddress,
      chain: 'mvc',
      codehash: `e205939ad9956673ce7da9fbd40514b30f66dc35`,
      genesis: `92cbffdd55ae32b4bd68e8a3394815c22c98e2b6`,
      ...pagination,
       
      })
      if (res?.code == 0) {
        debugger
        if (isCover) nfts.length = 0
        if (res.data.results.items.length === 0){
            pagination.nothing = true
        }
        pagination.flag = res.data?.cursor ? res.data.cursor : ''
        convertNfts.push(...res.data.results.items)
        
        nftOwnerInfo.val= await getUserAllInfo(route.params.address as string)
        console.log("nftOwnerAvatarId.value",nftOwnerInfo.val)
        debugger
        resolve()
        // for (let item of res.data) {
        //     item.creator_info = await getUserAllInfo(item.creator_info.address)
        //     item.owner_info = await getUserAllInfo(item.owner_info.address)
        //     nfts.push(item)
            
        // }



        
      }
     
    })
  }
  
  function getDatas(isCover = false) {
    
    return new Promise<void>(async (resolve, reject) => {
      if (!route.params.metaid) {
        reject()
      }
      if(isCover){
        pagination.page = 1
      }
      const res = await GetMyNFTs({
        page: String(pagination.page-1),
        size: String(pagination.pageSize),
        metaid:route.params.metaid as string
      }).catch(error => {
        ElMessage.error(error.message)
      })
      if (res?.code == 200) {
        
        if (isCover) nfts.length = 0
        if (res.data.length === 0){
            
            pagination.nothing = true
        }
        for (let item of res.data) {
            item.creator_info = await getUserAllInfo(item.creator_info.address)
            item.owner_info = await getUserAllInfo(item.owner_info.address)
            nfts.push(item)
            
        }



        
      }
      resolve()
    })
  }
  
  function getSaleDatas(isCover = false) {
    return new Promise<void>(async (resolve, reject) => {
      const res = await GetOwnerNFTsListing({
        page: pagination.page-1,
        pageSize: pagination.pageSize,
        metaid:route.params.metaid as string
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
    
    if (isSkeleton.value || pagination.loading || pagination.nothing || isListLoading.value) return
    pagination.loading = true
    pagination.page++
    
    if(tabActive.value == ProfileTab.Items){
      getDatas().then(() => {
      pagination.loading = false
    
    }).catch(()=>{
        isListLoading.value = false
    })
    }else if(tabActive.value == ProfileTab.Convert){
      getConvertNft().then(() => {
      pagination.loading = false
    
    }).catch(()=>{
        isListLoading.value = false
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
  
async function listSuccessful(){
  try {
    await sleep(500)
    await  getDatas(true)
    isListLoading.value = false
  } catch (error) {
    isListLoading.value = false
  }
  
}

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
            platformRate: PlatformRate,
            royaltyRate:realbuyPrice.value.royaltyRate,
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
  
    //isShowNftBuy.value = true
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

  async function btnFun(item: NftItemType){
    if(isSelf.value){
        await onOffsale(item)
    }else{
        router.push({
    name: 'nftDetail',
    params: {
      collectionpinid:item.collection_pinid,
      nftpinid: item.item_pinid,
    },
  })
    }
  }

 


  
  async function onOffsale(item: NftItemType) {
    try {
        await checkUserLogin()
    const result = await NFTOffSale(item).catch(error => {
     throw new Error(error)
    })
    if (result) {
      onOperateSuccess(result)
      getSaleDatas(true).then()
    }
    } catch (error) {
        
        ElMessage.error((error as any).message)
    }
  }
  
  async function onSale(item: NftOrderType) {
    await checkUserLogin()
    saleNftItem.val = item
    isShowNftSale.value = true
  }
  
  function onOperateSuccess(item: NftItemType,type?:string) {
    if(type == 'onSale'){
        isShowSaleSuccess.value = true
    }
    
    const index = saleNfts.findIndex(_item => _item.order_id === item.order_id)
    if (index > -1) {
      saleNfts[index] = item
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
  
  function changeTab(value: ProfileTab) {
    if (tabActive.value === value) return
    if (value === ProfileTab.Listing) {
      tabActive.value = value
      pagination.page = 1
      pagination.loading = false
      pagination.nothing = false
      saleNfts.length = 0
  
      getSaleDatas(true).then()
    } else if(value === ProfileTab.Items) {
      tabActive.value = value
      pagination.page = 1
      pagination.loading = false
      pagination.nothing = false
      getDatas(true).then(()=>{
        isListLoading.value = false
      }).catch(()=>{
        isListLoading.value = false
      })
    }else if(value === ProfileTab.Convert){
      tabActive.value = value
      pagination.page = 1
      pagination.loading = false
      pagination.nothing = false
      getConvertNft(true).then(()=>{
        isListLoading.value = false
      }).catch(()=>{
        isListLoading.value = false
      })
    }
  }
  getDatas(true)
        .then(() => {
          
          isSkeleton.value = false
        })
        .catch(() => {
          isSkeleton.value = false
        })
        getProfileUser()
//   getCollection()
//     .then(() => {
    
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
  </script>
  
  <style lang="scss" scoped src="./index.scss"></style>
  