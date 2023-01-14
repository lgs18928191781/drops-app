<template>
  <div class="text-sm p-4.5 h-full overflow-y-scroll slim-scrollbar" ref="scroller" id="scroller">
    <!-- 编写，仅管理员可见 -->
    <div
      class="flex justify-between items-center bg-white dark:bg-gray-800 p-4.5 rounded-xl group cursor-pointer mb-4.5"
      @click="showCreateModal = true"
      v-if="talk.isAdmin()"
    >
      <div class="flex items-center gap-x-3">
        <span class="bg-primary rounded-full p-2.5">
          <Icon
            name="edit"
            class="w-4 h-4 !text-dark-800 dark:text-white cursor-pointer  box-content"
          />
        </span>
        <div class="text-base group-hover:underline">
          {{ $t('Talk.General.publish_new_announcement') }}
        </div>
      </div>

      <div class="text-dark-300 dark:text-gray-400 flex items-center gap-x-2 shrink-0">
        <Icon name="calendar_days" class="w-5 h-5" />
        <span>{{ todayInDate }}</span>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="w-full flex items-center gap-x-8 mb-4.5" v-if="announcements.length > 0">
      <div class="border-b border-solid border-dark-300/20 dark:border-gray-400/20 grow"></div>
      <div class="shrink-0 text-dark-300 dark:text-gray-400">
        {{ $t('Talk.General.announcements_total', announcementsCount) }}
      </div>
      <div class="border-b border-solid border-dark-300/20 dark:border-gray-400/20 grow"></div>
    </div>

    <!-- 公告列表 -->
    <div class="" v-if="isLoading">
      <LoadingList :item-count="5" />
    </div>
    <template v-else>
      <div class="space-y-2" v-if="announcements.length">
        <AnnouncementItem
          v-for="announcement in announcements"
          :key="announcement.txId"
          :announcement="announcement"
          @delete="popDeleteModal(announcement)"
          @edit="popEditModal(announcement)"
        />

        <LoadingItem v-show="isLoadingMore && !isAtBottom" />
        <div class="w-full h-px bg-inherit" id="bottomAnchor"></div>
      </div>

      <div v-else class="flex items-center justify-center w-full mt-48 lg:mt-64 flex-col">
        <img :src="CatImg" class="w-48 h-48" alt="" />
        <p>{{ $t('Talk.General.no_announcement') }}</p>
      </div>
    </template>

    <CreateModal
      :show="showCreateModal"
      @close="closeCreateModal"
      @submit="onSubmit"
      :date="todayInDate"
      :community-id="talk.activeCommunityId"
    />

    <DeleteModal
      :show="showDeleteModal"
      @close="
        () => {
          showDeleteModal = false
        }
      "
      @submit="onSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { useTalkStore } from '@/stores/talk'
import { computed, ref, watch, Ref, nextTick, onBeforeUnmount } from 'vue'
import CreateModal from './CreateModal.vue'
import DeleteModal from './DeleteModal.vue'
import CatImg from '@/assets/images/cat_3.svg?url'
import { GetCommunityAnnouncements } from '@/api/talk'
import AnnouncementItem from './AnnouncementItem.vue'
import LoadingList from '../LoadingList.vue'
import LoadingItem from '../LoadingItem.vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { sleep } from '@/utils/util'
import { ElMessage } from 'element-plus'
import { useCreateAnnouncementFormStore, useDeleteAnnouncementFormStore } from '@/stores/forms'

const i18n = useI18n()
const talk = useTalkStore()

talk.activeChannelId = 'announcements'
const announcements: Ref<AnnouncementItem[]> = ref([])
const announcementsCount = ref(0)

// modal相关
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const deleteForm = useDeleteAnnouncementFormStore()
const createForm = useCreateAnnouncementFormStore()
const closeCreateModal = () => {
  createForm.reset()
  showCreateModal.value = false
}

// 滚动加载相关
const isLoading = ref(false)
const isLoadingMore = ref(false)
const isAtBottom = ref(false)
const currentPage = ref(1)
const scroller = ref<HTMLElement>()
const handleScroll = () => {
  const bottomAnchor = document.getElementById('bottomAnchor')
  if (bottomAnchor) {
    // 如果底部锚点在可视区域内
    if (
      bottomAnchor.getBoundingClientRect().bottom < window.innerHeight &&
      !isLoadingMore.value &&
      !isLoading.value &&
      !isAtBottom.value
    ) {
      isLoadingMore.value = true
      loadMore().then(() => {
        isLoadingMore.value = false
      })
    }
  }
}
const loadMore = async () => {
  currentPage.value++

  await fetchAnnouncements()
}
watch(
  scroller,
  async () => {
    scroller.value?.addEventListener('scroll', handleScroll)
    if (scroller.value) {
      await nextTick()
      scroller.value.addEventListener('scroll', handleScroll)
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  scroller.value?.removeEventListener('scroll', handleScroll)
})

// 获取公告列表
watch(
  () => talk.activeCommunityId,
  async () => {
    if (!talk.activeCommunityId) return
    isLoading.value = true
    await fetchAnnouncements(true)
    isLoading.value = false
  },
  { immediate: true }
)

function popEditModal(announcement: AnnouncementItem) {
  // 填写表单
  createForm.communityId = talk.activeCommunityId
  createForm.title = announcement.title
  createForm.content = announcement.content
  createForm.type = 'edit'
  createForm.txId = announcement.txId
  createForm.publickey = announcement.publicKey
  createForm.original = announcement

  showCreateModal.value = true
}

function popDeleteModal(announcement: AnnouncementItem) {
  deleteForm.announcementId = announcement.metanetId
  deleteForm.title = announcement.title
  deleteForm.communityId = talk.activeCommunityId

  showDeleteModal.value = true
}

async function fetchAnnouncements(init = false) {
  const params = {
    communityId: talk.activeCommunityId,
    pageSize: 15,
    page: currentPage.value,
  }
  const res = await GetCommunityAnnouncements(params)

  if (res.data.results.items.length < 15) {
    isAtBottom.value = true
  }
  announcements.value = [...announcements.value, ...res.data.results.items]

  if (init) {
    announcementsCount.value = res.data.total
  }
}

async function onSubmit() {
  showCreateModal.value = false
  showDeleteModal.value = false
  ElMessage.success(i18n.t('Talk.General.publish_success'))
  await sleep(2000)
  await refresh()

  // 滚动回顶
  scroller.value?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

async function refresh() {
  announcements.value = []
  currentPage.value = 1
  isAtBottom.value = false
  await fetchAnnouncements(true)
}

const todayInDate = computed(() => {
  const date = dayjs()

  // 中文显示为 今天，1月2日 的格式
  if (i18n.locale.value === 'zh') {
    return date.format('M月D日')
  }

  // 英文显示为 Today, Jan. 2nd 的格式
  return date.format('MMM. Do')
})
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  /* prettier-ignore */
  width: 5PX !important;
}
</style>
