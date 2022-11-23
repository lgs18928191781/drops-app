<template>
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
</template>

<script setup lang="ts">
import { GetRecommendUsers } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'

const userStore = useUserStore()
const users: any[] = reactive([])

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
</script>

<style lang="scss" scoped src="./Follow.scss"></style>
