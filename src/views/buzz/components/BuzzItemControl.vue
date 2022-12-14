<template>
  <div class="control flex flex-align-center">
    <div class="flex1 flex flex-align-center">
      <a class="more flex flex-align-center flex-pack-center">
        <Icon name="more" @click.stop="emit('more', buzz.txId)" />
      </a>

      <a class="tx" @click.stop="tx(buzz.txId)"
        >{{ buzz.txId.slice(0, 6) }}...{{ buzz.txId.slice(-3) }}</a
      >
    </div>

    <div class="operates flex flex-align-center">
      <div
        class="operate-item flex flex-align-center"
        :class="{ active: item.active() }"
        v-for="(item, index) in operates"
        :key="index"
        @click.stop="item.fun()"
      >
        <component :is="item.icon" />
        <span class="value">{{ item.value().value }}</span>
      </div>
    </div>

    <!-- <div :class="['item', isIForward ? 'active' : '']" @click.stop="handleAction()">
      <i class="forward"></i><span>{{ forwardText }}</span>
    </div>
    <div class="item" @click="emit('reply', { txId: '', username: '' })">
      <i class="comment"></i><span>{{ commentText }}</span>
    </div>
    <div :class="['item', isILike ? 'active' : '']" @click.stop="handleLike">
      <i class="like"></i><span>{{ likeText }}</span>
    </div> -->
  </div>

  <!-- <van-popup v-model:show="showPopup" position="bottom" round close-on-popstate>
    <div class="popup-list">
      <div class="item" @click.stop="handleFollow"><span>快速转发</span></div>
      <div class="item" @click.stop="handleForward"><span>带评论转发</span></div>
    </div>
  </van-popup> -->
</template>

<script setup lang="ts">
import { checkUserLogin, tx } from '@/utils/util'
import { computed } from 'vue'
import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import ShareIcon from '@/assets/svg/share.svg'
import CommentIcon from '@/assets/svg/comment.svg'
import LikeIcon from '@/assets/svg/like.svg'

interface Props {
  buzz: BuzzItem
}
const props = withDefaults(defineProps<Props>(), {})

const userStore = useUserStore()

const emit = defineEmits(['update', 'repost', 'buzz', 'more', 'like', 'replay'])

const operates = [
  {
    icon: ShareIcon,
    value: () => {
      return forwardText
    },
    active: () => {
      return isIForward.value
    },
    fun: async () => {
      await checkUserLogin()
      emit('repost', props.buzz.txId)
    },
  },
  {
    icon: CommentIcon,
    value: () => {
      return commentText
    },
    active: () => {
      return false
    },
    fun: async () => {
      await checkUserLogin()
      emit('replay', {
        txId: props.buzz.txId,
        username: props.buzz.userName,
        userAddress: props.buzz.zeroAddress,
        commentTo: props.buzz.txId,
        replyTo: '',
        buzzTxId: props.buzz.txId,
      })
    },
  },
  {
    icon: LikeIcon,
    value: () => {
      return likeText
    },
    active: () => {
      return isILike.value
    },
    fun: async () => {
      await checkUserLogin()
      if (isILike.value) return
      emit('like', { txId: props.buzz.txId, address: props.buzz.zeroAddress })
    },
  },
]

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
    return props.buzz.like.some(v => v.metaId === userStore.user?.metaId)
  }
  return false
})

const likeText = computed(() => {
  if (props.buzz.like && props.buzz.like.length) {
    return props.buzz.like.length
  }
  return '点赞'
})
</script>

<style lang="scss" scoped src="./BuzzItemControl.scss"></style>
