<template>
  <div class="control">
    <div :class="['item', isIForward ? 'active' : '']" @click.stop="handleAction()">
      <i class="forward"></i><span>{{ forwardText }}</span>
    </div>
    <div class="item" @click="emit('reply', { txId: '', username: '' })">
      <i class="comment"></i><span>{{ commentText }}</span>
    </div>
    <div :class="['item', isILike ? 'active' : '']" @click.stop="handleLike">
      <i class="like"></i><span>{{ likeText }}</span>
    </div>
  </div>

  <van-popup v-model:show="showPopup" position="bottom" round close-on-popstate>
    <div class="popup-list">
      <div class="item" @click.stop="handleFollow"><span>快速转发</span></div>
      <div class="item" @click.stop="handleForward"><span>带评论转发</span></div>
    </div>
  </van-popup>

  <!-- 确认发表 -->
  <MePayConfirmModalVue v-model="isShowConfirm" :params="payMe" />
</template>

<script setup lang="ts">
import { PayMeParams } from '@/@types/sdk'
import { PayMeParamsType } from '@/enum'
import { checkSdkStatus } from '@/utils/util'
import { Notify } from 'vant'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
// import payAction from './PayAction'
// import Mitt from '@/utils/mitt'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
// import MePayConfirmModalVue from '@/components/MePayConfirmModal/MePayConfirmModal.vue'
import { getOneBuzz } from '@/api/buzz'
import { BuzzItem } from '@/@types/common'
import { useUserStore } from '@/stores/user'

interface Props {
  buzz: BuzzItem
}
const props = withDefaults(defineProps<Props>(), {})

const userStore = useUserStore()

const route = useRoute()
const emit = defineEmits(['update', 'reply'])

const showPopup = ref(false)
const payMe: PayMeParams = reactive({
  amount: 0,
  resolve: null,
  type: PayMeParamsType.BuzzComment,
})
const isShowConfirm = ref(false)

const isIForward = computed(() => {
  if (props.buzz.rePost && props.buzz.rePost.length) {
    return props.buzz.rePost.some(v => v.metaId === userStore.user?.metaId)
  }
  return false
})

const forwardText = computed(() => {
  if (props.buzz.rePost && props.buzz.rePost.length) {
    return props.buzz.rePost.length
  }
  return '转发'
})

const commentText = computed(() => {
  if (props.buzz.comment && props.buzz.comment.length) {
    return props.buzz.comment.length
  }
  return '评论'
})

const isILike = computed(() => {
  if (props.buzz.like && props.buzz.like.length) {
    return props.buzz.like.some(v => v?.metaId === userStore.user!.metaId)
  }
  return false
})

const likeText = computed(() => {
  if (props.buzz.like && props.buzz.like.length) {
    return props.buzz.like.length
  }
  return '点赞'
})

async function handleAction() {
  await checkSdkStatus(route.fullPath)
  showPopup.value = true
}

async function handleLike() {
  await checkSdkStatus(route.fullPath)
  if (isILike.value) {
    return Notify({
      type: 'warning',
      message: '暂不支持取消点赞',
    })
  }
  payAction('like', props.buzz!, onPayMeConfirmCallback).then((res: any) => {
    emit('update', {
      ...props.buzz,
      like: [
        ...props.buzz.like,
        {
          metaId: userStore.user!.metaId!,
          timestamp: new Date().getTime(),
          txId: res.txId,
          userName: userStore.user!.name!,
          value: 2000,
        },
      ],
    })
  })
}

function onPayMeConfirmCallback(params: { useMe: number }) {
  return new Promise<boolean>(async resolve => {
    payMe.amount = params.useMe
    payMe.resolve = resolve
    isShowConfirm.value = true
  })
}

function getOneBuzzDetail(txId: string) {
  return new Promise<BuzzItem>(async (resolve, reject) => {
    const res = await getOneBuzz({
      txId: txId,
    })
    if (res && res.code === 0) {
      const detailRes = res.data.results.items[0] || null
      resolve(detailRes)
    }
  })
}

function handleFollow() {
  showPopup.value = false
  payMe.type = PayMeParamsType.BuzzReopost
  payAction('SimpleRePost', props.buzz!, onPayMeConfirmCallback).then(async (res: any) => {
    emit('update', {
      ...props.buzz,
      rePost: [
        ...props.buzz.rePost,
        {
          metaId: userStore.user!.metaId!,
          timestamp: new Date().getTime(),
          txId: res.txId,
          userName: userStore.user!.name!,
          value: 2000,
        },
      ],
    })
    const buzz = await getOneBuzzDetail(res.txId)

    Mitt.emit('addBuzz', buzz)
    if (route.name === 'appBuzzDetail') {
      router.replace({
        name: 'appBuzzDetail',
        params: {
          txId: res.txId,
        },
      })
    }
    ElMessage.success('转发成功')
  })
}

function handleForward() {
  router.push({
    name: 'appBuzzEdit',
    query: {
      txId: props.buzz.txId,
      type: 'SimpleRePost',
    },
  })
  showPopup.value = false
}
</script>

<style lang="scss" scoped src="./BuzzItemControl.scss"></style>
