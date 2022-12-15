<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <template #template>
      <div class="text">
        <ElSkeletonItem variant="text" />
      </div>

      <CardVue :color="postTagStroe.list.find(item => item.tag === buzz.postTag)?.color">
        <div class="simple-publish-share flex">
          <ElSkeletonItem variant="image" class="image" />
          <div class="cont flex1">
            <div class="name"><ElSkeletonItem variant="text" /></div>
            <div class="drsc"><ElSkeletonItem variant="text" /></div>
          </div>
          <ElSkeletonItem variant="rect" class="right" />
        </div>
      </CardVue>
    </template>
    <template #default>
      <div class="text" v-html="$filters.buzzTextContent(shareInfo.val!.shareContent)"></div>

      <CardVue
        :color="postTagStroe.list.find(item => item.tag === buzz.postTag)?.color"
        @click.stop="toItem"
      >
        <div class="simple-publish-share flex">
          <Image :src="shareInfo.val!.cover" />
          <div class="cont flex1">
            <div class="name">{{ shareInfo.val!.title }}</div>
            <div class="drsc">{{ shareInfo.val!.detail }}</div>
          </div>
          <Icon name="down" class="right" />
        </div>
      </CardVue>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import CardVue from '@/components/Card/Card.vue'
import { reactive, ref } from 'vue'
import { GetPublishShare } from '@/api/aggregation'
import { usePostTagStore } from '@/stores/buzz/tag'
import { useRouter } from 'vue-router'

interface Props {
  buzz: BuzzItem
}
const shareInfo: { val: PublishShareItem | null } = reactive({ val: null })
const props = withDefaults(defineProps<Props>(), {})
const userStore = useUserStore()
const isSkeleton = ref(true)
const postTagStroe = usePostTagStore()
const router = useRouter()

function getShareInfo() {
  return new Promise<void>(async resolve => {
    const res = await GetPublishShare(props.buzz.txId).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      shareInfo.val = res.data
      resolve()
    }
  })
}

function toItem() {
  if (shareInfo.val!.shareIdType === 'communityId/channelId') {
    router.push({
      name: 'talkChannel',
      params: {
        communityId: shareInfo.val!.shareId.split('/')[0],
        channelId: shareInfo.val!.shareId.split('/')[1],
      },
    })
  }
}

getShareInfo().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./BuzzItemContentSimplePublicShare.scss"></style>
