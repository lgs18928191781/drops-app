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
                <div class="title flex1">{{$t('myUnSellNft')}}</div>
            </div>
            <NftSkeleton
                :loading="isShowNftListSkeleton"
                :count="pagination.pageSize"
                class="section-cont nft-list"
            >
                <template #default>
                    <div class="section-cont nft-list">
                        <template v-for="nft in nfts" :key="nft.tokenId">
                            <NftItem :item="nft" :isSelf="true" />
                        </template>
                    </div>
                </template>
            </NftSkeleton>
        </div>
        <LoadMore :pagination="pagination" @getMore="getMore" />
    </div>
</template>
<script setup lang="ts">
import { GetMySelledNfts, GetNftIssue, GetSeriesNftList, MyNfts, NftApiCode } from '@/api';
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store';
import { reactive, ref } from 'vue';
import LoadMore from '@/components/LoadMore/LoadMore.vue';
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import { useRoute } from 'vue-router';

const store = useStore()
const route = useRoute()
const pagination = reactive({
    ...store.state.pagination,
    pageSize: 6    
})
const nfts: NftItem [] = reactive([])
const isShowNftListSkeleton = ref(true)



function getMyNfts (isCover: boolean = false) {
    return new Promise<void>(async resolve => {
        const res = await GetSeriesNftList({
            Page: pagination.page.toString(),
            PageSize: pagination.pageSize.toString(),
            Address: store.state.userInfo!.address,
            codehash: typeof route.params.codehash === 'string' ? route.params.codehash : '',
            genesis: typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
        })
        debugger
        if (res && res.code === 0) {
            
            if (res.data.results.items.length > 0) {
                res.data.results.items.map(item => {
                    const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : undefined
                    nfts.push({
                        name: data ? data.nftname : item.nftName,
                        amount: 0,
                        foundryName: store.state.userInfo!.name,
                        classify: data ? data.classifyList : '',
                        tokenId: item.nftGenesis + item.nftTokenIndex,
                        coverUrl: data ? data.nfticon : item.nftIcon,
                        putAway: false,
                        metaId: store.state.userInfo!.metaId,
                        productName: data ? data.nftname : item.nftName,
                        genesis: item.nftGenesis
                    })
                })
            }
            const totalPage = Math.ceil(res.data.total / pagination.pageSize)
            if (pagination.page >= totalPage){
                pagination.nothing = false
            }
        }
        isShowNftListSkeleton.value = false
        resolve()
    })
}

// function getMyNfts (isCover: boolean = false) {
//     return new Promise<void>(async resolve => {
//         const res = await store.state.sdk?.nftList(store.state.userInfo!.address)
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

getMyNfts()



</script>
<style lang="scss" scoped src="./self.scss"></style>