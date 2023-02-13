<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <template #template>
      <IndexSkeletonVue />
    </template>
    <template #default>
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
            <div class="banner-item" @click="toUrl(item.url)">
              <a class="cover"><img :src="$filters.strapiImage(item.cover.url)"/></a>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Hot Series -->
      <div class="nft-home-module">
        <div class="title">{{ $t('NFT.Hot Collection') }}</div>
        <div class="cont">
          <span class="swiper-button-next hot-next flex flex-align-center flex-pack-center">
            <Icon name="down" />
          </span>
          <span class="swiper-button-prev hot-prev flex flex-align-center flex-pack-center">
            <Icon name="down" />
          </span>
          <Swiper
            :autoHeight="true"
            :modules="[Pagination, Navigation, A11y]"
            :pagination="{ clickable: true }"
            :navigation="{
              nextEl: '.hot-next',
              prevEl: '.hot-prev',
            }"
            :autoplay="false"
            :loop="true"
            :slidesPerView="hotCollectionSlidesPerView"
            :spaceBetween="10"
            class="hot-collection"
          >
            <SwiperSlide
              v-for="(item, index) in hotCollections"
              :key="index"
              class="hot-collection-item"
              @click="toCollection(item.show_3_collection.id)"
            >
              <div class="cover"></div>
              <div class="image">
                <img :src="$filters.strapiImage(item.show_3_collection.cover.url)" />
              </div>
              <div class="name">{{ item.show_3_collection.name }}</div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <!-- Latest Series -->
      <div class="nft-home-module">
        <div class="title">{{ $t('NFT.Latest Collection') }}</div>
        <div class="cont">
          <span class="swiper-button-next latest-next flex flex-align-center flex-pack-center">
            <Icon name="down" />
          </span>
          <span class="swiper-button-prev latest-pre flex flex-align-center flex-pack-center">
            <Icon name="down" />
          </span>
          <Swiper
            :autoHeight="true"
            :modules="[Pagination, Navigation, A11y]"
            :navigation="{
              nextEl: '.latest-next',
              prevEl: '.latest-pre',
            }"
            :pagination="{ clickable: true }"
            :autoplay="false"
            :loop="true"
            :slidesPerView="latestCollectionSlidesPerView"
            :spaceBetween="15"
            class="latest-collection"
          >
            <SwiperSlide
              v-for="(item, index) in latestCollections"
              :key="index"
              class="latest-collection-item"
              @click="toCollection(item.show_3_collection.id)"
            >
              <div class="cover">
                <img :src="$filters.strapiImage(item.show_3_collection.cover.url)" />
              </div>
              <div class="content flex flex-align-center">
                <UserAvatar
                  :metaId="item.show_3_collection.creatorMetaId"
                  :image="item.show_3_collection.creatorAvatarImage"
                  :name="item.show_3_collection.creatorName"
                />
                <div class="flex1">
                  <div class="name flex flex-align-center">
                    <span class="text">{{ item.show_3_collection.name }} </span><IconCert />
                  </div>
                  <div class="metaid">
                    MetaID：{{ item.show_3_collection.creatorMetaId.slice(0, 6) }}
                  </div>
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
                    <span class="name">MetaBot Avatar MetaBot Avatar MetaBot Avatar</span>
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

      <!-- NFT Introduction -->
      <div class="nft-home-module">
        <div class="title">{{ $t('NFT.NFT Introduction') }}</div>
        <div class="cont">
          <div class="nft-intro-list flex flex-align-center">
            <a class="nft-intro-item flex1" v-for="(item, index) in NFTIntroList" :key="index">
              <div class="name">{{ item.name() }}</div>
              <div class="drsc">{{ item.drsc() }}</div>
            </a>
          </div>
        </div>
      </div>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { Pagination, Autoplay, Grid, Navigation, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { reactive, ref } from 'vue'
import Banner from '@/assets/images/banner.jpg'
import Collection from '@/assets/images/collection.jpg'
import IconCert from '@/assets/svg/icon_cer.svg'
import { ElSelect } from 'element-plus'
import IndexSkeletonVue from './IndexSkeleton.vue'
import { useI18n } from 'vue-i18n'
import { GetBanners, GetHomeHotSeries, GetHomeLatestSeries } from '@/api/strapi'
import { toUrl } from '@/utils/util'
import { router } from '@/router'

const banners: HomeBanner[] = reactive([])
const i18n = useI18n()
const isSkeleton = ref(true)
const hotCollections: TypeCollction[] = reactive([])
const latestCollections: TypeCollction[] = reactive([])
const loading = reactive({
  banner: false,
  hot: false,
  latest: false,
  leaderboard: false,
})

const NFTIntroList = [
  { name: () => i18n.t('NFT.intro1'), drsc: () => i18n.t('NFT.intro1_drsc'), path: '' },
  { name: () => i18n.t('NFT.intro2'), drsc: () => i18n.t('NFT.intro2_drsc'), path: '' },
  { name: () => i18n.t('NFT.intro3'), drsc: () => i18n.t('NFT.intro3_drsc'), path: '' },
  { name: () => i18n.t('NFT.intro4'), drsc: () => i18n.t('NFT.intro4_drsc'), path: '' },
]

function getBanners() {
  return new Promise<void>(async resolve => {
    const res = await GetBanners().catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res) {
      banners.length = 0
      banners.push(...res)
      loading.banner = false
      resolve()
    }
  })
}

function getHotSeries() {
  return new Promise<void>(async resolve => {
    const res = await GetHomeHotSeries({
      _start: 0,
      _limit: 12,
    }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res) {
      hotCollections.length = 0
      hotCollections.push(...res)
      loading.hot = false
      resolve()
    }
  })
}

function getLatestSeries() {
  return new Promise<void>(async resolve => {
    const res = await GetHomeLatestSeries({
      _start: 0,
      _limit: 12,
    }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res) {
      latestCollections.length = 0
      latestCollections.push(...res)
      loading.latest = false
      resolve()
    }
  })
}

function toCollection(collectionId: number) {
  router.push({
    name: 'nftCollection',
    params: {
      collectionId,
    },
  })
}

const hotCollectionSlidesPerView = ref(document.body.clientWidth > 750 ? 4 : 2)
const latestCollectionSlidesPerView = ref(document.body.clientWidth > 750 ? 3 : 2)

Promise.all([getBanners(), getHotSeries(), getLatestSeries()]).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
