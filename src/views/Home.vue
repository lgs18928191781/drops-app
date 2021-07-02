<template>
    <div class="home">
        <!-- 推荐作品 -->
        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">推荐作品</div>
            </div>
            <div class="section-cont nft-list">
                <template v-for="item in Array.from({length: 4})">
                    <NftItem />
                </template>
            </div>
        </div>

        <!-- 所有类别 -->
        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">所有类别</div>
                <img class="search-icon" src="@/assets/images/hom_icon_search.svg" />
            </div>
            <div class="section-screen flex flex-align-center">
                <div class="tags flex1 flex flex-align-center flex-wrap-wrap">
                    <a class="active">所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                    <a>所有</a>
                </div>
                <div class="sort">
                    时间：最晚到最早
                </div>
            </div>
            <div class="section-cont nft-list">
                <template v-for="item in Array.from({length: 16})">
                    <NftItem />
                </template>
            </div>
        </div>

        <div class="more-warp">
            <div class="tips">点击加载更多</div>
            <div class="icon"><img src="@/assets/images/home_icon_ins.svg" /></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import NftItem from '@/components/Nft-item/Nft-item.vue'
</script>
<style lang="scss" scoped src="./Home.scss"></style>