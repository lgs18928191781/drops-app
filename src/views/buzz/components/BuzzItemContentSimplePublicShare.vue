<template>
  <ElSkeleton :loading="isSkeleton" animated>
    <template #template>
      <div class="text">
        <ElSkeletonItem variant="text" />
      </div>

      <CardVue :color="postTagStore.list.find(item => item.tag === buzz.postTag)?.color">
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
      <div class="text" v-if="isBandTalkBuzz">
        {{ $t('buzz.blacktips') }}
      </div>
      <div v-else>
        <div class="text" v-html="$filters.buzzTextContent(shareInfo.val!.shareContent)"></div>

        <CardVue
          :color="postTagStore.list.find(item => item.tag === buzz.postTag)?.color"
          @click.stop="toItem"
        >
          <div class="simple-publish-share flex">
            <Image :src="shareInfo.val!.cover" v-if="shareInfo.val!.cover" />
            <div class="image flex flex-align-center flex-pack-center" v-else>
              <Icon name="link" />
            </div>
            <div class="cont flex1">
              <div class="name flex flex-align-center" :class="{ metaName: isMetaName }">
                <span class="text">{{ shareInfo.val!.title }}</span>
              </div>
              <div class="drsc">{{ shareInfo.val!.detail }}</div>
            </div>
            <Icon name="down" class="right" />
          </div>
        </CardVue>
      </div>

      <div class="msg-error" v-if="isFail">{{ $t('NFT.Get Msg Error') }}</div>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import CardVue from '@/components/Card/Card.vue'
import { reactive, ref, computed } from 'vue'
import { GetPublishShare } from '@/api/aggregation'
import { usePostTagStore } from '@/stores/buzz/tag'
import { useRouter } from 'vue-router'
import MetaNameTag from '@/components/MetaName/Tag.vue'
import { useRootStore } from '@/stores/root'
interface Props {
  buzz: BuzzItem
}
const shareInfo: { val: PublishShareItem | null } = reactive({ val: null })
const props = withDefaults(defineProps<Props>(), {})
const userStore = useUserStore()
const isSkeleton = ref(true)
const postTagStore = usePostTagStore()
const router = useRouter()
const isMetaName = ref(false)
const isFail = ref(false)

const rootStore = useRootStore()
const isBandTalkBuzz = computed(() => {
  return (
    rootStore.myBlackList?.includes(props.buzz.metaId) ||
    rootStore.myBlackList?.includes(props.buzz?.rePost[0]?.metaId)
  )
})
function getShareInfo() {
  return new Promise<void>(async resolve => {
    const res = await GetPublishShare(props.buzz.txId).catch(error => {
      isFail.value = true
    })
    if (res?.code === 0) {
      shareInfo.val = res.data
      if (
        shareInfo.val!.shareIdType === 'communityId/channelId' ||
        shareInfo.val!.shareIdType === 'communityId'
      ) {
        isMetaName.value = true
      }
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
  } else if (shareInfo.val!.shareIdType === 'communityId') {
    router.push(`/talk/channels/${shareInfo.val!.shareId}/welcome`)
  }
}

getShareInfo().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./BuzzItemContentSimplePublicShare.scss"></style>
