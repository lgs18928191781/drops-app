<template>
  <ElSkeleton :loading="loading" animated>
    <template #template>
      <div class="buzz-list">
        <div
          class="buzz-item-warp"
          v-for="(item, index) in Array.from({ length: pagination?.pageSize || 1 })"
        >
          <BuzzItemSkeletonVue />
        </div>
      </div>
    </template>

    <template #default>
      <div
        v-infinite-scroll="getMore"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
        class="buzz-list"
      >
        <DynamicScroller
          :items="list"
          :min-item-size="1"
          key-field="txId"
          :pageMode="true"
          :buffer="1000"
        >
          <template v-slot="{ item, index, active }">
            <template v-if="index === recommendCommunityIndex && pagination">
              <slot name="recommendCommunity"></slot>
            </template>
            <template v-if="index === recommendFollowIndex && pagination">
              <slot name="recommendFollow"></slot>
            </template>
            <template v-if="index === recommendGuideIndex && pagination">
              <slot name="recommendGuide"></slot>
            </template>
            <DynamicScrollerItem
              class="buzz-item-warp"
              :item="item"
              :active="active"
              :data-index="index"
            >
              <BuzzItemVue
                :data="item"
                :loading="loading"
                :play-file="playFile"
                :isInDetailPage="isInDetailPage"
                @repost="onRepost"
                @more="onMore"
                @like="onLike"
                @follow="onFollow"
                @play="onPlay"
                @replay="onReplay"
                @translate="onTranslate"
              >
                <template #comment>
                  <slot name="comment"></slot>
                </template>
              </BuzzItemVue>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
        <LoadMoreVue :pagination="pagination" v-if="pagination && !loading && list.length > 0" />

        <!-- null -->
        <IsNullVue v-if="!loading && list.length <= 0" />
      </div>
    </template>
  </ElSkeleton>

  <ElDrawer
    v-model="isShowOperateModal"
    direction="btt"
    :with-header="false"
    :close-on-click-modal="false"
    custom-class="buzz"
  >
    <div
      class="repost-list"
      v-loading="operateLoading"
      :element-loading-svg="LoadingTEXT"
      :element-loading-text="$t('Loading')"
    >
      <div class="repost-list-warp">
        <div
          class="respost-item main-border primary"
          v-for="(item, index) in operates[operateType]"
          :key="index"
          @click="item.fun()"
        >
          {{ item.name() }}
        </div>
        <div class="respost-item main-border" @click="isShowOperateModal = false">
          {{ $t('Cancel') }}
        </div>
      </div>
    </div>
  </ElDrawer>

  <PublishBaseTemplateVue
    v-model="isShowCommentModal"
    v-model:text="comment"
    :replay-user="replayMsg.val.username"
    :loading="operateLoading"
    :placeholder="$t('Buzz.Your reply')"
  >
    <template #other>
      <div class="operate flex flex-pack-end">
        <a class="main-border primary" :class="{ faded: comment === '' }" @click="replay">
          {{ $t('Reply') }}
        </a>
      </div>
    </template>
  </PublishBaseTemplateVue>
</template>

