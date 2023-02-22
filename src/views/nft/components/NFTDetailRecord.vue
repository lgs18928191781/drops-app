<template>
  <ElSkeleton :loading="loading" animated>
    <template #template>
      <div class="record flex1 flex flex-v">
        <div class="record-item th flex flex-align-center">
          <span class="owner flex1"><ElSkeletonItem :variant="'text'"/></span>
          <span class="role flex1"><ElSkeletonItem :variant="'text'"/></span>
          <span class="time flex1"><ElSkeletonItem :variant="'text'"/></span>
          <span class="price flex1"><ElSkeletonItem :variant="'text'"/></span>
          <span class="link"></span>
        </div>

        <div class="record-list-warp flex1">
          <div class="record-list flex1">
            <div
              class="record-item flex flex-align-center"
              v-for="(item, index) in Array.from({ length: 5 })"
              :key="index"
            >
              <Icon name="top" class="top-icon" />
              <span class="owner flex1">
                <div class="flex flex-align-center">
                  <ElSkeletonItem :variant="'image'" class="avatar" />
                  <span class="name"><ElSkeletonItem :variant="'text'"/></span>
                </div>
              </span>
              <span class="role flex1"><ElSkeletonItem :variant="'text'"/></span>
              <span class="time flex1"><ElSkeletonItem :variant="'text'"/></span>
              <span class="price flex1 flex flex-align-center"
                ><ElSkeletonItem :variant="'text'" />
              </span>
              <span class="link">
                <ElSkeletonItem :variant="'text'" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <div class="record flex1 flex flex-v">
        <div class="record-item th flex flex-align-center">
          <span class="owner flex1">{{ $t('NFT.Owner') }}</span>
          <span class="role flex1">{{ $t('NFT.Role') }}</span>
          <span class="time flex1">{{ $t('NFT.Time') }}</span>
          <span class="price flex1">{{ $t('NFT.Price') }}</span>
          <span class="link"></span>
        </div>

        <div class="record-list-warp flex1">
          <div class="record-list flex1">
            <div
              class="record-item flex flex-align-center"
              v-for="(item, index) in records"
              :key="item.txId"
            >
              <Icon name="top" class="top-icon" />
              <span class="owner flex1">
                <div class="flex flex-align-center">
                  <UserAvatar :meta-id="item.metaId" :image="item.avatarImage" :name="item.name" />
                  <span class="name"><UserName :name="item.name" :meta-name="''"/></span>
                </div>
              </span>
              <span class="role flex1">{{
                pagination.nothing && index === records.length - 1
                  ? $t('NFT.Creator')
                  : index === 0
                  ? $t('NFT.Owner')
                  : $t('NFT.History owner')
              }}</span>
              <span class="time flex1">{{
                item.timestamp ? $filters.dateTimeFormat(item.timestamp) : '--'
              }}</span>
              <span class="price flex1 flex flex-align-center">
                <template v-if="item.satoshisPrice && item.satoshisPrice !== '0'">
                  {{ new Decimal(item.satoshisPrice).div(Math.pow(10, 8)).toNumber() }} Space
                </template>
                <template v-else>
                  --
                </template>
              </span>
              <span class="link">
                <Icon name="link" @click="tx(item.txId)" />
              </span>
            </div>
          </div>
          <LoadMore :pagination="pagination" />
        </div>
      </div>
    </template>
  </ElSkeleton>
</template>

<script setup lang="ts">
import { GetNftHolderList } from '@/api/aggregation'
import { initPagination } from '@/config'
import Decimal from 'decimal.js-light'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import { tx } from '@/utils/util'

interface Props {
  genesis: string
  codehash: string
  tokenIndex: string
}
const props = withDefaults(defineProps<Props>(), {})

const pagination = reactive({ ...initPagination })
const records: GetNftHolderListResItem[] = reactive([])
const loading = ref(true)

//  获取拥有记录
async function getDatas(isCover = false) {
  return new Promise<void>(async resolve => {
    const res = await GetNftHolderList({
      genesis: props.genesis,
      codehash: props.codehash,
      tokenIndex: props.tokenIndex,
      page: pagination.page.toString(),
      pageSize: pagination.pageSize.toString(),
    }).catch(error => {
      ElMessage.error(error.message)
    })

    if (res?.code === 0) {
      if (isCover) {
        records.length = 0
      }
      records.push(...res.data.results.items.holderList)
      const totalPages = Math.ceil(res.data.total / pagination.pageSize)
      if (totalPages <= pagination.page) {
        pagination.nothing = true
      }
      resolve()
    }
  })
}

if (props.codehash && props.tokenIndex && props.genesis) {
  getDatas(true).then(() => {
    loading.value = false
  })
}
</script>

<style lang="scss" scoped src="./NFTDetailRecord.scss"></style>
