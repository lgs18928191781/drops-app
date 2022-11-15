<template>
  <div class="publish flex " v-if="userStore.isAuthorized">
    <UserAvatar :meta-id="userStore.user!.metaId" />
    <div class="cont flex1">
      <div class="input">
        <ElInput type="text" :placeholder="$t('Buzz.publish.placeholder')" />
      </div>
      <div class="operate flex flex-pack-end">
        <a v-for="(item, index) in publishOperates" :key="index" @click="item.fun()">
          <Icon :name="item.icon" />
        </a>
      </div>
    </div>
  </div>

  <BuzzListVue :list="list" />
</template>

<script setup lang="ts">
import { BuzzItem } from '@/@types/common'
import { GetHomeBuzzs } from '@/api/aggregation'
import { getBuzzHomeList } from '@/api/buzz'
import { initPagination } from '@/config'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'
import BuzzListVue from '@/components/BuzzList/BuzzList.vue'

const pagintion = reactive({ ...initPagination, timestamp: 0 })
const userStore = useUserStore()

const list: BuzzItem[] = reactive([])

function getDatas(isCover = false) {
  return new Promise(async (resolve, reject) => {
    const res = await GetHomeBuzzs({
      ...pagintion,
      metaId: userStore.user?.metaId,
    })
    if (res.code === 0) {
      if (isCover) list.length = 0
      list.push(...res.data.results.items)
    }
  })
}

const publishOperates = [
  {
    icon: 'buzzn_emoji',
    fun: () => {},
  },
  {
    icon: 'buzz_img',
    fun: () => {},
  },
  {
    icon: 'buzz_nft',
    fun: () => {},
  },
  {
    icon: 'buzz_hashtag',
    fun: () => {},
  },
]

getDatas(true)
</script>

<style lang="scss" scoped src="./Index.scss"></style>
