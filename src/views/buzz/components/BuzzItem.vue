<template>
  <div class="buzz-item" v-if="itemData && displayItemData">
    <div @click.stop="handleGoDetail(displayItemData!.txId)" class="buzz-item-warp">
      <!-- back -->
      <div class="back" v-if="$route.name === 'buzzDetail' && !isQuote">
        <span>
          <a class="flex flex-align-center" @click.stop="$router.back()">
            <Icon name="down" />
            {{ $t('back') }}
          </a>
        </span>
      </div>
      <!-- 快速转发 -->
      <template
        v-if="itemData.protocol === 'SimpleRePost' && itemData.displayType === 'quickRePost'"
      >
        <div class="forward-head">
          <ShareIcon />
          <UserAvatar
            class="head"
            :meta-id="itemData.metaId"
            :image="itemData.avatarImage"
            :name="itemData.userName"
            :meta-name="itemData.userInfo.metaName"
          />
          <div class="name">
            <UserName
              :name="itemData.userName"
              :metaName="itemData?.userInfo?.metaName"
            />&nbsp;|&nbsp;{{ $t('Forwarded') }}
          </div>
        </div>
      </template>
      <div class="header">
        <div class="user-info">
          <div class="head">
            <UserAvatar
              :meta-id="displayItemData.metaId"
              :image="displayItemData.avatarImage"
              :name="displayItemData.userName"
              :meta-name="displayItemData.userInfo.metaName"
              :image-class="'w-12 h-12'"
            />
          </div>
          <div class="info">
            <div class="name">
              <UserName
                :name="displayItemData.userName"
                :metaName="displayItemData?.userInfo?.metaName"
              />
            </div>
            <div class="desc">
              <span>MetaID: {{ sliceStr(displayItemData.metaId) }}</span>
              <span class="time">{{
                $filters.dateTimeFormat(displayItemData.timestamp, 'YY-MM-DD HH:mm:ss')
              }}</span>
            </div>
          </div>
        </div>
        <div class="operate" v-if="!isQuote">
          <div
            class="follow main-border primary small"
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
        <template v-if="displayItemData.protocol === NodeName.MetaNote">
          <BuzzItemContentMetaNoteVue :buzz="displayItemData" />
        </template>
        <template v-else-if="displayItemData.protocol === NodeName.SimplePublicShare">
          <BuzzItemContentSimplePublicShareVue :buzz="displayItemData" />
        </template>
        <template
          v-else-if="
            displayItemData.protocol === NodeName.LegalSellNft ||
              displayItemData.protocol === NodeName.NftSell
          "
        >
          <BuzzItemContentSellNftVue :buzz="displayItemData" />
        </template>
        <template v-else-if="displayItemData.protocol === NodeName.ShareChatMessage">
          <BuzzItemContentSellNftVue :buzz="displayItemData" />
        </template>
        <template v-else>
          <BuzzItemContentNormalVue
            :buzz="data!"
            :play-file="playFile"
            :isQuote="isQuote"
            @play="val => emit('play', val)"
            @translate="(txId, callback) => emit('translate', txId, callback)"
          />
        </template>

        <!-- 标签 -->
        <div class="tags flex flex-align-center" v-if="!isQuote">
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
          v-if="!isHideControl && !isQuote && !isNFTLegalBuzz"
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
import { PayMeParamsType, NodeName } from '@/enum'
import { checkSdkStatus, checkUserLogin } from '@/utils/util'

import BuzzItemControlVue from './BuzzItemControl.vue'
import BuzzItemSkeletonVue from './BuzzItemSkeleton.vue'
import ShareIcon from '@/assets/svg/share.svg'
import { useUserStore } from '@/stores/user'
import { Loading } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import BuzzItemContentNormalVue from './BuzzItemContentNormal.vue'
import BuzzItemContentMetaNoteVue from './BuzzItemContentMetaNote.vue'
import BuzzItemContentSimplePublicShareVue from './BuzzItemContentSimplePublicShare.vue'
import BuzzItemContentSellNftVue from './BuzzItemContentSellNft.vue'
import { ElMessage } from 'element-plus'

interface Props {
  data?: BuzzItem
  isInDetailPage?: boolean
  isHideControl?: boolean
  loading?: boolean
  playFile?: string
  isQuote?: boolean
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
  (e: 'translate', txId: any, callback?: (result: boolean) => void): void
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
  switch (itemData.value.protocol) {
    case 'SimpleRePost': {
      if (itemData.value.displayType === 'quickRePost') {
        return itemData.value.quoteItem
      } else {
        return itemData.value
      }
    }
    default: {
      return itemData.value
    }
  }
})

const isNFTLegalBuzz = computed(() => {
  return displayItemData.value?.protocol === 'sell_nft'
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
