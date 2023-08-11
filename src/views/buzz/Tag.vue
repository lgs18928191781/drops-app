<template>
  <div class="group-msg">
    <img class="bg-image" :src="tag?.cover" />
    <div class="bg"></div>
    <div class="content">
      <div class="back">
        <a @click="$router.back()"><Icon name="down"/></a>
        <div class="menu-select-wrap">
          <div class="menu-select">
            <div
              :class="[
                'menu-select-item',
                'flex',
                'flex-align-center',

                route.path == item.path ? 'isActive' : '',
              ]"
              v-for="(item, index) in newMenu"
              :key="index"
              @click="toBuzzTag(item.path)"
            >
              <span class="name">{{ item.name() }}</span>
            </div>
          </div>
        </div>
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

  <div ref="refreshBox"></div>

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
import { GetTagBuzzs } from '@/api/aggregation'
import CommentIcon from '@/assets/svg/comment.svg'
import { initPagination } from '@/config'
import { usePostTagStore } from '@/stores/buzz/tag'
import { useUserStore } from '@/stores/user'
import { useRootStore } from '@/stores/root'
import { computed, inject, onActivated, reactive, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BuzzListVue from './components/BuzzList.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const route = useRoute()
const postTagStore = usePostTagStore()
const userStore = useUserStore()
const i18n = useI18n()
const list: BuzzItem[] = reactive([])
const pagination = reactive({ ...initPagination, timestamp: 0 })
const isSkeleton = ref(true)
const pulldown: PullDownVal = inject('Pulldown')!
const refreshBox = ref()
const isChangeTag = ref(false)
const router = useRouter()
const rootStore = useRootStore()
const newMenu = [
  {
    name: () => i18n.t('Buzz.newbuzz'),
    path: '/buzz/tag/1',
  },
  {
    name: () => i18n.t('Buzz.newnft'),
    path: '/buzz/tag/2',
  },
  {
    name: () => i18n.t('Buzz.newtalk'),
    path: '/buzz/tag/3',
  },
]

const tag = computed(
  () =>
    postTagStore.list.length &&
    postTagStore.list.find(item => item.id.toString() === route.params.tagId)
)
const tabActive = computed(() =>
  tag.value?.subTag && tag.value?.subTag.length ? tag.value?.subTag[0].tag : ''
)

function toBuzzTag(path: string) {
  if (!path) return
  router.push(path)
}
function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetTagBuzzs({
      tag: tag.value!.tag,
      langId: '', //localStorage.getItem('lang') === 'zh' ? 2 : 1,
      metaId: userStore.user?.metaId,
      subTag: tabActive.value ? tabActive.value : '',
      ...pagination,
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
          if (buzz.quoteItem && rootStore.myBlackList?.includes(buzz.quoteItem.metaId)) {
            buzz.quoteItem.content = `${i18n.t('buzz.blacktips')}`
            buzz.quoteItem.attachments = []
          }
        })

        list.push(...res.data.results.items)
        pagination.nothing = false
        pagination.timestamp = res.data.results.items[res.data.results.items.length - 1].timestamp
      } else {
        pagination.nothing = true
      }

      resolve()
    }
  })
}

async function changeSubTag(tag: string) {
  if (tabActive.value === tag) return
  isSkeleton.value = true
  tabActive.value = tag
  pagination.page = 1
  pagination.timestamp = 0
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

function updateItem(buzz: BuzzItem) {
  const index = list.findIndex(item => item.txId === buzz.txId)
  if (index !== -1) {
    list[index] = buzz
  }
}

onActivated(() => {
  pulldown.refreshSlot = refreshBox.value

  pulldown.onRefresh = () => {
    return new Promise<void>(async resolve => {
      pagination.page = 1
      await getDatas(true)
        .then(() => {
          resolve()
        })
        .catch(() => {
          resolve()
        })
    })
  }
})

getDatas(true).then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Tag.scss"></style>
