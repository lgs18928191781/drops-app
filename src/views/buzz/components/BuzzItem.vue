<template>
  <ElSkeleton :loading="loading" animated>
    <template #template>
      <BuzzItemSkeletonVue />
    </template>
    <template #default>
      <div class="buzz-item" v-if="itemData && displayItemData">
        <div @click.stop="handleGoDetail(displayItemData!.txId)" class="buzz-item-warp">
          <!-- 快速转发 -->
          <template v-if="itemData.displayType === 'quickRePost'">
            <div class="forward-head" @click.stop="$filters.toUserHome(itemData.metaId)">
              <i></i>
              <UserAvatar class="head" :meta-id="itemData.metaId" />
              <div class="name">{{ itemData.userName }}转发了</div>
            </div>
          </template>
          <div class="header">
            <div class="user-info" @click.stop="$filters.toUserHome(displayItemData!.metaId)">
              <div class="head">
                <UserAvatar :meta-id="displayItemData.metaId" />
              </div>
              <div class="info">
                <div class="name">{{ displayItemData.userName }}</div>
                <div class="desc">
                  <span>MetaID: {{ sliceStr(displayItemData.metaId) }}</span>
                  <span class="time">{{ $filters.dateTimeFormat(displayItemData.timestamp) }}</span>
                </div>
              </div>
            </div>
            <div class="operate">
              <div class="follow main-border primary" @click.stop="handleAction('more')">
                {{ $t('Follow') }}
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
                      `<a href='/app/buzz/topic/${val
                        .replace('#', '')
                        .replace(/(^\s*)|(\s*$)/g, '')}' style='color:#fc6d5e' >${val}</a>&nbsp;`
                  )
              "
            ></div>

            <!-- Attachment -->
            <Attachment
              class="content-item"
              :attachments="displayItemData.attachments"
              v-if="displayItemData.attachments && displayItemData.attachments.length > 0"
            />

            <!-- 引用buzz -->
            <QuoteVue
              class="content-item"
              :buzz="itemData.quoteItem"
              v-if="itemData.displayType === 'rePost'"
            />

            <!-- 标签 -->
            <div class="tags flex flex-align-center">
              <a class="flex flex-align-center">
                <Icon name="flag" />
                Buzz
              </a>
            </div>

            <BuzzItemControlVue
              :buzz="displayItemData"
              @repost="params => emit('repost', params)"
              @update="params => emit('update', params)"
              @more="params => emit('more', params)"
              v-if="!isHideControl"
            />

            <slot name="comment"></slot>
          </div>
        </div>
      </div>
    </template>
  </ElSkeleton>
  <!-- <van-popup v-model:show="showPopup" position="bottom" round close-on-popstate>
    <div class="popup-list">
             <div class="item" @click.stop="handleFollow"><span>关注</span></div>
             <div class="item" @click.stop="handleForward"><span>转发</span></div>
             <div class="item" @click.stop="handleShield"><span>拉⿊</span></div>
      <div class="item" @click.stop="handleShare"><span>分享</span></div>
      <div class="item" @click.stop="handleGoToWoc"><span>查看TX</span></div>
    </div>
  </van-popup> -->

  <!-- 确认发表 -->
  <MePayConfirmModalVue v-model="isShowConfirm" :params="payMe" />
</template>
<script setup lang="ts">
import { isApp } from '@/stores/root'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Attachment from './Attachment.vue'
// import { copy } from '@/utils/filters'
import { PayMeParams } from '@/@types/sdk'
import { PayMeParamsType } from '@/enum'
// import MePayConfirmModalVue from '@/components/MePayConfirmModal/MePayConfirmModal.vue'
import { checkSdkStatus } from '@/utils/util'
import QuoteVue from './Quote.vue'
import BuzzItemControlVue from './BuzzItemControl.vue'
import BuzzItemSkeletonVue from './BuzzItemSkeleton.vue'

interface Props {
  data?: BuzzItem
  isInDetailPage?: boolean
  isHideControl?: boolean
  loading?: boolean
}
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['update', 'repost', 'more'])
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
</script>
<style scoped lang="scss" src="./BuzzItem.scss"></style>
