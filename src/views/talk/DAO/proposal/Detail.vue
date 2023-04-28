<template>
  <div class="h-full flex flex-v ">
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
          class="content flex1 relative"
          v-infinite-scroll="getMore"
          :infinite-scroll-immediate="false"
          :infinite-scroll-distance="100"
          :infinite-scroll-disabled="isMobile"
        >
          <!-- 结果 -->
          <div
            class="result flex flex-align-center flex-pack-center"
            :class="resultClass"
            v-if="status === DAOProposalStatus.Ended"
          >
            {{ resultText }}
          </div>
          <div class="msg flex flex-align-center">
            <div class="flex1 flex flex-align-center">
              <ElSkeleton :loading="!createUser.val" animated>
                <template #template>
                  <div class="user flex flex-align-center">
                    <ElSkeletonItem :variant="'image'" class="avatar" />
                    <span><ElSkeletonItem :variant="'text'"/></span>
                  </div>
                </template>
                <div class="user flex flex-align-center">
                  <UserAvatar
                    :meta-id="createUser.val!.metaId"
                    :name="createUser.val!.name"
                    :meta-name="createUser.val!.metaName"
                    :image="createUser.val!.avatarImage"
                  />
                  <span
                    ><UserName
                      :name="createUser.val!.name"
                      :meta-name="createUser.val!.metaName"
                      :no-tag="true"
                  /></span>
                </div>
              </ElSkeleton>

              <!-- <span
                class="time"
                >{{ $filters.dateTimeFormat(proposal.val!.createTime * 1000) }}</span
              > -->
            </div>
            <span class="status" :class="statusClass">{{ statusText }}</span>
            <!-- <div class="share">
              {{ $t('DAO.Share') }}
            </div> -->
          </div>

          <div class="title">{{ proposal.val!.title }}</div>

          <div class="cont" :class="{ rendering: markdownRendering }" ref="ConetenWarpRef">
            <article ref="ContentRef"></article>
          </div>

          <Card>
            <template #default>
              <div class="vote">
                <div
                  class="cover flex flex-align-center flex-pack-center"
                  v-if="status !== DAOProposalStatus.Active && !votedInfo"
                >
                  {{ statusText }}
                </div>
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
                    >{{ $t(item) }}</a
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
                  <div class="user flex flex-align-center">
                    <UserAvatar
                      :meta-id="
                        recordsUserInfo.find(_item => _item.address === item.address)?.metaId
                      "
                      :image="
                          recordsUserInfo.find(_item => _item.address === item.address)!.avatarImage
                        "
                      :name="recordsUserInfo.find(_item => _item.address === item.address)?.name"
                      :meta-name="
                          recordsUserInfo.find(_item => _item.address === item.address)!.metaName
                        "
                    />
                    <div class="flex1">
                      <div class="username">
                        <UserName
                          :name="recordsUserInfo.find(_item => _item.address === item.address)!.name"
                          :meta-name="recordsUserInfo.find(_item => _item.address === item.address)!.metaName"
                          :no-tag="true"
                        />
                      </div>
                      <div class="metaid">
                        MetaID:
                        {{ recordsUserInfo.find(_item => _item.address === item.address)!.metaId.slice(0,6) }}
                      </div>
                    </div>
                  </div>
                </ElSkeleton>

                <div class="value flex1">
                  {{ $t(proposal.val!.options[item.voteOption]) }}
                </div>
                <div class="time">
                  {{ $filters.dateTimeFormat(item.time * 1000, $i18n.locale, 'YY-MM-DD HH:mm:ss') }}
                </div>
                <Icon name="link" class="link" @click="tx(item.txid)"></Icon>
              </div>

              <LoadMore :pagination="pagination" v-if="records.length" />
              <IsNull v-else />
            </div>
          </div>
        </div>

        <div class="right flex flex-v">
          <!-- Information -->
          <div class="section">
            <div class="title">{{ $t('DAO.Information') }}</div>
            <div class="cont">
              <div class="information-list">
                <!-- Proposal Type -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Proposal Type') }}</div>
                    <div class="value">{{ $t('DAO.Single Vote Type') }}</div>
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

                <!-- Total Staking -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Total Staking') }}</div>
                    <div class="value">
                      {{ $filters.space(totalVoteValue) }}
                    </div>
                  </div>
                </div>

                <!-- Result Pass Min User Number -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Result Pass Min User Number') }}</div>
                    <div class="value">
                      {{ proposal!.val!.infos.resultOption.minUser }} {{ $t('DAO.People') }}
                    </div>
                  </div>
                </div>

                <!-- Result Pass Min User Number -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.Result Pass Min Vote Amount') }}</div>
                    <div class="value">
                      {{ $filters.space(proposal!.val!.infos.resultOption.minAmount) }} Space
                    </div>
                  </div>
                </div>

                <!-- Result Pass Min User Number -->
                <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.DAO.Result Pass Min Percent') }}</div>
                    <div class="value">{{ proposal!.val!.infos.resultOption.minPercent }} %</div>
                  </div>
                </div>

                <!-- My Stakeding -->
                <div class="information-item" v-if="votedInfo">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">{{ $t('DAO.My Stakeding') }}</div>
                    <div class="value">
                      {{ $filters.space(votedInfo!.voteAmount) }}
                    </div>
                  </div>
                </div>

                <div class="time-tips">
                  {{ $t('DAO.Not Extractable Time Tips') }} <br />
                  {{ $t('DAO.New Block Time') }}: {{ $filters.dateTimeFormat(blockTimeStamp) }}
                </div>

                <!-- MetaDao -->
                <!-- <div class="information-item ">
                  <div class="information-item-warp flex flex-align-center">
                    <div class="flex1 lable">MetaDao</div>
                    <div class="value">67</div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>

          <!-- Result -->
          <div class="section">
            <div class="title">{{ $t('DAO.Result') }}</div>
            <div class="cont">
              <div class="result-list h-full overflow-y-auto">
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
                    {{ $filters.space(proposal.val!.voteSumData[index]) }} /
                    {{ $filters.space(totalVoteValue) }}
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
import {
  DAOProposalStatus,
  DAOStakeOperate,
  DAOVoteDefaultOption,
  NodeName,
  SdkPayType,
} from '@/enum'
import Card from '@/components/Card/Card.vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import { initPagination } from '@/config'
import { isMobile } from '@/stores/root'
import { getStatusClass, getStatusText, DAOtypeOptions } from '@/utils/DAO'
import { GetBlockTime, GetStake, GetUserStakeInfo, Proposal, Vote, Vote2, Voters } from '@/api/dao'
import { useTalkStore } from '@/stores/talk'
import { useRoute } from 'vue-router'
import { ProposalItem, VoterItem, DAOUserStakeInfo } from '@/@types/api/dao'
import Decimal from 'decimal.js-light'
import Modal from '@/components/Modal/Modal.vue'
import { useUserStore } from '@/stores/user'
import { checkUserLogin, getUserInfoByAddress, openLoading, tx } from '@/utils/util'
import { signTx, toHex, mvc } from 'mvc-scrypt/dist'
import { marked } from 'marked'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

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
  val: UserAllInfo | null
} = reactive({
  val: null,
})
const recordsUserInfo: UserAllInfo[] = reactive([])
const ContentRef = ref()
const blockTimeStamp = ref(0)
const vditor = ref<Vditor | null>(null)
const markdownRendering = ref(true)
const ConetenWarpRef = ref()
let markdownLoading: any

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

