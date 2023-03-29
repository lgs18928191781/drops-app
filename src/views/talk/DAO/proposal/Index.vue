<template>
  <div
    class="h-full flex flex-v proposal-index"
    v-infinite-scroll="getMore"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="100"
    :infinite-scroll-disabled="!isMobile"
  >
    <ElSkeleton :loading="isSkeleton" animated>
      <div class="pool-msg flex flex-align-center">
        <div class="pool-msg-item flex1">
          <div class="lable">{{ $t('DAO.Stake SPACE to obtain voting power') }}</div>
          <div class="value">{{ talk.activeCommunity?.dao?.governanceSymbol }}</div>
        </div>
        <div class="pool-msg-item flex1">
          <div class="lable">{{ $t('DAO.Your staked SPACE') }}</div>
          <div class="value flex flex-align-center">
            {{ userStake.val!.lockedTokenAmount || '--' }}
            <a
              class="main-border primary"
              @click="
                () => {
                  stakeType = StakeType.Unlock
                  isShowStake = true
                }
              "
              v-if="userStake.val!.lockedTokenAmount && userStake.val!.lockedTokenAmount !== '0'"
              >{{ $t('DAO.UnLock') }}</a
            >
          </div>
        </div>
        <div class="pool-msg-item flex1">
          <div class="lable ">{{ $t('DAO.Unlock Token') }}</div>
          <div class="value flex flex-align-center">
            {{ unlockTokenAmount || '--' }}
            <a
              class="main-border primary"
              @click="
                () => {
                  isShowExtractModal = true
                }
              "
              v-if="userStake.val!.unlockingTokens.length"
              >{{ $t('DAO.Extract') }}</a
            >
          </div>
        </div>
        <div
          class="main-border primary stake"
          @click="
            () => {
              stakeType = StakeType.Pledge
              isShowStake = true
            }
          "
        >
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
        :infinite-scroll-disabled="isMobile"
      >
        <RouterLink
          :to="{ name: 'talkDAOProposalDetail', params: { id: item._id } }"
          class="proposal-item"
          v-for="item in proposals"
          :key="item._id"
        >
          <!-- top -->
          <div class="top flex flex-align-center">
            <div class="flex1 flex flex-align-center">
              <ElSkeleton :loading="!users.some(_item => _item.address === item.creator)">
                <template #template>
                  <span class="user flex flex-align-center">
                    <ElSkeletonItem :variant="'image'" class="avatar" />
                    <span><ElSkeletonItem :variant="'text'" class="avatar"/></span>
                  </span>
                </template>
                <span class="user flex flex-align-center">
                  <UserAvatar
                    :meta-id="users.find(_item => _item.address === item.creator)!.metaId"
                    :image="users.find(_item => _item.address === item.creator)!.avatarImage"
                    :meta-name="users.find(_item => _item.address === item.creator)!.metaName"
                    :name="users.find(_item => _item.address === item.creator)!.name"
                  />
                  <span
                    ><UserName
                      :name="users.find(_item => _item.address === item.creator)!.name"
                      :meta-name="users.find(_item => _item.address === item.creator)!.metaName"
                  /></span>
                </span>
              </ElSkeleton>
            </div>
            <span class="status" :class="getStatusClass(item.beginBlockTime, item.endBlockTime)">{{
              getStatusText(item.beginBlockTime, item.endBlockTime)
            }}</span>
          </div>

          <div class="title">{{ item.title }}</div>

          <div class="content">
            {{ replaceMarkdownTag(item.desc) }}
          </div>

          <div class="bottom flex flex-align-center">
            <span class="time flex1 flex flex-align-center"
              ><Icon name="calendar_days" />
              {{ $filters.dateTimeFormat(item.createTime * 1000) }}</span
            >
            <span class="txid flex flex-align-center" @click.stop="tx(item.txid)"
              ><Icon name="link" /> {{ item.txid?.slice(0, 6) }}</span
            >
          </div>
        </RouterLink>

        <LoadMore :pagination="pagination" v-if="proposals.length" />
        <IsNull v-else />
      </div>

      <StakeModal v-model="isShowStake" :type="stakeType" @success="getUserStakeInfo" />

      <ExtractModal v-model="isShowExtractModal" @success="getUserStakeInfo" />
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { computed, reactive, ref, watch } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import { checkUserLogin, getUserInfoByAddress } from '@/utils/util'
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
import { tx } from '@/utils/util'
import { StakeType } from '@/enum'
import ExtractModal from '../components/ExtractModal.vue'
import { isMobile } from '@/stores/root'
import { replaceMarkdownTag } from '@/utils/util'

const pagination = reactive({ ...initPagination })
const proposals: ProposalItem[] = reactive([])
const isSkeleton = ref(true)
const router = useRouter()
const talk = useTalkStore()
const i18n = useI18n()
const now = new Date().getTime()
const userStore = useUserStore()
const stakeType = ref(StakeType.Pledge)
const users: UserAllInfo[] = reactive([])

const userStake: { val: DAOUserStakeInfo | null } = reactive({ val: null })
const isShowStake = ref(false)
const isShowExtractModal = ref(false)

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
        setTimeout(() => {
          for (let i = 0; i < res.length; i++) {
            if (typeof res[i].creator === 'string' && !users.some(item => item.address === res[i].creator)){
              getUserInfoByAddress(res[i].creator).then(user => {
                users.push(user)
              })
            }
          }
        }, 0)
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


const watchFun = watch(() => talk.activeCommunity, (result) => {
  if (result) {
    // watchFun()
    Promise.all([getDatas(true), getUserStakeInfo()]).then(() => {
      isSkeleton.value = false
    })
  }
}, {
 immediate: true
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