<script setup lang="ts">
import BuzzItemVue from './BuzzItem.vue'
import { ElDrawer } from 'element-plus'
import { computed, inject, reactive, Ref, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IsNullVue from '@/components/IsNull/IsNull.vue'
import LoadMoreVue from '@/components/LoadMore/LoadMore.vue'
import { checkUserLogin, copy, randomRange, tx } from '@/utils/util'
import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import { JobStatus, NodeName } from '@/enum'
import { Mitt, MittEvent } from '@/utils/mitt'
import { useLayoutStore } from '@/stores/layout'
import BuzzItemSkeletonVue from './BuzzItemSkeleton.vue'
import { metafile } from '@/utils/filters'
import PublishBaseTemplateVue from '@/components/PublishBaseTemplate/PublishBaseTemplate.vue'
import { useRoute } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { GetBuzz } from '@/api/aggregation'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { Translate } from '@/api/core'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

interface Props {
  list: BuzzItem[]
  loading?: boolean
  pagination?: Pagination
  isInDetailPage?: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['getMore', 'comment', 'like', 'updateItem', 'removeItem', 'addItem'])
console.log('props.list', props.list)
const i18n = useI18n()
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()
const jobsStore = useJobsStore()

const operateLoading = ref(false)

const recommendCommunityIndex = ref(randomRange(0, 11))
const recommendFollowIndex = ref(randomRange(0, 11))
const recommendGuideIndex = ref(randomRange(0, 11))
const isShowOperateModal = ref(false)
const operateType: Ref<'repost' | 'more'> = ref('repost')
const currentTxId = ref('')
const playFile = ref('')
const isShowCommentModal = ref(false)
const comment = ref('')
const replayMsg = reactive({
  val: {
    username: '',
    userAddress: '',
    commentTo: '',
    replyTo: '',
  },
})
let audio: HTMLAudioElement | null
const isShowBuzzPublish: Ref<boolean> = inject('isShowBuzzPublish')!
const repostTxId: Ref<string> = inject('repostTxId')!
const translatedTx: {
  txId: string
  originalText: string
  originalQuiteText?: string
}[] = []

const operates: {
  [key: string]: {
    name: () => string
    fun: () => void
  }[]
} = {
  repost: [
    {
      name: () => i18n.t('Buzz.repost.quick'),
      fun: async () => {
        await checkUserLogin()
        try {
          let isQuoteItem = false
          const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
          let index = props.list.findIndex(item => item.txId === currentTxId.value)
          if (index === -1) {
            index = props.list.findIndex(
              item => item.quoteItem && item.quoteItem.txId === currentTxId.value
            )
            if (index === -1) {
              throw new Error('TxId Not Found')
            } else {
              isQuoteItem = true
            }
          }
          const targetBuzz = isQuoteItem
            ? { ...props.list[index].quoteItem }
            : { ...props.list[index] }

          const time = new Date().getTime()
          const res = await userStore.showWallet.createBrfcChildNode(
            {
              nodeName: NodeName.SimpleRePost,
              data: JSON.stringify({
                createTime: time,
                rePostTx: currentTxId.value,
                rePostProtocol: targetBuzz.protocol,
                rePostComment: '',
              }),
              payTo: [{ amount: payAmount, address: targetBuzz.zeroAddress }],
            },
            {
              useQueue: true,
            }
          )
          if (res) {
            const watchJobStatus = watch(
              () => jobsStore.waitingNotify.find(job => job.id === res.subscribeId)?.status,
              status => {
                if (status === JobStatus.Success) {
                  watchJobStatus()
                  GetBuzz({
                    txId: res.currentNode!.txId,
                    metaId: userStore.user!.metaId,
                  }).then(respones => {
                    if (respones.data.results.items.length) {
                      emit('updateItem', respones.data.results.items[0])
                    }
                  })
                } else if (status === JobStatus.Failed) {
                  watchJobStatus()
                  emit('removeItem', { txId: res.currentNode!.txId })
                }
              }
            )
            targetBuzz.rePost.push({
              metaId: userStore.user!.metaId!,
              timestamp: time,
              txId: res.currentNode!.txId,
              userName: userStore.user!.name!,
              value: payAmount,
            })
            emit(
              'updateItem',
              isQuoteItem
                ? {
                    ...props.list[index],
                    quoteItem: targetBuzz,
                  }
                : targetBuzz
            )
            Mitt.emit(MittEvent.AddBuzz, {
              applauseCount: 0,
              attachments: [],
              avatarImage: userStore.user!.avatarImage,
              avatarTxId: userStore.user!.avatarTxId,
              avatarType: userStore.user!.avatarType,
              blockHeight: -1,
              buzzCard: null,
              comment: [],
              commentCount: 0,
              confirmState: 0,
              content: '',
              contentType: 'text/plain',
              data: '',
              displayType: 'quickRePost',
              donate: [],
              encrypt: '0',
              history: [],
              isEdit: false,
              isFull: true,
              isMyFollow: true,
              isNew: true,
              isSelling: false,
              isValid: true,
              like: [],
              likeCount: 0,
              metaAccessCodeHash: '',
              metaAccessContentAmount: '',
              metaAccessContentEncryptContent: '',
              metaAccessContentOwnerAvatarTxId: '',
              metaAccessContentOwnerAvatarType: '',
              metaAccessContentOwnerMetaId: '',
              metaAccessContentOwnerName: '',
              metaAccessContentRevenueAmount: 0,
              metaAccessGenesisId: '',
              metaAccessHasPay: false,
              metaAccessMetanetId: '',
              metaAccessPayTx: '',
              metaAccessPutAway: false,
              metaAccessSellTx: '',
              metaAccessServiceConfigMetanetId: '',
              metaAccessServiceConfigTxId: '',
              metaAccessServiceFee: '',
              metaAccessServiceMetaId: '',
              metaAccessServiceName: '',
              metaAccessServiceUrl: '',
              metaAccessTokenIndex: '',
              metaAccessTxId: '',
              metaId: userStore.user!.metaId,
              metanetId: '',
              postTag: 'buzz',
              postTagId: 1,
              protocol: 'SimpleRePost',
              publicKey: '',
              quoteItem: targetBuzz,
              rePost: [],
              rePostCount: 0,
              serverCode: '',
              serverPublicKey: '',
              shareProtocol: '',
              timestamp: 1671866186541,
              totalValue: 0,
              txId: res.currentNode!.txId,
              userName: userStore.user!.name,
              zeroAddress: userStore.user!.address,
              userInfo: {
                address: userStore.user!.address,
                avatarImage: userStore.user!.avatarImage,
                avatarTxId: userStore.user!.avatarTxId,
                avatarType: userStore.user!.avatarType,
                coverPublicKey: '',
                coverType: userStore.user!.avatarType,
                coverUrl: '',
                metaIdTimestamp: '',
                name: userStore.user!.name,
                nameType: '',
                nftNamePublicKey: '',
                publicKey: '',
                metaName: userStore.user!.metaName,
              },
            })
            ElMessage.success(i18n.t('Buzz.repost.success'))
            operateLoading.value = false
            isShowOperateModal.value = false
          } else {
            operateLoading.value = false
          }
        } catch (error) {
          operateLoading.value = false
          ElMessage.error((error as any).message)
        }
      },
    },
    {
      name: () => i18n.t('Buzz.repost.comment'),
      fun: () => {
        operateLoading.value = false
        isShowOperateModal.value = false
        repostTxId.value = currentTxId.value
        isShowBuzzPublish.value = true
      },
    },
  ],
  more: [
    {
      name: () => i18n.t('Buzz.repost.share'),
      fun: () => {
        copy(
          `${location.origin}${
            router.resolve({
              name: 'buzzDetail',
              params: {
                txId: currentTxId.value,
              },
            }).fullPath
          }`
        ).then(() => {
          isShowOperateModal.value = false
        })
      },
    },
    {
      name: () =>
        translatedTx.some(item => item.txId === currentTxId.value)
          ? i18n.t('Buzz.repost.Show original text')
          : i18n.t('Buzz.repost.Translate'),
      fun: async () => {},
    },
    {
      name: () => i18n.t('Buzz.repost.lookTx'),
      fun: () => {
        tx(currentTxId.value)
        isShowOperateModal.value = false
      },
    },
  ],
}

async function onRepost(txId: string) {
  await checkUserLogin()
  operateType.value = 'repost'
  currentTxId.value = txId
  isShowOperateModal.value = true
}

function onMore(txId: string) {
  operateType.value = 'more'
  currentTxId.value = txId
  isShowOperateModal.value = true
}

function onReplay(params: {
  txId: string
  username: string
  userAddress: string
  commentTo: string
  replyTo: string
}) {
  currentTxId.value = params.txId
  replayMsg.val = params
  isShowCommentModal.value = true
}

async function onLike(params: { txId: string; address: string; done: () => void }) {
  await checkUserLogin()
  let isQuote = false
  let index = props.list.findIndex(item => item.txId === params.txId)
  if (index === -1) {
    index = props.list.findIndex(item => item.quoteItem && item.quoteItem.txId === params.txId)
    if (index === -1) {
      // throw new Error('txId Not Found')
    } else {
      isQuote = true
    }
  }
  const time = new Date().getTime()
  const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
  const res = await userStore.showWallet
    .createBrfcChildNode(
      {
        nodeName: NodeName.PayLike,
        data: JSON.stringify({
          createTime: time,
          isLike: '1',
          likeTo: params.txId,
          pay: payAmount,
          payTo: params.address,
        }),
        payTo: [{ amount: payAmount, address: params.address }],
      },
      {
        useQueue: true,
      }
    )
    .catch(error => {
      ElMessage.error(error.message)
    })
  if (res) {
    if (index !== -1) {
      const buzz = { ...props.list[index] }
      const watchJobStatus = watch(
        () => jobsStore.waitingNotify.find(job => job.id === res.subscribeId)?.status,
        status => {
          if (status === JobStatus.Success) {
            watchJobStatus()
          } else if (status === JobStatus.Failed) {
            watchJobStatus()
            if (isQuote) {
              buzz.quoteItem.like.splice(
                buzz.quoteItem.like.findIndex(item => item.txId === res.currentNode!.txId),
                1
              )
            } else {
              buzz.like.splice(
                buzz.like.findIndex(item => item.txId === res.currentNode!.txId),
                1
              )
            }
            emit('updateItem', buzz)
          }
        }
      )
      const params = {
        metaId: userStore.user!.metaId!,
        timestamp: time,
        txId: res.currentNode!.txId,
        userName: userStore.user!.name,
        value: payAmount,
      }
      if (isQuote) buzz.quoteItem.like.push(params)
      else buzz.like.push(params)
      emit('updateItem', buzz)
    }
    ElMessage.success(i18n.t('PayLike') + ' ' + i18n.t('Success'))
    emit('like', params.txId)
    params.done()
  } else {
    params.done()
  }
}

async function onFollow(
  txId: string,
  params: { resolve: (txId?: string) => void; reject: (resan: any) => any }
) {
  await checkUserLogin()
  let isQuoteItem = false
  let index = props.list.findIndex(item => item.txId === txId)
  if (index === -1) {
    index = props.list.findIndex(item => item.quoteItem && item.quoteItem.txId === txId)
    if (index !== -1) {
      isQuoteItem = true
    } else {
      return new Error('txId not found')
    }
  }
  const target = isQuoteItem ? { ...props.list[index].quoteItem } : { ...props.list[index] }

  const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
  const res = await userStore.showWallet
    .createBrfcChildNode(
      {
        nodeName: NodeName.PayFollow,
        data: JSON.stringify({
          createTime: new Date().getTime(),
          MetaID: target.metaId,
          pay: payAmount,
          payTo: target.zeroAddress,
        }),
        payTo: [{ amount: payAmount, address: target.zeroAddress }],
      },
      {
        useQueue: true,
      }
    )
    .catch(error => params.reject(error))
  if (res) {
    const watchJobStatus = watch(
      () => jobsStore.waitingNotify.find(job => job.id === res.subscribeId)?.status,
      status => {
        if (status === JobStatus.Success) {
          watchJobStatus()
        } else if (status === JobStatus.Failed) {
          watchJobStatus()
          target.isMyFollow = false
          Mitt.emit(MittEvent.RemoveBuzz, { txId: res.currentNode!.txId })
          emit(
            'updateItem',
            isQuoteItem
              ? {
                  ...props.list[index],
                  quoteItem: target,
                }
              : target
          )
          Mitt.emit(MittEvent.FollowUser, { metaId: target.metaId, result: false })
        }
      }
    )
    target.isMyFollow = true
    emit(
      'updateItem',
      isQuoteItem
        ? {
            ...props.list[index],
            quoteItem: target,
          }
        : target
    )
    Mitt.emit(MittEvent.FollowUser, { metaId: target.metaId, result: true })
    params.resolve(res.currentNode.txId)
  } else {
    params.resolve()
  }
}

function onPlay(params: { file: string; type: 'audio' | 'video' }) {
  if (playFile.value === params.file) playFile.value = ''
  else playFile.value = params.file
  if (params.type === 'audio' && playFile.value) {
    if (!audio) {
      audio = new Audio()
    }
    audio.src = metafile(params.file)
    audio.play()
    audio.addEventListener('ended', () => {
      audio!.src = ''
      playFile.value = ''
    })
  } else {
    if (audio) {
      audio.pause()
      audio.src = ''
    }
  }
}

function replay() {
  return new Promise<void>(async resolve => {
    if (comment.value === '') return
    operateLoading.value = true
    try {
      const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
      const dataParams = {
        createTime: new Date().getTime(),
        content: comment.value,
        contentType: 'text/plain',
        commentTo: replayMsg.val.commentTo,
        replyTo: replayMsg.val.replyTo,
        pay: payAmount,
        payTo: replayMsg.val.userAddress,
      }
      const res = await userStore.showWallet?.createBrfcChildNode(
        {
          nodeName: NodeName.PayComment,
          dataType: 'application/json',
          data: JSON.stringify(dataParams),
          payTo: [{ address: replayMsg.val.userAddress, amount: payAmount }],
        },
        {
          useQueue: true,
        }
      )
      if (res) {
        const index = props.list.findIndex(item => item.txId === currentTxId.value)

        if (index !== -1) {
          if (replayMsg.val.commentTo === currentTxId.value) {
            const buzz = { ...props.list[index] }
            const watchJobStatus = watch(
              () => jobsStore.waitingNotify.find(job => job.id === res.subscribeId)?.status,
              status => {
                if (status === JobStatus.Success) {
                  watchJobStatus()
                } else if (status === JobStatus.Failed) {
                  watchJobStatus()
                  buzz.comment.splice(
                    buzz.comment.findIndex(item => item.txId === res.currentNode!.txId)
                  )
                  emit('updateItem', buzz)
                }
              }
            )
            buzz.comment.unshift({
              metaId: userStore.user!.metaId!,
              timestamp: dataParams.createTime,
              txId: res.currentNode!.txId,
              userName: userStore.user!.name!,
              value: payAmount,
            })
            emit('updateItem', buzz)
          }
        }

        if (route.name !== 'buzzDetail') {
          router.push({
            name: 'buzzDetail',
            params: {
              txId: currentTxId.value,
            },
          })
        }
        emit('comment', {
          amount: 'payAmount',
          avatarImage: userStore.user!.avatarImage,
          avatarTxId: userStore.user!.avatarTxId,
          avatarType: userStore.user!.avatarType,
          blockHeight: 0,
          buzzTxId: currentTxId.value,
          commentCount: 0,
          confirmState: 0,
          content: comment.value,
          hasComment: false,
          hasMyLike: false,
          isValid: true,
          likeCount: 0,
          metaId: userStore.user!.metaId,
          metanetId: '',
          protocol: 'PayComment',
          publicKey: '',
          replyTo: replayMsg.val!.replyTo,
          replyToAvatarImage: '',
          replyToAvatarTxId: '',
          replyToAvatarType: '',
          replyToUserName: replayMsg.val!.username,
          timestamp: dataParams.createTime,
          txId: res.currentNode!.txId,
          userName: userStore.user!.name,
          zeroAddress: userStore.user!.address,
          subInteractiveItem: [],
          commentTo: replayMsg.val.commentTo,
        })
        isShowCommentModal.value = false
        ElMessage.success(i18n.t('Buzz.comment.success'))
        operateLoading.value = false

        comment.value = ''
        resolve()
      } else {
        operateLoading.value = false
        resolve()
      }
    } catch (error) {
      ElMessage.error((error as any).message)
      operateLoading.value = false
    }
  })
}

async function onTranslate(txId: string, callback?: (result: boolean) => void) {
  currentTxId.value = txId
  await translateItem()
  if (callback) callback(translatedTx.some(item => item.txId === currentTxId.value))
}

function getMore() {
  emit('getMore')
}

function translateItem() {
  return new Promise<void>(async resolve => {
    const translatedTxIndex = translatedTx.findIndex(item => item.txId === currentTxId.value)
    const index = props.list.findIndex(item => item.txId === currentTxId.value)
    if (translatedTxIndex !== -1) {
      if (
        props.list[index].protocol === 'SimpleRePost' &&
        props.list[index].displayType === 'quickRePost'
      ) {
        props.list[index]!.quoteItem.content = translatedTx[translatedTxIndex].originalText
      } else {
        props.list[index]!.content = translatedTx[translatedTxIndex].originalText
      }

      if (translatedTx[translatedTxIndex].originalQuiteText) {
        props.list[index]!.quoteItem.content = translatedTx[translatedTxIndex].originalQuiteText!
      }
      translatedTx.splice(translatedTxIndex, 1)
      isShowOperateModal.value = false
      resolve()
    } else {
      operateLoading.value = false
      try {
        let translated: any = {}
        const originalText =
          props.list[index].protocol === 'SimpleRePost' &&
          props.list[index].displayType === 'quickRePost'
            ? props.list[index].quoteItem.content
            : props.list[index].content
        const originalQuiteText =
          props.list[index].displayType !== 'quickRePost' && props.list[index].quoteItem
            ? props.list[index].quoteItem.content
            : undefined
        const res = await Translate({
          query: originalText,
          to: i18n.locale.value,
        })
        if (res.code === 0) {
          translated.originalText = res.result.transResult
          if (originalQuiteText) {
            const res = await Translate({
              query: originalQuiteText,
              to: i18n.locale.value,
            })
            if (res.code === 0) {
              translated.originalQuiteText = res.result.transResult
            }
          }
          if (
            props.list[index].protocol === 'SimpleRePost' &&
            props.list[index].displayType === 'quickRePost'
          ) {
            props.list[index].quoteItem.content = translated.originalText
          } else {
            props.list[index].content = translated.originalText
          }

          if (originalQuiteText) {
            props.list[index].quoteItem.content = translated.originalQuiteText
          }
          translatedTx.push({
            txId: currentTxId.value,
            originalText,
            originalQuiteText,
          })
          operateLoading.value = false
          isShowOperateModal.value = false
        }
        resolve()
      } catch (error) {
        ElMessage.error((error as any).message)
        operateLoading.value = false
        resolve()
      }
    }
  })
}

Mitt.on(MittEvent.FollowUser, async (params: { metaId: string; result: boolean }) => {
  for (let item of props.list) {
    if (
      item.metaId === params.metaId ||
      (item.quoteItem && item.quoteItem.metaId === params.metaId)
    ) {
      const _item = { ...item }
      if (_item.metaId === params.metaId) _item.isMyFollow = params.result
      else _item.quoteItem!.isMyFollow = params.result
      emit('updateItem', _item)
    }
  }
})

Mitt.on(MittEvent.UpdateBuzz, (buzz: BuzzItem) => {
  if (props.list.length) {
    const index = props.list.findIndex(item => item && item.txId === buzz.txId)
    if (index !== -1) {
      emit('updateItem', buzz)
    }
  }
})

Mitt.on(MittEvent.RemoveBuzz, (txId: string) => {
  emit('removeItem', txId)
})

Mitt.on(MittEvent.AddBuzz, (buzz: BuzzItem) => {
  emit('addItem', buzz)
})

defineExpose({
  onReplay,
  onLike,
  replay,
  replayMsg,
  currentTxId,
  comment,
})
</script>

<style lang="scss" scoped src="./BuzzList.scss"></style>
