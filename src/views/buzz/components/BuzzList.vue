<template>
  <!-- <div class="buzz-list" v-infinite-scroll="getMore" :infinite-scroll-immediate="false"> -->
  <div class="buzz-list" v-infinite-scroll="getMore" :infinite-scroll-immediate="false">
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
            @repost="onRepost"
            @more="onMore"
            @like="onLike"
            @follow="onFollow"
            @play="onPlay"
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
    <div class="repost-list" v-loading="">
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

interface Props {
  list: BuzzItem[]
  loading?: boolean
  pagination?: Pagination
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['getMore', 'update:list'])

const i18n = useI18n()
const userStore = useUserStore()
const layout = useLayoutStore()

const operateLoading = ref(false)

const recommendCommunityIndex = ref(randomRange(0, 11))
const recommendFollowIndex = ref(randomRange(0, 11))
const recommendGuideIndex = ref(randomRange(0, 11))
const isShowOperateModal = ref(false)
const operateType: Ref<'repost' | 'more'> = ref('repost')
const currentTxId = ref('')
const playFile = ref('')
let audio: HTMLAudioElement | null

const repost = reactive({
  rePostTx: '',
  rePostProtocol: '', // 转帖的所属协议
  rePostComment: '', // 转帖附带的评论
})

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
          const index = props.list.findIndex(item => item.txId === currentTxId.value)
          const time = new Date().getTime()
          const res = await userStore.showWallet.createBrfcChildNode({
            nodeName: NodeName.SimpleRePost,
            data: JSON.stringify({
              createTime: time,
              rePostTx: currentTxId.value,
              rePostProtocol: props.list[index].protocol,
              rePostComment: '',
            }),
          })
          if (res) {
            props.list[index].rePost.push({
              metaId: userStore.user!.metaId!,
              timestamp: time,
              txId: res.currentNode!.txId,
              userName: userStore.user!.name!,
              value: 0,
            })
            emit('update:list', props.list)
            Mitt.emit(MittEvent.AddBuzz, { txId: res.currentNode!.txId })
            ElMessage.success(i18n.t('Buzz.repost.success'))
            operateLoading.value = false
            isShowOperateModal.value = false
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

async function onLike(txId: string) {
  const time = new Date().getTime()
  const res = await userStore.showWallet.createBrfcChildNode({
    nodeName: NodeName.PayLike,
    data: JSON.stringify({
      createTime: time,
      isLike: '1',
      likeTo: txId,
      // pay,
      // payTo: userContentAddress || address || zeroAddress,
    }),
  })
  if (res) {
    const index = props.list.findIndex(item => item.txId === txId)
    props.list[index].like.push({
      metaId: userStore.user!.metaId!,
      timestamp: time,
      txId: res.currentNode!.txId,
      userName: userStore.user!.name,
      value: 0,
    })
    emit('update:list', props.list)
  }
}

async function onFollow(
  txId: string,
  params: { resolve: (txId?: string) => void; reject: (resan: any) => any }
) {
  const index = props.list.findIndex(item => item.txId === txId)
  const res = await userStore.showWallet
    .createBrfcChildNode({
      nodeName: NodeName.PayFollow,
      data: JSON.stringify({
        createTime: new Date().getTime(),
        MetaID: props.list[index].metaId,
        pay: 0,
        payTo: '',
      }),
    })
    .catch(error => params.reject(error))
  if (res) {
    props.list[index].isMyFollow = true
    emit('update:list', props.list)
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

function getMore() {
  emit('getMore')
}
</script>

<style lang="scss" scoped src="./BuzzList.scss"></style>
