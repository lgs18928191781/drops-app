<template>
  <!-- 推荐社区 -->
  <div class="recommend-section">
    <div class="title flex">
      {{ $t('Buzz.Referral Community') }}
    </div>

    <div class="cont">
      <div class="communitys">
        <div class="follow-list">
          <CardVue class="follow-item" v-for="(item, index) in communitys" :key="item.communityId">
            <div class="follow-item-warp card flex">
              <div class="community-cover">
                <span class="radius"></span>
                <Image :src="item.cover" />
                <Icon name="emb" />
              </div>
              <div class="flex1">
                <div class="name flex flex-align-center">
                  <span
                    >{{ item.name.slice(0, 8) }}
                    <template v-if="item.name.length > 8">.</template></span
                  >
                  <Icon name="down" />
                </div>

                <div class="people flex flex-align-center">
                  <Icon name="people" /> {{ item.memberTotal }}
                </div>

                <div class="operate flex flex-align-center flex-pack-end">
                  <a
                    class="main-border primary"
                    :class="{ disabled: loading.includes(true), faded: item.isMyJoin }"
                    @click="join(item, index)"
                  >
                    <template v-if="loading[index]">
                      <ElIcon class="is-loading">
                        <Loading />
                      </ElIcon>
                    </template>
                    <template v-else>{{ $t('Join') }}</template>
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
import { reactive, ref } from 'vue'
import CardVue from '@/components/Card/Card.vue'
import { Loading } from '@element-plus/icons-vue'
import { NodeName } from '@/enum'
import { useI18n } from 'vue-i18n'

const pagination = reactive({ ...initPagination, pageSize: 4 })
const userStore = useUserStore()
const i18n = useI18n()

const communitys: recommnedCommunity[] = reactive([])

const loading: boolean[] = reactive([])

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

async function join(item: recommnedCommunity, index: number) {
  if (loading.includes(true) || item.isMyJoin) return
  loading[index] = true
  const res = await userStore.showWallet
    .createBrfcChildNode({
      nodeName: NodeName.SimpleCommunityJoin,
      data: JSON.stringify({
        communityId: item.communityId, //string
        state: 1, //加入状态, number: 1 or -1. 1:in; -1:out
      }),
    })
    .catch(error => {
      ElMessage.error(error.message)
      loading[index] = false
    })
  if (res) {
    item.isMyJoin = true
    ElMessage.success(i18n.t('Join Success'))
    loading[index] = false
  } else {
    loading[index] = false
  }
}

getRecommendCommunitys()
</script>

<style lang="scss" scoped src="./Community.scss"></style>
