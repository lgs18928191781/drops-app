<template>
  <div class="collection">
    <!-- cover -->
    <Image class="cover" src="" />

    <div class="collection-content">
      <!-- collection-avatar -->
      <div class="collection-avatar">
        <img src="" />
      </div>

      <!-- collection-msg -->
      <div class="collection-msg flex">
        <div class="flex3">
          <div class="name flex flex-align-center">MetaBot Avatar <Icon name="certed" /></div>
          <div class="creator flex flex-align-center">
            {{ $t('NFT.Creater') }}: <a>ShowPayTeam</a> <Icon name="center_star" />
          </div>
          <div class="drsc">
            <span class="text"
              >MetaBot is the original robot living on the MetaNet blockchain in the future. They
              were born at the...</span
            ><a>{{ $t('NFT.Discover More') }}</a>
          </div>
        </div>
        <div class="flex1">
          <div class="statiscs-list">
            <div class="statiscs-item" v-for="(item, index) in statiscs" :key="index">
              <div class="flex flex-align-center flex-pack-end">
                <div class="statiscs-item-warp">
                  <div class="value">{{ item.value() }}</div>
                  <div class="label">{{ item.name() }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- tab -->
      <div class="tab flex flex-align-center">
        <a
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ active: item.value === tabActive }"
          >{{ item.name() }}</a
        >
      </div>

      <!-- screen -->
      <div class="screen flex flex-align-center">
        <div class="flex1">
          <a class="main-border flex flex-align-center">
            <Icon name="filter" /> {{ $t('NFT.Filter') }}
          </a>
        </div>
        <ElSelect>
          <option></option>
        </ElSelect>
        <div class="display flex flex-align-center">
          <a class="active">
            <Icon name="layout-grid-fill" />
          </a>
          <a>
            <Icon name="grid-fill" />
          </a>
        </div>
      </div>

      <ElRow :gutter="22" class="nft-list">
        <ElCol
          :xs="12"
          :sm="8"
          :md="6"
          :lg="6"
          :xl="4"
          v-for="(item, index) in Array.from({ length: 36 })"
        >
          <NFTItemVue />
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTItemVue from '@/components/NFTItem/NFTItem.vue'

const i18n = useI18n()
enum NFTCollectTab {
  CollectionWorks = 0,
  PriceTrend = 1,
}
const tabs = [
  {
    name: () => i18n.t('NFT.Collection works'),
    value: NFTCollectTab.CollectionWorks,
  },
  {
    name: () => i18n.t('NFT.Price Trend'),
    value: NFTCollectTab.PriceTrend,
  },
]
const tabActive = ref(NFTCollectTab.CollectionWorks)

const statiscs = reactive([
  {
    name: () => i18n.t('NFT.Initial Price'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Floor Price'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Highest Price'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Supply'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Owner'),
    value: () => '2.38 Space',
  },
  {
    name: () => i18n.t('NFT.Blockchain'),
    value: () => 'MVC',
  },
])
</script>

<style lang="scss" scoped src="./Collection.scss"></style>
