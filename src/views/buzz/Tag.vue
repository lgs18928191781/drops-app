<template>
  <div class="group-msg">
    <img class="bg-image" :src="tag?.cover" />
    <div class="bg"></div>
    <div class="content">
      <div class="back">
        <a @click="$router.back()"><Icon name="down"/></a>
      </div>
      <div class="msg flex">
        <div class="icon-warp">
          <div class="box-shadow" :style="{ background: tag?.color }"></div>
          <div class="content-warp flex flex-align-center flex-pack-center">
            <img :src="tag?.icon" />
          </div>
        </div>
        <div class="cont">
          <div class="name">{{ tag?.tagName[$i18n.locale] }}</div>
          <div class="intro">{{ tag?.info[$i18n.locale] }}</div>
        </div>
      </div>

      <div class="tab flex flex-align-center" v-if="tag?.subTag && tag?.subTag.length">
        <a
          :class="{ active: item.tag === tabActive }"
          v-for="item in tag?.subTag"
          :key="item.tag"
          @click="changeSubTag(item.tag)"
          >{{ item[$i18n.locale] }}</a
        >
      </div>
    </div>
  </div>

  <div class="buzz-list-warp">
    <BuzzListVue
      :list="list"
      :pagination="pagination"
      :loading="isSkeleton"
      @get-more="getMore"
      @update-item="updateItem"
    />
  </div>
</template>

<script setup lang="ts">
import { GetTagBuzzs } from '@/api/aggregation'
import CommentIcon from '@/assets/svg/comment.svg'
import { initPagination } from '@/config'
import { usePostTagStore } from '@/stores/buzz/tag'
import { useUserStore } from '@/stores/user'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'

const route = useRoute()
const postTagStore = usePostTagStore()
const userStore = useUserStore()

const list: BuzzItem[] = reactive([])
const pagination = reactive({ ...initPagination })
const isSkeleton = ref(true)

const tag = computed(() =>
  postTagStore.list.find(item => item.id.toString() === route.params.tagId)
)
const tabActive = ref(tag.value?.subTag && tag.value?.subTag.length ? tag.value?.subTag[0].tag : '')

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetTagBuzzs({
      tag: tag.value!.tag,
      metaId: userStore.user?.metaId,
      subTag: tabActive.value ? tabActive.value : '',
      ...pagination,
    }).catch(error => {
      ElMessage.error(error.message)
      resolve()
    })
    if (res?.code === 0) {
      if (isCover) list.length = 0
      if (res.data.results.items.length <= 0) pagination.nothing = true
      list.push(...res.data.results.items)
      resolve()
    }
  })
}

async function changeSubTag(tag: string) {
  if (tabActive.value === tag) return
  isSkeleton.value = true
  tabActive.value = tag
  pagination.page = 1
  pagination.nothing = false
  pagination.loading = false
  await getDatas(true)
  isSkeleton.value = false
}

function getMore() {
  if (isSkeleton.value || pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

function updateItem(params: { txId: string; buzz: BuzzItem }) {
  const index = list.findIndex(item => item.txId === params.txId)
  if (index !== -1) {
    list[index] = params.buzz
  }
}

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Tag.scss"></style>
