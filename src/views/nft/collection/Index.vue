<template>
  <div class="collection-index">
    <!-- header -->
    <div class="header flex flex-align-center">
      <div class="flex1">
        <div class="title">{{ $t('Collection.title') }}</div>
        <div class="drsc">{{ $t('Collection.drsc') }}</div>
      </div>
      <div class="flex flex-align-center chain">
        <span class="label">{{ $t('Collection.Blockchain') }}:</span>
        <ElSelect v-model="currentChain" popper-class="custom-select" @change="onChangeChain">
          <template #prefix>
            <img
              class="chain-icon"
              :class="{ all: currentChain === -1 }"
              :src="currentChain === -1 ? Link : $filters.strapiImage(chains.find(item => item.id === currentChain)!.icon.url)"
            />
          </template>
          <ElOption v-for="item in chains" :key="item.id" :label="item.name" :value="item.id">
            <div class="option-item flex flex-align-center">
              <img
                class="chain-icon"
                :class="{ all: item.id === -1 }"
                :src="item.id === -1 ? Link : $filters.strapiImage(item.icon.url)"
              />
              <span class="name flex1">{{ item.name }}</span>
              <span
                class="check flex flex-align-center flex-pack-center"
                v-if="item.id === currentChain"
              >
                <Icon name="check" />
              </span>
            </div>
          </ElOption>
        </ElSelect>
      </div>
    </div>

    <!-- collection-list -->
    <ElSkeleton :loading="isSkeleton" animated>
      <div
        class="collection-list"
        v-infinite-scroll="getMore"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="100"
      >
        <RouterLink
          :to="{ name: 'nftCollectionDetail', params: { topicType: item.topicType } }"
          class="collection-item"
          v-for="item in collections"
          :key="item.id"
        >
          <div class="cover">
            <img :src="$filters.strapiImage(item.cover.url)" />
          </div>

          <div class="cont">
            <div class="author flex flex-align-center">
              <UserAvatar
                :name="item.creatorName"
                :image="item.creatorAvatarImage"
                :meta-id="item.creatorMetaId"
                :meta-name="item.creatorMetaName"
              />
              <div class="flex1">
                <div class="name flex flex-align-center">
                  <UserName :name="item.creatorName" :meta-name="item.creatorMetaName" />
                  <Icon name="center_star" />
                </div>
                <div class="metaid">MetaID：{{ item.creatorMetaId.slice(0, 6) }}</div>
              </div>
            </div>

            <div class="msg-list flex flex-align-center">
              <div class="flex1 msg-item">
                <div class="label">{{ $t('Collection.Floor price') }}</div>
                <div class="value">1.40 ETH</div>
              </div>
              <div class="flex1 msg-item">
                <div class="label">{{ $t('Collection.Total volume') }}</div>
                <div class="value">9999</div>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>

      <IsNull v-if="collections.length === 0" />

      <LoadMore :pagination="pagination" v-if="collections.length > 0" />
    </ElSkeleton>
  </div>
</template>

<script setup lang="ts">
import { GetChains, Chain, GetCollects } from '@/api/strapi'
import { strapiImage } from '@/utils/filters'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Link from '@/assets/icons/link.svg?url'
import { initPagination } from '@/config'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'

const chains: Chain[] = reactive([])
const currentChain = ref(-1)
const i18n = useI18n()
const pagination = reactive({ ...initPagination })
const collections: Collect[] = reactive([])
const isSkeleton = ref(true)

function getChains() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetChains()
    if (res) {
      chains.length = 0
      chains.push(
        {
          created_at: '',
          // @ts-ignore
          icon: null,
          id: -1,
          name: i18n.t('Collection.AllChain'),
          published_at: '',
          symbol: '',
          updated_at: '',
        },
        ...res
      )
      resolve()
    }
  })
}

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetCollects({
      _start: (pagination.page - 1) * pagination.pageSize,
      _limit: pagination.pageSize,
      _sort: 'index:ASC',
      chain: currentChain.value === -1 ? undefined : currentChain.value,
    })
    if (res) {
      if (isCover) collections.length = 0
      if (res.length === 0) {
        pagination.nothing = true
      } else {
        pagination.nothing = false
        collections.push(...res)
      }
      resolve()
    }
  })
}

function getMore() {
  if (pagination.loading || pagination.nothing) return
  pagination.page++
  pagination.loading = true
  getDatas().then(() => {
    pagination.loading = false
  })
}

function onChangeChain() {
  isSkeleton.value = true
  pagination.page = 1
  getDatas(true).then(() => {
    isSkeleton.value = false
  })
}

getChains()
getDatas().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./Index.scss"></style>
