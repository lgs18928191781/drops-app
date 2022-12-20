<template>
  <div class="banner">
    <Swiper
      :autoHeight="true"
      :modules="[Pagination, Autoplay]"
      :pagination="{ clickable: true }"
      :autoplay="true"
      :loop="true"
      class="banner-warp"
    >
      <SwiperSlide v-for="(item, index) in banners" :key="index">
        <div class="banner-item" @click="toPage(item.url)">
          <a class="cover"><img :src="item.url"/></a>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>

  <!-- Hot Series -->
  <div class="nft-home-module">
    <div class="title">{{ $t('NFT.Hot Collection') }}</div>
    <div class="cont">
      <Swiper
        :autoHeight="true"
        :modules="[Pagination]"
        :pagination="{ clickable: true }"
        :autoplay="false"
        :loop="true"
        :slidesPerView="4"
        :spaceBetween="10"
        class="hot-collection"
      >
        <SwiperSlide
          v-for="(item, index) in hotCollections"
          :key="index"
          class="hot-collection-item"
        >
          <div class="cover"></div>
          <img :src="item.cover" />
          <div class="name">{{ item.name }}</div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>

  <!-- Latest Series -->
  <div class="nft-home-module">
    <div class="title">{{ $t('NFT.Latest Collection') }}</div>
    <div class="cont">
      <Swiper
        :autoHeight="true"
        :modules="[Pagination]"
        :pagination="{ clickable: true }"
        :autoplay="false"
        :loop="true"
        :slidesPerView="3"
        :spaceBetween="15"
        class="latest-collection"
      >
        <SwiperSlide
          v-for="(item, index) in hotCollections"
          :key="index"
          class="latest-collection-item"
        >
          <div class="cover">
            <img :src="item.cover" />
          </div>
          <div class="content flex flex-align-center">
            <UserAvatar :metaId="''" :image="''" />
            <div class="flex1">
              <div class="name flex flex-align-center">"The Sword of Time" NFT ...<IconCert /></div>
              <div class="metaid">MetaID：86cedc</div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>

  <!-- NFT Leaderboard -->
  <div class="nft-home-module">
    <div class="title">{{ $t('NFT.NFT Leaderboard') }}</div>
    <div class="cont">
      <div class="leader-board">
        <div class="top flex flex-align-center">
          <div class="flex1">
            <span class="name">{{ $t('NFT.Top Collections') }}</span>
          </div>
          <div class="screen flex flex-align-center">
            <div class="screen-item flex flex-align-center">
              <span class="lable">{{ $t('NFT.Floor price') }}</span>
              <ElInput type="number" :placeholder="$t('NFT.Min')" />
              <span class="divid"></span>
              <ElInput type="number" :placeholder="$t('NFT.Max')" />
            </div>
            <div class="screen-item flex flex-align-center">
              <ElSelect></ElSelect>
            </div>
            <div class="screen-item flex flex-align-center">
              <ElSelect></ElSelect>
            </div>
            <div class="screen-item flex flex-align-center">
              <ElButton class="main-border faded">{{ $t('NFT.View all') }}</ElButton>
            </div>
          </div>
        </div>

        <div class="content flex">
          <div class="rank-section flex1" v-for="(item, index) in Array.from({ length: 2 })">
            <div class="rank-item th flex flex-align-center">
              <span class="collection flex1">{{ $t('NFT.Collection') }}</span>
              <span class="floor-price flex flex-pack-center">{{ $t('NFT.Floor price') }}</span>
              <span class="trading-volume flex flex-pack-center">{{
                $t('NFT.Trading volume')
              }}</span>
            </div>
            <div
              class="rank-item flex flex-align-center"
              v-for="(rank, rankIndex) in Array.from({ length: 5 })"
            >
              <span class="collection flex1 flex flex-align-center">
                <span class="index">{{ index === 0 ? rankIndex + 1 : rankIndex + 5 + 1 }}</span>
                <Image :src="''" />
                <span class="name">MetaBot Avatar</span>
                <IconCert />
              </span>
              <span class="floor-price flex flex-pack-center">23.52 Space</span>
              <span class="trading-volume flex flex-pack-center">1052 Space</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pagination, Autoplay, Grid } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { reactive } from 'vue'
import Banner from '@/assets/images/banner.jpg'
import Collection from '@/assets/images/collection.jpg'
import IconCert from '@/assets/svg/icon_cer.svg'
import { ElSelect } from 'element-plus'

const banners = reactive([{ url: Banner }])
const hotCollections = reactive([
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
  {
    name: 'MetaBot Avatar',
    cover: Collection,
  },
])
</script>

<style lang="scss" scoped src="./Index.scss"></style>
