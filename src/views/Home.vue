<template>
    <div class="home">
        <!-- 推荐作品 -->
        <div class="section container recommend-section">
            <div class="section-cont nft-list">
                <!-- @ts-ignore -->
                <NftItem :isRecommendCard="true" :item="{ name: 'recommend', amount: 0, foundryName: '', classify: '', tokenId: '', coverUrl: '', metaId: ''}" />
                <template v-for="item in recommendNfts">
                    <NftItem :item="item" />
                </template>
            </div>
        </div>

        <!-- 所有类别 -->
        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">{{ $t('allmenu') }}</div>
                <!-- <img class="search-icon" src="@/assets/images/hom_icon_search.svg" /> -->
            </div>
            <div class="section-screen flex flex-align-center">
                <div class="tags flex1 flex flex-align-center flex-wrap-wrap">
                    <a :class="{ 'active': classify === 'all'}" @click="changeClassify('all')" >{{ $t('all') }}</a>
                    <a :class="{ 'active': classify === item.classify }" v-for="item in classies" :key="item.id" @click="changeClassify(item.classify)">{{ item.classify }}</a>
                </div>
                <div class="search-warp flex flex-align-center">
                    <input class="flex1" v-model="keyword" :placeholder="$t('search')" @keyup.enter="search" type="text" />
                    <img src="@/assets/images/icon_search.svg" @click="search">
                </div>
            </div>
            <div class="section-cont nft-list">
                <template v-for="item in Nfts">
                    <NftItem :item="item" />
                </template>
            </div>
        </div>

        <LoadMore :pagination="pagination" @getMore="getMore" v-if="Nfts.length > 0" />
        <IsNull v-else />
    </div>
</template>
<script setup lang="ts">
import { GetClassies, GetProductClassifyList, GetProductList, NftApiCode, Search } from '@/api';
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store';
import { reactive, ref } from 'vue';
import LoadMore from '@/components/LoadMore/LoadMore.vue';
import IsNull from '../components/IsNull/IsNull.vue';


const store = useStore()
let recommendNfts = reactive<NftItem []>([])
let Nfts = reactive<NftItem []>([])
const pagination = reactive({
    ...store.state.pagination    
})
const keyword = ref('')
const classify = ref('all')

async function  getNftList (isCover: boolean = false) {
    const res = await  GetProductList(pagination)
    if (res.code === NftApiCode.success) {
        if (isCover) Nfts.length = 0
        Nfts.push(...res.data)
        const totalPages = Math.ceil(res.count / pagination.pageSize)
        if (pagination.page >= totalPages) {
            pagination.nothing = true
        }
    }
}

async function  getNftClassifyList (isCover: boolean = false) {
    const res = await  GetProductClassifyList({
        ...pagination,
        classifyName: classify.value
    })
    if (res.code === NftApiCode.success) {
        if (isCover) Nfts.length = 0
        Nfts.push(...res.data)
        const totalPages = Math.ceil(res.count / pagination.pageSize)
        if (pagination.page >= totalPages) {
            pagination.nothing = true
        }
    }
}

function  getRecommendNftList () {
    return new Promise<void>(async resolve => {
        const res = await GetProductList({ page: 1, pageSize: 7 })
        if (res.code === NftApiCode.success) {
            recommendNfts.length = 0
            recommendNfts.push(...res.data)
        }
        resolve()
    })
}

function getMore() {
    pagination.loading = true
    pagination.page++
    if (classify.value === 'all') {
        getNftList().then(() => {
            pagination.loading = false
        })
    } else {
        getNftClassifyList().then(() => {
            pagination.loading = false
        })
    }
}

async function search () {
    pagination.loading = false,
    pagination.nothing = false,
    pagination.page = 1
    if (keyword.value === '') {
        classify.value = 'all'
        getNftList()
    } else {
        classify.value = ''
        const res = await Search({
            likeName: keyword.value
        })
        if (res.code === NftApiCode.success) {
            Nfts.length = 0
            Nfts.push(...res.data)
        }
    }
}

const classies: Classify [] = reactive([])

async function getClassies () {
    const res = await GetClassies()
    if (res.code === NftApiCode.success) {
        classies.push(...res.data)
    }
}

function changeClassify (classifyName: string) {
    if (classify.value === classifyName) return
    classify.value = classifyName
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    if (classifyName === 'all') {
        getNftList(true)
    } else {
        getNftClassifyList(true)
    }

    keyword.value = ''
}

getRecommendNftList()
getNftList()
getClassies()
</script>
<style lang="scss" scoped src="./Home.scss"></style>