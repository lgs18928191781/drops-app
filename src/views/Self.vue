<template>
    <div class="self">
        <div class="banner container">
            <a>
                <img src="@/assets/images/banner.svg" />
            </a>
        </div>

        <div class="section container">
            <div class="section-header flex flex-align-center">
                <div class="title flex1">{{$t('mynft')}}</div>
            </div>
            <div class="section-cont nft-list">
                <template v-for="item in Array.from({length: 4})">
                    <NftItem />
                </template>
            </div>
        </div>

        <div class="nothing">{{$t('nomore')}}</div>
    </div>
</template>
<script setup lang="ts">
import NftItem from '@/components/Nft-item/Nft-item.vue'
</script>
<style lang="scss" scoped src="./Self.scss"></style>