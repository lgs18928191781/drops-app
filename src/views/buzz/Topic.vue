<template>
  <div class="topic-header flex flex-align-center">
    <div class="flex1 flex flex-align-center">
      <a class="back flex flex-align-center flex-pack-center" @click="$router.back()">
        <Icon name="down" />
      </a>
      <span class="tag flex flex-align-center flex-pack-center">
        <Icon name="buzz_hashtag" />
      </span>
      <span class="namt">To Life</span>
    </div>
    <a class="flex flex-align-center operate" @click="publishTopic">
      <Icon name="plus" />
      {{ $t('Buzz.topic.Create Community') }}
    </a>
  </div>

  <div class="buzz-list-warp">
    <BuzzListVue :list="list" :pagination="pagination" :loading="isSkeleton" />
  </div>
</template>

<script setup lang="ts">
import { initPagination } from '@/config'
import { useLayoutStore } from '@/stores/layout'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'

const layoutStore = useLayoutStore()
const route = useRoute()

const pagination = reactive({ ...initPagination })
const list: BuzzItem[] = reactive([])
const isSkeleton = ref(true)

function publishTopic() {
  layoutStore.publish({ topic: route.params.topic as string })
}

function getDatas(isCover = false) {
  return new Promise<void>(async resolve => {
    const res = {}
  })
}

getDatas()
</script>

<style lang="scss" scoped src="./Topic.scss"></style>
