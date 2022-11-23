<template>
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
</template>

<script setup lang="ts">
import { GetRecommendCommunitys } from '@/api/aggregation'
import { initPagination } from '@/config'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'
import CardVue from '@/components/Card/Card.vue'

const pagination = reactive({ ...initPagination })
const userStore = useUserStore()
const communitys: any[] = reactive([])

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

getRecommendCommunitys()
</script>

<style lang="scss" scoped src="./Community.scss"></style>
