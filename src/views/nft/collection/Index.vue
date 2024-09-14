<template>
  <div class="collection-index">
    <!-- header -->
    <div class="header flex flex-align-center">
      <div class="flex1">
        <div class="title flex items-center ">
          <span>{{ $t('Collection.title') }}</span>
          <span class="ml-1 text-[#303133] text-base">({{ $t("Collection.display") }})</span>
        </div>
        <div class="drsc">{{ $t('Collection.drsc') }}</div>
      </div>
      <div class="flex flex-align-center chain">
        <span class="label">{{ $t('Collection.Blockchain') }}:</span>
        <ElSelect v-model="currentChain" popper-class="custom-select" @change="onChangeChain">
          <template #prefix>
            <!--
              :class="{ all: currentChain === -1 }"
            -->
            <!-- <img
              class="chain-icon"
              :src="currentChain === -1 ? mvcIcon : $filters.strapiImage(chains.find(item => item.id === currentChain)!.icon?.url)"
            /> -->
            <img
              class="chain-icon"
              :src="btc"
            />
          </template>
          <!-- <ElOption v-for="item in chains" :key="item.id" :label="item.name" :value="item.id">
            <div class="option-item flex flex-align-center">
              
              <img
                class="chain-icon"
                :class="{ all: item.id === -1 }"
                :src="item.id === -1 ? mvcIcon : $filters.strapiImage(item.icon.url)"
              />
              <span class="name flex1">{{ item.name }}</span>
              <span
                class="check flex flex-align-center flex-pack-center"
                v-if="item.id === currentChain"
              >
                <Icon name="check" />
              </span>
            </div>
          </ElOption> -->
        </ElSelect>
      </div>
    </div>

    <!-- collection-list -->
    <ElSkeleton :loading="isSkeleton" animated>
      <div
        class="collection-list"
        v-infinite-scroll="getMore"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
      >
        <RouterLink
          :to="{ name: 'nftCollectionDetail', params: { topicType: item.collection_pinid } }"
          class="collection-item"
          v-for="item in collections"
          :key="item.id"
        >
          <div class="cover">
            <Image :src="item.cover_pinid"  />  
            <div class="seriesName">
              <span>{{ item.name }}</span>
            </div>
          </div>

          <div class="cont">
            <div class="author flex flex-align-center">
              <UserAvatar
                :name="item.collection_creator?.name"
                :image="item.collection_creator?.avatarId"
                :meta-id="item.collection_creator?.metaid"
                :meta-name="''"
              />
              <div class="flex1">
                <div class="name flex flex-align-center">
                  <UserName :name="item.collection_creator?.name" :meta-name="''" />
                  <Icon name="center_star" />
                </div>
                <div class="metaid">MetaID：{{ item.metaid.slice(0, 6) }}</div>
              </div>
            </div>

            <div class="msg-list flex flex-align-center">
              <div class="flex1 msg-item">
                <div class="label">{{ $t('Collection.Floor price') }}</div>
                <div class="value">
                  {{ $filters.Currency(item.floor_price,CurrencyUnit) }}
                  {{ CurrencyUnit.toLocaleUpperCase() }}
                </div>
              </div>
              <div class="flex1 msg-item">
                <div class="label">{{ $t('Collection.Total volume') }}</div>
                <div class="value">
                  {{ item.total_supply ? item.total_supply : '--' }}
                </div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <IsNull v-if="collections.length === 0" />

      <LoadMore :pagination="pagination" v-if="collections.length > 0" />
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { GetChains, Chain, GetCollects } from '@/api/strapi'
import { strapiImage } from '@/utils/filters'
import { reactive, ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Link from '@/assets/icons/link.svg?url'
import { initPagination } from '@/config'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import { Chains } from '@/enum'
import { GetGenesisStatistics } from '@/api/broad'
import btc from '@/assets/nft/btc.png'
import {NftsLaunchPadChain,NftsLaunchPadChainSymbol} from '@/data/constants'
import {getMarketCollectionList,getCollectionMintAmout} from '@/api/mrc721-api'
import {useMetaIDEntity} from '@/hooks/use-metaid-entity'
const chains: Chain[] = reactive([])
const currentChain = ref(NftsLaunchPadChain.btc)
const i18n = useI18n()
const {getUserAllInfo}=useMetaIDEntity()
const pagination = reactive({ ...initPagination })
// const collections: Collect[] = reactive([])
const collections:NftsCollection[]=reactive([])
const isSkeleton = ref(true)
const topicTypeListInfo: GenesisVolumeInfo[] = reactive([])
const mvcIcon = computed(() => {
  return `${import.meta.env.VITE_AdminBaseApi}/uploads/icon_1_ff2def8e32.png`
})
const currentChainById = computed(() => {
  return Chains.BTC
  // switch (currentChain.value) {
  //   case -1:
  //     return Chains.MVC
  //   case 1:
  //     return Chains.ETH
  //   case 2:
  //     return Chains.POLYGON
  //   default:
  //     return Chains.MVC
  
})

const CurrencyUnit = computed(() => {
  if (currentChainById.value == Chains.MVC) {
    return 'SPACE'
  }
  return currentChainById.value
})

function getChains() {
  return new Promise<void>(async (resolve, reject) => {
    let res = await GetChains()
    if (res) {
      res = res.filter(item => item.name !== Chains.MVC.toLocaleUpperCase())
      chains.length = 0
      chains.push(
        {
          created_at: '',
          // @ts-ignore
          icon: `${import.meta.env.VITE_AdminBaseApi}/uploads/icon_1_ff2def8e32.png`, //null,
          id: -1,
          name: 'MVC', //i18n.t('Collection.AllChain'),
          published_at: '',
          symbol: 'mvc',
          updated_at: '',
        },
        ...res
      )

      resolve()
    }
  })
}

// function getDatas(isCover = false) {
//   return new Promise<void>(async (resolve, reject) => {
//     const res = await GetCollects({
//       _start: (pagination.page - 1) * pagination.pageSize,
//       _limit: pagination.pageSize,
//       _sort: 'index:ASC',
//       chain: currentChain.value === -1 ? undefined : currentChain.value,
//     })

//     if (res) {
//       let newRes: Collect[] = []
//       if (isCover) collections.length = 0
//       if (res.length === 0) {
//         pagination.nothing = true
//       } else {
//         pagination.nothing = false
//         for (let i = 0; i < res.length; i++) {
//           const TopicRes = await GetGenesisStatistics(res[i].topicType)
//           if (TopicRes.code == 0) {
//             res[i] = Object.assign(res[i], {
//               floorPrice: TopicRes.data.minPriceOnSell ? TopicRes.data.minPriceOnSell : 0,
//               circulatingSupply: TopicRes.data.totalSupply ? TopicRes.data.totalSupply : 0,
//             })
//             newRes.push(res[i])
//           }
//         }
//         collections.push(...newRes)
//       }
//       resolve()
//     }
//   })
// }

function getDatas(isCover = false){
  return new Promise<void>(async(resolve,reject)=>{
   const res= await getMarketCollectionList({
      chain:NftsLaunchPadChainSymbol.btc,
      page:pagination.page,
      pageSize:pagination.pageSize,
      canMint:true
    })
    if(res.code == 200){
        if(res.data.result.length){
          pagination.nothing = false
          for(let item of res.data.result){
            
            if(item.init_price){
              const mintRes= await getCollectionMintAmout({
                collectionPinid:item.collection_pinid
            })
            
            if(mintRes.code == 200){
              const creator_info= await getUserAllInfo(item.address)
              item.collection_creator=creator_info
              const {mintAmout,currentSupply,currentMintPrice}=mintRes.data
              collections.push({...item,current_supply:currentSupply,minted:mintAmout})
            }
            
            }
            
            
            
          }
        


       
        }else{
          pagination.nothing = true
        }
        resolve()
    }
    
  })
}



function getMore() {
  if (pagination.loading || pagination.nothing) return
  pagination.page++
  pagination.loading = true
  getDatas().then(() => {
    pagination.loading = false
  })
}

function onChangeChain() {
  isSkeleton.value = true
  pagination.page = 1
  topicTypeListInfo.length = 0
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
}

isSkeleton.value = false
// getChains()
getDatas().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