const statusText = computed(() => {
  return getStatusText(
    proposal.val!.beginBlockTime,
    proposal.val!.endBlockTime,
    blockTimeStamp.value
  )
})

const resultText = computed(() => {
  let text = ''
  if (proposal.val!) {
    let max = new Decimal(proposal.val!.voteSumData[0]).toNumber()
    let maxIndex = 0
    for (let i = 1; i < proposal.val!.voteSumData.length; i++) {
      const value = new Decimal(proposal.val!.voteSumData[i]).toNumber()
      if (value > max) {
        max = value
        maxIndex = i
      }
    }
    if (
      max < proposal.val.infos.resultOption.minAmount ||
      new Decimal(max)
        .div(totalVoteValue.value)
        .mul(100)
        .toNumber() < proposal.val.infos.resultOption.minPercent
    ) {
      text = i18n.t('DAO.Invalid')
    } else {
      text = proposal.val!.options[maxIndex]
    }
  }
  return text
})

const resultClass = computed(() => {
  let text = ''
  if (proposal.val!) {
    let max = new Decimal(proposal.val!.voteSumData[0]).toNumber()
    let maxIndex = 0
    for (let i = 1; i < proposal.val!.voteSumData.length; i++) {
      const value = new Decimal(proposal.val!.voteSumData[i]).toNumber()
      if (value > max) {
        max = value
        maxIndex = i
      }
    }
    if (
      max < proposal.val.infos.resultOption.minAmount ||
      new Decimal(max)
        .div(totalVoteValue.value)
        .mul(100)
        .toNumber() < proposal.val.infos.resultOption.minPercent
    ) {
      text = 'faded'
    }
  }
  return text
})

