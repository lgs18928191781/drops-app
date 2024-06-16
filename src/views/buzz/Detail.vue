<template>
  <BuzzListVue
    :list="list"
    :loading="isSkeleton"
    ref="BuzzListRef"
    @comment="onReplayCommentSucccess"
    @like="onLikeCommentSuccess"
    @update-item="updateItem"
    @add-item="val => list.unshift(val)"
    :isInDetailPage="true"
  >
    <template #comment>
      <!--  NFT 法币 Buzz 不给评论 -->
      <div class="comment" v-if="!isNFTLegalBuzz">
        <div class="dived"></div>
        <div class="publish-comment flex flex-align-center">
          <UserAvatar
            :meta-id="userStore.user?.metaId || ''"
            :image="userStore.user?.avatarImage || ''"
            :name="userStore.user?.name || ''"
            :meta-name="userStore.user?.metaName || ''"
            :disabled="true"
          />
          <div
            class="cont flex1"
            v-loading="loading"
            :element-loading-svg="LoadingTEXT"
            :element-loading-text="$t('Loading')"
            @click.stop="reply"
          >
            <input :placeholder="$t('Buzz.Your reply')" :readonly="true" />
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
import { checkSdkStatus, checkUserLogin } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { GetBuzz, GetBuzzInteractive } from '@/api/aggregation'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { useRootStore } from '@/stores/root'
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const i18n = useI18n()
const BuzzListRef = ref()
const rootStore = useRootStore()
const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)

const commentPagination = reactive({
  ...initPagination,
  protocols: ['PayComment'],
})
const commentListData: BuzzInteractiveItem[] = reactive([])

const comment = ref('')

const isNFTLegalBuzz = computed(() => {
  return list[0]?.protocol === 'sell_nft'
})

function fetchData(count = 1, parentResolve?: () => void) {
  return new Promise<void>(async resolve => {
    const res = await GetBuzz({
      txId: route.params.txId as string,
      metaId: userStore.user?.metaId,
      chain: 'man',
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      if (res.data.results.items.length > 0) {
        const buzzRes = res.data.results.items[0]
        if (rootStore.myBlackList?.includes(buzzRes.metaId)) {
          //此内容用户被屏蔽
          buzzRes.content = `${i18n.t('buzz.blacktips')}`
          buzzRes.attachments = []
        }
        if (buzzRes.quoteItem && rootStore.myBlackList?.includes(buzzRes.metaId)) {
          buzzRes.quoteItem.content = `${i18n.t('buzz.blacktipsRepost')}`
          buzzRes.quoteItem.attachments = []
        }
        if (buzzRes.quoteItem && rootStore.myBlackList?.includes(buzzRes.quoteItem.metaId)) {
          buzzRes.quoteItem.content = `${i18n.t('buzz.blacktips')}`
          buzzRes.quoteItem.attachments = []
        }

        let detailRes: BuzzItem = buzzRes || null
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
         fetchCommentList(detailRes.txId, true).then()
        if (parentResolve) parentResolve()
        else resolve()
      } else {
        if (count < 6) {
          setTimeout(() => {
            fetchData(count + 1, parentResolve ? parentResolve : resolve)
          }, 2000)
        } else {
          ElMessage.error('TxId Not Found')
        }
      }
    }
  })
}

async function fetchCommentList(buzzTxId: string, isCover = false) {
  console.log(buzzTxId)
  const res = await GetBuzzInteractive({
    page: commentPagination.page,
    pageSize: commentPagination.pageSize,
    protocols: commentPagination.protocols,
    metaId: userStore.user?.metaId,
    buzzTxId,
    chain: 'man',
  })
  if (res && res.code === 0) {
    if (isCover) commentListData.length = 0
    const commentListRes: any = res.data.results.items || []
    commentListData.push(...commentListRes)
    const totalPages = Math.ceil(res.data.total / commentPagination.pageSize)
    if (commentPagination.page >= totalPages) commentPagination.nothing = true
  }
}

async function reply() {
  await checkUserLogin()
  BuzzListRef.value.onReplay({
    txId: list[0].txId,
    username: list[0].userName,
    userAddress: list[0].zeroAddress,
    commentTo: list[0].txId,
    replyTo: '',
  })
}

function replyComment(params: { txId: string; username: string; userAddress: string }) {
  BuzzListRef.value.onReplay(params)
}

function onReplayCommentSucccess(item: BuzzInteractiveItem) {
  const index = commentListData.findIndex(_item => _item.txId === item.commentTo)
  if (index !== -1) {
    commentListData[index].commentCount++
    commentListData[index].hasComment = true
    if (!commentListData[index].subInteractiveItem) {
      commentListData[index].subInteractiveItem = []
    }
    commentListData[index].subInteractiveItem.unshift(item)
  } else {
    commentListData.unshift(item)
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

function updateItem(buzz: BuzzItem) {
  const index = list.findIndex(item => item.txId === buzz.txId)
  if (index !== -1) {
    list[index] = buzz
  }
}

fetchData().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
