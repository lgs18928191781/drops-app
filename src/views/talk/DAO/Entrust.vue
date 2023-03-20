<template>
  <div
    class="h-full overflow-y-auto"
    v-infinite-scroll="getMore"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="100"
  >
    <div class="header">
      {{ $t('DAO.Entrust') }}
    </div>

    <div class="section">
      <div class="title">{{ $t('DAO.Choose Entrust') }}</div>
      <div class="content" ref="InputWarpRef">
        <div class="confirm-user" v-if="userInfo.val">
          <div class="user flex flex-align-center">
            <UserAvatar :name="''" :meta-name="''" :meta-id="''" :image="''" />
            <div class="flex1">
              <template v-if="userInfo.val!.metaId && userInfo.val!.name">
                <div class="username">{{ userInfo.val!.name }}</div>
                <div class="metaid">MetaID: {{ userInfo.val!.metaId.slice(0, 6) }}</div>
              </template>
              <template else>
                <div class="username">Address: {{ userInfo.val!.address }}</div>
              </template>
            </div>
          </div>
          <div class="operate flex flex-align-center">
            <a class="main-border flex1 bg-primary">{{ $t('DAO.Confirm Entrust') }}</a>
            <a class="main-border flex1 faded" @click="userInfo.val = null">{{ $t('Cancel') }}</a>
          </div>
        </div>
        <template v-else>
          <ElInput v-model="account" placeholder="MetaID/Address/Paymail/MetaName" type="text" />
          <div class="operate">
            <div
              class="main-border flex1"
              :class="[account ? 'primary' : 'faded']"
              @click="getUserInfo"
            >
              {{ $t('Confirm') }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="section">
      <div class="title">{{ $t('DAO.Entrust Records') }}</div>
      <div class="content">
        <ElSkeleton :loading="isSkeleton" animated>
          <div class="list">
            <div class="item flex flex-align-center" v-for="(item, index) in records" :key="index">
              <div class="iten-warp flex1 flex flex-align-center">
                <div class="user flex flex-align-center">
                  <UserAvatar :meta-id="''" :name="''" :image="''" :meta-name="''" />
                  <div class="flex1">
                    <div class="name">UPKJUI</div>
                    <div class="metaid">MetaID: 6d5465</div>
                  </div>
                </div>

                <Icon name="right" />

                <div class="user flex flex-align-center">
                  <UserAvatar :meta-id="''" :name="''" :image="''" :meta-name="''" />
                  <div class="flex1">
                    <div class="name">UPKJUI</div>
                    <div class="metaid">MetaID: 6d5465</div>
                  </div>
                </div>
              </div>

              <span class="time flex1">2022-05-11 01:44:13</span>
            </div>

            <LoadMore :pagination="pagination" />
          </div>
        </ElSkeleton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { getAccountUserInfo, openLoading } from '@/utils/util'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'

const account = ref('')
const userInfo: { val: UserAllInfo | null } = reactive({
  val: null,
})
const InputWarpRef = ref()
const records = reactive<any[]>([])
const pagination = reactive({ ...initPagination })
const isSkeleton = ref(true)

async function getUserInfo() {
  if (!account.value) return
  const loading = openLoading({
    target: InputWarpRef.value,
  })
  const res = await getAccountUserInfo(account.value).catch(error => {
    ElMessage.error(error.message)
    loading.close()
  })
  if (res) {
    userInfo.val = res
    loading.close()
    account.value = ''
  }
}

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    setTimeout(() => {
      const res = {
        code: 0,
        data: {
          list: Array.from({ length: 12 }),
        },
      }
      if (res.code === 0) {
        if (isCover) records.length = 0
        if (res.data.list.length) {
          records.push(...res.data.list)
          pagination.nothing = false
        } else {
          pagination.nothing = true
        }

        resolve()
      }
    }, 2000)
  })
}

function getMore() {
  if (pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Entrust.scss"></style>
