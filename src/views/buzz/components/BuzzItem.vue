<template>
  <div class="buzz-item" v-if="itemData && displayItemData">
    <div @click.stop="handleGoDetail(displayItemData!.txId)" class="buzz-item-warp">
      <!-- 快速转发 -->
      <template v-if="itemData.displayType === 'quickRePost'">
        <div class="forward-head" @click.stop="$filters.toUserHome(itemData.metaId)">
          <ShareIcon />
          <UserAvatar class="head" :meta-id="itemData.metaId" :image="itemData.avatarImage" />
          <div class="name">{{ itemData.userName }}转发了</div>
        </div>
      </template>
      <div class="header">
        <div class="user-info" @click.stop="$filters.toUserHome(displayItemData!.metaId)">
          <div class="head">
            <UserAvatar :meta-id="displayItemData.metaId" :image="displayItemData.avatarImage" />
          </div>
          <div class="info">
            <div class="name">{{ displayItemData.userName }}</div>
            <div class="desc">
              <span>MetaID: {{ sliceStr(displayItemData.metaId) }}</span>
              <span class="time">{{
                $filters.dateTimeFormat(displayItemData.timestamp, 'YY-MM-DD HH:mm:ss')
              }}</span>
            </div>
          </div>
        </div>
        <div class="operate">
          <div
            class="follow main-border primary"
            :class="{ disabled: following }"
            @click.stop="follow"
            v-if="!displayItemData.isMyFollow && (!userStore.isAuthorized || (userStore.isAuthorized && displayItemData.metaId !== userStore.user!.metaId))"
          >
            <template v-if="following">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
            </template>
            <template v-else>{{ $t('Follow') }}</template>
          </div>
        </div>
      </div>
      <div class="content">
        <!-- text -->
        <div
          class="text content-item"
          v-html="
            displayItemData.content
              .replace(/\\n/g, '\n')
              .replace(
                /#.*?[\s\n\r#]{1}|#.*?$/g,
                val =>
                  `<a href='/buzz/topic/${val
                    .replace('#', '')
                    .replace(/(^\s*)|(\s*$)/g, '')}' style='color:#fc6d5e' >${val}</a>&nbsp;`
              )
          "
        ></div>

        <!-- Attachment -->
        <div
          class="content-item"
          v-if="displayItemData.attachments && displayItemData.attachments.length > 0"
        >
          <Attachment
            :attachments="displayItemData.attachments"
            :playFile="playFile"
            @play="params => emit('play', params)"
          />
        </div>

        <!-- 引用buzz -->
        <div
          class="content-item"
          v-if="itemData.quoteItem && itemData.displayType !== 'quickRePost'"
        >
          <QuoteVue :buzz="itemData.quoteItem" />
        </div>

        <!-- 标签 -->
        <div class="tags flex flex-align-center">
          <a
            class="flex flex-align-center"
            @click.stop="
              $router.push({ name: 'buzzTag', params: { tagId: displayItemData?.postTagId } })
            "
          >
            <Icon name="flag" />
            {{ displayItemData.postTag }}
          </a>
        </div>

        <BuzzItemControlVue
          :buzz="displayItemData"
          @repost="params => emit('repost', params)"
          @update="params => emit('update', params)"
          @more="params => emit('more', params)"
          @like="params => emit('like', params)"
          @replay="params => emit('replay', params)"
          v-if="!isHideControl"
        />

        <slot name="comment"></slot>
      </div>
    </div>
  </div>

  <!-- <van-popup v-model:show="showPopup" position="bottom" round close-on-popstate>
    <div class="popup-list">
             <div class="item" @click.stop="handleFollow"><span>关注</span></div>
             <div class="item" @click.stop="handleForward"><span>转发</span></div>
             <div class="item" @click.stop="handleShield"><span>拉⿊</span></div>
      <div class="item" @click.stop="handleShare"><span>分享</span></div>
      <div class="item" @click.stop="handleGoToWoc"><span>查看TX</span></div>
    </div>
  </van-popup> -->
</template>
<script setup lang="ts">
import { isApp } from '@/stores/root'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Attachment from './Attachment.vue'
// import { copy } from '@/utils/filters'
import { PayMeParams } from '@/@types/sdk'
import { PayMeParamsType } from '@/enum'
import { checkSdkStatus, checkUserLogin } from '@/utils/util'
import QuoteVue from './Quote.vue'
import BuzzItemControlVue from './BuzzItemControl.vue'
import BuzzItemSkeletonVue from './BuzzItemSkeleton.vue'
import ShareIcon from '@/assets/svg/share.svg'
import { useUserStore } from '@/stores/user'
import { Loading } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

interface Props {
  data?: BuzzItem
  isInDetailPage?: boolean
  isHideControl?: boolean
  loading?: boolean
  playFile?: string
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const i18n = useI18n()
// const emit = defineEmits(['update', 'repost', 'more', 'like', 'follow'])
const emit = defineEmits<{
  (e: 'update', txId: string): void
  (e: 'repost', txId: string): void
  (e: 'more', txId: string): void
  (e: 'like', txId: string): void
  (e: 'follow', txId: string, params: { resolve: (txId?: string) => any; reject: () => any }): void
  (e: 'play', txId: any): void
  (e: 'replay', txId: any): void
}>()
const props = withDefaults(defineProps<Props>(), {
  isInDetailPage: false,
})
const showPopup = ref(false)
const popupType = ref('more')
const isShowConfirm = ref(false)
const payMe: PayMeParams = reactive({
  amount: 0,
  resolve: null,
  type: PayMeParamsType.BuzzComment,
})
const isSkeleton = ref(true)
const following = ref(false)

const itemData = computed(() => {
  return props.data
})
const displayItemData = computed(() => {
  if (!itemData.value) {
    return null
  }
  switch (itemData.value.displayType) {
    case 'quickRePost': {
      return itemData.value.quoteItem || null
    }
    default: {
      return itemData.value
    }
  }
})

async function handleAction(type: string) {
  await checkSdkStatus(route.fullPath)
  showPopup.value = true
  popupType.value = type
}
function handleGoDetail(txId: string) {
  if (props.isInDetailPage) {
    return
  }
  router.push({
    name: 'buzzDetail',
    params: {
      txId: displayItemData.value?.txId,
    },
  })
}

function handleShare() {
  copy(
    location.origin +
      router.resolve({
        name: 'buzzDetail',
        params: {
          txId: displayItemData.value!.txId,
        },
      }).href
  )
  showPopup.value = false
}
function handleGoToWoc() {
  const url = `https://whatsonchain.com/tx/${itemData.value.txId}`
  showPopup.value = false

  if (isApp) {
    router.push({
      path: '/iframe',
      query: {
        url: encodeURIComponent(url),
      },
    })
  } else {
    window.open(url)
  }
}
function sliceStr(str?: string, len = 8) {
  return str ? str.slice(0, len) : ''
}

async function follow() {
  await checkUserLogin()
  if (following.value) return
  following.value = true
  const followCallback = () => {
    return new Promise<any>((resolve, reject) => {
      emit('follow', displayItemData!.value!.txId, { resolve, reject })
    })
  }
  followCallback()
    .then(res => {
      following.value = false
      if (res) {
        ElMessage.success(i18n.t('Buzz.follow.success'))
      }
    })
    .catch(error => {
      following.value = false
      ElMessage.error(error.message)
    })
}
</script>
<style scoped lang="scss" src="./BuzzItem.scss"></style>
