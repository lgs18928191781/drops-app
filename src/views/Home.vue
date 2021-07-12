<template>
    <div class="home">
        <!-- 推荐作品 -->
        <div class="section container recommend-section">
            <div class="section-cont nft-list">
                <NftItem :isRecommendCard="true" />
                <template v-for="item in recommendNfts">
                    <NftItem :item="item" />
                </template>
            </div>
        </div>

        <!-- 所有类别 -->
        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">{{ $t('allmenu') }}</div>
                <img class="search-icon" src="@/assets/images/hom_icon_search.svg" />
            </div>
            <div class="section-screen flex flex-align-center">
                <div class="tags flex1 flex flex-align-center flex-wrap-wrap">
                    <a class="active">{{ $t('all') }}</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                </div>
                <div class="search-warp flex flex-align-center">
                    <input class="flex1" :placeholder="$t('search')" type="text" />
                    <img src="@/assets/images/icon_search.svg">
                </div>
            </div>
            <div class="section-cont nft-list">
                <template v-for="item in Nfts">
                    <NftItem :item="item" />
                </template>
            </div>
        </div>

        <div class="nothing" v-if="pagination.nothing">{{$t('nomore')}}</div>
        <div class="more-warp" v-else @cliick="getMore">
            <div class="tips">{{ $t('clickmore') }}</div>
            <div class="icon"><img src="@/assets/svg/home_icon_ins.svg" /></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { GetProductList } from '@/api';
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store';
import { reactive } from 'vue';

const store = useStore()
let recommendNfts = reactive<NftItem []>([])
let Nfts = reactive<NftItem []>([])
const pagination = reactive({
    ...store.state.pagination    
})
async function  getNftList (isCover: boolean = false) {
    const res = await  GetProductList(pagination)
    if (res.code === 200) {
        if (isCover) Nfts.length = 0
        Nfts.push(...res.data)
    }
}

function  getRecommendNftList () {
    // setTimeout(() => {
    //     recommendNfts.length = 0
    //     recommendNfts.push({
    //         name: 'string',
    //         amount: 1,
    //         foundryName: 'string',
    //         classify: 'string',
    //         head: 'string',
    //         tokenId: 'string',
    //     })
    // }, 3000)
    return new Promise<void>(async resolve => {
        const res = await GetProductList({ page: 1, pageSize: 7 })
        if (res.code === 200) {
            recommendNfts.length = 0
            recommendNfts.push(...res.data)
        }
        resolve()
    })
}

function getMore() {
    pagination.loading = true
    pagination.page++
    getNftList().then(() => {
        pagination.loading = false
    })
}

getRecommendNftList()
getNftList()

</script>
<style lang="scss" scoped src="./Home.scss"></style>