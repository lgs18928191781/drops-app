<template>
  <div class="buzz-list-warp">
    <BuzzListVue
      :list="list"
      :pagination="pagination"
      :loading="isSkeleton"
      @get-more="getMore"
      @update-item="updateItem"
      @add-item="val => list.unshift(val)"
      @remove-item="
        txId =>
          list.splice(
            list.findIndex(item => item.txId === txId),
            1
          )
      "
    />
  </div>
</template>

<script setup lang="ts">
import { BuzzItem } from '@/@types/common'
import { GetUserBuzzs } from '@/api/aggregation'
import { initPagination } from '@/config'
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from '../buzz/components/BuzzList.vue'
import { useRootStore } from '@/stores/root'
import { useI18n } from 'vue-i18n'
const list: BuzzItem[] = reactive([])
const pagination = reactive({ ...initPagination })
const userStore = useUserStore()
const route = useRoute()
const isSkeleton = ref(true)
const rootStore = useRootStore()
const i18n = useI18n()
function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, rject) => {
    const res = await GetUserBuzzs({
      metaId: route.params.metaId as string,
      isNoEncrypt: userStore.user?.metaId === route.params.metaId ? false : true,
      page: pagination.page,
      pageSize: pagination.pageSize,
      myMetaId: userStore.user?.metaId,
    }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      if (isCover) list.length = 0
      if (res.data.results.items.length) {
        res.data.results.items.forEach(buzz => {
          if (rootStore.myBlackList?.includes(buzz.metaId)) {
            //此内容用户被屏蔽
            buzz.content = `${i18n.t('buzz.blacktips')}`
            buzz.attachments = []
          }
          if (buzz.quoteItem && rootStore.myBlackList?.includes(buzz.metaId)) {
            buzz.quoteItem.content = `${i18n.t('buzz.blacktipsRepost')}`
            buzz.quoteItem.attachments = []
          }
          if (buzz.quoteItem && rootStore.myBlackList?.includes(buzz.quoteItem.metaId)) {
            buzz.quoteItem.content = `${i18n.t('buzz.blacktips')}`
            buzz.quoteItem.attachments = []
          }
        })
        pagination.nothing = false
      } else {
        pagination.nothing = true
      }
      list.push(...res.data.results.items)
      resolve()
    }
  })
}

function getMore() {
  if (isSkeleton.value || pagination.nothing || pagination.loading) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

function updateItem(buzz: BuzzItem) {
  const index = list.findIndex(item => item.txId === buzz.txId)
  if (index !== -1) {
    list[index] = buzz
  }
}

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Buzz.scss"></style>
