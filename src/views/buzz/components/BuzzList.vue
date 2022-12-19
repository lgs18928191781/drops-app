<template>
  <div
    class="buzz-list"
    v-infinite-scroll="getMore"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="100"
  >
    <template v-if="loading">
      <ElSkeleton :loading="true" animated>
        <template #template>
          <div
            class="buzz-item-warp"
            v-for="(item, index) in Array.from({ length: pagination?.pageSize || 1 })"
          >
            <BuzzItemSkeletonVue />
          </div>
        </template>
      </ElSkeleton>
    </template>
    <template v-else>
      <template v-for="(item, index) in list" :key="item.txId">
        <template v-if="index === recommendCommunityIndex && pagination">
          <slot name="recommendCommunity"></slot>
        </template>
        <template v-if="index === recommendFollowIndex && pagination">
          <slot name="recommendFollow"></slot>
        </template>
        <template v-if="index === recommendGuideIndex && pagination">
          <slot name="recommendGuide"></slot>
        </template>
        <div class="buzz-item-warp">
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
          >
            <template #comment>
              <slot name="comment"></slot>
            </template>
          </BuzzItemVue>
        </div>
      </template>
    </template>
    <!-- pagination -->
    <LoadMoreVue :pagination="pagination" v-if="pagination && !loading && list.length > 0" />

    <!-- null -->
    <IsNullVue v-if="!loading && list.length <= 0" />
  </div>

  <ElDrawer
    v-model="isShowOperateModal"
    direction="btt"
    :with-header="false"
    :close-on-click-modal="false"
    custom-class="buzz"
  >
    <div class="repost-list" v-loading="operateLoading">
      <div class="repost-list-warp">
        <div
          class="respost-item main-border primary"
          v-for="(item, index) in operates[operateType]"
          :key="index"
          @click="item.fun()"
        >
          {{ item.name }}
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
import { computed, reactive, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IsNullVue from '@/components/IsNull/IsNull.vue'
import LoadMoreVue from '@/components/LoadMore/LoadMore.vue'
import { copy, randomRange, tx } from '@/utils/util'
import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import { NodeName } from '@/enum'
import { Mitt, MittEvent } from '@/utils/mitt'
import { useLayoutStore } from '@/stores/layout'
import BuzzItemSkeletonVue from './BuzzItemSkeleton.vue'
import { metafile } from '@/utils/filters'
import PublishBaseTemplateVue from '@/components/PublishBaseTemplate/PublishBaseTemplate.vue'
import { useRoute } from 'vue-router'
import { listenerCount } from 'process'

interface Props {
  list: BuzzItem[]
  loading?: boolean
  pagination?: Pagination
  isInDetailPage?: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['getMore', 'comment', 'like', 'updateItem'])

const i18n = useI18n()
const userStore = useUserStore()
const layout = useLayoutStore()
const route = useRoute()

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

const operates: {
  [key: string]: {
    name: string
    fun: () => void
  }[]
} = {
  repost: [
    {
      name: i18n.t('Buzz.repost.quick'),
      fun: async () => {
        operateLoading.value = true
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
          const res = await userStore.showWallet.createBrfcChildNode({
            nodeName: NodeName.SimpleRePost,
            data: JSON.stringify({
              createTime: time,
              rePostTx: currentTxId.value,
              rePostProtocol: targetBuzz.protocol,
              rePostComment: '',
            }),
            payTo: [{ amount: payAmount, address: targetBuzz.zeroAddress }],
          })
          if (res) {
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
            Mitt.emit(MittEvent.AddBuzz, { txId: res.currentNode!.txId })
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
      name: i18n.t('Buzz.repost.comment'),
      fun: () => {
        operateLoading.value = false
        isShowOperateModal.value = false
        layout.publish({ repostTxId: currentTxId.value })
      },
    },
  ],
  more: [
    {
      name: i18n.t('Buzz.repost.share'),
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
      name: i18n.t('Buzz.repost.lookTx'),
      fun: () => {
        tx(currentTxId.value)
        isShowOperateModal.value = false
      },
    },
  ],
}

function onRepost(txId: string) {
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
    .createBrfcChildNode({
      nodeName: NodeName.PayLike,
      data: JSON.stringify({
        createTime: time,
        isLike: '1',
        likeTo: params.txId,
        pay: payAmount,
        payTo: params.address,
      }),
      payTo: [{ amount: payAmount, address: params.address }],
    })
    .catch(error => {
      ElMessage.error(error.message)
    })
  if (res) {
    if (index !== -1) {
      const buzz = { ...props.list[index] }
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
    .createBrfcChildNode({
      nodeName: NodeName.PayFollow,
      data: JSON.stringify({
        createTime: new Date().getTime(),
        MetaID: target.metaId,
        pay: payAmount,
        payTo: target.zeroAddress,
      }),
      payTo: [{ amount: payAmount, address: target.zeroAddress }],
    })
    .catch(error => params.reject(error))
  if (res) {
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
    const res = await userStore.showWallet
      ?.createBrfcChildNode({
        nodeName: NodeName.PayComment,
        dataType: 'application/json',
        data: JSON.stringify(dataParams),
        payTo: [{ address: replayMsg.val.userAddress, amount: payAmount }],
      })
      .catch(error => {
        ElMessage.error(error.message)
        operateLoading.value = false
      })
    if (res) {
      const index = props.list.findIndex(item => item.txId === currentTxId.value)

      if (index !== -1) {
        if (replayMsg.val.commentTo === currentTxId.value) {
          const buzz = { ...props.list[index] }
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
  })
}

function getMore() {
  emit('getMore')
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