const status = computed(() => {
  if (proposal.val!.beginBlockTime * 1000 > blockTimeStamp.value) {
    return DAOProposalStatus.UnStart
  } else if (
    proposal.val!.beginBlockTime * 1000 <= blockTimeStamp.value &&
    proposal.val!.endBlockTime * 1000 > blockTimeStamp.value
  ) {
    return DAOProposalStatus.Active
  } else {
    return DAOProposalStatus.Ended
  }
})

const isVoteing = computed(() => {
  if (
    proposal.val!.beginBlockTime * 1000 <= blockTimeStamp.value &&
    proposal.val!.endBlockTime * 1000 > blockTimeStamp.value
  ) {
    return true
  } else {
    return false
  }
})

const statusClass = computed(() => {
  return getStatusClass(
    proposal.val!.beginBlockTime,
    proposal.val!.endBlockTime,
    blockTimeStamp.value
  )
})

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
      // @ts-ignore
      if (!res.infos) res.infos = {}
      if (!res.infos?.resultOption) {
        res.infos.resultOption = {
          minAmount: 100000000,
          minUser: 1,
          minPercent: 60,
        }
      }

      proposal.val = res
      if (!createUser.val && typeof proposal.val!.creator === 'string') {
        getUserInfoByAddress(proposal.val!.creator).then(user => {
          createUser.val = user
        })
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
      } else if (transfer === null) {
        loading.value = false
      }
    }
  } catch (error) {
    ElMessage.error((error as any).message)
    loading.value = false
  }
}

function getLeastBlockTimestamp() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetBlockTime().catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      blockTimeStamp.value = res.data * 1000
      resolve()
    }
  })
}

let watchFun: any
watchFun = watch(
  () => talk.activeCommunity,
  result => {
    if (result) {
      if (watchFun) {
        watchFun()
      }
      Promise.all([getLeastBlockTimestamp(), getDetail(), getDatas(true), getUserStake()]).then(
        () => {
          isSkeleton.value = false
          nextTick(() => {
            markdownLoading = openLoading({
              target: ConetenWarpRef.value,
            })
            vditor.value = new Vditor(ContentRef.value, {
              cache: {
                enable: false,
              },
              toolbarConfig: {
                hide: true,
              },
              mode: 'sv',
              preview: {
                theme: {
                  current: 'ant-design',
                },
              },
              value: proposal.val!.desc.replace(
                '](https://www.msn.cn/zh-cn/news/other/8%E6%A0%B9%E7%82%B8%E4%B8%B2%E8%A6%81115%E5%85%83-%E6%B8%B8%E5%AE%A2%E4%B8%8E%E5%95%86%E5%AE%B6%E4%BA%89%E6%89%A7%E8%A2%AB%E9%AA%82%E7%A9%B7-%E5%9B%9E%E5%BA%94%E6%9D%A5%E4%BA%86/ar-AA1ar2zt?ocid=msedgntp&cvid=08a19c58ad61421e812b51a6b11701b3&ei=6&fullscreen=true#image=3)',
                ''
              ),
              after: () => {
                vditor.value!.disabled()
                markdownRendering.value = false
                if (markdownLoading) {
                  markdownLoading.close()
                }
              },
            })
            // ContentRef.value.innerHTML = marked.parse(proposal.val!.desc)
          })
        }
      )
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
