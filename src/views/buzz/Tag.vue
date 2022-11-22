<template>
  <div class="group-msg">
    <div class="bg"></div>
    <div class="content">
      <div class="back">
        <a @click="$router.back()"><Icon name="down"/></a>
      </div>
      <div class="msg flex">
        <div class="icon-warp">
          <div class="box-shadow"></div>
          <div class="content-warp flex flex-align-center flex-pack-center">
            <CommentIcon />
          </div>
        </div>
        <div class="cont">
          <div class="name">Group Chats</div>
          <div class="intro">Web3 on-chain NFT pending sale</div>
        </div>
      </div>

      <div class="tab flex flex-align-center">
        <a class="active">All</a>
        <a>Music</a>
      </div>
    </div>
  </div>

  <div class="buzz-list-warp">
    <BuzzListVue :list="list" :pagination="pagination" :loading="isSkeleton" />
  </div>
</template>

<script setup lang="ts">
import { GetTagBuzzs } from '@/api/aggregation'
import CommentIcon from '@/assets/svg/comment.svg'
import { initPagination } from '@/config'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'

const route = useRoute()

const list: BuzzItem[] = reactive([])
const pagination = reactive({ ...initPagination })
const isSkeleton = ref(true)

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetTagBuzzs({
      tag: route.params.tagId as string,
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

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Tag.scss"></style>
