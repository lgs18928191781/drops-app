<template>
  <Modal :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)">
    <template #title>{{ $t('Buzz.Schedule Buzzs') }}</template>
    <template #body>
      <div
        class="list"
        v-infinite-scroll="getMore"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
      >
        <ElSkeleton :loading="isSkeleton" animated>
          <div class="item flex flex-align-center" v-for="item in list" :key="item.id">
            <div class="txid flex1">
              txId: {{ item.txId.slice(0, 6) }}...{{ item.txId.slice(-6) }}
            </div>
            <div class="time">{{ $filters.dateTimeFormat(item.broadcastAt) }}</div>
          </div>
          <IsNull v-if="list.length <= 0" />
          <LoadMore v-else :pagination="pagination" />
        </ElSkeleton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal/Modal.vue'
import { ElTimeSelect } from 'element-plus'
import { reactive } from 'vue'
import { watch } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { BroadcastTasks } from '@/api/dashbroad'
import { initPagination } from '@/config'
import { NodeName } from '@/enum'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'

interface Props {
  modelValue: boolean
}
const now = dayjs()
  .add(1, 'minute')
  .format('HH:mm')
const props = withDefaults(defineProps<Props>(), {})
const i18n = useI18n()
const emit = defineEmits<{
  (e: 'confirm', time: any): void
  (e: 'update:modelValue', value: boolean): void
}>()

const pagination = reactive({ ...initPagination })
const list: BroadcastTaskItem[] = reactive([])
const isSkeleton = ref(true)

function clear() {
  emit('confirm', '')
  emit('update:modelValue', false)
}

function confirm() {}

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await BroadcastTasks({
      ...pagination,
      protocol: NodeName.SimpleMicroblog,
    })
    if (res) {
      list.push(...res[0])

      const totalPage = Math.ceil(res[1] / pagination.pageSize)
      if (totalPage > pagination.page) {
        pagination.nothing = false
      } else {
        pagination.nothing = true
      }
    }
    resolve()
  })
}

function getMore() {
  if (pagination.loading || pagination.nothing) return
  pagination.loading = true
  pagination.page++
  getDatas().then(() => {
    pagination.loading = false
  })
}

watch(
  () => props.modelValue,
  value => {
    if (value) {
      getDatas(true).then(() => {
        isSkeleton.value = false
      })
    } else {
      isSkeleton.value = true
      list.length = 0
      pagination.page = 1
      pagination.nothing = false
      pagination.loading = false
    }
  }
)
</script>

<style lang="scss" scoped src="./PublishScheduleList.scss"></style>
