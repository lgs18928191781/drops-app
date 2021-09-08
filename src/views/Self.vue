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
                        <router-link :to="{ name: 'create' }" class="btn" v-if="!store.state.isApp">{{$t('start')}}<img class="icon-right" src="@/assets/images/btn_ins.svg" /></router-link>
                    </div>
                </div>
            </a>
        </div>

        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="tab flex flex-align-center">
                    <a
                        :class="{ active: index === tabIndex }"
                        v-for="(tab, index) in tabs"
                        :key="index"
                        @click="changeTabIndex(index)"
                        >{{tab.name}}</a
                    >
                </div>
            </div>
            <NftSkeleton
                :loading="isShowNftListSkeleton"
                :count="pagination.pageSize"
                class="section-cont nft-list"
            >
                <template #default>
                    <div class="section-cont nft-list">
                        <template v-for="nft in nfts">
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
import { GetDeadlineTime, GetMyNftSummaryList, GetMyOnSellNftList, GetMySelledNfts, GetNftIssue, MyNfts, NftApiCode } from '@/api';
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store';
import { reactive, ref } from 'vue';
import SeriesItem from '@/components/SeriesItem/SeriesItem.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue';
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import { router } from '@/router';
import { setDataStrclassify } from '@/utils/util';

const i18n = useI18n()
const store = useStore()
const pagination = reactive({
    ...store.state.pagination,
    pageSize: 6    
})
const selledPagination = reactive({
    ...store.state.pagination,
    pageSize: 6   
})

const tabs = [{name: i18n.t('mynft')}, {name: i18n.t('mySellNft')}]
const tabIndex = ref(0)
const nfts: NftItem [] = reactive([])
const selledNfts: NftItem [] = reactive([])
const isShowNftListSkeleton = ref(true)
const isShowSelledNftListSkeleton = ref(true)
const seriesList: NFTSeriesItem [] = reactive([])


function changeTabIndex (index: number) {
    isShowNftListSkeleton.value = true
    tabIndex.value = index
    pagination.loading = false
    pagination.nothing = false
    pagination.page = 1
    if (tabIndex.value === 0) {
        getMyNfts(true)
    } else {
        getMySelledNfts(true)
    }
}

function getMyNfts (isCover: boolean = false) {
    return new Promise<void>(async resolve => {
        const res = await GetMyNftSummaryList({
            Address: store.state.userInfo!.address,
            Page: pagination.page.toString(),
            PageSize: pagination.pageSize.toString(),
        })
        if (res && res.code === 0) {
            if (isCover) {
                nfts.length = 0
            }
            if (res.data.results.items.length > 0) {
                res.data.results.items.map(item => {
                    
                    const nft = item.nftDetailItemList && item.nftDetailItemList[0] ? item.nftDetailItemList[0] : undefined
                    const count = item.nftMyCount + item.nftMyPendingCount
                    const name = count > 1 &&  item.nftSeriesName && item.nftSeriesName !== '' ? item.nftSeriesName : item.nftName ? item.nftName : '--'
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
                    } | undefined = nft && nft.nftDataStr !== '' ? JSON.parse(nft.nftDataStr) : undefined
                    const classify = setDataStrclassify(data)
                    nfts.push({
                        name: name,
                        amount: 0,
                        foundryName: item.nftIssuer,
                        classify: classify,
                        head: '',
                        tokenId: item.nftGenesis + item.nftCodehash + item.nftTokenIndex,
                        coverUrl: item.nftIcon,
                        putAway: item.nftIsReady,
                        metaId: item.nftIssueMetaId,
                        productName: name,
                        deadlineTime: 0,
                        genesis: item.nftGenesis,
                        tokenIndex: nft?.nftTokenIndex ? nft?.nftTokenIndex : '',
                        codehash: item.nftCodehash,
                        total: item.nftTotalSupply,
                        hasCount: count
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


function getMore() {
    pagination.loading = true
    pagination.page++
    getMyNfts().then(() => {
        pagination.loading = false
    })
}







function getMySelledNfts (isCover: boolean = false) {
    return new Promise<void>(async resolve => {
        const res = await GetMyOnSellNftList({
            Page: selledPagination.page.toString(),
            PageSize: selledPagination.pageSize.toString(),
            Address: store.state.userInfo!.address,
            metaId: store.state.userInfo!.metaId
        })
        if (res && res.code === 0) {
            if (isCover) {
                nfts.length = 0
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
                    const classify = setDataStrclassify(data)
                    nfts.push({
                        name: item.nftName ? item.nftName : '--',
                        amount: item.nftPrice,
                        foundryName: item.nftIssuer,
                        classify: classify,
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
                pagination.nothing = true
            }
        }
        isShowNftListSkeleton.value = false
        resolve()
    })
}

if(store.state.token) {
    // 还没拿到用户信息的时候要等待拿用户信息完再调接口
    if (store.state.userInfo) {
        getMyNfts()
    } else {
        store.watch((state) => state.userInfo, () => {
            getMyNfts()
        })
    }
} else {
    ElMessage.warning(i18n.t('toLoginTip'))
    router.replace('/')
}

</script>
<style lang="scss" scoped src="./Self.scss"></style>