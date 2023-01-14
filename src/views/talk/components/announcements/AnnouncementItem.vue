<template>
  <div
    class="flex flex-col items-stretch bg-white dark:bg-gray-800 p-4.5 rounded-xl gap-y-4.5 text-sm group"
  >
    <!-- title -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-x-2">
        <h3 class="text-xl font-medium">{{ announcement.title }}</h3>
        <span
          v-if="isToday"
          class="text-dark-800 bg-primary rounded text-xxs py-0.5 px-1.5 font-bold"
        >
          {{ $t('Talk.General.new') }}
        </span>
      </div>

      <!-- admin按钮：修改、删除 -->
      <div class="lg:hidden lg:group-hover:block" v-if="talk.isAdmin()">
        <div class="flex items-center gap-x-3">
          <button class="" @click="emit('edit')">
            <Icon
              name="pencil_square"
              class="w-4 h-4 text-dark-300 hover:text-dark-400 dark:text-gray-400 dark:hover:text-gray-200"
            />
          </button>
          <button class="" @click="emit('delete')">
            <Icon
              name="trash"
              class="w-4 h-4 text-dark-300 hover:text-dark-400 dark:text-gray-400 dark:hover:text-gray-200"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- content -->
    <template v-if="isTooLong && !isExpanded">
      <div class="line-clamp-6" v-html="parsedContent"></div>
      <div class="flex justify-center">
        <button
          class="text-dark-300 dark:text-gray-300 flex gap-x-1 group/expand"
          @click="isExpanded = true"
        >
          <Icon name="chevron_double_down" class="w-4 h-4" />
          <span class="group-hover/expand:underline">{{ $t('Talk.General.read_more') }}</span>
        </button>
      </div>
    </template>

    <div v-html="parsedContent" v-else></div>

    <!-- footer -->
    <div class="text-dark-300 dark:text-gray-400 flex items-center justify-between">
      <!-- date -->
      <div class="flex items-center gap-x-2">
        <Icon name="calendar_days" class="w-5 h-5" />
        <span>{{ timestampInDate }}</span>
      </div>

      <!-- txId -->
      <span @click="toMvcScan(announcement.txId)" class="cursor-pointer hover:underline">{{
        shortenedTxId
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toMvcScan } from '@/utils/util'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useTalkStore } from '@/stores/talk'

const i18n = useI18n()
const talk = useTalkStore()

const props = defineProps<{
  announcement: AnnouncementItem
}>()

const emit = defineEmits(['edit', 'delete'])

const relativeFromNow = computed(() => {
  // 规则：如果是今天，则显示为今天
  // 如果是昨天，则显示为昨天
  // 如果是前天及之前，则不显示
  const date = dayjs(props.announcement.timestamp)
  const today = dayjs()
  const yesterday = dayjs().subtract(1, 'day')
  if (date.isSame(today, 'day')) {
    return `${i18n.t('Talk.Datetime.today_with_comma')}`
  }
  if (date.isSame(yesterday, 'day')) {
    return i18n.t('Talk.Datetime.yesterday_with_comma')
  }
  return ''
})

const parsedContent = computed(() => {
  let text = props.announcement.content
  if (typeof text == 'undefined') {
    return ''
  }

  const HTML = /<\/?.+?>/gi
  const COOKIE = /document\.cookie/gi
  const HTTP = /(http|https):\/\//gi
  const re = /(f|ht){1}(tp|tps):\/\/([\w-]+\S)+[\w-]+([\w-?%#&=]*)?(\/[\w- ./?%#&=]*)?/g

  if (HTML.test(text)) {
    return ''
  }
  if (COOKIE.test(text)) {
    return ''
  }
  text = text.replace(re, function(url) {
    if (HTTP.test(text)) {
      return `<a href=${url} target="_blank" style="text-decoration: underline;cursor: pointer;" class="url"> ${url} </a>`
    }
    return `<a onClick="window.open('http://${text}','_blank')" style="text-decoration: underline;cursor: pointer;" target="_blank">${text}</a>`
  })
  text = text.replace(/\\n/g, '\n')

  return text.replace(/\n/g, '<br />')
})

const isToday = computed(() => {
  const date = dayjs(props.announcement.timestamp)
  const today = dayjs()
  return date.isSame(today, 'day')
})

const timestampInDate = computed(() => {
  const date = dayjs(props.announcement.timestamp)

  // 中文显示为 今天，1月2日 的格式
  if (i18n.locale.value === 'zh') {
    return `${relativeFromNow.value}${date.format('M月D日')}`
  }

  // 英文显示为 Today, Jan. 2nd 的格式
  return `${relativeFromNow.value}${date.format('MMM. Do')}`
})

const shortenedTxId = computed(() => {
  const txId = props.announcement.txId
  return `${txId.slice(0, 6)}...${txId.slice(-6)}`
})

// 过长的内容的展开收起
const isTooLong = computed(() => {
  const content = parsedContent.value
  if (typeof content == 'undefined') {
    return false
  }

  // 超过1000个字符，就认为是过长的
  return content.length > 300
})

const isExpanded = ref(false)
</script>
