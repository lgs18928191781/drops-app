<template>
  <BuzzListVue :list="list">
    <template #comment>
      <div class="comment">
        <div class="dived"></div>
        <div class="publish-comment flex flex-align-center">
          <UserAvatar :meta-id="userStore.user?.metaId || ''" />
          <div class="cont flex1" v-loading="loading">
            <input
              v-model="addComment.content"
              :placeholder="$t('Buzz.comment.publishPlaceholder')"
              @keyup.enter="reply({ txId: '', username: '' })"
            />
          </div>
        </div>

        <BuzzCommentListVue :commentList="commentListData" @reply="reply"></BuzzCommentListVue>
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
import { GetBuzz } from '@/api/aggregation'

const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const i18n = useI18n()

const detailData: {
  data: null | BuzzItem
  params: {
    page: string
    pageSize: string
    protocols: string[]
  }
} = reactive({
  data: null,
  params: {
    page: '1',
    pageSize: '15',
    protocols: ['PayComment'],
  },
})

const commentPagination = reactive({
  ...initPagination,
  protocols: ['PayComment'],
})
const commentListData: any = reactive([])

const addComment = reactive({
  content: '',
  commentToCommentTxId: '',
  commentToUserName: '',
})

const list = computed(() => {
  if (detailData.data) {
    return [detailData.data]
  } else {
    return []
  }
})

async function fetchData() {
  const res = await GetBuzz({
    txId: route.params.txId as string,
    metaId: userStore.user?.metaId,
  })
  if (res && res.code === 0) {
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
    detailData.data = detailRes
    await fetchCommentList(detailRes.txId, true)
  }
}

async function fetchCommentList(buzzTxId: string, isCover = false) {
  const params = {
    page: commentPagination.page.toString(),
    pageSize: commentPagination.pageSize.toString(),
    protocols: commentPagination.protocols,
    buzzTxId,
  }
  const res = await getBuzzInteractiveList(params)
  if (res && res.code === 0) {
    if (isCover) commentListData.length = 0
    const commentListRes: any = res.data.results.items || []
    const childBuzzTxIds: string[] = []
    for (const i of commentListRes) {
      if (i.hasComment) {
        childBuzzTxIds.push(i.txId)
        i.children = []
      }
    }
    if (childBuzzTxIds.length) {
      const childCommentListRes = await fetchChildCommentList(childBuzzTxIds)
      for (const childRes of childCommentListRes) {
        const target = commentListRes.find((v: any) => {
          return v.txId === childRes.txId
        })
        if (target) {
          target.children = childRes.result || []
        }
      }
    }
    commentListData.push(...commentListRes)
    const totalPages = Math.ceil(res.data.total / commentPagination.pageSize)
    if (commentPagination.page >= totalPages) commentPagination.nothing = true
  }
}

async function fetchChildCommentList(buzzTxIds: string[]) {
  const fetchChildComment = (txId: string) =>
    getBuzzInteractiveList({
      page: '1',
      pageSize: '99',
      protocols: ['PayComment'],
      buzzTxId: txId,
    })
  const requestArr: Promise<any>[] = []
  for (const txId of buzzTxIds) {
    requestArr.push(fetchChildComment(txId))
  }
  return Promise.all(requestArr).then(resList => {
    return resList.map((res, index) => {
      let result = []
      if (res && res.code === 0) {
        result = res.data.results.items || []
      }
      return {
        txId: buzzTxIds[index],
        result,
      }
    })
  })
}

async function reply(params: { txId: string; username: string }) {
  if (loading.value) return
  addComment.commentToCommentTxId = params.txId
  addComment.commentToUserName = params.username
  if (!params.txId) {
    await confirmComment()
  }
  // isShowAddCommentWarp.value = true
}

async function confirmComment() {
  loading.value = true
  await checkSdkStatus(route.fullPath)
  try {
    const dataParams = {
      createTime: new Date().getTime(),
      content: addComment.content,
      contentType: 'text/plain',
      commentTo:
        addComment.commentToCommentTxId === ''
          ? detailData.data!.txId
          : addComment.commentToCommentTxId,
      pay: 0,
      payTo: '',
    }
    const res = await userStore.showWallet?.createBrfcChildNode({
      nodeName: NodeName.PayComment,
      dataType: 'application/json',
      data: JSON.stringify(dataParams),
      encrypt: IsEncrypt.No,
      // confirmHandel: onPayMeConfirmCallback,
      // payType: SdkPayType.MC,
    })
    if (res) {
      const item = {
        amount: 0,
        avatarTxId: userStore.user!.avatarTxId!,
        avatarType: userStore.user!.avatarType!,
        buzzTxId: detailData.data!.txId,
        confirmState: 0,
        content: dataParams.content,
        hasComment: false,
        hasMyLike: false,
        isValid: true,
        likeCount: 0,
        metaId: userStore.user!.metaId,
        protocol: 'PayComment',
        timestamp: dataParams.createTime,
        txId: res.txId,
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
      detailData.data?.comment.unshift({
        metaId: userStore.user!.metaId!,
        timestamp: dataParams.createTime,
        txId: res.txId,
        userName: userStore.user!.name!,
        value: 0,
      })
      addComment.content = ''
      ElMessage.success(i18n.t('Buzz.comment.success'))
      loading.value = false
      // isShowAddCommentWarp.value = false
    }
  } catch (error) {
    loading.value = false
    ElMessage.error((error as any).message)
  }
}

fetchData()
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
