<template>
  <div class="buzz-list">
    <template v-for="item in list" :key="item.txId">
      <BuzzItemVue :data="item" @repost="onRepost" @more="onMore" />
    </template>
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
import { BuzzItem } from '@/@types/common'
import BuzzItemVue from '@/components/BuzzItem/BuzzItem.vue'
import { ElDrawer } from 'element-plus'
import { computed, reactive, Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  list: BuzzItem[]
}
const props = withDefaults(defineProps<Props>(), {})

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
</script>

<style lang="scss" scoped src="./BuzzList.scss"></style>
