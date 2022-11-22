<template>
  <div class="recommend">
    <!-- 推荐社区 -->
    <div class="recommend-section">
      <div class="title flex">
        {{ $t('Buzz.Referral Community') }}
      </div>

      <div class="cont">
        <div class="communitys">
          <div class="follow-list">
            <CardVue class="follow-item" v-for="item in Array.from({ length: 4 })">
              <div class="follow-item-warp card flex">
                <Image src="" />
                <div class="flex1">
                  <div class="name flex flex-align-center">
                    Doodles
                    <Icon name="down" />
                  </div>

                  <div class="people flex flex-align-center"><Icon name="people" /> 628</div>

                  <div class="operate flex flex-align-center flex-pack-end">
                    <a class="main-border primary">
                      {{ $t('Join') }}
                    </a>
                  </div>
                </div>
              </div>
            </CardVue>
          </div>
          <div class="refresh flex flex-pack-center">
            <a class="flex flex-align-center">
              <Icon name="exchange" />
              {{ $t('Buzz.RecommendContent.Change batch') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐关注 -->
    <div class="recommend-section">
      <div class="title flex">
        {{ $t('Buzz.RecommendContent.Recommend To Follow') }}
      </div>

      <div class="cont">
        <div class="follows">
          <div class="user-list">
            <div class="user-item flex flex-align-center" v-for="item in Array.from({ length: 4 })">
              <UserAvatar meta-id="" />
              <div class="flex1">
                <div class="name flex flex-align-center">
                  Doodles
                </div>
                <div class="intro">
                  Web3 participant, love new things, love life...
                </div>
              </div>
              <div class="operate">
                <a class="main-border primary">{{ $t('Follow') }}</a>
              </div>
            </div>
          </div>
          <div class="more flex flex-pack-center">
            <a class="flex flex-align-center">
              {{ $t('Buzz.RecommendContent.View More') }}
            </a>
          </div>
        </div>
      </div>
    </div>

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
          >
            <span class="icon-warp">
              <component :is="item.icon" />
            </span>
            <div class="name flex1">{{ item.name }}</div>
            <Icon name="down" />
          </div>
        </div>
      </div>
    </div>
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
const users: any[] = reactive([])

const guides = [
  { icon: LearnSVG, name: i18n.t('Buzz.RecommendContent.Learn the show function'), link: '' },
  { icon: AppSVG, name: i18n.t('Buzz.RecommendContent.Download showApp'), link: '' },
]

function getRecommendCommunitys() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetRecommendCommunitys({
      metaId: userStore.user?.metaId,
      ...pagination,
    })
    if (res.code === 0) {
      communitys.length = 0
      communitys.push(...res.data.results.items)
      resolve()
    }
  })
}

function getRecommendUsers() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetRecommendUsers({
      page: 1,
      pageSize: 5,
      metaId: userStore.user?.metaId,
    })
    if (res.code === 0) {
      users.length = 0
      users.push(...res.data.results.items)
      resolve()
    }
  })
}

getRecommendUsers()
getRecommendCommunitys()
</script>

<style lang="scss" scoped src="./RecommendContent.scss"></style>
