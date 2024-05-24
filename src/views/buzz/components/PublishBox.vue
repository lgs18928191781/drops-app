<template>
  <div class="publish flex " v-if="userStore.isAuthorized" @click="publish">
    <UserAvatar
      :meta-id="userStore.user!.metaId"
      :image="connectionStore.last.user.avatarId"
      :name="userStore.user!.name"
      :meta-name="userStore.user!.metaName"
      :disabled="true"
      class="mr-2 !border-0"
    />
    <div class="cont flex1">
      <div class="input">
        <ElInput type="text" :placeholder="$t('Buzz.publish.placeholder')" />
      </div>
      <div class="operate flex flex-pack-end">
        <a v-for="(item, index) in publishOperates" :key="index">
          <Icon :name="item.icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { inject, Ref } from 'vue'
import { useConnectionStore } from '@/stores/connection'
interface Props {
  topic?: string
}
const props = withDefaults(defineProps<Props>(), {})
const connectionStore = useConnectionStore()
const layout = useLayoutStore()
const userStore = useUserStore()
const isShowBuzzPublish: Ref<boolean> = inject('isShowBuzzPublish')!
const topic: Ref<string> = inject('topic')!

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

function publish() {
  const params: any = {}
  if (props.topic) topic.value = props.topic
  isShowBuzzPublish.value = true
}
</script>

<style lang="scss" scoped src="./PublishBox.scss"></style>
