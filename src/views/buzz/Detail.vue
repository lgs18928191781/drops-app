<template>
  <BuzzListVue
    :list="list"
    :loading="isSkeleton"
    ref="BuzzListRef"
    @comment="onReplayCommentSucccess"
    @like="onLikeCommentSuccess"
  >
    <template #comment>
      <div class="comment">
        <div class="dived"></div>
        <div class="publish-comment flex flex-align-center">
          <UserAvatar
            :meta-id="userStore.user?.metaId || ''"
            :image="userStore.user?.avatarImage || ''"
            :disabled="true"
          />
          <div class="cont flex1" v-loading="loading">
            <input
              v-model="addComment.content"
              :placeholder="$t('Buzz.comment.publishPlaceholder')"
              @keyup.enter="reply({ txId: '', username: '', userAddress: userStore.user!.address! })"
              @click.stop="() => {}"
            />
          </div>
        </div>
        <BuzzCommentListVue
          :commentList="commentListData"
          @replay="replyComment"
          @like="likeComment"
        ></BuzzCommentListVue>
      </div>
    </template>
  </BuzzListVue>
</template>

<script setup lang="ts">
import { getBuzzInteractiveList } from '@/api/buzz'
import BuzzListVue from './components/BuzzList.vue'
import { initPagination } from '@/config'
import { SdkPayType, IsEncrypt, NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BuzzCommentListVue from './components/BuzzCommentList.vue'
import { checkSdkStatus } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { GetBuzz, GetBuzzInteractive } from '@/api/aggregation'

const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const i18n = useI18n()
const BuzzListRef = ref()

const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)

const commentPagination = reactive({
  ...initPagination,
  protocols: ['PayComment'],
})
const commentListData: BuzzInteractiveItem[] = reactive([])

const addComment = reactive({
  content: '',
  commentToCommentTxId: '',
  commentToUserName: '',
  userAddress: '',
})

function fetchData() {
  return new Promise<void>(async resolve => {
    const res = await GetBuzz({
      txId: route.params.txId as string,
      metaId: userStore.user?.metaId,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      let detailRes: BuzzItem = res.data.results.items[0] || null
      if (detailRes.encrypt === IsEncrypt.Yes.toString()) {
        const result = await userStore.showWallet?.eciesDecryptData({
          data: detailRes.data,
        })
        if (result) {
          detailRes = {
            ...detailRes,
            ...JSON.parse(result),
          }
        }
      }
      list[0] = detailRes
      await fetchCommentList(detailRes.txId, true)
      resolve()
    }
  })
}

async function fetchCommentList(buzzTxId: string, isCover = false) {
  const res = await GetBuzzInteractive({
    page: commentPagination.page,
    pageSize: commentPagination.pageSize,
    protocols: commentPagination.protocols,
    metaId: userStore.user?.metaId,
    buzzTxId,
  })
  if (res && res.code === 0) {
    if (isCover) commentListData.length = 0
    const commentListRes: any = res.data.results.items || []
    commentListData.push(...commentListRes)
    const totalPages = Math.ceil(res.data.total / commentPagination.pageSize)
    if (commentPagination.page >= totalPages) commentPagination.nothing = true
  }
}

async function reply(params: { txId: string; username: string; userAddress: string }) {
  debugger
  if (loading.value) return
  addComment.commentToCommentTxId = params.txId
  addComment.commentToUserName = params.username
  addComment.userAddress = params.userAddress
  if (!params.txId) {
    await confirmComment()
  }
  // isShowAddCommentWarp.value = true
}

async function confirmComment() {
  loading.value = true
  await checkSdkStatus(route.fullPath)
  try {
    const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
    const dataParams = {
      createTime: new Date().getTime(),
      content: addComment.content,
      contentType: 'text/plain',
      commentTo:
        addComment.commentToCommentTxId === '' ? list[0]!.txId : addComment.commentToCommentTxId,
      pay: payAmount,
      payTo: addComment.userAddress,
    }
    const res = await userStore.showWallet?.createBrfcChildNode({
      nodeName: NodeName.PayComment,
      dataType: 'application/json',
      data: JSON.stringify(dataParams),
      encrypt: IsEncrypt.No,
      payTo: [{ address: addComment.userAddress, amount: payAmount }],
    })
    if (res) {
      const item = {
        amount: 0,
        avatarTxId: userStore.user!.avatarTxId!,
        avatarType: userStore.user!.avatarType!,
        buzzTxId: list[0]!.txId,
        confirmState: 0,
        content: dataParams.content,
        hasComment: false,
        hasMyLike: false,
        isValid: true,
        likeCount: 0,
        metaId: userStore.user!.metaId,
        protocol: 'PayComment',
        timestamp: dataParams.createTime,
        txId: res.currentNode?.txId,
        userName: userStore.user!.name!,
        zeroAddress: userStore.user!.address!,
      }

      if (addComment.commentToCommentTxId === '') {
        commentListData.unshift(item)
      } else {
        const index = commentListData.findIndex(
          (_item: any) => _item.txId === addComment.commentToCommentTxId
        )
        if (index !== -1) {
          commentListData[index].push(item)
        }
      }
      list[0]!.comment.unshift({
        metaId: userStore.user!.metaId!,
        timestamp: dataParams.createTime,
        txId: res.currentNode!.txId,
        userName: userStore.user!.name!,
        value: payAmount,
      })
      addComment.content = ''
      ElMessage.success(i18n.t('Buzz.comment.success'))
      loading.value = false
      // isShowAddCommentWarp.value = false
    } else {
      loading.value = false
    }
  } catch (error) {
    loading.value = false
    ElMessage.error((error as any).message)
  }
}

function replyComment(params: { txId: string; username: string; userAddress: string }) {
  BuzzListRef.value.onReplay(params)
}

function onReplayCommentSucccess(item: BuzzInteractiveItem) {
  const index = commentListData.findIndex(_item => _item.txId === item.commentTo)
  debugger
  if (index !== -1) {
    commentListData[index].commentCount++
    commentListData[index].hasComment = true
    if (!commentListData[index].subInteractiveItem) {
      commentListData[index].subInteractiveItem = []
    }
    commentListData[index].subInteractiveItem.unshift(item)
  }
}

function likeComment(params: any) {
  BuzzListRef.value.onLike(params)
}

function onLikeCommentSuccess(txId: string) {
  const index = commentListData.findIndex(item => item.txId === txId)
  if (index !== -1) {
    commentListData[index].likeCount++
    commentListData[index].hasMyLike = true
  }
}

fetchData().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
