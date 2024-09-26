<template>
  <div class="nft-list-wrap">
    <div class="hot-series">
        <div class="title ">
           
            <span class="text-3xl">🔥{{ $t('NFT.Hot Series') }}</span>
        </div>
        <div class="swaper w-full h-120">
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
            :slidesPerView="5"
            :spaceBetween="15"
            class="latest-collection"
          >
            <SwiperSlide
              v-for="(item, index) in 5"
              :key="index"
              class="latest-collection-item"
             
            >
              <div class="cover">
                <img :src="banner" />
              </div>
              <div class="content flex flex-align-center">
                <!-- <UserAvatar
                  :metaId="item.show_3_collection.creatorMetaId"
                  :image="item.show_3_collection.creatorAvatarImage"
                  :name="item.show_3_collection.creatorName"
                  :meta-name="item.show_3_collection.creatorMetaName"
                /> -->
                <div class="flex1">
                  <div class="name flex flex-align-center">
                    <!-- <span class="text">{{ item.show_3_collection.name }} </span><IconCert /> -->
                  </div>
                  <div class="metaid">
                    <!-- MetaID：{{ item.show_3_collection.creatorMetaId.slice(0, 6) }} -->
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>



        </div>


    </div>
    <div class="notable-collections"></div>
  </div>
</template>
<script setup lang='ts'>
import { Pagination, Autoplay, Grid, Navigation, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import banner from '@/assets/images/login_img.png'



</script>
<style lang='scss' scoped src="./NFTlist.scss">

</style>