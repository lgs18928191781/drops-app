<template>
  <div class="h-full flex flex-v">
    <div class="header">
      <a class="back flex flex-align-center" @click="$router.back()">
        <span class="icon-warp flex flex-align-center flex-pack-center">
          <Icon name="down" />
        </span>
        {{ $t('back') }}
      </a>
    </div>

    <ElSkeleton :loading="isSkeleton" animated>
      <div class="flex1 flex content-warp">
        <div
          class="content flex1"
          v-infinite-scroll="getMore"
          :infinite-scroll-immediate="false"
          :infinite-scroll-distance="100"
          :infinite-scroll-disabled="isMobile"
        >
          <div class="title">{{ proposal.val!.title }}</div>

          <div class="msg flex flex-align-center">
            <div class="flex1 flex flex-align-center">
              <div class="user flex flex-align-center">
                <UserAvatar :meta-id="''" :name="''" :meta-name="''" :image="''" />
                <span>缺角居士</span>
              </div>
              <span
                class="status"
                :class="getStatusClass(proposal.val!.beginBlockTime, proposal.val!.endBlockTime)"
                >{{  getStatusText(proposal.val!.beginBlockTime, proposal.val!.endBlockTime) }}</span
              >
              <span
                class="time"
                >{{ $filters.dateTimeFormat(proposal.val!.createTime * 1000) }}</span
              >
            </div>
            <div class="share">
              {{ $t('DAO.Share') }}
            </div>
          </div>

          <div class="cont">
            {{ proposal.val!.desc }}
          </div>

          <Card>
            <template #default>
              <div class="vote">
                <div class="title">
                  {{ votedInfo ? $t('DAO.Information About Your Vote') : $t('DAO.Vote Title') }}
                </div>
                <div class="vote-list">
                  <a
                    class="main-border"
                    :class="{
                      faded: votedInfo && index !== votedInfo.voteOption,
                      voted: votedInfo,
                    }"
                    v-for="(item, index) in proposal.val!.options"
                    :key="item"
                    @click="vote(item)"
                    >{{ $t(item)
                    }}<span class="value" v-if="votedInfo && index === votedInfo.voteOption"
                      >({{ votedInfo.voteAmount }})</span
                    ></a
                  >
                </div>
              </div>
            </template>
          </Card>

          <div class="vote-record">
            <div class="title">{{ $t('DAO.Vote Records') }}</div>

            <div
              class="vote-record-list"
              v-infinite-scroll="getMore"
              :infinite-scroll-immediate="false"
              :infinite-scroll-distance="100"
              :infinite-scroll-disabled="!isMobile"
            >
              <div
                class="vote-record-item flex flex-align-center"
                v-for="(item, index) in records"
                :key="index"
              >
                <ElSkeleton
                  class="flex1"
                  :loading="!recordsUserInfo.some(_item => _item.address === item.address)"
                  animated
                >
                  <template #template>
                    <div class="user flex flex-align-center">
                      <ElSkeletonItem :variant="'image'" class="avatar" />
                      <div class="flex1">
                        <div class="username"><ElSkeletonItem :variant="'text'" /></div>
                        <div class="metaid"><ElSkeletonItem :variant="'text'" /></div>
                      </div>
                    </div>
                  </template>
                </ElSkeleton>

                <div class="value flex1">
                  {{ $t(proposal.val!.options[item.voteOption]) }}
                </div>
                <div class="time">2020-04-26 11:30:12</div>
                <Icon name="link" class="link"></Icon>
              </div>

              <LoadMore :pagination="pagination" v-if="records.length" />
              <IsNull v-else />
            </div>
          </div>
        </div>

        <div class="right">
          <!-- Information -->
          <div class="section">
            <div class="title">{{ $t('DAO.Information') }}</div>
            <div class="cont">
              <div class="information-list">
                <!-- Proposal Type -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Proposal Type') }}</div>
                    <div class="value">基本类型投票</div>
                  </div>
                </div>

                <!-- Start Time -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Start Time') }}</div>
                    <div class="value">
                      {{ $filters.dateTimeFormat(proposal!.val!.beginBlockTime * 1000, 'local', 'YY-MM-DD HH:mm') }}
                    </div>
                  </div>
                </div>

                <!-- End Time -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.End Time') }}</div>
                    <div class="value">
                      {{ $filters.dateTimeFormat(proposal!.val!.endBlockTime * 1000, 'local', 'YY-MM-DD HH:mm') }}
                    </div>
                  </div>
                </div>

                <!-- MetaDao -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">MetaDao</div>
                    <div class="value">67</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Result -->
          <div class="section">
            <div class="title">{{ $t('DAO.Result') }}</div>
            <div class="cont">
              <div class="result-list">
                <div
                  class="result-item "
                  v-for="(item, index) in proposal.val!.options"
                  :key="index"
                >
                  <div class="top flex flex-align-center">
                    <div class="value flex1">{{ $t(item) }}</div>
                    <div class="count">
                      {{
                      proposal.val!.voteSumData[index] !== '0' 
                      ? 
                      new Decimal(proposal.val!.voteSumData[index]).div(totalVoteValue).mul(100).toFixed(2) 
                      :
                      0












                      }}%
                    </div>
                  </div>
                  <div class="proccess">
                    <ElProgress
                      :percentage="proposal.val!.voteSumData[index] !== '0' ? new Decimal(proposal.val!.voteSumData[index]).div(totalVoteValue).mul(100).toNumber() : 0"
                      :show-text="false"
                    />
                  </div>
                  <div class="vote-number">
                    {{ $t('DAO.Vote Number') }}: <br />
                    {{proposal.val!.voteSumData[index]}} / {{ totalVoteValue }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal v-model="isShowVoteModal" :loading="loading">
        <template #title>{{ $t('DAO.Vote') }}</template>
        <template #body>
          <div class="confirm-model">
            <div class="lable">{{ $t('DAO.You Will Vote') }}</div>
            <div class="main-border option">{{ $t(currentOption) }}</div>
            <div class="value">
              {{ $t('DAO.Vote Number') }}:<span>{{ userStake.val!.lockedTokenAmount }}</span>
            </div>
            <div class="main-border primary" @click="confirmVote">{{ $t('DAO.Confirm Vote') }}</div>
          </div>
        </template>
      </Modal>
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DAOStakeOperate, DAOVoteDefaultOption, NodeName, SdkPayType } from '@/enum'
import Card from '@/components/Card/Card.vue'
import { computed, reactive, ref } from 'vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import { initPagination } from '@/config'
import { isMobile } from '@/stores/root'
import { getStatusClass, getStatusText } from '@/utils/DAO'
import { GetStake, GetUserStakeInfo, Proposal, Vote, Vote2, Voters } from '@/api/dao'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { ProposalItem, VoterItem, DAOUserStakeInfo } from '@/@types/api/dao'
import Decimal from 'decimal.js-light'
import Modal from '@/components/Modal/Modal.vue'
import { useUserStore } from '@/stores/user'
import { checkUserLogin, getUserInfoByAddress } from '@/utils/util'
import { signTx, toHex, mvc } from 'mvc-scrypt/dist'

