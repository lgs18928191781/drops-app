<template>
    <div class="self">
        <div class="banner container">
            <a class="banner-item">
                <img class="cover" src="@/assets/images/banner_bg.svg" />
                <div class="cont">
                    <div class="cont-warp">
                        <div>
                            <div class="title">铸造属于您的NFT</div>
                            <div class="drsc">您的数字资产，从这里开始</div>
                        </div>
                        <router-link :to="{ name: 'create' }" class="btn">开始<img class="icon-right" src="@/assets/images/btn_ins.svg" /></router-link>
                    </div>
                </div>
            </a>
        </div>

        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">{{$t('mynft')}}</div>
            </div>
            <div class="section-cont nft-list">
                <template v-for="nft in nfts" :key="nft.tokenId">
                    <NftItem :item="nft" :isSelf="true" />
                </template>
            </div>
        </div>

        <LoadMore :pagination="pagination" @getMore="getMore" />
    </div>
</template>
<script setup lang="ts">
import { MyNfts, NftApiCode } from '@/api';
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store';
import { reactive } from 'vue';
import LoadMore from '@/components/LoadMore/LoadMore.vue';

const store = useStore()
const pagination = reactive({
    ...store.state.pagination    
})
const nfts: NftItem [] = reactive([])

function getMyNfts (isCover: boolean = false) {
    return new Promise(async resolve => {
        const res = await MyNfts(pagination)
        if (res.code === NftApiCode.success) {
            if (isCover) {
                nfts.length = 0
            }
            nfts.push(...res.data)
            const totalPages = Math.ceil(res.count / pagination.pageSize)
            if (pagination.page >= totalPages) {
                pagination.nothing = true
            }
        }
    })
}

function getMore() {
    pagination.loading = true
    pagination.page++
    getMyNfts().then(() => {
        pagination.loading = false
    })
}

getMyNfts()

</script>
<style lang="scss" scoped src="./Self.scss"></style>