<template>
  <div class="h-full flex flex-v">
    <ElSkeleton :loading="isSkeleton" animated>
      <div class="pool-msg flex flex-align-center">
        <div class="pool-msg-item flex1">
          <div class="lable">{{ $t('DAO.Stake SPACE to obtain voting power') }}</div>
          <div class="value">{{ talk.activeCommunity?.dao?.governanceSymbol }}</div>
        </div>
        <div class="pool-msg-item flex1">
          <div class="lable">{{ $t('DAO.Your staked SPACE') }}</div>
          <div class="value">{{ userStake.val!.lockedTokenAmount || '--' }}</div>
        </div>
        <div class="pool-msg-item flex1">
          <div class="lable ">{{ $t('DAO.Unlock Token') }}</div>
          <div class="value">{{ unlockTokenAmount || '--' }}</div>
        </div>
        <div class="main-border primary" @click="isShowStake = true">
          {{ $t('DAO.Stake') }}
        </div>
      </div>

      <div class="header flex flex-align-center">
        <div class="flex1">
          <span class="title">{{ $t('DAO.Proposal') }}</span>
        </div>
        <a class="main-border primary" @click="toCreate">{{ $t('DAO.New Proposal') }}</a>
      </div>

      <div
        class="proposal-list flex1"
        v-infinite-scroll="getMore"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
      >
        <RouterLink
          :to="{ name: 'talkDAOProposalDetail', params: { id: item._id } }"
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

      <StakeModal v-model="isShowStake" />
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { computed, reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import { checkUserLogin } from '@/utils/util'
import { useRouter } from 'vue-router'
import { GetUserStakeInfo, Proposals } from '@/api/dao'
import { useTalkStore } from '@/stores/talk'
import { ProposalItem } from '@/@types/api/dao'
import { useI18n } from 'vue-i18n'
import { getStatusClass, getStatusText } from '@/utils/DAO'
import { useUserStore } from '@/stores/user'
import  type { DAOUserStakeInfo } from '@/@types/api/dao.d'
import Decimal from 'decimal.js-light'
import StakeModal from '../components/StakeModal.vue'

const pagination = reactive({ ...initPagination })
const proposals: ProposalItem[] = reactive([])
const isSkeleton = ref(true)
const router = useRouter()
const talk = useTalkStore()
const i18n = useI18n()
const now = new Date().getTime()
const userStore = useUserStore()

const userStake: { val: DAOUserStakeInfo | null } = reactive({ val: null })
const isShowStake = ref(false)

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await Proposals({
      symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${talk.activeCommunity!.dao!.daoId}`,
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize
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

function getUserStakeInfo() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetUserStakeInfo({
      symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${talk.activeCommunity!.dao!.daoId}`,
      address: userStore.user!.address!,
    })
    if (res.code === 0) {
      userStake.val = res.data
      resolve()
    }
  })
}

const unlockTokenAmount = computed(() => {
  let amount = 0
  if (userStake.val) {
    for (let i = 0; i < userStake.val!.unlockingTokens.length; i++) {
      amount = new Decimal(amount).plus(userStake.val!.unlockingTokens[i].amount).toNumber()
    }
  }
  return amount
})


Promise.all([getDatas(true), getUserStakeInfo()]).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