const i18n = useI18n()
const records: VoterItem[] = reactive([])
const isSkeleton = ref(true)
const pagination = reactive({ ...initPagination })
const talk = useTalkStore()
const route = useRoute()
const proposal: { val: null | ProposalItem } = reactive({ val: null })
const isShowVoteModal = ref(false)
const currentOption = ref('')
const voteValue = ref('')
const userStore = useUserStore()
const loading = ref(false)
const userStake: { val: null | DAOUserStakeInfo } = reactive({ val: null })
const createUser: {
  loading: boolean
  info: UserAllInfo | null
} = reactive({
  loading: true,
  info: null,
})
const recordsUserInfo: UserAllInfo[] = reactive([])

const dafaultVoteOptions = [
  {
    name: () => i18n.t('DAO.Approve'),
    value: DAOVoteDefaultOption.Approve,
  },
  {
    name: () => i18n.t('DAO.Opposition'),
    value: DAOVoteDefaultOption.Opposition,
  },
  {
    name: () => i18n.t('DAO.Abstain'),
    value: DAOVoteDefaultOption.Abstain,
  },
]

const totalVoteValue = computed(() => {
  let value = 0
  if (proposal.val) {
    for (let i = 0; i < proposal.val!.voteSumData.length; i++) {
      value += parseInt(proposal.val!.voteSumData[i])
    }
  }
  return value
})

const votedInfo = computed(() => {
  let result = null
  if (userStake.val) {
    for (let i in userStake.val!.voteInfo) {
      if (i === route.params.id && userStake.val!.voteInfo[i].voteAmount) {
        result = userStake.val!.voteInfo[i]
        break
      }
    }
  }
  return result
})

