<template>
  <div class="nft-list-wrap">
    <div class="nft-home-module">
        <div class="title ">
           
          🔥{{ $t('NFT.Hot Series') }}
        </div>
        <div class="cont">
          <span class="swiper-button-next hot-next flex flex-align-center flex-pack-center">
            <Icon name="down" color="#fff"  />
          </span>
          <span class="swiper-button-prev hot-prev flex flex-align-center flex-pack-center">
            <Icon name="down" color="#fff" />
          </span>
          <Swiper
            :autoHeight="false"
            :modules="[Pagination, Navigation, A11y]"
            :pagination="{ clickable: true }"
            :navigation="{
              nextEl: '.hot-next',
              prevEl: '.hot-prev',
            }"
            :autoplay="false"
            :loop="true"
            :slidesPerView="3"
            :spaceBetween="24"
            class="hot-collection"
          >
            <SwiperSlide
              v-for="(item, index) in 6"
              :key="index"
              class="hot-collection-item"
              @click=""
            >
              <div class="cover"></div>
              <div class="image">
                <img class="collection-cover" :src="banner" />
              </div>
              <div class="mt-7">
                <div class="name ">123132132132</div>
              <div class="collection-info flex flex-row items-center mt-5">
                <div class="mr-3 ">
                  <img class="w-[39px] h-[39px] rounded-full " :src="banner" alt="">
                </div>
                <div class="flex flex-col ">
                  <span class="text-lg">23132</span>
                  <span class="text-xs opacity-50 ">MetaID: {{  }}</span>
                </div>
              </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
     

    </div>
    <div class="notable-collections">
      <div class="title text-3xl">
        
        💫{{ $t('NFT.notable') }}
         </div>
         <div class="notable-item-wrap ">
          <div class="notable-item" v-for="item in 10">
           <div class="image">
            <img class="collection-cover" :src="banner" alt="">
           </div>
            <div class="mt-7">
                <div class="name ">123132132132</div>
              <div class="collection-info flex flex-row items-center mt-5">
                <div class="mr-3 ">
                  <img class="w-[39px] h-[39px] rounded-full " :src="banner" alt="">
                </div>
                <div class="flex flex-col ">
                  <span class="text-lg">23132</span>
                  <span class="text-xs opacity-50 ">MetaID: {{  }}</span>
                </div>
              </div>
              </div>
          </div>
         </div>


    </div>
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