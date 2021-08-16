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
                <div class="title flex1">{{$t('mynft')}}</div>
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
import { MyNfts, NftApiCode } from '@/api';
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store';
import { reactive, ref } from 'vue';
import LoadMore from '@/components/LoadMore/LoadMore.vue';
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'

const store = useStore()
const pagination = reactive({
    ...store.state.pagination    
})
const nfts: NftItem [] = reactive([])
const isShowNftListSkeleton = ref(true)

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
            isShowNftListSkeleton.value = false
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