function getDetail() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await Proposal({
      symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${talk.activeCommunity!.dao!.daoId}`,
      voteID: route.params.id as string,
    })
    if (res) {
      proposal.val = res
      if (createUser.loading) {
        // getUserInfoByAddress(mvc.Address.fromObject(proposal.val!.creator).toString()).then(
        //   user => {
        //     createUser.info = user
        //     createUser.loading = false
        //   }
        // )
      }
      resolve()
    }
  })
}

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await Voters({
      symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${talk.activeCommunity!.dao!.daoId}`,
      voteID: route.params.id as string,
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    })
    if (res) {
      if (isCover) records.length = 0
      if (res.length) {
        records.push(...res)
        pagination.nothing = false
        setTimeout(() => {
          for (let i = 0; i < res.length; i++) {
            if (!recordsUserInfo.some(item => item.address === res[i].address)) {
              getUserInfoByAddress(res[i].address).then(user => {
                recordsUserInfo.push(user)
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

function getUserStake() {
  return new Promise<void>(async (resolve, reject) => {
    if (userStore.isAuthorized) {
      const res = await GetUserStakeInfo({
        symbol: `${talk.activeCommunity!.dao!.governanceSymbol}_${
          talk.activeCommunity!.dao!.daoId
        }`,
        address: userStore.user!.address,
      })
      if (res.code === 0) {
        userStake.val = res.data
        resolve()
      }
    } else {
      resolve()
    }
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

async function vote(option: string) {
  await checkUserLogin()
  if (votedInfo.value) return
  if (!userStake.val!.lockedTokenAmount || userStake.val!.lockedTokenAmount === '0') {
    return ElMessage.error(i18n.t('DAO.NOt Have Voting Quota'))
  }
  currentOption.value = option
  isShowVoteModal.value = true
}

async function confirmVote() {
  loading.value = true
  try {
    const symbol = `${talk.activeCommunity!.dao!.governanceSymbol}_${
      talk.activeCommunity!.dao!.daoId
    }`
    const stakeRes = await GetStake({
      symbol,
      address: userStore.user!.address,
      op: DAOStakeOperate.Vote,
    })
    if (stakeRes.code === 0) {
      const transfer = await userStore.showWallet.createBrfcChildNode(
        {
          nodeName: NodeName.SendMoney,
          payTo: [{ address: stakeRes.data.mvcToAddress, amount: stakeRes.data.txFee }],
        },
        {
          isBroadcast: false,
          payType: SdkPayType.SPACE,
        }
      )
      if (transfer) {
        if (transfer.payToAddress?.transaction) {
          await userStore.showWallet.wallet?.provider.broadcast(
            transfer.payToAddress?.transaction.toString()
          )
        }
        const res = await Vote({
          symbol,
          requestIndex: stakeRes.data.requestIndex,
          mvcRawTx: transfer.sendMoney.transaction.toString(),
          mvcOutputIndex: 0,
          voteID: route.params.id as string,
          voteOption: proposal.val!.options.findIndex(item => item === currentOption.value),
          confirmVote: true,
        })
        if (res.code === 0) {
          const tx = new mvc.Transaction(res.data.txHex)
          // @ts-ignore
          const script = mvc.Script.fromBuffer(Buffer.from(res.data.scriptHex, 'hex'))
          const pubKey = userStore.showWallet.wallet!.getPathPubliceKey('0/0').toHex()
          const sig = toHex(
            signTx(
              // @ts-ignore
              tx,
              userStore.showWallet.wallet!.getPathPrivateKey('0/0'),
              script,
              Number(res.data.satoshis),
              res.data.inputIndex
            )
          )
          const response = await Vote2({
            symbol,
            requestIndex: stakeRes.data.requestIndex,
            pubKey: pubKey,
            sig,
          })
          if (response.code === 0) {
            pagination.page = 1
            getDatas(true)
            getDetail()
            userStake.val!.voteInfo[route.params.id as string] = {
              voteAmount: userStake.val!.lockedTokenAmount,
              voteOption: proposal.val!.options.findIndex(item => item === currentOption.value),
            }
            ElMessage.success(i18n.t('DAO.Vote Successful'))
            isShowVoteModal.value = false
            loading.value = false
          }
        }
      }
    }
  } catch (error) {
    ElMessage.error((error as any).message)
    loading.value = false
  }
}

Promise.all([getDetail(), getDatas(true), getUserStake()]).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
