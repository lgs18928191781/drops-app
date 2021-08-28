<template>
    <div class="self">
        <div class="banner container">
            <a class="banner-item">
                <img class="cover" src="@/assets/images/banner_bg.svg" />
                <div class="cont">
                    <div class="cont-warp">
                        <div>
                            <div class="title">{{$t('selfTitle')}}</div>
                            <div class="drsc">{{$t('selfDrsc')}}</div>
                        </div>
                        <router-link :to="{ name: 'create' }" class="btn">{{$t('start')}}<img class="icon-right" src="@/assets/images/btn_ins.svg" /></router-link>
                    </div>
                </div>
            </a>
        </div>

        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">{{$t('myUnSellNftSeries')}}</div>
            </div>
            <NftSkeleton
                :loading="isShowNftListSkeleton"
                :count="pagination.pageSize"
                class="section-cont nft-list"
            >
                <template #default>
                    <div class="section-cont nft-list">
                        <template v-for="series in seriesList">
                            <SeriesItem :item="series" />
                        </template>
                    </div>
                </template>
            </NftSkeleton>
        </div>
        <LoadMore :pagination="pagination" @getMore="getMore" />

        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">{{$t('mySellNft')}}</div>
            </div>
            <NftSkeleton
                :loading="isShowSelledNftListSkeleton"
                :count="selledPagination.pageSize"
                class="section-cont nft-list"
            >
                <template #default>
                    <div class="section-cont nft-list">
                        <template v-for="nft in selledNfts" :key="nft.tokenId">
                            <NftItem :item="nft" :isSelf="true" />
                        </template>
                    </div>
                </template>
            </NftSkeleton>
        </div>
        <LoadMore :pagination="selledPagination" @getMore="getSelledMore" />
    </div>
</template>
<script setup lang="ts">
import { GetDeadlineTime, GetMyNftSummaryList, GetMyOnSellNftList, GetMySelledNfts, GetNftIssue, MyNfts, NftApiCode } from '@/api';
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store';
import { reactive, ref } from 'vue';
import SeriesItem from '@/components/SeriesItem/SeriesItem.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue';
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'

const store = useStore()
const pagination = reactive({
    ...store.state.pagination,
    pageSize: 6    
})
const selledPagination = reactive({
    ...store.state.pagination,
    pageSize: 6   
})
const nfts: NftItem [] = reactive([])
const selledNfts: NftItem [] = reactive([])
const isShowNftListSkeleton = ref(true)
const isShowSelledNftListSkeleton = ref(true)
const seriesList: NFTSeriesItem [] = reactive([])



function getMyNfts (isCover: boolean = false) {
    return new Promise<void>(async resolve => {
        const res = await GetMyNftSummaryList({
            Address: store.state.userInfo!.address,
            Page: pagination.page.toString(),
            PageSize: pagination.pageSize.toString(),
        })
        if (res && res.code === 0) {
            if (res.data.results.items.length > 0) {
                res.data.results.items.map(item => {
                    const data: {
                        nftname: string
                        nftdesc: string
                        nfticon: string
                        nftwebsite: string
                        nftissuerName: string
                        nftType: string
                        classifyList: string
                        originalFileTxid: string
                        contentTxId: string
                    } | undefined = item.nftDataStr ? JSON.parse(item.nftDataStr) : undefined
                    seriesList.push({
                        cover: item.nftIcon,
                        name: item.nftSeriesName && item.nftSeriesName !== '' ? item.nftSeriesName : item.nftName ? item.nftName : '--',
                        nftDesc: '',
                        total: item.nftTotalSupply,
                        hasCount: item.nftMyCount,
                        genesis: item.nftGenesis,
                        codehash: item.nftCodehash
                    })
                })
            } else {
                pagination.nothing = true
            }
        }
        isShowNftListSkeleton.value = false
        resolve()
    })
}

// function getMyNfts (isCover: boolean = false) {
//     return new Promise<void>(async resolve => {
//         const res = await GetMyNftSummaryList({
//             address: store.state.userInfo!.address,
//             ...pagination
//         })
//         if (res && res.code === 200) {
//             if (res.data.length > 0) {
//                 res.data.map(item => {
//                     if (item.nftDataStr) item.data = JSON.parse(item.nftDataStr)
//                     nfts.push({
//                         name: item.data ? item.data.nftname : item.nftName,
//                         amount: 0,
//                         foundryName: 'string',
//                         classify: item.data ? JSON.parse(item.data.classifyList) : [],
//                         tokenId: item.nftGenesis + item.nftTokenIndex,
//                         coverUrl: item.data ? item.data.nfticon : item.nftIcon,
//                         putAway: false,
//                         metaId: store.state.userInfo!.metaId,
//                         productName: item.data ? item.data.nftname : item.nftName,
//                         genesis: item.nftGenesis
//                     })
//                 })
//             }
//         }
//         isShowNftListSkeleton.value = false
//         resolve()
//     })
// }

function getMore() {
    pagination.loading = true
    pagination.page++
    getMyNfts().then(() => {
        pagination.loading = false
    })
}

function getSelledMore() {
    selledPagination.loading = true
    selledPagination.page++
    getMySelledNfts().then(() => {
        selledPagination.loading = false
    })
}

getMyNfts()



function getMySelledNfts (isCover: boolean = false) {
    return new Promise<void>(async resolve => {
        const res = await GetMyOnSellNftList({
            Page: selledPagination.page.toString(),
            PageSize: selledPagination.pageSize.toString(),
            Address: store.state.userInfo!.address
        })
        if (res && res.code === 0) {
            if (isCover) {
                selledNfts.length = 0
            }
            if (res.data.results.items.length > 0) {
                for (let i = 0; i < res.data.results.items.length; i++) {
                    const item = res.data.results.items[i]
                    const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : null
                    const deadlineTimeRes = await GetDeadlineTime({
                        codeHash: item.nftCodehash,
                        genesis: item.nftGenesis,
                        tokenIndex: item.nftTokenIndex
                    })
                    selledNfts.push({
                        name: item.nftName ? item.nftName : '--',
                        amount: item.nftPrice,
                        foundryName: item.nftIssuer,
                        classify: data && data.classify ? JSON.parse(data.classify) : [],
                        head: '',
                        tokenId: item.nftGenesis + item.nftTokenIndex,
                        coverUrl: item.nftIcon,
                        putAway: item.nftIsReady,
                        metaId: item.nftIssuer,
                        productName: item.nftName,
                        deadlineTime: deadlineTimeRes && deadlineTimeRes.data && deadlineTimeRes.data.deadlineTime ? deadlineTimeRes.data.deadlineTime : null,
                        genesis: item.nftGenesis,
                        tokenIndex: item.nftTokenIndex,
                        codehash: item.nftCodehash
                    })
                }
            } else {
                selledPagination.nothing = true
            }
            
            console.log(selledNfts)
        }
        isShowSelledNftListSkeleton.value = false
        resolve()
    })
}

getMySelledNfts()

</script>
<style lang="scss" scoped src="./Self.scss"></style>