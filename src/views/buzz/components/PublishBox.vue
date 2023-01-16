<template>
  <div
    class="publish flex "
    v-if="userStore.isAuthorized"
    @click="layout.$patch({ isShowPublishBuzz: true })"
  >
    <UserAvatar
      :meta-id="userStore.user!.metaId"
      :image="userStore.user!.avatarImage"
      :name="userStore.user!.name"
    />
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
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'

const layout = useLayoutStore()
const userStore = useUserStore()

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
</script>

<style lang="scss" scoped src="./PublishBox.scss"></style>
