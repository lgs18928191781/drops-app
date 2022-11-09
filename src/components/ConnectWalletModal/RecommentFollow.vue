<template>
  <ElDialog :model-value="false" class="none-header ">
    <div class="recomment-follow">
      <div class="top flex flex-align-center">
        <div class="title" v-html="$t('Login.recomment.title')"></div>
        <div class="opreate flex1 flex flex-align-center flex-pack-end">
          <a class="main-border">{{ $t('Login.recomment.followAll') }}</a>
          <a class="main-border primary">
            <Icon name="right" />
          </a>
        </div>
      </div>
      <Swiper
        :autoHeight="true"
        :modules="[Grid, Pagination]"
        :pagination="{ clickable: true }"
        :slidesPerView="2"
        :slidesPerGroup="2"
        :grid="{
          fill: 'row',
          rows: 2,
        }"
        :spaceBetween="12"
      >
        <SwiperSlide v-for="item in Array.from({ length: 8 })">
          <div class="card follow-item flex flex-align-center">
            <Image src="" />
            <div class="cont flex1">
              <div class="name flex flex-align-center">
                Doodles
                <Icon name="down" />
              </div>
            </div>
            <Icon class="collect" name="star" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import { Pagination, Grid } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { reactive } from 'vue'
</script>

<style lang="scss" scoped src="./RecommentFollow.scss"></style>
