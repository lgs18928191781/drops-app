<template>
  <div class="recommend">
    <!-- 推荐社区 -->
    <CommunityVue />

    <!-- 推荐关注 -->
    <FollowVue />

    <!-- 使用教程 -->
    <GuideVue />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CardVue from '@/components/Card/Card.vue'
import { GetRecommendCommunitys, GetRecommendUsers } from '@/api/aggregation'
import { reactive } from 'vue'
import { initPagination } from '@/config'
import { useUserStore } from '@/stores/user'
import AppSVG from '@/assets/svg/guides_icon_app.svg?component'
import LearnSVG from '@/assets/svg/guides_icon_learn.svg?component'

const i18n = useI18n()
const userStore = useUserStore()

const pagination = reactive({ ...initPagination })

const communitys: any[] = reactive([])
</script>

<style lang="scss" scoped src="./RecommendContent.scss"></style>
