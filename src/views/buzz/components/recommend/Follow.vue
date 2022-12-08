<template>
  <!-- 推荐关注 -->
  <div class="recommend-section">
    <div class="title flex">
      {{ $t('Buzz.RecommendContent.Recommend To Follow') }}
    </div>

    <div class="cont">
      <div class="follows">
        <div class="user-list">
          <div
            class="user-item flex flex-align-center"
            v-for="(item, index) in users"
            :key="item.metaId"
          >
            <UserAvatar :meta-id="item.metaId" />
            <div class="flex1">
              <div class="name flex flex-align-center">
                {{ item.name }}
              </div>
              <div class="intro flex flex-align-center">MetaId: {{ item.metaId.slice(0, 6) }}</div>
            </div>
            <div class="operate">
              <a
                class="main-border primary"
                :class="{ disabled: loading.includes(true), faded: item.isMyFollow }"
                @click="follow(item, index)"
              >
                <template v-if="loading[index]">
                  <ElIcon class="is-loading">
                    <Loading />
                  </ElIcon>
                </template>
                <template v-else>
                  {{ item.isMyFollow ? $t('Followed') : $t('Follow') }}
                </template>
              </a>
            </div>
          </div>
        </div>
        <div class="more flex flex-pack-center">
          <a class="flex flex-align-center" @click="exchange">
            <Icon name="exchange" />
            {{ $t('Buzz.RecommendContent.Change batch') }}
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
import { Loading } from '@element-plus/icons-vue'
import { NodeName } from '@/enum'
import { initPagination } from '@/config'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const i18n = useI18n()
const users: RecommnedUser[] = reactive([])
const loading: boolean[] = reactive([])
const pagination = reactive({ ...initPagination, totalPages: 1, pageSize: 5 })

function getRecommendUsers() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetRecommendUsers({
      ...pagination,
      metaId: userStore.user?.metaId,
    }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      users.length = 0
      pagination.totalPages = Math.ceil(res.data.total / pagination.pageSize)
      users.push(...res.data.results.items)
      resolve()
    }
  })
}

async function follow(item: RecommnedUser, index: number) {
  if (loading.includes(true) || item.isMyFollow) return
  loading[index] = true
  const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
  const res = await userStore.showWallet
    .createBrfcChildNode({
      nodeName: NodeName.PayFollow,
      data: JSON.stringify({
        createTime: new Date().getTime(),
        MetaID: item.metaId,
        pay: payAmount,
        payTo: item.address,
      }),
      payTo: [{ amount: payAmount, address: item.address }],
    })
    .catch(error => {
      ElMessage.error(error.message)
      loading[index] = false
    })
  if (res) {
    item.isMyFollow = true
    item.total = item.total + 1
    loading[index] = false
  }
}

function exchange() {
  if (pagination.totalPages === 1) return ElMessage.error(i18n.t('None More'))
  if (pagination.page < pagination.totalPages) pagination.page++
  else pagination.page = 1
  getRecommendUsers()
}

getRecommendUsers()
</script>

<style lang="scss" scoped src="./Follow.scss"></style>
