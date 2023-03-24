<template>
  <div class="h-full flex flex-v ">
    <div class="header flex flex-align-center">
      <div class="flex1">
        <span class="title">{{ $t('DAO.Proposal') }}</span>
      </div>
      <a class="main-border primary" @click="toCreate">{{ $t('DAO.New Proposal') }}</a>
    </div>

    <ElSkeleton :loading="isSkeleton" animated>
      <div
        class="proposal-list flex1"
        v-infinite-scroll="getMore"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
      >
        <RouterLink
          :to="{ name: 'talkDAOProposalDetail', params: { id: item.id } }"
          class="proposal-item"
          v-for="item in proposals"
          :key="item.id"
        >
          <!-- top -->
          <div class="top flex flex-align-center">
            <div class="flex1 flex flex-align-center">
              <span class="user flex flex-align-center">
                <UserAvatar :meta-id="''" :image="''" :meta-name="''" :name="''" />
                <span>proposal</span>
              </span>
              <span class="txid flex flex-align-center"><Icon name="link" /> asd4456</span>
              <span class="time">2019-02-45 12:45:12</span>
            </div>
            <span class="status" :class="getStatusClass(item.beginBlockTime, item.endBlockTime)">{{
              getStatusText(item.beginBlockTime, item.endBlockTime)
            }}</span>
          </div>

          <div class="title">{{ item.title }}</div>

          <div class="content">
            {{ item.desc }}
          </div>
        </RouterLink>

        <LoadMore :pagination="pagination" v-if="proposals.length" />
        <IsNull v-else />
      </div>
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import { checkUserLogin } from '@/utils/util'
import { useRouter } from 'vue-router'
import { Proposals } from '@/api/dao'
import { useTalkStore } from '@/stores/talk'
import { ProposalItem } from '@/@types/api/dao'
import { useI18n } from 'vue-i18n'

const pagination = reactive({ ...initPagination })
const proposals: ProposalItem[] = reactive([])
const isSkeleton = ref(true)
const router = useRouter()
const talk = useTalkStore()
const i18n = useI18n()
const now = new Date().getTime()

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await Proposals({
      symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${talk.activeCommunity!.dao!.daoId}`,
      // symbol: `${talk.activeCommunity!.dao!.governanceSymbol}`,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res) {
      if (isCover) proposals.length = 0
      if (res.length) {
        proposals.push(...res)
        pagination.nothing = false
      } else {
        pagination.nothing = true
      }
      resolve()
    }
  })
}

function getMore() {
  if (pagination.nothing || pagination.loading) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

async function toCreate() {
  await checkUserLogin()
  router.push({
    name: 'talkDAOProposalCreate',
  })
}

function getStatusText(startTime: number, endTime: number) {
  if (startTime * 1000 < now) return i18n.t('DAO.Proposal Status.UnStarted')
  else if (startTime * 1000 >= startTime && endTime * 1000 <= now)
    return i18n.t('DAO.Proposal Status.Voting')
  else return i18n.t('DAO.Proposal Status.Ended')
}
function getStatusClass(startTime: number, endTime: number) {
  if (startTime * 1000 < now) return 'faded'
  else if (startTime * 1000 >= startTime && endTime * 1000 <= now) return 'active'
  else return 'faded'
}

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
