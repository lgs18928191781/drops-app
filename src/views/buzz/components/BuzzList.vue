<template>
  <!-- <div class="buzz-list" v-infinite-scroll="getMore" :infinite-scroll-immediate="false"> -->
  <div class="buzz-list" v-infinite-scroll="getMore" :infinite-scroll-immediate="false">
    <div class="buzz-item-warp" v-for="item in list" :key="item.txId">
      <BuzzItemVue :data="item" @repost="onRepost" @more="onMore" :loading="loading">
        <template #comment>
          <slot name="comment"></slot>
        </template>
      </BuzzItemVue>
    </div>
    <!-- pagination -->
    <LoadMoreVue :pagination="pagination" v-if="!loading && list.length > 0" />

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
    <div class="repost-list">
      <div class="repost-list-warp">
        <div
          class="respost-item main-border primary"
          v-for="(item, index) in operates[operateType]"
          :key="index"
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

interface Props {
  list: BuzzItem[]
  loading?: boolean
  pagination: Pagination
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['getMore'])

const i18n = useI18n()

const isShowOperateModal = ref(false)
const operateType: Ref<'repost' | 'more'> = ref('repost')
const currentTxId = ref('')

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
      fun: () => {},
    },
    {
      name: i18n.t('Buzz.repost.comment'),
      fun: () => {},
    },
  ],
  more: [
    {
      name: i18n.t('Buzz.repost.share'),
      fun: () => {},
    },
    {
      name: i18n.t('Buzz.repost.lookTx'),
      fun: () => {},
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

function getMore() {
  emit('getMore')
}
</script>

<style lang="scss" scoped src="./BuzzList.scss"></style>
