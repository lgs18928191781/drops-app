<template>
  <!-- 使用教程 -->
  <div class="recommend-section">
    <div class="title flex">
      {{ $t('Buzz.RecommendContent.Introduction to Guiding') }}
    </div>

    <div class="cont">
      <div class="guide-list">
        <div
          class="guide-item flex flex-align-center"
          v-for="(item, index) in guides"
          :key="index"
          @click="item.fun()"
        >
          <span class="icon-warp">
            <img :src="item.icon" />
          </span>
          <div class="name flex1">{{ item.name() }}</div>
          <Icon name="down" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppSVG from '@/assets/svg/guides_icon_app.svg?url'
import LearnSVG from '@/assets/svg/guides_icon_learn.svg?url'
import { useRouter } from 'vue-router'

const i18n = useI18n()
const router = useRouter()
const guides = [
  {
    icon: LearnSVG,
    name: () => i18n.t('Buzz.RecommendContent.Learn the show function'),
    fun: () => {
      ElMessage.info(i18n.t('Comming Soon'))
    },
  },
  {
    icon: AppSVG,
    name: () => i18n.t('Buzz.RecommendContent.Download showApp'),
    fun: () => {
      router.push({
        name: 'home',
      })
    },
  },
]
</script>

<style lang="scss" scoped src="./Guide.scss"></style>
